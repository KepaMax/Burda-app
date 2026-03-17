import messaging from '@react-native-firebase/messaging';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import {request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {API_URL} from '@env';
import {fetchData} from '@utils/fetchData';
import storage from '@utils/MMKVStore';

const FCM_TOKEN_KEY = 'fcmToken';
const UNREAD_COUNT_REFRESH_TRIGGER_KEY = 'unreadCountRefreshTrigger';
const ANDROID_CHANNEL_ID = 'burda_default';
const DEVICE_TYPE = Platform.OS === 'ios' ? 'ios' : 'android';

/**
 * Register FCM token on backend so push notifications can be sent to this device.
 * Only sends request when user is logged in (has accessToken). Avoids 403 when called before login.
 */
export async function registerFcmTokenWithBackend(token) {
  try {
    if (!token) return;
    const accessToken = storage.getString('accessToken');
    if (!accessToken) return; // Kullanıcı giriş yapmamışsa backend'e gönderme (403 önlenir)

    const result = await fetchData({
      url: `${API_URL}/notifications/fcm/register/`,
      method: 'POST',
      tokenRequired: true,
      body: {
        registration_token: token,
        device_type: DEVICE_TYPE,
      },
      returnsData: false,
    });
    if (result?.success) {
      console.log('FCM token registered successfully');
    }
    if (!result.success) {
      console.warn(
        'FCM token register failed:',
        result.status,
        result.data || '',
      );
    }
  } catch (e) {
    console.warn('FCM token register error:', e?.message || e);
  }
}

/**
 * Call after login so the stored FCM token is registered with the backend.
 */
export async function registerStoredFcmTokenIfLoggedIn() {
  const token = storage.getString(FCM_TOKEN_KEY);
  if (token) await registerFcmTokenWithBackend(token);
}

/**
 * Request notification permission and create channel. Call once at app start.
 * Android 13+ (API 33+) requires runtime POST_NOTIFICATIONS permission.
 * On Android 12 and below, no runtime permission is needed for notifications.
 */
export async function requestNotificationPermissionAndCreateChannel() {
  try {
    if (Platform.OS === 'android') {
      const apiLevel = typeof Platform.Version === 'number' ? Platform.Version : parseInt(Platform.Version, 10) || 0;
      if (apiLevel >= 33) {
        const result = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
        const status = result?.status;
        const granted = status === RESULTS.GRANTED || status === RESULTS.LIMITED;
        const denied = status === RESULTS.DENIED || status === RESULTS.BLOCKED;
        if (denied) {
          console.warn('Notification permission not granted:', status);
          return false;
        }
        if (!granted && status !== undefined) {
          console.warn('Notification permission not granted:', status);
          return false;
        }
        // status undefined can happen on some devices; don't block, continue to create channel
      }
      await notifee.createChannel({
        id: ANDROID_CHANNEL_ID,
        name: 'Bildirimlər',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });
    } else {
      const settings = await notifee.requestPermission();
      const granted =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      if (!granted) {
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
      const granted =
        settings.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
        settings.authorizationStatus === AuthorizationStatus.PROVISIONAL;
      if (granted) {
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
    triggerUnreadCountRefresh();
  } catch (e) {
    console.warn('displayNotificationFromRemoteMessage error:', e?.message || e);
  }
}

/**
 * Increment trigger so HomeHeader (and any listener) can refresh unread count.
 * Call when a push notification is received (foreground or background).
 */
export function triggerUnreadCountRefresh() {
  try {
    const raw = typeof storage.getNumber === 'function'
      ? storage.getNumber(UNREAD_COUNT_REFRESH_TRIGGER_KEY)
      : parseInt(storage.getString(UNREAD_COUNT_REFRESH_TRIGGER_KEY) || '0', 10);
    const current = Number(raw) || 0;
    storage.set(UNREAD_COUNT_REFRESH_TRIGGER_KEY, current + 1);
  } catch (e) {
    console.warn('triggerUnreadCountRefresh error:', e?.message || e);
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
       await registerFcmTokenWithBackend(token);
    }
    return token;
  } catch (e) {
    const msg = e?.message || String(e);
    if (Platform.OS === 'ios' && (msg.includes('aps-environment') || msg.includes('unregistered'))) {
      console.warn(
        'Push token unavailable: Add "Push Notifications" capability in Xcode (Target → Signing & Capabilities → + Capability).',
      );
    } else {
      console.warn('Push permission/token error:', e);
    }
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
    // fire and forget – backend registration shouldn't block app flow
    registerFcmTokenWithBackend(token);
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
