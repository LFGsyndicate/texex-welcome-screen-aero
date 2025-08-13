import React, { useEffect, useRef, useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface TinkoffPaymentIframeProps {
  amount: number;
  itemName: string;
  paymentType: 'payment' | 'installment';
  className?: string;
  children: React.ReactNode;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

declare global {
  interface Window {
    PaymentIntegration: any;
  }
}

export const TinkoffPaymentIframe: React.FC<TinkoffPaymentIframeProps> = ({
  amount,
  itemName,
  paymentType,
  className = '',
  children,
  onSuccess,
  onError
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showIframe, setShowIframe] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const integrationRef = useRef<any>(null);

  useEffect(() => {
    // Загружаем скрипт Tinkoff Integration
    const script = document.createElement('script');
    script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js';
    script.async = true;
    script.onload = initializeIntegration;
    document.head.appendChild(script);

    return () => {
      // Очистка при размонтировании
      if (integrationRef.current) {
        integrationRef.current.unmount?.();
      }
    };
  }, []);

  const initializeIntegration = async () => {
    try {
      if (!window.PaymentIntegration) {
        console.error('Tinkoff PaymentIntegration не загружен');
        return;
      }

      const initConfig = {
        terminalKey: '25801389', // Ваш Terminal Key
        product: 'eacq',
        features: {
          iframe: {}
        }
      };

      const integration = await window.PaymentIntegration.init(initConfig);
      integrationRef.current = integration;

      console.log('Tinkoff Integration инициализирована');
    } catch (error) {
      console.error('Ошибка инициализации Tinkoff Integration:', error);
    }
  };

  const handlePayment = async () => {
    if (isLoading || !integrationRef.current) return;
    
    setIsLoading(true);
    console.log('TinkoffPaymentIframe: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const safeItemName = itemName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const orderId = PaymentService.generateOrderId(`${paymentType}_${safeItemName}`);
      
      // Описание для формы
      const description = 'Услуги по реализации автоматизированных программных решений';

      console.log('TinkoffPaymentIframe: Generated order data:', { orderId, description, amount });

      // Создаем iframe интеграцию
      const iframeIntegration = await integrationRef.current.iframe.create(
        `payment_${orderId}`,
        {
          status: {
            changedCallback: async (status: string) => {
              console.log('Payment status changed:', status);
              if (status === 'SUCCESS') {
                onSuccess?.();
                setShowIframe(false);
              } else if (status === 'REJECTED' || status === 'CANCELED') {
                onError?.(`Платеж отклонен: ${status}`);
                setShowIframe(false);
              }
            }
          }
        }
      );

      // Монтируем iframe в контейнер
      if (containerRef.current) {
        await iframeIntegration.mount(containerRef.current);
        setShowIframe(true);
      }

    } catch (error) {
      console.error('TinkoffPaymentIframe: Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    if (integrationRef.current) {
      integrationRef.current.unmount?.();
    }
  };

  if (showIframe) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="relative w-full max-w-4xl h-96 bg-white rounded-lg shadow-xl">
          <button
            onClick={closeIframe}
            className="absolute top-4 right-4 z-10 p-2 bg-gray-800 text-white rounded-full hover:bg-gray-700"
          >
            ✕
          </button>
          <div ref={containerRef} className="w-full h-full" />
        </div>
      </div>
    );
  }

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
