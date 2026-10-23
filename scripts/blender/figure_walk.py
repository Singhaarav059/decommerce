"""Placeholder character loop: a faceless linen mannequin walking in place.

Stands in for the AI-generated cashier/picker/shopper clips until those exist.
Transparent background; encoded to WebM VP9 alpha + HEVC alpha by encode_alpha.sh.
"""
import sys, os, math, bpy
sys.path.insert(0, os.path.dirname(__file__))
import lib

a = lib.args({"frames": 48, "size": "540x960"})
scene = lib.reset()
lib.setup_render(scene, a.size, a.samples, transparent=True)
lib.world(scene, strength=0.7)
lib.light_rig(scene)
M = lib.mats()


def limb(name, length, radius, mat, parent, at):
    bpy.ops.mesh.primitive_cylinder_add(radius=radius, depth=length, vertices=24)
    o = bpy.context.active_object
    o.name = name
    for v in o.data.vertices:
        v.co.z -= length / 2  # pivot at the top joint
    o.data.materials.append(mat)
    lib.bevel(o, radius * 0.9, 4)
    lib.smooth(o)
    o.parent = parent
    o.location = at
    return o


hips = bpy.data.objects.new("Hips", None)
scene.collection.objects.link(hips)
hips.location = (0, 0, 0.95)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.2, segments=32, ring_count=16)
torso = bpy.context.active_object
torso.name = "Torso"
torso.scale = (1.0, 0.62, 1.75)
torso.location = (0, 0, 0.36)
torso.parent = hips
torso.data.materials.append(M["linen"])
lib.smooth(torso)

bpy.ops.mesh.primitive_uv_sphere_add(radius=0.11, segments=32, ring_count=16)
head = bpy.context.active_object
head.name = "Head"
head.scale = (0.9, 0.95, 1.12)
head.location = (0, 0, 0.82)
head.parent = hips
head.data.materials.append(M["stone"])
lib.smooth(head)

legs = [limb(f"Leg{s}", 0.9, 0.065, M["ink"], hips, (0.09 * s, 0, 0.0)) for s in (-1, 1)]
arms = [limb(f"Arm{s}", 0.62, 0.045, M["linen"], hips, (0.23 * s, 0, 0.62)) for s in (-1, 1)]

n = a.frames
for f in range(1, n + 1):
    t = (f - 1) / n * 2 * math.pi
    for i, leg in enumerate(legs):
        leg.rotation_euler = (math.sin(t + i * math.pi) * 0.42, 0, 0)
        leg.keyframe_insert("rotation_euler", frame=f)
    for i, arm in enumerate(arms):
        arm.rotation_euler = (-math.sin(t + i * math.pi) * 0.35, 0, (0.08 if i else -0.08))
        arm.keyframe_insert("rotation_euler", frame=f)
    hips.location = (0, 0, 0.95 + abs(math.cos(t)) * 0.025)
    hips.rotation_euler = (0, 0, math.sin(t) * 0.06)
    hips.keyframe_insert("location", frame=f)
    hips.keyframe_insert("rotation_euler", frame=f)

lib.camera(scene, (2.6, -3.6, 1.35), target=(0, 0, 0.95), lens=55)
lib.render_frames(scene, a.out, n)
