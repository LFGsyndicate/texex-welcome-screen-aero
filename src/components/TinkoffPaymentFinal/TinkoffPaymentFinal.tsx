import React, { useState } from 'react';
import { PaymentService } from '@/services/paymentService';
import { FiscalDataModal } from '@/components/FiscalDataModal';
import { FiscalData, EnhancedPaymentData } from '@/types/payment.types';

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
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false);

  // ✅ НОВОЕ: Обработчик клика по кнопке - открывает модальное окно
  const handlePaymentClick = () => {
    if (isLoading) return;
    console.log('TinkoffPaymentFinal: Starting payment flow', { amount, itemName, paymentType });
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
        fiscalData // ✅ Передаем фискальные данные от пользователя
      };

      console.log('TinkoffPaymentFinal: Initializing payment with fiscal data');

      // ✅ Используем обновленный PaymentService
      const result = await PaymentService.initPayment(paymentData);

      if (result.success && result.paymentUrl) {
        console.log('TinkoffPaymentFinal: Payment initialized successfully', result);
        
        // Закрываем модальное окно
        setIsFiscalModalOpen(false);
        
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
        // ✅ Обрабатываем ошибки через новую систему
        const errorMsg = result.error?.userMessage || 'Ошибка инициализации платежа';
        console.error('TinkoffPaymentFinal: Payment initialization failed', result.error);
        
        alert(errorMsg);
        
        // Не закрываем модальное окно, чтобы пользователь мог исправить данные
      }

    } catch (error) {
      console.error('TinkoffPaymentFinal: Unexpected error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
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