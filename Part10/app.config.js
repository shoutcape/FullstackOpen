import 'dotenv/config'

export default {
  name: 'github-repository-rating-app',
  slug: 'github-repository-rating-app',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#ffffff',
    },
  },

  extra: {
    env: process.env.ENV,
    apolloUri: process.env.APOLLO_URI
  },
  web: {
    favicon: './assets/favicon.png',
  },
};
