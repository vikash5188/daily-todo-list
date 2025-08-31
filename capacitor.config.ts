import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.vikash.dailytodo',
  appName: 'Daily ToDo',
  webDir: '.',
  server: {
    androidScheme: 'https'
  }
};

export default config;