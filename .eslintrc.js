module.exports = {
  root: true,
  extends: '@react-native-community',
  plugins: ['import'],
  settings: {
    'import/resolver': {
      node: {
        paths: ['src'],
        alias: {
          '@io': './src/store/io',
          '@reducers': './src/store/reducers',
          '@actions': './src/store/actions',
          '@containers': './src/containers',
          '@common': './src/common',
          '@screens': './src/components/screens',
          '@elements': './src/components/elements',
          '@utils': './src/store/utils',
          '@helpers': './src/helpers',
          '@types': './src/store/types',
        },
      },
    },
  },
};
