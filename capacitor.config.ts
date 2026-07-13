import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atomic.app',
  appName: 'Atomic ERP',
  webDir: 'out',
  server: {
    // Enlace de producción mediante IP Local
    url: 'http://192.168.0.105:3000',
    cleartext: true,
  },
};

export default config;
