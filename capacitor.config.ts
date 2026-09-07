import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.atomic.app',
  appName: 'Atomic ERP',
  webDir: 'out',
  server: {
    // Enlace de producción en vivo — Actualizaciones instantáneas automáticas
    url: 'https://atomiccotizador.shop',
    cleartext: false,
    androidScheme: 'https'
  },
};

export default config;
