package ly.img.camera.reactnative.module.model

import android.os.Parcel
import android.os.Parcelable
import ly.img.camera.reactnative.module.model.CameraResult.CREATOR.readMap
import ly.img.camera.reactnative.module.model.CameraResult.CREATOR.writeMap

/**
 * The result type for a camera recording session in standard mode.
 *
 * @property recordings The recordings of the camera session.
 */
data class CameraRecording(
    val recordings: List<Recording>?,
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        parcel.createTypedArrayList(Recording),
    )
    constructor(record: ly.img.camera.core.CameraResult.Record) : this(
        record.recordings.map { Recording(it) },
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        parcel.writeTypedList(recordings)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraResult> {
        override fun createFromParcel(parcel: Parcel): CameraResult = CameraResult(parcel)

        override fun newArray(size: Int): Array<CameraResult?> = arrayOfNulls(size)
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "recordings" to recordings?.map { it.toMap() },
    )
}

/**
 * A class representing the result of a camera session.
 *
 * @property recording The result for the camera session in standard mode.
 * @property metadata The associated metadata.
 */
data class CameraResult(
    val recording: CameraRecording?,
    val metadata: Map<String, Any> = emptyMap(),
) : Parcelable {
    /**
     * Creates a new instance from a given [Parcel].
     * @param parcel The [Parcel].
     */
    constructor(parcel: Parcel) : this(
        CameraRecording(parcel),
        readMap(parcel),
    )
    constructor(record: ly.img.camera.core.CameraResult.Record) : this(
        CameraRecording(record),
        emptyMap(),
    )

    override fun writeToParcel(
        parcel: Parcel,
        flags: Int,
    ) {
        recording?.writeToParcel(parcel, flags)
        writeMap(parcel, metadata, flags)
    }

    override fun describeContents(): Int = 0

    companion object CREATOR : Parcelable.Creator<CameraResult> {
        override fun createFromParcel(parcel: Parcel): CameraResult = CameraResult(parcel)

        override fun newArray(size: Int): Array<CameraResult?> = arrayOfNulls(size)

        private fun writeMap(
            parcel: Parcel,
            map: Map<String, Any>,
            flags: Int,
        ) {
            parcel.writeInt(map.size)
            for ((key, value) in map) {
                parcel.writeString(key)
                parcel.writeValue(value)
            }
        }

        private fun readMap(parcel: Parcel): Map<String, Any> {
            val size = parcel.readInt()
            val map = mutableMapOf<String, Any>()
            repeat(size) {
                val key = parcel.readString()
                val value = parcel.readValue(this::class.java.classLoader)
                key ?: throw (IllegalStateException("Key must not be null."))
                value ?: throw (IllegalStateException("Value must not be null."))

                map[key] = value
            }
            return map
        }
    }

    fun toMap(): Map<String, Any?> = mapOf(
        "recording" to recording?.toMap(),
        "metadata" to metadata,
    )
}
