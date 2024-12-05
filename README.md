# Camera SDK

The `@imgly/camera-react-native` module contains the prebuilt iOS and Android Camera SDK powered by the _Creative Engine_ - made accessible for React Native.
The Creative Engine enables you to build any design editing UI, automation and creative workflow.
It offers performant and robust graphics processing capabilities combining the best of layout, typography and image processing with advanced workflows centered around templating and adaptation.

Visit our [documentation](https://img.ly/docs/cesdk) for more tutorials on how to integrate and customize the engine for your specific use case.

## License

The Camera SDK is a commercial product. To use it and get access you need to unlock the SDK with a license file. You can purchase a license at https://img.ly/pricing.

## Integration

```ts
import IMGLYCamera from '@imgly/camera-react-native';

// Open the camera and retrieve the result.
const result = await IMGLYCamera.openCamera({
  license: 'YOUR_LICENSE'
});
```

## Changelog

To keep up-to-date with the latest changes, visit [CHANGELOG](https://img.ly/docs/cesdk/changelog/).
