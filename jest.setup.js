jest.mock('react-native-device-info', () => ({
  getVersion: jest.fn(() => '0.0.0'),
}));
