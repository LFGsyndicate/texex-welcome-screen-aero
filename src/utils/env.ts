/**
 * Утилиты для работы с переменными окружения
 */

export const env = {
  // Основные настройки
  APP_URL: import.meta.env.VITE_APP_URL || 'https://texex-ai-platform.vercel.app',
  COMPANY_NAME: import.meta.env.VITE_COMPANY_NAME || 'Texex AI Solutions',
  CONTACT_EMAIL: import.meta.env.VITE_CONTACT_EMAIL || 'info@texex.ai',
  CONTACT_PHONE: import.meta.env.VITE_CONTACT_PHONE || '+7 (999) 123-45-67',

  // Режимы работы
  IS_DEV: import.meta.env.DEV,
  IS_PROD: import.meta.env.PROD,

  // Настройки производительности
  ENABLE_PERFORMANCE_MONITORING: import.meta.env.VITE_ENABLE_PERFORMANCE_MONITORING === 'true',
  ENABLE_LOGGING: import.meta.env.VITE_ENABLE_LOGGING === 'true' || import.meta.env.DEV,
  ENABLE_MOBILE_ANIMATIONS: import.meta.env.VITE_ENABLE_MOBILE_ANIMATIONS !== 'false',

  // API endpoints
  CONTACT_API_URL: import.meta.env.VITE_CONTACT_API_URL,
  PAYMENT_API_URL: import.meta.env.VITE_PAYMENT_API_URL,

  // Аналитика
  GA_ID: import.meta.env.VITE_GA_ID,
  YM_ID: import.meta.env.VITE_YM_ID,

  // Социальные сети
  TELEGRAM_URL: import.meta.env.VITE_TELEGRAM_URL || 'https://t.me/texex_ai',
  WHATSAPP_URL: import.meta.env.VITE_WHATSAPP_URL || 'https://wa.me/79991234567',
  EMAIL_URL: import.meta.env.VITE_EMAIL_URL || 'mailto:info@texex.ai',

  // Feature flags
  FEATURES: {
    NEW_HERO: import.meta.env.VITE_FEATURE_NEW_HERO !== 'false',
    ADVANCED_ANALYTICS: import.meta.env.VITE_FEATURE_ADVANCED_ANALYTICS === 'true',
    CHATBOT: import.meta.env.VITE_FEATURE_CHATBOT === 'true',
  }
} as const;

/**
 * Проверяет, включена ли функция
 */
export const isFeatureEnabled = (feature: keyof typeof env.FEATURES): boolean => {
  return env.FEATURES[feature];
};

/**
 * Получает URL для мета-тегов
 */
export const getMetaUrl = (path: string = ''): string => {
  return `${env.APP_URL}${path}`;
};

/**
 * Логирует сообщение только в режиме разработки или если включено логирование
 */
export const devLog = (message: string, ...args: any[]): void => {
  if (env.ENABLE_LOGGING) {
    console.log(`[Texex] ${message}`, ...args);
  }
};

/**
 * Проверяет, поддерживает ли устройство 3D анимации
 */
export const shouldEnableAnimations = (): boolean => {
  // Всегда включаем анимации, если не указано явно отключить
  if (env.ENABLE_MOBILE_ANIMATIONS === false) {
    return false;
  }
  
  return true;
};
