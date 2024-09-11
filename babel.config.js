module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'module:react-native-dotenv',
    'react-native-reanimated/plugin',
    'nativewind/babel',
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@stacks': './src/stacks',
          '@screens': './src/screens',
          '@common': './src/common',
          '@utils': './src/utils',
          '@icons': './assets/icons',
          '@images': './assets/images',
          '@locales': './src/locales',
        },
      },
    ],
  ],
};
