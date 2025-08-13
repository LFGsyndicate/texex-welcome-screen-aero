import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface TinkoffPaymentFinalProps {
  amount: number; // цена в рублях
  itemName: string; // название позиции
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
}

export const TinkoffPaymentFinal: React.FC<TinkoffPaymentFinalProps> = ({
  amount,
  itemName,
  paymentType,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('TinkoffPaymentFinal: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа с безопасными символами
      const safeItemName = itemName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const orderId = PaymentService.generateOrderId(`${paymentType}_${safeItemName}`);
      
      // Описание для формы
      const description = 'Услуги по реализации автоматизированных программных решений';

      console.log('TinkoffPaymentFinal: Generated order data:', { orderId, description, amount });

      // Инициализируем платеж через PaymentService
      const result = await PaymentService.initPayment({
        amount,
        orderId,
        description,
        customerKey: `customer_${Date.now()}`
      });

      if (result.success && result.paymentUrl) {
        console.log('TinkoffPaymentFinal: Payment initialized successfully', result);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          result.paymentUrl,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow) {
          alert('Разрешите всплывающие окна для этого сайта.');
        }
      } else {
        console.error('TinkoffPaymentFinal: Payment initialization failed', result);
        alert(`Ошибка инициализации платежа: ${result.message || 'Неизвестная ошибка'}`);
      }

    } catch (error) {
      console.error('TinkoffPaymentFinal: Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
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