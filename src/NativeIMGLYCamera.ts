import { TurboModule, TurboModuleRegistry } from 'react-native';

/**
 * A recording of the camera that can
 * contain multiple videos.
 */
export interface Recording {
  /** The individual videos of the recording. */
  videos: Video[];

  /** The overall duration in milliseconds. */
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

/** The result for a default camera recording session. */
interface CameraRecording {
  /** The recorded videos. */
  recordings: Recording[];
}

/** The result for a reaction camera recording session. */
interface CameraReaction {
  /** The video that was reacted to (iOS only). */
  video: Recording;

  /** The recorded videos. */
  recordings: Recording[];
}

/** The result of a camera session. */
interface CameraResult {
  /** The video that was reacted to (iOS only). */
  recording?: CameraRecording;

  /** The recorded videos. */
  reaction?: CameraReaction;

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
    settings: CameraSettings,
    video?: string,
    metadata?: { [key: string]: unknown }
  ): Promise<CameraResult | null>;
}

/** The native module. */
const NativeModule = TurboModuleRegistry.get<Spec>(
  'IMGLYCamera'
) as Spec | null;

/** The result for a default camera recording session. */
export interface CameraRecordingResult {
  /** The recorded videos. */
  recordings: Recording[];

  /** The associated metadata. */
  metadata: { [key: string]: unknown };
}

/** The result for a reaction camera recording session. */
export interface CameraReactionResult {
  /** The video that was reacted to (iOS only). */
  video: Recording;

  /** The recorded videos. */
  recordings: Recording[];

  /** The associated metadata. */
  metadata: { [key: string]: unknown };
}

/** The IMG.LY Camera. */
class IMGLYCamera {
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
   * Opens the standard camera.
   * @param settings - Configuration settings for the camera.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to the recording result, or null if cancelled.
   */
  static async openCamera(
    settings: CameraSettings,
    metadata?: { [key: string]: unknown }
  ): Promise<CameraRecordingResult | null>;

  /**
   * Opens the camera with the specified settings and optional video or metadata.
   * @param settings - Configuration settings for the camera.
   * @param video - Optional video input to trigger reactions (iOS only) or metadata object.
   * @param metadata - Optional metadata to pass to the native module.
   * @returns A promise that resolves to either the recording result, reaction result, or null if unsuccessful.
   */
  static async openCamera(
    settings: CameraSettings,
    video?: string | { [key: string]: unknown },
    metadata: { [key: string]: unknown } = {}
  ): Promise<CameraRecordingResult | CameraReactionResult | null> {
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
    if (result?.recording) {
      return {
        recordings: result.recording.recordings,
        metadata: result.metadata
      };
    }
    return null;
  }
}

export default IMGLYCamera;
