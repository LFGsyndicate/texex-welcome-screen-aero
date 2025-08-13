export interface PaymentError {
  code: string;
  message: string;
  userMessage: string;
  retryable: boolean;
}

export class PaymentErrorHandler {
  private static readonly ERROR_MESSAGES: Record<string, PaymentError> = {
    // Сетевые ошибки
    NETWORK_ERROR: {
      code: 'NETWORK_ERROR',
      message: 'Network request failed',
      userMessage: 'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.',
      retryable: true
    },
    TIMEOUT_ERROR: {
      code: 'TIMEOUT_ERROR',
      message: 'Request timeout',
      userMessage: 'Превышено время ожидания ответа от сервера. Попробуйте еще раз.',
      retryable: true
    },

    // Ошибки API Tinkoff
    INVALID_REQUEST: {
      code: 'INVALID_REQUEST',
      message: 'Invalid request parameters',
      userMessage: 'Некорректные данные платежа. Обратитесь в службу поддержки.',
      retryable: false
    },
    TERMINAL_NOT_FOUND: {
      code: 'TERMINAL_NOT_FOUND',
      message: 'Terminal not found',
      userMessage: 'Ошибка конфигурации платежной системы. Обратитесь в службу поддержки.',
      retryable: false
    },
    INVALID_TOKEN: {
      code: 'INVALID_TOKEN',
      message: 'Invalid token',
      userMessage: 'Ошибка безопасности. Попробуйте еще раз или обратитесь в поддержку.',
      retryable: true
    },
    AMOUNT_TOO_SMALL: {
      code: 'AMOUNT_TOO_SMALL',
      message: 'Amount is too small',
      userMessage: 'Сумма платежа слишком мала. Минимальная сумма: 1 рубль.',
      retryable: false
    },
    AMOUNT_TOO_LARGE: {
      code: 'AMOUNT_TOO_LARGE',
      message: 'Amount is too large',
      userMessage: 'Сумма платежа превышает максимально допустимую.',
      retryable: false
    },

    // Ошибки браузера
    POPUP_BLOCKED: {
      code: 'POPUP_BLOCKED',
      message: 'Popup window blocked',
      userMessage: 'Всплывающие окна заблокированы. Разрешите всплывающие окна для этого сайта и попробуйте снова.',
      retryable: true
    },

    // Общие ошибки
    INTERNAL_ERROR: {
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      userMessage: 'Внутренняя ошибка сервера. Попробуйте позже или обратитесь в поддержку.',
      retryable: true
    },
    UNKNOWN_ERROR: {
      code: 'UNKNOWN_ERROR',
      message: 'Unknown error',
      userMessage: 'Произошла неожиданная ошибка. Попробуйте еще раз.',
      retryable: true
    }
  };

  /**
   * Обрабатывает ошибку и возвращает пользовательское сообщение
   * @param error - ошибка для обработки
   * @returns обработанная ошибка с пользовательским сообщением
   */
  static handleError(error: unknown): PaymentError {
    // Логируем оригинальную ошибку для отладки
    console.error('Payment error:', error);

    if (error instanceof Error) {
      // Проверяем специфичные ошибки по сообщению
      if (error.message.includes('fetch')) {
        return this.ERROR_MESSAGES.NETWORK_ERROR;
      }
      
      if (error.message.includes('timeout') || error.message.includes('Превышено время ожидания')) {
        return this.ERROR_MESSAGES.TIMEOUT_ERROR;
      }

      if (error.message.includes('блокировщика всплывающих окон')) {
        return this.ERROR_MESSAGES.POPUP_BLOCKED;
      }

      if (error.message.includes('Сумма платежа превышает')) {
        return this.ERROR_MESSAGES.AMOUNT_TOO_LARGE;
      }

      if (error.message.includes('Сумма платежа должна быть больше')) {
        return this.ERROR_MESSAGES.AMOUNT_TOO_SMALL;
      }

      // Возвращаем ошибку с оригинальным сообщением, если не нашли специфичную
      return {
        code: 'CUSTOM_ERROR',
        message: error.message,
        userMessage: error.message,
        retryable: true
      };
    }

    if (typeof error === 'string') {
      // Проверяем коды ошибок Tinkoff API
      const tinkoffError = this.ERROR_MESSAGES[error];
      if (tinkoffError) {
        return tinkoffError;
      }

      return {
        code: 'STRING_ERROR',
        message: error,
        userMessage: error,
        retryable: true
      };
    }

    return this.ERROR_MESSAGES.UNKNOWN_ERROR;
  }

  /**
   * Определяет, можно ли повторить операцию
   * @param error - ошибка для проверки
   * @returns true, если операцию можно повторить
   */
  static isRetryable(error: PaymentError): boolean {
    return error.retryable;
  }

  /**
   * Логирует ошибку для мониторинга
   * @param error - ошибка для логирования
   * @param context - дополнительный контекст
   */
  static logError(error: PaymentError, context?: Record<string, any>): void {
    const logData = {
      timestamp: new Date().toISOString(),
      error: {
        code: error.code,
        message: error.message,
        userMessage: error.userMessage,
        retryable: error.retryable
      },
      context: context || {},
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // В продакшене здесь можно отправлять данные в систему мониторинга
    console.error('Payment Error Log:', logData);

    // Можно добавить отправку в Sentry, LogRocket или другую систему мониторинга
    // if (window.Sentry) {
    //   window.Sentry.captureException(new Error(error.message), {
    //     tags: { errorCode: error.code },
    //     extra: logData
    //   });
    // }
  }
}