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
    // В продакшене используем основной домен
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return window.location.origin;
    }
    return 'https://texex.ru';
  }
  return 'https://texex.ru'; // fallback для продакшена
};

export const tinkoffConfig = {
  // Правильный TerminalKey согласно документации
  terminalKey: '1754995728217', // Terminal_id из ваших данных
  // Правильный пароль
  password: 'Ut8FxLDYq2t3563u',
  // API URL для v2 API
  apiUrl: 'https://securepay.tinkoff.ru/v2/',
  // Страницы успеха и ошибки - теперь ваши собственные
  successUrl: `${getBaseUrl()}/payment/success`,
  failUrl: `${getBaseUrl()}/payment/error`,
  // Дополнительные данные для отладки
  merchantName: 'TEXEX AI',
  merchantId: '200000001673251',
  sbpMerchantId: 'MB0001881027'
};