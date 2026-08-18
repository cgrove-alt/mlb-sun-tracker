#import <AppKit/AppKit.h>
#import <Foundation/Foundation.h>
#import <Vision/Vision.h>

static void Fail(NSString *message) {
  fprintf(stderr, "%s\n", message.UTF8String);
  exit(1);
}

int main(int argc, const char *argv[]) {
  @autoreleasepool {
    if (argc < 4 || strcmp(argv[1], "--output") != 0) {
      Fail(@"Usage: ocrPageImages --output OUTPUT.json PAGE.png [PAGE.png ...]");
    }

    NSString *outputPath = [NSString stringWithUTF8String:argv[2]];
    NSMutableArray *pages = [NSMutableArray array];
    for (int index = 3; index < argc; index++) {
      NSString *inputPath = [NSString stringWithUTF8String:argv[index]];
      NSImage *image = [[NSImage alloc] initWithContentsOfFile:inputPath];
      if (image == nil) {
        Fail([NSString stringWithFormat:@"Could not read image: %@", inputPath]);
      }
      NSRect proposedRect = NSMakeRect(0, 0, image.size.width, image.size.height);
      CGImageRef cgImage = [image CGImageForProposedRect:&proposedRect
                                                context:nil
                                                  hints:nil];
      if (cgImage == nil) {
        Fail([NSString stringWithFormat:@"Could not create CGImage: %@", inputPath]);
      }

      VNRecognizeTextRequest *request = [[VNRecognizeTextRequest alloc] init];
      request.recognitionLevel = VNRequestTextRecognitionLevelAccurate;
      request.usesLanguageCorrection = YES;
      request.recognitionLanguages = @[@"en-US"];
      VNImageRequestHandler *handler =
          [[VNImageRequestHandler alloc] initWithCGImage:cgImage options:@{}];
      NSError *recognitionError = nil;
      if (![handler performRequests:@[ request ] error:&recognitionError]) {
        Fail([NSString stringWithFormat:@"Vision OCR failed for %@: %@",
                                         inputPath, recognitionError]);
      }

      NSArray<VNRecognizedTextObservation *> *observations =
          [request.results sortedArrayUsingComparator:^NSComparisonResult(
                               VNRecognizedTextObservation *left,
                               VNRecognizedTextObservation *right) {
            CGFloat verticalDifference = CGRectGetMidY(left.boundingBox) -
                                         CGRectGetMidY(right.boundingBox);
            if (fabs(verticalDifference) > 0.01) {
              return verticalDifference > 0 ? NSOrderedAscending : NSOrderedDescending;
            }
            CGFloat horizontalDifference = CGRectGetMinX(left.boundingBox) -
                                           CGRectGetMinX(right.boundingBox);
            if (horizontalDifference < 0) {
              return NSOrderedAscending;
            }
            if (horizontalDifference > 0) {
              return NSOrderedDescending;
            }
            return NSOrderedSame;
          }];
      NSMutableArray<NSString *> *lines = [NSMutableArray array];
      for (VNRecognizedTextObservation *observation in observations) {
        VNRecognizedText *candidate = [observation topCandidates:1].firstObject;
        if (candidate != nil) {
          [lines addObject:candidate.string];
        }
      }
      [pages addObject:@{
        @"path" : inputPath,
        @"text" : [lines componentsJoinedByString:@"\n"],
        @"recognizedLineCount" : @(lines.count)
      }];
    }

    NSDictionary *artifact = @{
      @"schemaVersion" : @1,
      @"engine" : @"macOS Vision VNRecognizeTextRequest",
      @"recognitionLevel" : @"accurate",
      @"usesLanguageCorrection" : @YES,
      @"pages" : pages
    };
    NSError *serializationError = nil;
    NSData *data = [NSJSONSerialization dataWithJSONObject:artifact
                                                    options:NSJSONWritingPrettyPrinted |
                                                            NSJSONWritingSortedKeys
                                                      error:&serializationError];
    if (data == nil) {
      Fail([NSString stringWithFormat:@"Could not serialize OCR artifact: %@",
                                       serializationError]);
    }
    NSMutableData *terminatedData = [data mutableCopy];
    const char newline = '\n';
    [terminatedData appendBytes:&newline length:1];
    if (![terminatedData writeToFile:outputPath options:NSDataWritingAtomic error:nil]) {
      Fail([NSString stringWithFormat:@"Could not write OCR artifact: %@", outputPath]);
    }
    printf("Wrote %lu OCR pages to %s\n", (unsigned long)pages.count,
           outputPath.UTF8String);
  }
  return 0;
}
