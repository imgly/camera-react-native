package ly.img.camera.reactnative.module.model

import android.os.Parcel
import android.os.Parcelable

/**
 * A class containing all necessary information to configure the camera.
 *
 * @property license The license key.
 * @property userId The id of the current user.
 */
data class CameraSettings(
    val license: String,
    val userId: String?,
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        parcel.readString() ?: throw (Exception("Missing value for key 'license.'")),
        parcel.readString(),
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeString(license)
        parcel.writeString(userId)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraSettings> {
        override fun createFromParcel(parcel: Parcel): CameraSettings = CameraSettings(parcel)

        override fun newArray(size: Int): Array<CameraSettings?> = arrayOfNulls(size)

        fun createFromMap(map: Map<String, Any>): CameraSettings {
            val license = map["license"] as? String ?: throw (Exception("Missing value for key 'license.'"))
            val userId = map["userId"] as? String
            return CameraSettings(license, userId)
        }
    }
}
