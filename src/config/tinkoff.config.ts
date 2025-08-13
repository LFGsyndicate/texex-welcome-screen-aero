export interface TinkoffConfig {
  terminalKey: string;
  merchantId: string;
  password: string;
  apiUrl: string;
  successUrl: string;
  failUrl: string;
}

// Функция для получения базового URL
const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000'; // fallback для SSR
};

export const tinkoffConfig: TinkoffConfig = {
  terminalKey: import.meta.env.VITE_TINKOFF_TERMINAL_KEY || '25801389',
  merchantId: import.meta.env.VITE_TINKOFF_MERCHANT_ID || '200000001673251',
  password: import.meta.env.VITE_TINKOFF_PASSWORD || 'Ut8FxLDYq2t3563u',
  apiUrl: import.meta.env.VITE_TINKOFF_API_URL || 'https://securepay.tinkoff.ru/v2/',
  successUrl: `${getBaseUrl()}/payment/success`,
  failUrl: `${getBaseUrl()}/payment/error`
};