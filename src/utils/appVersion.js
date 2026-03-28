import {Platform} from 'react-native';
import {getVersion} from 'react-native-device-info';

// Native sürüm: Android versionName, iOS MARKETING_VERSION (CFBundleShortVersionString)
const nativeVersion = getVersion();
export const APP_VERSION =
  nativeVersion && String(nativeVersion).trim().length > 0
    ? String(nativeVersion).trim()
    : '0.0.0';

export const getPlatform = () => {
  return Platform.OS === 'ios' ? 'ios' : 'android';
};

/**
 * Semver karşılaştırması: a < b → -1, eşit → 0, a > b → 1
 * (numeric segment; 2.0.10 > 2.0.9)
 */
export const compareSemver = (a, b) => {
  const pa = String(a || '0')
    .split('.')
    .map(n => parseInt(n, 10) || 0);
  const pb = String(b || '0')
    .split('.')
    .map(n => parseInt(n, 10) || 0);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i += 1) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x < y) {
      return -1;
    }
    if (x > y) {
      return 1;
    }
  }
  return 0;
};
