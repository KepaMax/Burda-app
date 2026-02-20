import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance} from '@notifee/react-native';
import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import storage from '@utils/MMKVStore';

const FCM_TOKEN_KEY = 'fcmToken';
const ANDROID_CHANNEL_ID = 'burda_default';

/**
 * Request notification permission and create channel. Call once at app start.
 * Android 13+ requires runtime POST_NOTIFICATIONS permission.
 */
export async function requestNotificationPermissionAndCreateChannel() {
  try {
    if (Platform.OS === 'android') {
      const {status} = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
      if (status !== RESULTS.GRANTED && status !== RESULTS.LIMITED) {
        console.warn('Notification permission not granted:', status);
        return false;
      }
      await notifee.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: 'Bildirimlər',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } else {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus < 2) {
        console.warn('iOS notification permission not granted');
        return false;
      }
    }
    return true;
  } catch (e) {
    console.warn('requestNotificationPermissionAndCreateChannel error:', e);
    return false;
  }
}

/**
 * Display a local notification from FCM remote message (foreground & background).
 */
export async function displayNotificationFromRemoteMessage(remoteMessage) {
  try {
    const title =
      remoteMessage.notification?.title ||
      remoteMessage.data?.title ||
      'Burda';
    const body =
      remoteMessage.notification?.body ||
      remoteMessage.data?.body ||
      '';

    if (Platform.OS === 'android') {
      await notifee.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: 'Bildirimlər',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
      await notifee.displayNotification({
        id: String(Date.now()),
        title,
        body,
        android: {
          channelId: ANDROID_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
          pressAction: {id: 'default'},
        },
      });
    } else {
      const settings = await notifee.requestPermission();
      if (settings.authorizationStatus >= 2) {
        await notifee.displayNotification({
          id: String(Date.now()),
          title,
          body,
          ios: {
            sound: 'default',
          },
        });
      }
    }
  } catch (e) {
    console.warn('displayNotificationFromRemoteMessage error:', e?.message || e);
  }
}

/**
 * Request notification permission (iOS) and get FCM token.
 * Call once after app launch or login.
 */
export async function requestUserPermissionAndGetToken() {
  try {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
    if (!enabled) {
      return null;
    }
    const token = await messaging().getToken();
    if (token) {
      storage.set(FCM_TOKEN_KEY, token);
    }
    return token;
  } catch (e) {
    console.warn('Push permission/token error:', e);
    return null;
  }
}

/**
 * Get current FCM token (from cache or request).
 */
export async function getFCMToken() {
  try {
    let token = storage.getString(FCM_TOKEN_KEY);
    if (!token) {
      token = await requestUserPermissionAndGetToken();
    }
    return token;
  } catch (e) {
    console.warn('getFCMToken error:', e);
    return null;
  }
}

/**
 * Subscribe to token refresh (e.g. when app is restored).
 */
export function onTokenRefresh(callback) {
  return messaging().onTokenRefresh(token => {
    storage.set(FCM_TOKEN_KEY, token);
    callback?.(token);
  });
}

/**
 * Handle foreground messages (when app is open).
 */
export function onForegroundMessage(callback) {
  return messaging().onMessage(async remoteMessage => {
    callback?.(remoteMessage);
  });
}

/**
 * Handle notification that opened the app from quit state.
 * Call from App.tsx when app is opened via notification.
 */
export function getInitialNotification() {
  return messaging().getInitialNotification();
}

/**
 * Handle notification that opened the app from background.
 */
export function onNotificationOpenedApp(callback) {
  return messaging().onNotificationOpenedApp(remoteMessage => {
    callback?.(remoteMessage);
  });
}

/**
 * Set up background message handler. Must be called outside of any React component
 * (e.g. in index.js) for Android.
 */
export function setBackgroundMessageHandler(handler) {
  messaging().setBackgroundMessageHandler(handler);
}
