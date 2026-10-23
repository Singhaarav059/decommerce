"""Shared Blender helpers: the one light rig, the material library, render setup.

Run scenes headless:  Blender -b -P scripts/blender/<scene>.py -- --out <dir> [--frames N] [--size WxH]
Every scene shares the warm low sun from the upper left (PLAN.md art direction).
"""
import sys, math, argparse, bpy

PALETTE = {
    "stone": (0.913, 0.886, 0.846),
    "travertine": (0.791, 0.716, 0.624),
    "terrazzo": (0.584, 0.479, 0.352),
    "ink": (0.008, 0.007, 0.005),
    "copper": (0.539, 0.117, 0.024),
    "olive": (0.141, 0.168, 0.077),
    "steel": (0.342, 0.371, 0.381),
    "kraft": (0.48, 0.32, 0.18),
    "linen": (0.82, 0.76, 0.66),
}


def args(defaults=None):
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser()
    p.add_argument("--out", required=True)
    p.add_argument("--frames", type=int, default=(defaults or {}).get("frames", 1))
    p.add_argument("--size", default=(defaults or {}).get("size", "1280x800"))
    p.add_argument("--samples", type=int, default=32)
    return p.parse_args(argv)


def reset():
    bpy.ops.wm.read_factory_settings(use_empty=True)
    return bpy.context.scene


def enum_ids(owner, prop):
    return [i.identifier for i in owner.bl_rna.properties[prop].enum_items]


def setup_render(scene, size, samples=32, transparent=False, fps=24):
    w, h = (int(v) for v in size.split("x"))
    r = scene.render
    try:
        r.engine = "BLENDER_EEVEE"
    except TypeError as e:
        print("engine:", e)
    r.resolution_x, r.resolution_y, r.resolution_percentage = w, h, 100
    r.film_transparent = transparent
    r.fps = fps
    r.image_settings.file_format = "PNG"
    r.image_settings.color_mode = "RGBA" if transparent else "RGB"
    if hasattr(scene, "eevee"):
        ee = scene.eevee
        if hasattr(ee, "taa_render_samples"):
            ee.taa_render_samples = samples
        for flag in ("use_gtao", "use_shadows", "use_raytracing"):
            if hasattr(ee, flag):
                setattr(ee, flag, True)
    vs = scene.view_settings
    if "AgX" in enum_ids(vs, "view_transform"):
        vs.view_transform = "AgX"
    looks = enum_ids(vs, "look")
    for want in ("AgX - Base Contrast", "AgX - Medium High Contrast", "None"):
        if want in looks:
            vs.look = want
            break


def world(scene, color=PALETTE["stone"], strength=0.9):
    w = bpy.data.worlds.new("World")
    scene.world = w
    w.use_nodes = True
    bg = next(n for n in w.node_tree.nodes if n.type == "BACKGROUND")
    bg.inputs[0].default_value = (*color, 1)
    bg.inputs[1].default_value = strength


def light_rig(scene, sun_strength=4.5):
    """Warm low sun from the upper left + soft fill. Same in every scene."""
    sun = bpy.data.lights.new("Sun", "SUN")
    sun.energy = sun_strength
    sun.color = (1.0, 0.86, 0.69)
    sun.angle = math.radians(6)
    o = bpy.data.objects.new("Sun", sun)
    scene.collection.objects.link(o)
    o.rotation_euler = (math.radians(52), math.radians(-8), math.radians(-38))
    fill = bpy.data.lights.new("Fill", "AREA")
    fill.energy = 120
    fill.size = 6
    fill.color = (0.95, 0.92, 0.86)
    f = bpy.data.objects.new("Fill", fill)
    scene.collection.objects.link(f)
    f.location = (5, -4, 3)
    f.rotation_euler = (math.radians(70), 0, math.radians(50))


def material(name, color, rough=0.6, metal=0.0, sheen=0.0, coat=0.0):
    m = bpy.data.materials.get(name)
    if m:
        return m
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = next(n for n in m.node_tree.nodes if n.type == "BSDF_PRINCIPLED")
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    b.inputs["Metallic"].default_value = metal
    if sheen and "Sheen Weight" in b.inputs:
        b.inputs["Sheen Weight"].default_value = sheen
    if coat and "Coat Weight" in b.inputs:
        b.inputs["Coat Weight"].default_value = coat
    return m


def mats():
    P = PALETTE
    return {
        "travertine": material("Travertine", P["travertine"], 0.75),
        "stone": material("Stone", P["stone"], 0.8),
        "terrazzo": material("Terrazzo", P["terrazzo"], 0.55, coat=0.2),
        "copper": material("Copper", P["copper"], 0.28, 1.0),
        "steel": material("Steel", P["steel"], 0.32, 1.0),
        "ink": material("Ink", P["ink"], 0.4),
        "kraft": material("Kraft", P["kraft"], 0.9),
        "linen": material("Linen", P["linen"], 0.85, sheen=0.4),
        "olive": material("Olive", P["olive"], 0.7),
    }


def add(obj_op, name, mat=None, **kw):
    obj_op(**kw)
    o = bpy.context.active_object
    o.name = name
    if mat:
        o.data.materials.append(mat)
    return o


def bevel(o, width=0.02, segments=3):
    m = o.modifiers.new("Bevel", "BEVEL")
    m.width = width
    m.segments = segments
    return o


def smooth(o):
    for p in o.data.polygons:
        p.use_smooth = True
    return o


def camera(scene, location, target=(0, 0, 0), lens=50, ortho_scale=None):
    cam = bpy.data.cameras.new("Cam")
    cam.lens = lens
    if ortho_scale:
        cam.type = "ORTHO"
        cam.ortho_scale = ortho_scale
    o = bpy.data.objects.new("Cam", cam)
    scene.collection.objects.link(o)
    o.location = location
    t = bpy.data.objects.new("Target", None)
    scene.collection.objects.link(t)
    t.location = target
    c = o.constraints.new("TRACK_TO")
    c.target = t
    c.track_axis = "TRACK_NEGATIVE_Z"
    c.up_axis = "UP_Y"
    scene.camera = o
    return o, t


def shadow_catcher(size=20):
    bpy.ops.mesh.primitive_plane_add(size=size)
    p = bpy.context.active_object
    p.name = "ShadowCatcher"
    p.is_shadow_catcher = True
    return p


def render_frames(scene, out, frames, start=1):
    import os
    os.makedirs(out, exist_ok=True)
    scene.frame_start = start
    scene.frame_end = start + frames - 1
    scene.render.filepath = os.path.join(out, "f_")
    bpy.ops.render.render(animation=True)
