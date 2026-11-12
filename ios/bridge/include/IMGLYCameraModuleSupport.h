#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/// Resolves a fulfilled result. Mirrors React Native's `RCTPromiseResolveBlock`
/// without importing React, so the Swift implementation stays React-free.
typedef void (^IMGLYCameraResolveBlock)(id _Nullable result);

/// Rejects with an error. Mirrors React Native's `RCTPromiseRejectBlock`.
typedef void (^IMGLYCameraRejectBlock)(NSString* code, NSString* message, NSError* _Nullable error);

/// The seam between the Objective-C++ React Native bridge and the Swift
/// implementation of the camera module.
///
/// The bridge resolves the implementation at runtime through
/// `IMGLYCameraModuleImplementationProvider` instead of importing the generated
/// `-Swift.h` header. Swift Package Manager cannot compile mixed
/// Swift/Objective-C++ targets (SE-0403) and never emits that header, so the
/// Objective-C target must not depend on Swift at compile time.
@protocol IMGLYCameraModuleImplementation <NSObject>

/// Opens the camera.
/// - Parameters:
///   - settings: The raw camera settings as received from JavaScript.
///   - video: The source of the video to react to as received from JavaScript.
///   - metadata: Any custom metadata as received from JavaScript.
///   - resolve: The block to invoke with the recording result, or `NSNull` on cancellation.
///   - reject: The block to invoke when parsing or the recording fails.
- (void)openCameraWithSettings:(NSDictionary*)settings
                         video:(nullable NSString*)video
                      metadata:(nullable NSDictionary*)metadata
                       resolve:(IMGLYCameraResolveBlock)resolve
                        reject:(IMGLYCameraRejectBlock)reject;

@end

/// Resolves the Swift implementation of the camera module at runtime.
@interface IMGLYCameraModuleImplementationProvider : NSObject

/// The resolved implementation, or `nil` when the Swift part of this module
/// was not linked into the app.
+ (nullable id<IMGLYCameraModuleImplementation>)implementation;

@end

NS_ASSUME_NONNULL_END
