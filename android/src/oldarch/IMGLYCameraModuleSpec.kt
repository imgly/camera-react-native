package ly.img.camera.reactnative.module

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReadableMap

abstract class IMGLYCameraModuleSpec internal constructor(
    context: ReactApplicationContext,
) : ReactContextBaseJavaModule(context) {
    abstract fun openCamera(
        settings: ReadableMap?,
        video: String?,
        metadata: ReadableMap?,
        promise: Promise?,
    )
}
