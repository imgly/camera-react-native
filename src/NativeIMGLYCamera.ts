import { TurboModule, TurboModuleRegistry } from 'react-native';

/**
 * A recording of the camera that can
 * contain multiple videos.
 */
export interface Recording {
  /** The individual videos of the recording. */
  videos: Video[];

  /** The overall duration in seconds. */
  duration: number;
}

/** An individual video. */
export interface Video {
  /**
   * A url to the video file that is stored
   * in a temporary location.
   */
  uri: string;

  /**
   * A rect that contains the position of
   * each video as it was shown in the
   * camera preview (iOS only).
   */
  rect: Rect;
}

/**
 * A rect used to determine video
 * dimensions on the canvas.
 */
export interface Rect {
  /** The x coordinate of the top-left corner. */
  x: number;

  /** The y coordinate of the top-left corner. */
  y: number;

  /** The width. */
  width: number;

  /** The height. */
  height: number;
}

/** A captured still photo. Contains one image in standard mode or two stacked images in dual camera mode. */
export interface Photo {
  /** The individual image(s) of the photo capture. */
  images: PhotoImage[];

  /**
   * The duration stamped on the photo, in seconds.
   * Note: the Flutter bridge passes this value in milliseconds instead.
   */
  duration: number;
}

/** A single image inside a photo capture. */
export interface PhotoImage {
  /**
   * A url to the photo file that is stored
   * in a temporary location.
   */
  uri: string;

  /**
   * A rect that contains the position of
   * the image inside the dual-camera layout
   * (iOS only).
   */
  rect: Rect;
}

/**
 * A single capture from the camera. Either a still
 * photo or a video recording.
 */
export interface Capture {
  /** The captured still photo, when this is a photo capture. */
  photo?: Photo;

  /** The video recording, when this is a video capture. */
  video?: Recording;
}

/** The kind of media the camera captures. */
export type CaptureType = 'photo' | 'video' | 'mixed';

/** How many captures the camera session produces. */
export type CaptureCount = 'single' | 'multi';

/**
 * Configuration options that control how the camera captures media.
 * All fields are optional; missing values fall back to native defaults
 * (`video`, `multi`, `5` seconds).
 */
export interface CameraConfiguration {
  /** The kind of media the camera captures. */
  captureType?: CaptureType;

  /** How many captures the camera session produces. */
  captureCount?: CaptureCount;

  /** The duration in seconds stamped on each captured photo. */
  photoClipDuration?: number;
}

/**
 * Spec-level shape for the configuration field.
 *
 * The native turbo-module codegen does not support string literal unions
 * inside nested struct fields, so the Spec sees this looser variant with
 * plain strings while customers still author against the strict
 * `CameraConfiguration` above. The literal types narrow it correctly at
 * the call site through subtype assignability.
 */
interface SpecCameraConfiguration {
  captureType?: string;
  captureCount?: string;
  photoClipDuration?: number;
}

/** The result for a reaction camera recording session. */
interface CameraReaction {
  /** The video that was reacted to (iOS only). */
  video: Recording;

  /** The recorded videos. */
  recordings: Recording[];
}

/** The result for a photo, video, or mixed camera capture session. */
interface CameraCapture {
  /** The individual captures from the session. */
  captures: Capture[];
}

/** The result of a camera session. */
interface CameraResult {
  /** The reaction result for a reaction camera session (iOS only). */
  reaction?: CameraReaction;

  /** The capture result for a photo, video, or mixed camera session. */
  capture?: CameraCapture;

  /** The associated metadata. */
  metadata: { [key: string]: unknown };
}

/** A class containing all necessary settings to setup the camera. */
export interface CameraSettings {
  /** The license of the editor. Pass `null` to run the SDK in evaluation mode with a watermark. */
  license?: string;

  /**
   * Unique ID tied to your application's user.
   * This helps us accurately calculate monthly
   * active users (MAU).
   */
  userId?: string;

  /**
   * Optional camera configuration. When omitted,
   * native defaults apply.
   */
  configuration?: CameraConfiguration;
}

/**
 * Spec-level shape for `CameraSettings`. See `SpecCameraConfiguration`
 * for the reason this exists alongside the public `CameraSettings`.
 */
interface SpecCameraSettings {
  license?: string;
  userId?: string;
  configuration?: SpecCameraConfiguration;
}

/** TurboModule Spec. */
interface Spec extends TurboModule {
  /**
   * Open the Camera.
   * @param settings The `CameraSettings`.
   * @param video The video to react to (iOS only).
   * @param metadata The metadata to pass to the native module.
   */
  openCamera(
    settings: SpecCameraSettings,
    video?: string,
    metadata?: { [key: string]: unknown }
  ): Promise<CameraResult | null>;
}

/** The native module. */
const NativeModule = TurboModuleRegistry.get<Spec>(
  'IMGLYCamera'
) as Spec | null;

/** The result for a reaction camera recording session. */
export interface CameraReactionResult {
  /** The video that was reacted to (iOS only). */
  video: Recording;

  /** The recorded videos. */
  recordings: Recording[];

  /** The associated metadata. */
  metadata: { [key: string]: unknown };
}

/** The result for a photo, video, or mixed camera capture session. */
export interface CameraCaptureResult {
  /** The individual captures from the session. */
  captures: Capture[];

  /** The associated metadata. */
  metadata: { [key: string]: unknown };
}

/** The IMG.LY Camera. */
class IMGLYCamera {
  /**
   * Opens the camera in photo or mixed capture mode.
   *
   * Returns a `CameraCaptureResult` with photos, videos, or both, depending
   * on the configured `captureType`.
   *
   * @param settings - Configuration settings for the camera. Must include
   *   a `configuration` with `captureType: 'photo'` or `'mixed'`.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to the capture result, or null if cancelled.
   */
  static async openCamera(
    settings: CameraSettings & {
      configuration: CameraConfiguration & {
        captureType: 'photo' | 'mixed';
      };
    },
    metadata?: { [key: string]: unknown }
  ): Promise<CameraCaptureResult | null>;

  /**
   * Opens the camera for reaction mode (iOS only).
   * @param settings - Configuration settings for the camera.
   * @param video - Optional video input to trigger reactions.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to the reaction result, or null if cancelled.
   */
  static async openCamera(
    settings: CameraSettings,
    video: string,
    metadata?: { [key: string]: unknown }
  ): Promise<CameraReactionResult | null>;

  /**
   * Opens the standard video camera.
   * @param settings - Configuration settings for the camera.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to the capture result, or null if cancelled.
   */
  static async openCamera(
    settings: CameraSettings,
    metadata?: { [key: string]: unknown }
  ): Promise<CameraCaptureResult | null>;

  /**
   * Opens the camera with the specified settings and optional video or metadata.
   * @param settings - Configuration settings for the camera.
   * @param video - Optional video input to trigger reactions (iOS only) or metadata object.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to a recording, reaction, or capture result, or null if unsuccessful.
   */
  static async openCamera(
    settings: CameraSettings,
    video?: string | { [key: string]: unknown },
    metadata: { [key: string]: unknown } = {}
  ): Promise<CameraReactionResult | CameraCaptureResult | null> {
    if (!NativeModule) return null;
    const videoInput = typeof video === 'string' ? video : undefined;
    const metadataInput =
      typeof video === 'object' && video !== null ? video : metadata;
    const result = await NativeModule.openCamera(
      settings,
      videoInput,
      metadataInput
    );
    if (result?.reaction) {
      const { video, recordings } = result.reaction;
      return { video, recordings, metadata: result.metadata };
    }
    if (result?.capture) {
      return {
        captures: result.capture.captures,
        metadata: result.metadata
      };
    }
    return null;
  }
}

export default IMGLYCamera;
