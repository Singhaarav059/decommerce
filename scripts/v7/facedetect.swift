// Prints face boxes for each image path given: "path x y w h" per face, in pixels from the top-left.
import Foundation
import Vision
import AppKit
for path in CommandLine.arguments.dropFirst() {
  guard let img = NSImage(contentsOfFile: path), let cg = img.cgImage(forProposedRect: nil, context: nil, hints: nil) else { continue }
  let req = VNDetectFaceRectanglesRequest()
  try? VNImageRequestHandler(cgImage: cg, options: [:]).perform([req])
  let W = Double(cg.width), H = Double(cg.height)
  for f in req.results ?? [] {
    let b = f.boundingBox
    print(path, Int(b.minX * W), Int((1 - b.maxY) * H), Int(b.width * W), Int(b.height * H))
  }
}
