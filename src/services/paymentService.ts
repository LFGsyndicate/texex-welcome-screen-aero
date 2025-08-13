import { tinkoffConfig } from '@/config/tinkoff.config';
import { TokenGenerator } from '@/utils/tokenGenerator';
import { TinkoffInitRequest } from '@/types/payment.types';

interface PaymentData {
  amount: number;
  orderId: string;
  description: string;
  itemName?: string; // Добавляем название карточки
  customerKey?: string; // Идентификатор покупателя для сохранения карт
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

  static async initPayment(paymentData: PaymentData) {
    try {
      console.log('PaymentService: Starting payment initialization', paymentData);

      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(paymentData.amount * 100);

      // Создаем запрос с правильными параметрами
      const requestData: Omit<TinkoffInitRequest, 'Token'> = {
        TerminalKey: tinkoffConfig.terminalKey, // 1754995728217
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
        // Фискальные чеки - обязательны для корректной работы
        Receipt: {
          Email: 'customer@example.com',
          Taxation: 'usn_income', // Упрощенная СН (доходы)
          Items: [
            {
              Name: paymentData.itemName ? 
                `Услуги по реализации автоматизированных программных решений: ${paymentData.itemName}` : 
                paymentData.description,
              Price: amountInKopecks,
              Quantity: 1.00,
              Amount: amountInKopecks,
              Tax: 'none' // Без НДС - согласно УСН
            }
          ]
        }
      };

      console.log('PaymentService: Request data:', requestData);

      // Генерируем токен
      const tokenParams = TokenGenerator.prepareTokenParams(requestData);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      const finalRequest = {
        ...requestData,
        Token: token
      };

      console.log('PaymentService: Final request with token:', finalRequest);

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
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
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
        throw new Error(`Tinkoff API Error ${data.ErrorCode}: ${data.Message}`);
      }

    } catch (error) {
      console.error('PaymentService: Error during payment initialization:', error);
      throw error;
    }
  }
}