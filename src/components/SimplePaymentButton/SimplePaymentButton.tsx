import React, { useState } from 'react';
import { PaymentService } from '../../services/paymentService';

interface SimplePaymentButtonProps {
  service: {
    packageId: string;
    packageName: string;
    price: number;
    description: string;
  };
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
}

export const SimplePaymentButton: React.FC<SimplePaymentButtonProps> = ({
  service,
  paymentType,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      
      // Генерируем уникальный ID заказа
      const orderId = PaymentService.generateOrderId(`${service.packageId}_${paymentType}`);

      // Подготавливаем данные для платежа
      const paymentData = {
        amount: service.price,
        orderId,
        description: service.description,
        customerKey: `customer_${Date.now()}`
      };

      console.log('Initiating payment:', paymentData);

      // Инициализируем платеж
      const result = await PaymentService.initPayment(paymentData);

      if (result.success && result.paymentUrl) {
        console.log('Payment URL received:', result.paymentUrl);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          result.paymentUrl,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes,location=yes'
        );

        if (!paymentWindow) {
          alert('Не удалось открыть окно оплаты. Разрешите всплывающие окна для этого сайта.');
        } else {
          // Мониторим закрытие окна платежа
          const checkClosed = setInterval(() => {
            if (paymentWindow.closed) {
              clearInterval(checkClosed);
              console.log('Payment window closed');
            }
          }, 1000);
        }
      } else {
        alert(`Ошибка инициализации платежа: ${result.message}`);
      }

    } catch (err) {
      console.error('Payment error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при оплате';
      alert(`Ошибка: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={className}
      onClick={handlePayment}
      disabled={isLoading}
      style={{ opacity: isLoading ? 0.6 : 1 }}
    >
      {isLoading ? 'Обработка...' : children}
    </button>
  );
};