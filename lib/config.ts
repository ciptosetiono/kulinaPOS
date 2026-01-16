
/**
 * KulinaPOS Configuration Manager
 */

export const config = {
  appName: process.env.VITE_APP_NAME || 'KulinaPOS Enterprise',
  version: process.env.VITE_APP_VERSION || '2.0.0-red',
  isProduction: process.env.VITE_ENVIRONMENT === 'production',
  
  storagePrefix: process.env.VITE_STORAGE_NAMESPACE || 'kulinapos_v2_',
  
  enableAI: process.env.VITE_ENABLE_AI_INSIGHTS !== 'false',
  offlineMode: process.env.VITE_OFFLINE_READY === 'true',

  apiBaseUrl: process.env.VITE_SYNC_BACKEND_URL || '',
  syncInterval: Number(process.env.VITE_AUTO_SYNC_INTERVAL) || 60000
};

export default config;
