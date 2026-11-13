SDBUBBLESGAME — Capacitor starter

IMPORTANT:
- The playable web game is in the www/ folder.
- Upload the CONTENTS of this folder to a GitHub repository.
- GitHub Pages hosting is for previewing the web version; it does not produce an Android APK/AAB or iOS app.
- Capacitor native builds require Node.js 22+, Android Studio + Android SDK for Android, and a Mac with Xcode for iOS.
- Keep appId stable after release: com.sdmarwat.sdbubblesgame

Local build commands (run in this folder after installing Node.js):
  npm install
  npx cap add android
  npx cap sync android
  npx cap open android

On a Mac:
  npm install
  npx cap add ios
  npx cap sync ios
  npx cap open ios

Do not run "cap add" a second time if the android/ or ios/ platform folder already exists.
