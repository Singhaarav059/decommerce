"""Lab test film for <ScrollSequence>: camera orbits the copper cube on its plinth."""
import sys, os, math, bpy
sys.path.insert(0, os.path.dirname(__file__))
import lib

a = lib.args({"frames": 60, "size": "1280x800"})
scene = lib.reset()
lib.setup_render(scene, a.size, a.samples)
lib.world(scene, strength=1.0)
lib.light_rig(scene)
M = lib.mats()

floor = lib.add(bpy.ops.mesh.primitive_plane_add, "Floor", M["stone"], size=400)
plinth = lib.bevel(lib.add(bpy.ops.mesh.primitive_cube_add, "Plinth", M["travertine"], size=1), 0.03)
plinth.scale = (1.4, 1.4, 0.18)
plinth.location = (0, 0, 0.09)
cube = lib.bevel(lib.add(bpy.ops.mesh.primitive_cube_add, "Cube", M["copper"], size=0.6), 0.04)
cube.location = (0, 0, 0.48)

cam, target = lib.camera(scene, (4, -4, 2.6), target=(0, 0, 0.45), lens=45)
n = a.frames
for f in range(1, n + 1):
    t = (f - 1) / (n - 1)
    ang = math.radians(-45 + 120 * t)
    cam.location = (5.6 * math.cos(ang), 5.6 * math.sin(ang), 2.6 - 0.9 * t)
    cam.keyframe_insert("location", frame=f)
    cube.rotation_euler = (0, 0, math.radians(90 * t))
    cube.keyframe_insert("rotation_euler", frame=f)

lib.render_frames(scene, a.out, n)
