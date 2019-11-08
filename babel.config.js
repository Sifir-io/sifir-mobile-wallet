module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@store': './src/store',
          '@containers': './src/containers',
          '@common': './src/common',
          '@screens': './src/components/screens',
          '@elements': './src/components/elements',
          '@utils': './src/store/utils',
        },
      },
    ],
  ],
};
