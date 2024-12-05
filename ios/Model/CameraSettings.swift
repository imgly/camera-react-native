/// A struct containing all necessary settings to setup the camera.
@objc @objcMembers public class CameraSettings: NSObject, Codable {
  /// The license key.
  public let license: String

  /// The id of the current user.
  public let userId: String?

  /// Creates a new instance from a given dictionary.
  ///
  /// - Parameters:
  ///   - dictionary: The dictionary to convert the instance from.
  /// - Returns: The `CameraSettings` instance.
  public static func fromDictionary(_ dictionary: [String: Any]) -> CameraSettings? {
    do {
      let data = try JSONSerialization.data(withJSONObject: dictionary, options: [])
      let settings = try JSONDecoder().decode(CameraSettings.self, from: data)
      return settings
    } catch {
      print("Error decoding dictionary: \(error)")
      return nil
    }
  }
}
