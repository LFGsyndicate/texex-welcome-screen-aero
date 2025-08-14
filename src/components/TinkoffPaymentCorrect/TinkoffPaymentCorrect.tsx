import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';
import { FiscalDataModal } from '@/components/FiscalDataModal';
import { FiscalData, EnhancedPaymentData } from '@/types/payment.types';

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
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false);

  // ✅ НОВОЕ: Обработчик клика по кнопке - открывает модальное окно
  const handlePaymentClick = () => {
    if (isLoading) return;
    console.log('TinkoffPaymentCorrect: Starting payment flow', { amount, itemName, paymentType });
    setIsFiscalModalOpen(true);
  };

  // ✅ НОВОЕ: Обработчик отправки фискальных данных
  const handleFiscalDataSubmit = async (fiscalData: FiscalData) => {
    setIsLoading(true);
    
    try {
      // Генерируем ID заказа
      const orderId = PaymentService.generateOrderId(paymentType);
      
      // Описание для платежа
      const description = `Услуги по реализации автоматизированных программных решений: ${itemName}`;

      // Подготавливаем данные для PaymentService
      const paymentData: EnhancedPaymentData = {
        amount,
        orderId,
        description,
        itemName,
        customerKey,
        fiscalData // ✅ Передаем фискальные данные от пользователя
      };

      console.log('TinkoffPaymentCorrect: Initializing payment with fiscal data');

      // ✅ Используем обновленный PaymentService
      const result = await PaymentService.initPayment(paymentData);

      if (result.success && result.paymentUrl) {
        console.log('TinkoffPaymentCorrect: Payment initialized successfully', result);
        
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
          console.error('TinkoffPaymentCorrect: Popup blocked');
          onError?.(errorMsg);
          alert(errorMsg);
        } else {
          onSuccess?.();
        }
      } else {
        // ✅ Обрабатываем ошибки через новую систему
        const errorMsg = result.error?.userMessage || 'Ошибка инициализации платежа';
        console.error('TinkoffPaymentCorrect: Payment initialization failed', result.error);
        
        onError?.(errorMsg);
        alert(errorMsg);
        
        // Не закрываем модальное окно, чтобы пользователь мог исправить данные
      }

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      console.error('TinkoffPaymentCorrect: Unexpected error:', error);
      onError?.(errorMessage);
      alert(errorMessage);
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

      {/* ✅ НОВОЕ: Модальное окно для сбора фискальных данных */}
      <FiscalDataModal
        isOpen={isFiscalModalOpen}
        onClose={handleFiscalModalClose}
        onSubmit={handleFiscalDataSubmit}
        isLoading={isLoading}
      />
    </>
  );
};
