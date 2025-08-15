import React, { useState } from 'react';
import { trackAddToCart, trackBeginCheckout } from '@/utils/analytics';
import { PaymentService } from '@/services/paymentService';
import { HelpCircle } from 'lucide-react';
import { InstallmentInfoModal } from '@/components/InstallmentInfoModal';
import { FiscalDataModal } from '@/components/FiscalDataModal';
import { FiscalData, EnhancedPaymentData } from '@/types/payment.types';

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
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false);

  // ✅ НОВОЕ: Обработчик клика по кнопке - открывает модальное окно
  const handlePaymentClick = () => {
    if (isLoading) return;
    
    try { trackAddToCart({ label: 'payment_button', packageId: service.packageId, name: service.packageName, price: service.price }); } catch {}

    onPaymentStart?.();
    console.log('PaymentButton: Starting payment flow', {
      service: service.packageName,
      amount: service.price,
      paymentType
    });
    
    setIsFiscalModalOpen(true);
  };

  // ✅ НОВОЕ: Обработчик отправки фискальных данных
  const handleFiscalDataSubmit = async (fiscalData: FiscalData) => {
    setIsLoading(true);
    
    try {
      // Генерируем ID заказа
      const orderId = PaymentService.generateOrderId(paymentType);
      
      // Описание для платежа
      const description = `Услуги по реализации автоматизированных программных решений: ${service.packageName}`;

      // Подготавливаем данные для PaymentService
      const paymentData: EnhancedPaymentData = {
        amount: service.price,
        orderId,
        description,
        itemName: service.packageName,
        customerKey: `customer-${service.packageId}`,
        fiscalData // ✅ Передаем фискальные данные от пользователя
      };

      console.log('PaymentButton: Initializing payment with fiscal data');
      try { trackBeginCheckout({ label: 'tinkoff_checkout', orderValue: service.price, packageId: service.packageId }); } catch {}

      // ✅ Используем обновленный PaymentService
      const result = await PaymentService.initPayment(paymentData);

      if (result.success && result.paymentUrl) {
        console.log('PaymentButton: Payment initialized successfully', result);
        
        // Закрываем модальное окно
        setIsFiscalModalOpen(false);
        
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
        // ✅ Обрабатываем ошибки через новую систему
        const errorMsg = result.error?.userMessage || 'Ошибка инициализации платежа';
        console.error('PaymentButton: Payment initialization failed', result.error);
        
        onPaymentError?.(errorMsg);
        alert(errorMsg);
        
        // Не закрываем модальное окно, чтобы пользователь мог исправить данные
      }

    } catch (error) {
      console.error('PaymentButton: Unexpected error:', error);
      const errorMsg = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      onPaymentError?.(errorMsg);
      alert(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ НОВОЕ: Обработчик закрытия модального окна
  const handleFiscalModalClose = () => {
    if (!isLoading) {
      setIsFiscalModalOpen(false);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-1">
        {paymentType === 'installment' && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShowInstallmentInfo(true);
            }}
            className="text-light-cream/70 hover:text-light-cream transition-colors p-1 z-10 relative flex-shrink-0"
            style={{ fontSize: '14px' }}
            title="Информация о рассрочке"
          >
            <HelpCircle size={14} />
          </button>
        )}
        <button
          className={className}
          onClick={handlePaymentClick}
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
      
      {/* ✅ НОВОЕ: Модальное окно для сбора фискальных данных */}
      <FiscalDataModal
        isOpen={isFiscalModalOpen}
        onClose={handleFiscalModalClose}
        onSubmit={handleFiscalDataSubmit}
        isLoading={isLoading}
      />
      
      {paymentType === 'installment' && (
        <InstallmentInfoModal
          isOpen={showInstallmentInfo}
          onClose={() => setShowInstallmentInfo(false)}
        />
      )}
    </>
  );
};