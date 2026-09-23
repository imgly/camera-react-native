#ifdef RCT_NEW_ARCH_ENABLED
#import <IMGLYCameraModuleSpec/IMGLYCameraModuleSpec.h>

@interface IMGLYCameraModule : NSObject <NativeIMGLYCameraSpec>
#else
#import <React/RCTBridgeModule.h>

@interface IMGLYCameraModule : NSObject <RCTBridgeModule>
#endif

@end
