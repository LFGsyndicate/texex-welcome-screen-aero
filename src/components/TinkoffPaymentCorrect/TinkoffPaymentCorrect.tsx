import React, { useState } from 'react';
import { tinkoffConfig } from '@/config/tinkoff.config';
import { TokenGenerator } from '@/utils/tokenGenerator';

interface TinkoffPaymentCorrectProps {
  amount: number;
  itemName: string;
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
  customerKey?: string; // Идентификатор покупателя для сохранения карт
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const TinkoffPaymentCorrect: React.FC<TinkoffPaymentCorrectProps> = ({
  amount,
  itemName,
  paymentType,
  className = '',
  children,
  customerKey,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) return;
    setIsLoading(true);
    
    console.log('TinkoffPaymentCorrect: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем простой и читаемый ID заказа
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 1000);
      const orderId = `order_${timestamp}_${random}`;
      
      // Описание для формы согласно требованию
      const description = `Услуги по реализации автоматизированных программных решений: ${itemName}`;

      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(amount * 100);

      console.log('TinkoffPaymentCorrect: Generated order data:', { orderId, description, amount: amountInKopecks });

      // Создаем параметры для API запроса согласно документации
      const initParams = {
        TerminalKey: tinkoffConfig.terminalKey, // 1754995728217
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: description,
        SuccessURL: tinkoffConfig.successUrl,
        FailURL: tinkoffConfig.failUrl,
        Language: 'ru',
        // Идентификатор покупателя для сохранения карт (если передан)
        ...(customerKey && { CustomerKey: customerKey }),
        // Фискальные чеки - обязательны для корректной работы
        Receipt: {
          Email: 'customer@example.com',
          Taxation: 'usn_income', // Упрощенная СН (доходы)
          Items: [
            {
              Name: description,
              Price: amountInKopecks,
              Quantity: 1.00,
              Amount: amountInKopecks,
              Tax: 'none' // Без НДС - согласно УСН
            }
          ]
        }
      };

      // Генерируем токен для безопасности
      const tokenParams = TokenGenerator.prepareTokenParams(initParams);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      const finalInitParams = { ...initParams, Token: token };

      console.log('TinkoffPaymentCorrect: Final init params:', finalInitParams);

      // Отправляем запрос к Tinkoff API
      const response = await fetch(`${tinkoffConfig.apiUrl}Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(finalInitParams)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP error response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('TinkoffPaymentCorrect: API response:', data);

      if (data.Success && data.PaymentURL) {
        console.log('TinkoffPaymentCorrect: Payment initialized successfully', data);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          data.PaymentURL, 
          'tinkoff_payment', 
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );
        
        if (!paymentWindow) {
          const errorMsg = 'Разрешите всплывающие окна для этого сайта.';
          console.error('TinkoffPaymentCorrect: Popup blocked');
          onError?.(errorMsg);
          alert(errorMsg);
        } else {
          onSuccess?.();
        }
      } else {
        console.error('TinkoffPaymentCorrect: Payment initialization failed', data);
        const errorMsg = `Ошибка инициализации платежа: ${data.Message || data.Details || 'Неизвестная ошибка'}`;
        onError?.(errorMsg);
        alert(errorMsg);
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      console.error('TinkoffPaymentCorrect: Error:', error);
      onError?.(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={className}
      onClick={handlePayment}
      disabled={isLoading}
      type="button"
      style={{
        opacity: isLoading ? 0.6 : 1,
        cursor: isLoading ? 'not-allowed' : 'pointer'
      }}
    >
      {isLoading ? 'Обработка...' : children}
    </button>
  );
};
