/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Основные настройки
  readonly VITE_APP_URL: string
  readonly VITE_COMPANY_NAME: string
  readonly VITE_CONTACT_EMAIL: string
  readonly VITE_CONTACT_PHONE: string

  // Аналитика
  readonly VITE_GA_ID?: string
  readonly VITE_YM_ID?: string

  // API
  readonly VITE_CONTACT_API_URL?: string
  readonly VITE_PAYMENT_API_URL?: string
  readonly VITE_EXTERNAL_API_KEY?: string

  // Настройки производительности
  readonly VITE_ENABLE_PERFORMANCE_MONITORING?: string
  readonly VITE_ENABLE_LOGGING?: string
  readonly VITE_ENABLE_MOBILE_ANIMATIONS?: string

  // Безопасность
  readonly VITE_ALLOWED_ORIGINS?: string

  // Социальные сети
  readonly VITE_TELEGRAM_URL?: string
  readonly VITE_WHATSAPP_URL?: string
  readonly VITE_EMAIL_URL?: string

  // Feature flags
  readonly VITE_FEATURE_NEW_HERO?: string
  readonly VITE_FEATURE_ADVANCED_ANALYTICS?: string
  readonly VITE_FEATURE_CHATBOT?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
