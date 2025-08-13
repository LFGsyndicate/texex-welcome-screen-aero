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
      // Генерируем простой и читаемый ID заказа
      const orderId = PaymentService.generateOrderId(paymentType);
      
      // Описание для формы с названием карточки
      const description = `Услуги по реализации автоматизированных программных решений: ${itemName}`;

      console.log('TinkoffPaymentFinal: Generated order data:', { orderId, description, amount });

      // Инициализируем платеж через PaymentService
      const result = await PaymentService.initPayment({
        amount,
        orderId,
        description,
        itemName
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
        alert(`Ошибка инициализации платежа: Неизвестная ошибка`);
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