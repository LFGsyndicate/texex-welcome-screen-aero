import React, { useEffect, useRef, useState } from 'react';
import { tinkoffConfig } from '@/config/tinkoff.config';
import { TokenGenerator } from '@/utils/tokenGenerator';

interface TinkoffPaymentIframeCorrectProps {
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

export const TinkoffPaymentIframeCorrect: React.FC<TinkoffPaymentIframeCorrectProps> = ({
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
  const mainIntegrationRef = useRef<any>(null);

  useEffect(() => {
    // Загружаем скрипт Tinkoff Integration
    const script = document.createElement('script');
    script.src = 'https://acq-paymentform-integrationjs.t-static.ru/integration.js';
    script.async = true;
    script.onload = initializeIntegration;
    document.head.appendChild(script);

    return () => {
      if (mainIntegrationRef.current) {
        mainIntegrationRef.current.unmount?.();
      }
    };
  }, []);

  const initializeIntegration = async () => {
    try {
      if (!window.PaymentIntegration) {
        console.error('Tinkoff PaymentIntegration не загружен');
        return;
      }

      // Конфигурация согласно документации
      const initConfig = {
        terminalKey: tinkoffConfig.terminalKey,
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
    console.log('TinkoffPaymentIframeCorrect: Starting payment', { amount, itemName, paymentType });

    try {
      // Генерируем уникальный ID заказа
      const safeItemName = itemName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      const orderId = `${paymentType}_${safeItemName}_${timestamp}_${random}`;
      
      // Описание для формы
      const description = 'Услуги по реализации автоматизированных программных решений';

      // Конвертируем рубли в копейки
      const amountInKopecks = Math.round(amount * 100);

      console.log('TinkoffPaymentIframeCorrect: Generated order data:', { orderId, description, amount: amountInKopecks });

      // Создаем параметры для API запроса с фискальными чеками
      const initParams = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: amountInKopecks,
        OrderId: orderId,
        Description: description,
        SuccessURL: tinkoffConfig.successUrl,
        FailURL: tinkoffConfig.failUrl,
        Language: 'ru',
        CustomerKey: `customer_${Date.now()}`,
        // Фискальные чеки - обязательны для корректной работы
        Receipt: {
          Email: 'customer@example.com',
          Taxation: 'usn_income',
          Items: [
            {
              Name: description,
              Price: amountInKopecks,
              Quantity: 1.00,
              Amount: amountInKopecks,
              Tax: 'none'
            }
          ]
        }
      };

      // Генерируем токен
      const tokenParams = TokenGenerator.prepareTokenParams(initParams);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      const finalInitParams = {
        ...initParams,
        Token: token
      };

      console.log('TinkoffPaymentIframeCorrect: Final init params:', finalInitParams);

      // Создаем iframe интеграцию согласно документации
      const MAIN_INTEGRATION_NAME = `payment_${orderId}`;
      const iframeConfig = {
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
      };

      const mainPaymentIntegration = await integrationRef.current.iframe.create(
        MAIN_INTEGRATION_NAME,
        iframeConfig
      );

      mainIntegrationRef.current = mainPaymentIntegration;

      // Инициируем платеж через helpers.init согласно документации
      const res = await integrationRef.current.helpers.init(
        `${tinkoffConfig.apiUrl}Init`,
        'POST',
        finalInitParams
      );

      console.log('TinkoffPaymentIframeCorrect: Init response:', res);

      if (res.PaymentURL && containerRef.current) {
        // Монтируем интеграцию в контейнер
        await mainPaymentIntegration.mount(containerRef.current, res.PaymentURL);
        setShowIframe(true);
      } else {
        throw new Error('PaymentURL не получен');
      }

    } catch (error) {
      console.error('TinkoffPaymentIframeCorrect: Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Произошла ошибка при инициализации платежа';
      onError?.(errorMessage);
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const closeIframe = () => {
    setShowIframe(false);
    if (mainIntegrationRef.current) {
      mainIntegrationRef.current.unmount?.();
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
