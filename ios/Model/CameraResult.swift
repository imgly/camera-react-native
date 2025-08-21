import IMGLYCamera

/// The result type for a camera recording session in standard or dual camera mode.
@objc @objcMembers public class CameraRecording: NSObject {
  /// The recorded videos.
  public let recordings: [Recording]

  /// Creates a new `CameraResult` from the `IMGLYCamera` result types.
  /// - Parameters:
  ///   - recordings: The recorded `IMGLYCamera.Recording` videos.
  public convenience init(recordings: [IMGLYCamera.Recording]) {
    self.init(
      recordings: recordings.compactMap { Recording(recording: $0) },
    )
  }

  /// Creates a new `CameraResult`.
  /// - Parameters:
  ///   - recordings: The recorded videos.
  public init(recordings: [Recording]) {
    self.recordings = recordings
  }

  func toDictionary() -> [String: Any] {
    [
      "recordings": recordings.compactMap { $0.toDictionary() },
    ]
  }
}

/// The result type for a camera reaction session.
@objc @objcMembers public class CameraReaction: NSObject {
  /// The video that was reacted to.
  public let video: Recording

  /// The recorded videos.
  public let recordings: [Recording]

  /// Creates a new `CameraReaction` from the `IMGLYCamera` result types.
  /// - Parameters:
  ///   - video: The `IMGLYCamera.Recording` video that was reacted to.
  ///   - recordings: The recorded `IMGLYCamera.Recording` videos.
  public convenience init(video: IMGLYCamera.Recording, recordings: [IMGLYCamera.Recording]) {
    self.init(
      video: Recording(recording: video),
      recordings: recordings.compactMap { Recording(recording: $0) },
    )
  }

  /// Creates a new `CameraReaction` instance..
  /// - Parameters:
  ///   - video: The `Recording` video that was reacted to.
  ///   - recordings: The recorded `Recording` videos.
  public init(video: Recording, recordings: [Recording]) {
    self.video = video
    self.recordings = recordings
  }

  func toDictionary() -> [String: Any] {
    [
      "video": video.toDictionary(),
      "recordings": recordings.compactMap { $0.toDictionary() },
    ]
  }
}

/// The result of a camera session.
@objc @objcMembers public class CameraResult: NSObject {
  /// The video that was reacted to.
  public let recording: CameraRecording?

  /// The recorded videos.
  public let reaction: CameraReaction?

  /// The associated metadata.
  public let metadata: [String: Any]

  /// Creates a new `CameraResult`.
  /// - Parameters:
  ///   - video: The video that was reacted to.
  ///   - recordings: The recorded videos.
  ///   - metadata: The associated metadata.
  public convenience init(recording: CameraRecording, metadata: [String: Any] = [:]) {
    self.init(recording: recording, reaction: nil, metadata: metadata)
  }

  /// Creates a new `CameraResult` from the `IMGLYCamera` result types.
  /// - Parameters:
  ///   - video: The `IMGLYCamera.Recording` video that was reacted to.
  ///   - recordings: The recorded `IMGLYCamera.Recording` videos.
  ///   - metadata: The associated metadata.
  public convenience init(reaction: CameraReaction, metadata: [String: Any] = [:]) {
    self.init(recording: nil, reaction: reaction, metadata: metadata)
  }

  private init(recording: CameraRecording?, reaction: CameraReaction?, metadata: [String: Any] = [:]) {
    self.recording = recording
    self.reaction = reaction
    self.metadata = metadata
  }

  /// Converts the instance to a dictionary.
  public func toDictionary() -> [String: Any] {
    var dictionary: [String: Any] = ["metadata": metadata]
    if let recording {
      dictionary["recording"] = recording.toDictionary()
    }
    if let reaction {
      dictionary["reaction"] = reaction.toDictionary()
    }
    return dictionary
  }
}

/// A recording of the camera that can contain multiple video sections.
@objc @objcMembers public class Recording: NSObject {
  /// The individual video sections.
  public let videos: [Video]

  /// The duration in milliseconds.
  public let duration: Double

  /// Creates a new `Recording` instance.
  /// - Parameters:
  ///   - videos: The individual video sections.
  ///   - duration: The duration in milliseconds.
  public init(videos: [Video], duration: Double) {
    self.videos = videos
    self.duration = duration
  }

  /// Creates a new `Recording` instance from a `IMGLYCamera.Recording`.
  /// - Parameter recording: The `IMGLYCamera.Recording`.
  public convenience init(recording: IMGLYCamera.Recording) {
    self.init(videos: recording.videos.compactMap { Video(video: $0) }, duration: recording.duration.seconds)
  }

  func toDictionary() -> [String: Any] {
    [
      "videos": videos.compactMap { $0.toDictionary() },
      "duration": duration,
    ]
  }
}

/// An individual video.
@objc @objcMembers public class Video: NSObject {
  /// The `URL` to the source of the video.
  public let url: URL

  /// The height of the video.
  public let rect: CGRect

  /// Creates a new `Video`.
  /// - Parameters:
  ///   - url: The `URL` to the source of the video.
  ///   - height: The height of the video.
  ///   - width: The width of the video.
  public init(url: URL, rect: CGRect) {
    self.url = url
    self.rect = rect
  }

  /// Creates a new `Video` instance from a `IMGLYCamera.Recording.Video`.
  /// - Parameter recording: The `IMGLYCamera.Recording.Video`.
  public convenience init(video: IMGLYCamera.Recording.Video) {
    self.init(url: video.url, rect: video.rect)
  }

  func toDictionary() -> [String: Any] {
    [
      "uri": url.absoluteString,
      "rect": [
        "x": rect.origin.x,
        "y": rect.origin.y,
        "width": Double(rect.width),
        "height": Double(rect.height),
      ],
    ]
  }
}
