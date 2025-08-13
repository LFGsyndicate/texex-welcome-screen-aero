import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface TinkoffPaymentButtonProps {
  amount: number; // цена в рублях
  itemName: string; // название позиции (заголовок карточки)
  paymentType: 'payment' | 'installment'; // тип оплаты
  className?: string;
  children: React.ReactNode;
}

export const TinkoffPaymentButton: React.FC<TinkoffPaymentButtonProps> = ({
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
    console.log('TinkoffPaymentButton: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const orderId = `${paymentType}_${timestamp}_${random}`;
      
      console.log('TinkoffPaymentButton: Generated order ID:', orderId);
      
      // Используем PaymentService для правильной инициализации через API
      const paymentData = {
        amount: amount,
        orderId: orderId,
        description: `Услуги по реализации автоматизированных программных решений: ${itemName}`,
        customerKey: `customer_${timestamp}`
      };

      console.log('TinkoffPaymentButton: Calling PaymentService.initPayment with:', paymentData);
      
      const result = await PaymentService.initPayment(paymentData);
      
      console.log('TinkoffPaymentButton: PaymentService result:', result);

      if (result.success && result.paymentUrl) {
        console.log('TinkoffPaymentButton: Opening payment URL:', result.paymentUrl);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          result.paymentUrl,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes,location=yes'
        );

        if (!paymentWindow) {
          alert('Не удалось открыть окно оплаты. Разрешите всплывающие окна для этого сайта.');
          return;
        }

        // Мониторим закрытие окна платежа
        const checkClosed = setInterval(() => {
          if (paymentWindow.closed) {
            clearInterval(checkClosed);
            console.log('TinkoffPaymentButton: Payment window closed');
          }
        }, 1000);

      } else {
        console.error('TinkoffPaymentButton: Payment initialization failed:', result.message);
        alert(`Ошибка инициализации платежа: ${result.message}`);
      }

    } catch (error) {
      console.error('TinkoffPaymentButton: Error:', error);
      alert('Произошла ошибка при инициализации платежа');
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