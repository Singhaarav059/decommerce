"""Garments + hanger for the clothing rack, exported as one GLB.

Each garment is built from a flattened tube whose top closes into shoulder
seams, with sleeves, hem flare and vertical folds that deepen toward the hem.
Stylised miniature, not a sewing pattern; replace with CC-licensed or
cloth-simulated garments later, keeping the node names.

  Blender -b -P scripts/blender/garments.py -- --out public/assets/models/raw
then compress with scripts/compress-glb.sh.
Node names: hanger, garment_<theme>. Origin of every garment is the hook point.
"""
import sys, os, math, random, bpy, bmesh
from mathutils import Vector

sys.path.insert(0, os.path.dirname(__file__))
import lib

a = lib.args()
lib.reset()
P = lib.PALETTE


def mat(name, color, rough=0.85, sheen=0.5, metal=0.0):
    return lib.material(name, color, rough, metal, sheen=sheen)


def tube(segments, rings, length):
    bm = bmesh.new()
    for r in range(rings + 1):
        z = -length * r / rings
        for s in range(segments):
            ang = 2 * math.pi * s / segments
            bm.verts.new((math.cos(ang), math.sin(ang), z))
    bm.verts.ensure_lookup_table()
    for r in range(rings):
        for s in range(segments):
            a0 = r * segments + s
            a1 = r * segments + (s + 1) % segments
            bm.faces.new((bm.verts[a0], bm.verts[a1], bm.verts[a1 + segments], bm.verts[a0 + segments]))
    return bm


def finish(bm, name, material, subsurf=1):
    me = bpy.data.meshes.new(name)
    bm.normal_update()
    bm.to_mesh(me)
    bm.free()
    o = bpy.data.objects.new(name, me)
    bpy.context.scene.collection.objects.link(o)
    me.materials.append(material)
    for p in me.polygons:
        p.use_smooth = True
    if subsurf:
        m = o.modifiers.new("Sub", "SUBSURF")
        m.levels = m.render_levels = subsurf
    return o


def garment(theme, color, length=0.78, width=0.44, depth=0.11, flare=0.12, sleeve=0.56, folds=1.0, collar=False, rib=False, seed=1):
    rnd = random.Random(seed)
    seg, rings = 40, 22
    bm = tube(seg, rings, length)
    phase = [rnd.uniform(0, 6.28) for _ in range(3)]
    neck = 0.07
    for v in bm.verts:
        t = -v.co.z / length  # 0 at shoulders, 1 at hem
        x0, y0 = v.co.x, v.co.y
        w = width / 2 * (1 + flare * t ** 1.5)
        d = depth / 2 * (0.55 + 0.45 * math.sin(min(1, t * 3) * math.pi / 2))
        x, y = x0 * w, y0 * d
        # shoulders: close the seam outside the neck and slope down from it
        if t < 0.08:
            k = 1 - t / 0.08
            if abs(x) > neck:
                y *= 1 - 0.92 * k
            v.co.z -= max(0.0, abs(x) - neck) * 0.32 * k
        # folds: vertical waves, stronger toward the hem
        f = folds * (0.15 + 0.85 * t)
        y += math.sin(x * 38 + phase[0]) * 0.012 * f + math.sin(x * 17 + phase[1]) * 0.008 * f
        x += math.sin(y0 * 3 + phase[2] + t * 4) * 0.004 * f
        # ribbed hem band for knits
        if rib and t > 0.9:
            x *= 0.93
            y *= 0.9 + 0.1 * math.cos(x0 * 60)
        v.co.x, v.co.y = x, y
    # z of shoulder line relative to hook: garment hangs from hanger bar at z=-0.07
    for v in bm.verts:
        v.co.z -= 0.075
    body = finish(bm, f"garment_{theme}", color)

    parts = [body]
    for side in (-1, 1):
        sb = tube(18, 12, sleeve)
        for v in sb.verts:
            t = -v.co.z / sleeve
            r = 0.058 * (1 - 0.22 * t)
            v.co.x, v.co.y = v.co.x * r, v.co.y * r * 0.7
            v.co.y += math.sin(t * 9 + side) * 0.006
        s = finish(sb, f"sleeve_{theme}_{side}", color)
        s.location = (side * (width / 2 + 0.03), 0, -0.075 - (width / 2 - neck) * 0.3)
        s.rotation_euler = (0, side * math.radians(7), 0)
        parts.append(s)

    if collar:
        bpy.ops.mesh.primitive_torus_add(major_radius=0.07, minor_radius=0.014, major_segments=32, minor_segments=8)
        c = bpy.context.active_object
        c.scale = (1, 0.55, 0.6)
        c.location = (0, 0.005, -0.08)
        c.data.materials.append(color)
        lib.smooth(c)
        parts.append(c)

    # join into one mesh per garment (only this garment's parts selected)
    for o in parts:
        bpy.context.view_layer.objects.active = o
        for m in list(o.modifiers):
            bpy.ops.object.modifier_apply(modifier=m.name)
    bpy.ops.object.select_all(action="DESELECT")
    for o in parts:
        o.select_set(True)
    bpy.context.view_layer.objects.active = body
    bpy.ops.object.join()
    body.select_set(False)
    return body


def hanger():
    wood = lib.material("Oak", (0.36, 0.22, 0.11), 0.55)
    steel = lib.material("Steel", P["steel"], 0.3, 1.0)
    # hook
    cu = bpy.data.curves.new("hook", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.0035
    cu.bevel_resolution = 3
    sp = cu.splines.new("POLY")
    pts = [(0, 0, -0.06), (0, 0, -0.02)]
    for i in range(13):
        ang = math.pi * i / 12
        pts.append((0.022 - 0.022 * math.cos(ang), 0, -0.02 + 0.022 * math.sin(ang) + 0.0))
    sp.points.add(len(pts) - 1)
    for p, co in zip(sp.points, pts):
        p.co = (*co, 1)
    hook = bpy.data.objects.new("hook", cu)
    bpy.context.scene.collection.objects.link(hook)
    hook.data.materials.append(steel)
    # bar
    cb = bpy.data.curves.new("bar", "CURVE")
    cb.dimensions = "3D"
    cb.bevel_depth = 0.009
    cb.bevel_resolution = 4
    sb = cb.splines.new("BEZIER")
    sb.bezier_points.add(2)
    for bp, co in zip(sb.bezier_points, [(-0.22, 0, -0.105), (0, 0, -0.062), (0.22, 0, -0.105)]):
        bp.co = co
        bp.handle_left_type = bp.handle_right_type = "AUTO"
    bar = bpy.data.objects.new("bar", cb)
    bpy.context.scene.collection.objects.link(bar)
    bar.data.materials.append(wood)
    bpy.ops.object.select_all(action="DESELECT")
    for o in (hook, bar):
        bpy.context.view_layer.objects.active = o
        o.select_set(True)
        bpy.ops.object.convert(target="MESH")
    bpy.ops.object.select_all(action="DESELECT")
    bpy.context.view_layer.objects.active = bar
    hook.select_set(True)
    bar.select_set(True)
    bpy.ops.object.join()
    bar.name = "hanger"
    bar.select_set(False)
    return bar


hanger()
themes = [
    ("linen", mat("Linen", P["linen"]), dict(collar=True, seed=3)),
    ("olive", mat("OliveKnit", P["olive"], 0.95, 0.7), dict(length=0.66, width=0.46, depth=0.13, sleeve=0.6, rib=True, folds=0.6, seed=5)),
    ("ink", mat("InkWool", (0.012, 0.011, 0.01), 0.75, 0.25), dict(length=1.02, width=0.47, flare=0.2, folds=1.2, collar=True, seed=7)),
    ("terrazzo", mat("TerrazzoCotton", P["terrazzo"], 0.85), dict(length=0.74, collar=True, seed=11)),
    ("kraft", mat("KraftCanvas", P["kraft"], 0.9, 0.2), dict(length=0.7, width=0.48, depth=0.14, folds=0.7, collar=True, seed=13)),
    ("stone", mat("StoneJersey", P["stone"], 0.9, 0.6), dict(length=0.68, sleeve=0.24, folds=0.9, seed=17)),
    ("copper", mat("CopperSilk", (0.42, 0.11, 0.03), 0.45, 0.8), dict(length=0.96, width=0.4, flare=0.45, sleeve=0.2, folds=1.4, seed=19)),
]
for name, m, kw in themes:
    garment(name, m, **kw)  # all at the origin (hook point); R3F places them

os.makedirs(a.out, exist_ok=True)
bpy.ops.export_scene.gltf(filepath=os.path.join(a.out, "rack.glb"), export_format="GLB", export_apply=True, export_yup=True)
print("EXPORTED", [o.name for o in bpy.context.scene.objects])
