import { tinkoffConfig } from '@/config/tinkoff.config';
import { TokenGenerator } from '@/utils/tokenGenerator';
import {
  EnhancedPaymentData,
  PaymentResult,
  FiscalError,
  EnhancedTinkoffInitRequest,
  TinkoffReceipt
} from '@/types/payment.types';

// ✅ Удаляем старый интерфейс PaymentData, используем EnhancedPaymentData

/**
 * ✅ НОВОЕ: Утилита для создания фискального Receipt из пользовательских данных
 */
class FiscalReceiptBuilder {
  static buildReceipt(
    paymentData: EnhancedPaymentData,
    amountInKopecks: number
  ): TinkoffReceipt {
    const receipt: TinkoffReceipt = {
      Taxation: 'usn_income', // УСН 6% (доходы)
      Items: [
        {
          Name: paymentData.itemName
            ? `Услуги по реализации автоматизированных программных решений: ${paymentData.itemName}`
            : paymentData.description,
          Price: amountInKopecks,
          Quantity: 1.00,
          Amount: amountInKopecks,
          Tax: 'none', // Без НДС при УСН
          PaymentMethod: 'full_prepayment' // Для опции "Отправить закрывающий чек"
        }
      ]
    };

    // ✅ Динамически добавляем контактные данные пользователя
    if (paymentData.fiscalData.email) {
      receipt.Email = paymentData.fiscalData.email;
    }
    if (paymentData.fiscalData.phone) {
      receipt.Phone = paymentData.fiscalData.phone;
    }

    return receipt;
  }
}

/**
 * ✅ НОВОЕ: Обработчик ошибок фискализации
 */
class FiscalErrorHandler {
  static handleTinkoffError(data: any): FiscalError {
    const errorCode = data.ErrorCode || 'UNKNOWN_ERROR';
    const message = data.Message || data.Details || 'Неизвестная ошибка';

    // Определяем пользовательское сообщение в зависимости от кода ошибки
    let userMessage = 'Произошла ошибка при обработке платежа';

    if (errorCode === '329' || message.includes('параметр')) {
      userMessage = 'Ошибка в данных для фискального чека. Проверьте корректность email или номера телефона.';
    } else if (errorCode === '53' || message.includes('Receipt')) {
      userMessage = 'Ошибка создания фискального чека. Пожалуйста, попробуйте еще раз.';
    } else if (message.includes('Email') || message.includes('Phone')) {
      userMessage = 'Некорректные контактные данные. Проверьте формат email или номера телефона.';
    }

    return {
      code: errorCode,
      message,
      details: data.Details,
      userMessage
    };
  }
}

export class PaymentService {
  /**
   * Генерирует уникальный ID заказа
   * @param prefix - префикс для ID (опционально)
   * @returns уникальный ID заказа
   */
  static generateOrderId(prefix: string = 'order'): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 1000);
    
    // Очищаем prefix от недопустимых символов
    const cleanPrefix = prefix.replace(/[^a-zA-Z0-9_-]/g, '_');
    
    // Формируем простой и читаемый ID
    const orderId = `${cleanPrefix}_${timestamp}_${random}`;
    
    // Проверяем длину (Tinkoff ограничивает OrderId)
    if (orderId.length > 64) {
      return orderId.substring(0, 64);
    }
    
    return orderId;
  }

  /**
   * ✅ ОБНОВЛЕННЫЙ: Инициализация платежа с поддержкой фискальных данных
   */
  static async initPayment(paymentData: EnhancedPaymentData): Promise<PaymentResult> {
    try {
      // ✅ Валидация фискальных данных
      if (!paymentData.fiscalData) {
        throw new Error('Фискальные данные пользователя обязательны');
      }

      if (!paymentData.fiscalData.email && !paymentData.fiscalData.phone) {
        throw new Error('Укажите email или телефон для получения фискального чека');
      }

      // Маскируем чувствительные данные в логах
      const safeFiscalData = {
        email: paymentData.fiscalData.email ? '***masked***' : undefined,
        phone: paymentData.fiscalData.phone ? '***masked***' : undefined,
        preferredContact: paymentData.fiscalData.preferredContact
      };
      console.log('PaymentService: Starting payment initialization with fiscal data:', {
        ...paymentData,
        fiscalData: safeFiscalData
      });

      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(paymentData.amount * 100);

      // ✅ Создаем фискальный Receipt с помощью FiscalReceiptBuilder
      const receipt = FiscalReceiptBuilder.buildReceipt(paymentData, amountInKopecks);

      // Создаем запрос с обновленными типами
      const requestData: Omit<EnhancedTinkoffInitRequest, 'Token'> = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: amountInKopecks,
        OrderId: paymentData.orderId || this.generateOrderId('payment'),
        Description: paymentData.itemName ?
          `Услуги по реализации автоматизированных программных решений: ${paymentData.itemName}` :
          paymentData.description,
        SuccessURL: tinkoffConfig.successUrl,
        FailURL: tinkoffConfig.failUrl,
        Language: 'ru',
        // Идентификатор покупателя для сохранения карт (если передан)
        ...(paymentData.customerKey && { CustomerKey: paymentData.customerKey }),
        // В DATA оставляем только технически необходимые параметры
        DATA: {
          connection_type: 'Widget2.0'
        },
        // ✅ Используем динамически созданный Receipt
        Receipt: receipt
      };

      console.log('PaymentService: Request data prepared');

      // Генерируем токен
      const tokenParams = TokenGenerator.prepareTokenParams(requestData);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      const finalRequest: EnhancedTinkoffInitRequest = {
        ...requestData,
        Token: token
      };

      // Маскируем чувствительные данные в логах
      const maskedRequestLog = {
        ...finalRequest,
        Token: '***masked***',
        Receipt: {
          ...finalRequest.Receipt,
          ...(finalRequest.Receipt.Email ? { Email: '***masked***' } : {}),
          ...(finalRequest.Receipt.Phone ? { Phone: '***masked***' } : {})
        }
      };
      console.log('PaymentService: Final request (sensitive masked):', maskedRequestLog);

      // Отправляем запрос к Tinkoff API
      const response = await fetch(`${tinkoffConfig.apiUrl}Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(finalRequest)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('PaymentService: HTTP error response:', response.status, errorText);
        
        return {
          success: false,
          error: {
            code: `HTTP_${response.status}`,
            message: errorText,
            userMessage: 'Ошибка соединения с платежной системой. Попробуйте еще раз.'
          }
        };
      }

      const data = await response.json();
      console.log('PaymentService: API response:', data);

      if (data.Success) {
        return {
          success: true,
          paymentUrl: data.PaymentURL,
          paymentId: data.PaymentId,
          orderId: data.OrderId
        };
      } else {
        // ✅ Используем FiscalErrorHandler для обработки ошибок
        const fiscalError = FiscalErrorHandler.handleTinkoffError(data);
        console.error('PaymentService: Tinkoff API error:', fiscalError);
        
        return {
          success: false,
          error: fiscalError
        };
      }

    } catch (error) {
      console.error('PaymentService: Error during payment initialization:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
      return {
        success: false,
        error: {
          code: 'INIT_ERROR',
          message: errorMessage,
          userMessage: 'Произошла ошибка при инициализации платежа. Попробуйте еще раз.'
        }
      };
    }
  }
}