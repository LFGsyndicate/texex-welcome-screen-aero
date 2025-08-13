import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface PaymentButtonProps {
  service: {
    packageId: string;
    packageName: string;
    price: number;
  };
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
  onPaymentStart?: () => void;
  onPaymentError?: (error: string) => void;
}

export const PaymentButton: React.FC<PaymentButtonProps> = ({
  service,
  paymentType,
  className = '',
  children,
  onPaymentStart,
  onPaymentError
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handlePayment = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    onPaymentStart?.();
    
    console.log('PaymentButton: Starting payment', { 
      service: service.packageName, 
      amount: service.price, 
      paymentType 
    });

    try {
      // Генерируем уникальный ID заказа с безопасными символами
      const safePackageId = service.packageId.replace(/[^a-zA-Z0-9_-]/g, '_');
      const orderId = PaymentService.generateOrderId(`${safePackageId}_${paymentType}`);
      
      // Описание для формы (единое для всех товаров)
      const description = 'Услуги по реализации автоматизированных программных решений';

      console.log('PaymentButton: Generated order data:', { orderId, description, amount: service.price });

      // Инициализируем платеж через PaymentService
      const result = await PaymentService.initPayment({
        amount: service.price,
        orderId,
        description,
        customerKey: `customer_${Date.now()}`
      });

      if (result.success && result.paymentUrl) {
        console.log('PaymentButton: Payment initialized successfully', result);
        
        // Открываем платежную форму в новом окне
        const paymentWindow = window.open(
          result.paymentUrl,
          'tinkoff_payment',
          'width=800,height=600,scrollbars=yes,resizable=yes'
        );

        if (!paymentWindow) {
          const errorMsg = 'Разрешите всплывающие окна для этого сайта.';
          console.error('PaymentButton: Popup blocked');
          onPaymentError?.(errorMsg);
          alert(errorMsg);
        }
      } else {
        const errorMsg = `Ошибка инициализации платежа: ${result.message || 'Неизвестная ошибка'}`;
        console.error('PaymentButton: Payment initialization failed', result);
        onPaymentError?.(errorMsg);
        alert(errorMsg);
      }

    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      console.error('PaymentButton: Error:', error);
      onPaymentError?.(errorMsg);
      alert(errorMsg);
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