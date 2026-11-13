#import "IMGLYCameraModuleSupport.h"

@implementation IMGLYCameraModuleImplementationProvider

+ (nullable id<IMGLYCameraModuleImplementation>)implementation {
  static id<IMGLYCameraModuleImplementation> implementation;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    // The Swift class is looked up by its stable Objective-C runtime name
    // (`IMGLYCameraModuleImplementation.swift`) because this target must not
    // reference Swift at compile time. React Native apps link with `-ObjC` on
    // both the CocoaPods and the Swift Package Manager path, which keeps the
    // class alive in Release and Archive builds despite the missing static
    // reference.
    Class implementationClass = NSClassFromString(@"IMGLYCameraModuleDefaultImplementation");
    if ([implementationClass conformsToProtocol:@protocol(IMGLYCameraModuleImplementation)]) {
      implementation = [[implementationClass alloc] init];
    }
  });
  return implementation;
}

@end
