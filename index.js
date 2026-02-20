/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {name as appName} from './app.json';
import App from './App';
import messaging from '@react-native-firebase/messaging';
import {displayNotificationFromRemoteMessage} from './src/utils/pushNotifications';

// Android: background message handler must be registered outside of any component.
// When this is set, the system does NOT auto-show the notification — we must show it.
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Background message:', remoteMessage);
  try {
    await displayNotificationFromRemoteMessage(remoteMessage);
  } catch (e) {
    console.warn('Background notification display error:', e?.message || e);
  }
});

AppRegistry.registerComponent(appName, () => App);
