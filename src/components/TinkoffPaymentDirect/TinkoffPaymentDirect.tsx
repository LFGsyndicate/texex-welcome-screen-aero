import React, { useState } from 'react';
import { tinkoffConfig } from '@/config/tinkoff.config';
import { TokenGenerator } from '@/utils/tokenGenerator';

interface TinkoffPaymentDirectProps {
  amount: number;
  itemName: string;
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const TinkoffPaymentDirect: React.FC<TinkoffPaymentDirectProps> = ({
  amount,
  itemName,
  paymentType,
  className = '',
  children,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('TinkoffPaymentDirect: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const safeItemName = itemName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const orderId = `${paymentType}_${safeItemName}_${timestamp}_${random}`;
      
      // Описание для формы
      const description = 'Услуги по реализации автоматизированных программных решений';

      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(amount * 100);

      console.log('TinkoffPaymentDirect: Generated order data:', { orderId, description, amount: amountInKopecks });

      // Подготавливаем данные для запроса
      const requestData = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: description,
        SuccessURL: tinkoffConfig.successUrl,
        FailURL: tinkoffConfig.failUrl,
        Language: 'ru',
        Receipt: {
          Email: 'customer@example.com',
          Taxation: 'usn_income',
          Items: [
            {
              Name: description,
              Price: amountInKopecks,
              Quantity: 1.00,
              Amount: amountInKopecks,
              Tax: 'none'
            }
          ]
        }
      };

      console.log('TinkoffPaymentDirect: Request data:', requestData);

      // Генерируем токен
      const tokenParams = TokenGenerator.prepareTokenParams(requestData);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      const finalRequest = {
        ...requestData,
        Token: token
      };

      console.log('TinkoffPaymentDirect: Final request with token:', finalRequest);

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
        console.error('HTTP error response:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}, body: ${errorText}`);
      }

      const data = await response.json();
      console.log('TinkoffPaymentDirect: API response:', data);

      if (data.Success && data.PaymentURL) {
        console.log('TinkoffPaymentDirect: Payment initialized successfully', data);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          data.PaymentURL,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow) {
          const errorMsg = 'Разрешите всплывающие окна для этого сайта.';
          console.error('TinkoffPaymentDirect: Popup blocked');
          onError?.(errorMsg);
          alert(errorMsg);
        } else {
          onSuccess?.();
        }
      } else {
        console.error('TinkoffPaymentDirect: Payment initialization failed', data);
        const errorMsg = `Ошибка инициализации платежа: ${data.Message || data.Details || 'Неизвестная ошибка'}`;
        onError?.(errorMsg);
        alert(errorMsg);
      }

    } catch (error) {
      console.error('TinkoffPaymentDirect: Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
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
