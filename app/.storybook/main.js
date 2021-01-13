module.exports = {
    stories: ['../src/**/*.stories.tsx'],
    addons:
    [
      '@storybook/preset-create-react-app',
    ],
    webpackFinal: async config => {
      config.module.rules.push({
        test: /\.(ts|tsx)$/,
        loader: require.resolve('babel-loader', { paths: [ 'node_modules/react-scripts' ]}),
        options: {
          presets: [['react-app', { flow: false, typescript: true }]],
        },
      });
      config.resolve.extensions.push('.ts', '.tsx');
      return config;
    },
    };