import {Platform} from 'react-native';

// App version - Bu değer build zamanında güncellenmeli
// Android için: android/app/build.gradle'deki versionName
// iOS için: Xcode project settings'teki MARKETING_VERSION
export const APP_VERSION = '1.8'; // Bu değer build.gradle veya Info.plist'ten alınmalı

export const getPlatform = () => {
  return Platform.OS === 'ios' ? 'ios' : 'android';
};
