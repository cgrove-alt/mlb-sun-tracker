#!/usr/bin/env swift

import AVFoundation
import Dispatch
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct FrameRecord: Codable {
    let fraction: Double
    let requestedSeconds: Double
    let actualSeconds: Double
    let file: String
}

func usage() -> Never {
    FileHandle.standardError.write(Data("Usage: swift scripts/extractVideoFrames.swift INPUT_VIDEO OUTPUT_DIRECTORY [SECONDS ...]\n".utf8))
    exit(2)
}

func extractFrames() async throws {
    let arguments = CommandLine.arguments
    guard arguments.count >= 3 else { usage() }

    let input = URL(fileURLWithPath: arguments[1]).standardizedFileURL
    let outputDirectory = URL(fileURLWithPath: arguments[2], isDirectory: true).standardizedFileURL
    guard FileManager.default.fileExists(atPath: input.path) else {
        FileHandle.standardError.write(Data("Input video does not exist: \(input.path)\n".utf8))
        exit(2)
    }

    try FileManager.default.createDirectory(at: outputDirectory, withIntermediateDirectories: true)

    let asset = AVURLAsset(url: input)
    let durationSeconds = CMTimeGetSeconds(try await asset.load(.duration))
    guard durationSeconds.isFinite, durationSeconds > 0 else {
        throw NSError(domain: "extractVideoFrames", code: 3, userInfo: [
            NSLocalizedDescriptionKey: "Could not determine a positive video duration.",
        ])
    }

    let generator = AVAssetImageGenerator(asset: asset)
    generator.appliesPreferredTrackTransform = true
    generator.maximumSize = CGSize(width: 1920, height: 1080)
    generator.requestedTimeToleranceBefore = CMTime(seconds: 0.1, preferredTimescale: 600)
    generator.requestedTimeToleranceAfter = CMTime(seconds: 0.1, preferredTimescale: 600)

    let defaultFractions = [0.05, 0.20, 0.35, 0.50, 0.65, 0.80, 0.95]
    let customSeconds = try arguments.dropFirst(3).map { value -> Double in
        guard let seconds = Double(value), seconds >= 0, seconds <= durationSeconds else {
            throw NSError(domain: "extractVideoFrames", code: 4, userInfo: [
                NSLocalizedDescriptionKey: "Invalid sample second '\(value)'; expected 0...\(durationSeconds).",
            ])
        }
        return seconds
    }
    let samples: [(fraction: Double, seconds: Double)] = customSeconds.isEmpty
        ? defaultFractions.map { ($0, durationSeconds * $0) }
        : Array(Set(customSeconds)).sorted().map { ($0 / durationSeconds, $0) }
    var records: [FrameRecord] = []

    for (index, sample) in samples.enumerated() {
        let requestedSeconds = sample.seconds
        let requestedTime = CMTime(seconds: requestedSeconds, preferredTimescale: 600)
        let generated = try await generator.image(at: requestedTime)
        let image = generated.image
        let actualSeconds = CMTimeGetSeconds(generated.actualTime)
        let fileName = String(format: "frame-%02d-%06.2fs.png", index + 1, actualSeconds)
        let output = outputDirectory.appendingPathComponent(fileName)

        guard let destination = CGImageDestinationCreateWithURL(
            output as CFURL,
            UTType.png.identifier as CFString,
            1,
            nil
        ) else {
            throw NSError(domain: "extractVideoFrames", code: 1, userInfo: [
                NSLocalizedDescriptionKey: "Could not create image destination: \(output.path)",
            ])
        }
        CGImageDestinationAddImage(destination, image, nil)
        guard CGImageDestinationFinalize(destination) else {
            throw NSError(domain: "extractVideoFrames", code: 2, userInfo: [
                NSLocalizedDescriptionKey: "Could not write frame: \(output.path)",
            ])
        }

        records.append(FrameRecord(
            fraction: sample.fraction,
            requestedSeconds: requestedSeconds,
            actualSeconds: actualSeconds,
            file: output.path
        ))
    }

    let encoder = JSONEncoder()
    encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
    let summary = try encoder.encode(records)
    FileHandle.standardOutput.write(summary)
    FileHandle.standardOutput.write(Data("\n".utf8))
}

Task {
    do {
        try await extractFrames()
        exit(0)
    } catch {
        FileHandle.standardError.write(Data("Frame extraction failed: \(error.localizedDescription)\n".utf8))
        exit(1)
    }
}
dispatchMain()
