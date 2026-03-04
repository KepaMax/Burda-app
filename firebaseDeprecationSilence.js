/**
 * Silence React Native Firebase v22 modular API deprecation warnings
 * until we migrate to the modular API (getApp(), getMessaging(), etc.).
 * See: https://rnfirebase.io/migrating-to-v22
 */
globalThis.RNFB_SILENCE_MODULAR_DEPRECATION_WARNINGS = true;
