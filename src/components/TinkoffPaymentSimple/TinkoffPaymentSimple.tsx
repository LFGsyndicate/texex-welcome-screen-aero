import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface TinkoffPaymentSimpleProps {
  amount: number;
  itemName: string;
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export const TinkoffPaymentSimple: React.FC<TinkoffPaymentSimpleProps> = ({
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
    console.log('TinkoffPaymentSimple: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const safeItemName = itemName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const orderId = PaymentService.generateOrderId(`${paymentType}_${safeItemName}`);
      
      // Описание для формы
      const description = 'Услуги по реализации автоматизированных программных решений';

      console.log('TinkoffPaymentSimple: Generated order data:', { orderId, description, amount });

      // Инициализируем платеж через PaymentService
      const result = await PaymentService.initPayment({
        amount,
        orderId,
        description,
        customerKey: `customer_${Date.now()}`
      });

      if (result.success && result.paymentUrl) {
        console.log('TinkoffPaymentSimple: Payment initialized successfully', result);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          result.paymentUrl,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow) {
          const errorMsg = 'Разрешите всплывающие окна для этого сайта.';
          console.error('TinkoffPaymentSimple: Popup blocked');
          onError?.(errorMsg);
          alert(errorMsg);
        } else {
          // Слушаем сообщения от платежного окна
          window.addEventListener('message', (event) => {
            if (event.origin === 'https://securepay.tinkoff.ru') {
              console.log('Payment message received:', event.data);
              if (event.data.status === 'success') {
                onSuccess?.();
              }
            }
          });
        }
      } else {
        console.error('TinkoffPaymentSimple: Payment initialization failed', result);
        const errorMsg = `Ошибка инициализации платежа: ${result.message || 'Неизвестная ошибка'}`;
        onError?.(errorMsg);
        alert(errorMsg);
      }

    } catch (error) {
      console.error('TinkoffPaymentSimple: Error:', error);
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
