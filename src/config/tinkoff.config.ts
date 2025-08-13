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

export const tinkoffConfig = {
  // Правильный TerminalKey согласно документации
  terminalKey: '1754995728217', // Terminal_id из ваших данных
  // Правильный пароль
  password: 'Ut8FxLDYq2t3563u',
  // API URL для v2 API
  apiUrl: 'https://securepay.tinkoff.ru/v2/',
  // Страницы успеха и ошибки по умолчанию
  successUrl: 'https://securepay.tinkoff.ru/html/payForm/success.html',
  failUrl: 'https://securepay.tinkoff.ru/html/payForm/fail.html',
  // Дополнительные данные для отладки
  merchantName: 'TEXEX AI',
  merchantId: '200000001673251',
  sbpMerchantId: 'MB0001881027'
};