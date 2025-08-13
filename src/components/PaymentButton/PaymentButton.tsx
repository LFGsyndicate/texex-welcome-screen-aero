import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';
import { HelpCircle } from 'lucide-react';
import { InstallmentInfoModal } from '@/components/InstallmentInfoModal';

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
  const [showInstallmentInfo, setShowInstallmentInfo] = useState(false);

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
      // Генерируем простой и читаемый ID заказа
      const orderId = PaymentService.generateOrderId(paymentType);
      
      // Описание для формы с названием карточки
      const description = `Услуги по реализации автоматизированных программных решений: ${service.packageName}`;

      console.log('PaymentButton: Generated order data:', { orderId, description, amount: service.price });

      // Инициализируем платеж через PaymentService
      const result = await PaymentService.initPayment({
        amount: service.price,
        orderId,
        description,
        itemName: service.packageName,
        customerKey: `customer-${service.packageId}` // Уникальный CustomerKey для каждого пакета
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
        const errorMsg = `Ошибка инициализации платежа: Неизвестная ошибка`;
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
    <>
      <div className="flex items-center space-x-1">
        {paymentType === 'installment' && (
          <button
            type="button"
            onClick={() => setShowInstallmentInfo(true)}
            className="text-light-cream/70 hover:text-light-cream transition-colors p-1"
            style={{ fontSize: '14px' }}
            title="Информация о рассрочке"
          >
            <HelpCircle size={14} />
          </button>
        )}
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
      </div>
      
      {paymentType === 'installment' && (
        <InstallmentInfoModal
          isOpen={showInstallmentInfo}
          onClose={() => setShowInstallmentInfo(false)}
        />
      )}
    </>
  );
};