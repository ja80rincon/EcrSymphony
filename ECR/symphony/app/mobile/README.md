# Symphony Mobile App (Symphony App)
Symphony Mobile App is the mobile interface for the Symphony Platform.  It is intended to be used in the field as an alternative to the web interface, and has features that make use of sensors and capabilitites available on mobile devices (GPS, Wi-Fi/Cell radios, Camera, etc).

## Tech Stack
* The apps are mainly written with ReactNative + Relay GraphQL
* UI is based on material design with react native material ui

## Requirements
1. Minimum Android version supported: 5.0 (aka Lollipop)
2. Install the following items:
Android NDK
Android SDK
Android Studio
Oracle Java 8 JDK
3. Open command line and run the following commands to install:
```
brew install node
brew install watchman
brew install react-native-cli
brew install jq
yarn global add react-devtools
yarn global add flow-typed
```

## Build and Install the Symphony App
1. launch an Android emulator or connect an Android device to your dev computer
2. to download the node modules locally run: `yarn`
3. create a file called .env.platform and include the following information:
APP_NAME='platform'
MAPBOX_TOKEN='[token here]'
4. run: `yarn install:platform` to build the symphony version

## Development against local Symphony Docker instance
https://github.com/Telecominfraproject/symphony/pull/1833

See the [CONTRIBUTING](CONTRIBUTING.md) file for how to help out.

## Terms of Use
https://opensource.facebook.com/legal/terms

## Privacy Policy
https://opensource.facebook.com/legal/privacy

## License
This project is BSD licensed, as found in the [LICENSE](LICENSE) file.
