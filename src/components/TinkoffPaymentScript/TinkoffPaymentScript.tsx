import React, { useEffect, useState } from 'react';

interface TinkoffPaymentScriptProps {
  amount: number; // цена в рублях
  itemName: string; // название позиции
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
}

// Типы объявлены в src/types/global.d.ts

export const TinkoffPaymentScript: React.FC<TinkoffPaymentScriptProps> = ({
  amount,
  itemName,
  paymentType,
  className = '',
  children
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Загружаем официальный скрипт Tinkoff
    if (!document.getElementById('tinkoff-script')) {
      const script = document.createElement('script');
      script.id = 'tinkoff-script';
      script.src = 'https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js';
      script.async = true;
      script.onload = () => {
        console.log('Tinkoff script loaded successfully');
        setScriptLoaded(true);
      };
      script.onerror = () => {
        console.error('Failed to load Tinkoff script');
      };
      document.head.appendChild(script);
    } else {
      setScriptLoaded(true);
    }
  }, []);

  const handlePayment = () => {
    if (isLoading) return;
    
    if (!window.tinkoffPayRow) {
      alert('Платежная система временно недоступна. Попробуйте позже.');
      return;
    }

    setIsLoading(true);
    console.log('Starting Tinkoff payment:', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const orderId = `${paymentType}_${timestamp}_${random}`;
      
      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(amount * 100);

      // Параметры для Tinkoff согласно документации
      const paymentParams = {
        terminalkey: '25801389', // ваш Terminal_id
        amount: amountInKopecks,
        order: orderId,
        description: 'Услуги по реализации автоматизированных программных решений',
        name: itemName,
        successURL: 'https://securepay.tinkoff.ru/html/payForm/success.html',
        failURL: 'https://securepay.tinkoff.ru/html/payForm/fail.html',
        language: 'ru',
        frame: false // Открывать в новом окне
      };

      console.log('Tinkoff payment params:', paymentParams);

      // Вызываем официальную функцию Tinkoff
      window.tinkoffPayRow(paymentParams);

    } catch (error) {
      console.error('Payment error:', error);
      alert('Произошла ошибка при инициализации платежа');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={className}
      onClick={handlePayment}
      disabled={isLoading || !scriptLoaded}
      type="button"
      style={{ 
        opacity: (isLoading || !scriptLoaded) ? 0.6 : 1,
        cursor: (isLoading || !scriptLoaded) ? 'not-allowed' : 'pointer'
      }}
    >
      {isLoading ? 'Обработка...' : !scriptLoaded ? 'Загрузка...' : children}
    </button>
  );
};