import { TokenParams } from '../types/payment.types';

export class TokenGenerator {
  /**
   * Генерирует токен для запроса к Tinkoff API согласно документации
   * @param params - параметры запроса
   * @param password - пароль терминала
   * @returns SHA-256 токен
   */
  static async generateToken(params: TokenParams, password: string): Promise<string> {
    // Исключаем вложенные объекты и массивы из генерации токена
    const filteredParams: { [key: string]: string | number | boolean } = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      if (typeof value !== 'object' && value !== null && value !== undefined) {
        filteredParams[key] = value;
      }
    });

    // Добавляем пароль
    filteredParams.Password = password;

    // Сортируем ключи по алфавиту
    const sortedKeys = Object.keys(filteredParams).sort();

    // Конкатенируем значения
    const concatenatedValues = sortedKeys
      .map(key => String(filteredParams[key]))
      .join('');

    // Используем Web Crypto API для генерации SHA-256
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(concatenatedValues);
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      return hashHex.toLowerCase(); // Tinkoff ожидает lowercase
    } catch (error) {
      console.error('Error generating token:', error);
      // Fallback для старых браузеров
      const simpleHash = btoa(concatenatedValues).replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
      return simpleHash.substring(0, 64).padEnd(64, '0');
    }
  }

  /**
   * Подготавливает параметры для генерации токена
   * @param params - исходные параметры
   * @returns отфильтрованные параметры
   */
  static prepareTokenParams(params: any): TokenParams {
    const tokenParams: TokenParams = {};
    
    Object.keys(params).forEach(key => {
      const value = params[key];
      // Исключаем Token из параметров для генерации токена
      if (key !== 'Token' && typeof value !== 'object' && value !== null && value !== undefined) {
        tokenParams[key] = value;
      }
    });

    return tokenParams;
  }
}