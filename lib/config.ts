
/**
 * KulinaPOS Configuration Manager
 */

export const config = {
  appName: process.env.NEXT_PUBLIC_APP_NAME || 'KulinaPOS Enterprise',
  version: process.env.NEXT_PUBLIC_APP_VERSION || '2.0.0',
  isProduction: process.env.NODE_ENV === 'production',

  storagePrefix: process.env.NEXT_PUBLIC_STORAGE_NAMESPACE || 'kulinapos_v2_',

  enableAI: process.env.NEXT_PUBLIC_ENABLE_AI_INSIGHTS !== 'false',
  offlineMode: process.env.NEXT_PUBLIC_OFFLINE_READY === 'true',

  apiBaseUrl: process.env.NEXT_PUBLIC_SYNC_BACKEND_URL || '',
  syncInterval: Number(process.env.NEXT_PUBLIC_AUTO_SYNC_INTERVAL) || 60000
};

export default config;
