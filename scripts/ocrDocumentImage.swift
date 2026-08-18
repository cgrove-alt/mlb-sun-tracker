#!/usr/bin/env swift

import AppKit
import Foundation
import Vision

func cgImage(at path: String) throws -> CGImage {
    guard let image = NSImage(contentsOfFile: path) else {
        throw NSError(domain: "ocrDocumentImage", code: 1, userInfo: [
            NSLocalizedDescriptionKey: "Unable to load image: \(path)",
        ])
    }
    var rect = NSRect(origin: .zero, size: image.size)
    guard let output = image.cgImage(forProposedRect: &rect, context: nil, hints: nil) else {
        throw NSError(domain: "ocrDocumentImage", code: 2, userInfo: [
            NSLocalizedDescriptionKey: "Unable to convert image to CGImage: \(path)",
        ])
    }
    return output
}

let rawArguments = Array(CommandLine.arguments.dropFirst())
let outputArgument = rawArguments.first { $0.hasPrefix("--output=") }
let outputPath = outputArgument.map { String($0.dropFirst("--output=".count)) }
let paths = rawArguments.filter { !$0.hasPrefix("--output=") }
guard !paths.isEmpty else {
    FileHandle.standardError.write(Data("Usage: ocrDocumentImage.swift [--output=FILE] IMAGE [IMAGE ...]\n".utf8))
    exit(2)
}

var documentResults: [[String: Any]] = []
for path in paths {
    do {
        let request = VNRecognizeTextRequest()
        request.recognitionLevel = .accurate
        request.usesLanguageCorrection = true
        request.recognitionLanguages = ["en-US"]
        let handler = VNImageRequestHandler(cgImage: try cgImage(at: path), options: [:])
        try handler.perform([request])
        let observations = (request.results ?? []).sorted { first, second in
            let verticalDifference = first.boundingBox.maxY - second.boundingBox.maxY
            if abs(verticalDifference) > 0.01 {
                return verticalDifference > 0
            }
            return first.boundingBox.minX < second.boundingBox.minX
        }
        let lines = observations.compactMap { $0.topCandidates(1).first?.string }
        documentResults.append([
            "path": path,
            "recognitionLevel": "accurate",
            "recognitionLanguages": ["en-US"],
            "lines": lines,
            "text": lines.joined(separator: "\n"),
        ])
        print("FILE \(path)")
        for line in lines {
            print(line)
        }
        print("END_FILE")
    } catch {
        FileHandle.standardError.write(Data("OCR failed for \(path): \(error)\n".utf8))
        exit(1)
    }
}

if let outputPath {
    let artifact: [String: Any] = [
        "schemaVersion": 1,
        "analysisVersion": "macos-vision-document-ocr-v1",
        "documents": documentResults,
        "publicationEligible": false,
        "note": "OCR is a discovery and transcription aid. It is not measured geometry or a substitute for visual source review.",
    ]
    let data = try JSONSerialization.data(withJSONObject: artifact, options: [.prettyPrinted, .sortedKeys])
    try data.write(to: URL(fileURLWithPath: outputPath))
}
