#import "IMGLYCameraModule.h"
#import "IMGLYCameraModule/IMGLYCameraModule-Swift.h"

@implementation IMGLYCameraModule

RCT_EXPORT_MODULE(IMGLYCamera)

#ifdef RCT_NEW_ARCH_ENABLED
- (void)openCamera:(JS::NativeIMGLYCamera::CameraSettings&)settings
             video:(NSString*)video
          metadata:(NSDictionary*)metadata
           resolve:(RCTPromiseResolveBlock)resolve
            reject:(RCTPromiseRejectBlock)reject {
  NSMutableDictionary* convertedSettings = [@{
    @"license" : settings.license(),
  } mutableCopy];
  if (settings.userId() != nil) {
    convertedSettings[@"userId"] = settings.userId();
  }
  [self open:convertedSettings video:video metadata:metadata resolve:resolve reject:reject];
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
  (const facebook::react::ObjCTurboModule::InitParams&)params {
  return std::make_shared<facebook::react::NativeIMGLYCameraSpecJSI>(params);
}

#else
RCT_EXPORT_METHOD(openCamera
                  : (nonnull NSDictionary*)settings video
                  : (nullable NSString*)video metadata
                  : (NSDictionary*)metadata resolve
                  : (RCTPromiseResolveBlock)resolve reject
                  : (RCTPromiseRejectBlock)reject) {
  [self open:settings video:video metadata:metadata resolve:resolve reject:reject];
}
#endif

- (void)open:(nonnull NSDictionary*)settings
       video:(nullable NSString*)video
    metadata:(NSDictionary*)metadata
     resolve:(RCTPromiseResolveBlock)resolve
      reject:(RCTPromiseRejectBlock)reject {
  CameraSettings* cameraSettings = [CameraSettings fromDictionary:settings];
  dispatch_async(dispatch_get_main_queue(), ^{
    [[IMGLYCameraModuleSwiftAdapter shared]
      openCameraWithSettings:cameraSettings
                       video:video
                    metadata:metadata
                  completion:^(CameraResult* _Nullable result, NSError* _Nullable error) {
                    if (result != nil) {
                      resolve([result toDictionary]);
                    } else if (error != nil) {
                      reject(@"E_RECORDING_FAILED", @"The recording failed due to: ", error);
                    } else {
                      resolve([NSNull null]);
                    }
                  }];
  });
}
@end
