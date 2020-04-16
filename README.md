# Sifir : Bitcoin and Lightning powered mobile wallet
- Non-custodial and open-source
- Anonymous, private and secure TOR connection to your own Bitcoin and Lightning node via Cyphernode.
- All communication is signed and encrypted with PGP keys generated on device to ensure maximum privacy and origination of messages.
- User friendly UX without compromising cypherpunk principles.

:warning: Dragons lie ahead ! :warning:
Sifir is still very much Alpha software with known issues. Please keep that in mind when using it. If you do find an issue while using the Sifir *please* open an issue for it so we can get on it.

*ANDROID ONLY* Sifir has only been tested on android phones at this time.

## Downloading Release
- Download and install the prebuilt APK from the release section
- Google Store - Coming soon...

## Build and Install for your self

1. Setup React Native CLI
https://facebook.github.io/react-native/docs/getting-started
2. Clone the Sifir project repository
3. Install any npm dependencies locally:
`npm i`

### Running in development mode
1. Make sure you've installed all depedencies and that your phone is connected and recongized by your system. 
2. Open two terminal windows (or Tmux panes, emacs,...)
In one terminal window run:
```
npm run start
```
and in another run:
```
npm run android
```
This will build, upload and start a debug version of the app on your phone with hot reload enabled.
### Building APK  for 'real' use
1. Build APK by running:
`npm run android:apk`
This will build the APK as `app-release.apk` and also make a copy tagged with the git commit being built ex: `sifir-android-app-release-e3fa51.apk`
Both files will be located in:
`<path to repo>/android/app/build/outputs/apk/release`

2. Make sure your phone is connected and recongized by your computer and then install APK directly on your phohne by running
`adb install app-release.apk`

## Built With

- [React Native](https://facebook.github.io/react-native//)

## Authors

- @gabidi 
## Acknowledgments

- React Native
- Cyphernode
- Bitcoin 
