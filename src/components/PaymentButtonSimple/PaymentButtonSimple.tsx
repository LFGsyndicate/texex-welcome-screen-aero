import React, { useState } from 'react';

interface PaymentButtonSimpleProps {
  amount: number;
  description: string;
  className?: string;
  children: React.ReactNode;
  type?: 'payment' | 'installment';
}

export const PaymentButtonSimple: React.FC<PaymentButtonSimpleProps> = ({
  amount,
  description,
  className = '',
  children,
  type = 'payment'
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    console.log('PaymentButtonSimple: Starting payment', { amount, description, type });

    try {
      // Генерируем уникальный ID заказа
      const orderId = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
      
      // Конвертируем в копейки
      const amountInKopecks = Math.round(amount * 100);
      
      // Формируем URL для Tinkoff
      const params = new URLSearchParams({
        terminalkey: '25801389',
        amount: amountInKopecks.toString(),
        order: orderId,
        description: description,
        successURL: `${window.location.origin}/payment/success`,
        failURL: `${window.location.origin}/payment/error`,
        language: 'ru'
      });

      const paymentUrl = `https://securepay.tinkoff.ru/new/redirect?${params.toString()}`;
      
      console.log('PaymentButtonSimple: Opening payment URL:', paymentUrl);
      
      // Открываем платежную форму
      const paymentWindow = window.open(
        paymentUrl,
        'tinkoff_payment',
        'width=800,height=600,scrollbars=yes,resizable=yes,location=yes'
      );

      if (!paymentWindow) {
        alert('Не удалось открыть окно оплаты. Разрешите всплывающие окна для этого сайта.');
        return;
      }

      // Мониторим закрытие окна
      const checkClosed = setInterval(() => {
        if (paymentWindow.closed) {
          clearInterval(checkClosed);
          console.log('PaymentButtonSimple: Payment window closed');
        }
      }, 1000);

    } catch (error) {
      console.error('PaymentButtonSimple: Error:', error);
      alert('Произошла ошибка при инициализации платежа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={className}
      onClick={handleClick}
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