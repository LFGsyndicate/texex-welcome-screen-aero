export interface RetryOptions {
  maxAttempts: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
  retryCondition?: (error: any) => boolean;
}

export class RetryLogic {
  private static readonly DEFAULT_OPTIONS: RetryOptions = {
    maxAttempts: 3,
    baseDelay: 1000, // 1 секунда
    maxDelay: 10000, // 10 секунд
    backoffFactor: 2,
    retryCondition: (error) => {
      // По умолчанию повторяем только сетевые ошибки
      if (error instanceof Error) {
        return error.message.includes('fetch') || 
               error.message.includes('network') || 
               error.message.includes('timeout');
      }
      return false;
    }
  };

  /**
   * Выполняет функцию с повторными попытками
   * @param fn - функция для выполнения
   * @param options - настройки повторных попыток
   * @returns результат выполнения функции
   */
  static async withRetry<T>(
    fn: () => Promise<T>,
    options: Partial<RetryOptions> = {}
  ): Promise<T> {
    const config = { ...this.DEFAULT_OPTIONS, ...options };
    let lastError: any;

    for (let attempt = 1; attempt <= config.maxAttempts; attempt++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;

        // Проверяем, стоит ли повторять попытку
        if (attempt === config.maxAttempts || !config.retryCondition!(error)) {
          throw error;
        }

        // Вычисляем задержку с экспоненциальным backoff
        const delay = Math.min(
          config.baseDelay * Math.pow(config.backoffFactor, attempt - 1),
          config.maxDelay
        );

        console.warn(`Payment attempt ${attempt} failed, retrying in ${delay}ms:`, error);

        // Ждем перед следующей попыткой
        await this.delay(delay);
      }
    }

    throw lastError;
  }

  /**
   * Создает задержку
   * @param ms - время задержки в миллисекундах
   * @returns промис, который разрешается через указанное время
   */
  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Создает функцию retry с предустановленными настройками
   * @param options - настройки по умолчанию
   * @returns функция retry с предустановленными настройками
   */
  static createRetryFunction(options: Partial<RetryOptions>) {
    return <T>(fn: () => Promise<T>, overrideOptions?: Partial<RetryOptions>) => {
      return this.withRetry(fn, { ...options, ...overrideOptions });
    };
  }
}

// Предустановленные конфигурации для разных типов операций
export const paymentRetry = RetryLogic.createRetryFunction({
  maxAttempts: 3,
  baseDelay: 2000,
  maxDelay: 8000,
  backoffFactor: 2,
  retryCondition: (error) => {
    if (error instanceof Error) {
      const message = error.message.toLowerCase();
      return message.includes('network') || 
             message.includes('fetch') || 
             message.includes('timeout') ||
             message.includes('превышено время ожидания');
    }
    return false;
  }
});

export const quickRetry = RetryLogic.createRetryFunction({
  maxAttempts: 2,
  baseDelay: 500,
  maxDelay: 2000,
  backoffFactor: 2
});