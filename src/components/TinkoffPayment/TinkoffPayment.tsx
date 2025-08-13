import React, { useEffect, useRef, useState } from 'react';
import { PaymentService } from '@/services/paymentService';

interface TinkoffPaymentProps {
  terminalKey: string;
  amount: number; // в рублях
  orderId: string;
  description: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  className?: string;
  children: React.ReactNode;
}

// Типы объявлены в src/types/global.d.ts

export const TinkoffPayment: React.FC<TinkoffPaymentProps> = ({
  terminalKey,
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  className = '',
  children
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const scriptLoaded = useRef(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Загружаем скрипт Tinkoff только один раз
    if (!scriptLoaded.current) {
      const script = document.createElement('script');
      script.src = 'https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js';
      script.async = true;
      script.onload = () => {
        scriptLoaded.current = true;
        console.log('Tinkoff script loaded');
      };
      script.onerror = () => {
        console.error('Failed to load Tinkoff script');
        // Не показываем ошибку сразу, попробуем fallback
      };
      document.head.appendChild(script);
    }
  }, []);

  const handlePayment = async () => {
    if (isLoading) return;

    setIsLoading(true);
    console.log('TinkoffPayment: Starting payment process');

    try {
      // Проверяем, загружен ли скрипт Tinkoff
      if (window.tinkoffPayRow) {
        const amountInKopecks = Math.round(amount * 100);

        console.log('TinkoffPayment: Using Tinkoff script', {
          terminalKey,
          amount: amountInKopecks,
          orderId,
          description
        });

        window.tinkoffPayRow({
          terminalkey: terminalKey,
          amount: amountInKopecks,
          order: orderId,
          description: description,
          successURL: `${window.location.origin}/payment/success`,
          failURL: `${window.location.origin}/payment/error`,
          frame: false,
          language: 'ru',
          success: () => {
            console.log('TinkoffPayment: Tinkoff script success');
            onSuccess?.();
          },
          error: (scriptError: any) => {
            console.error('TinkoffPayment: Tinkoff script error:', scriptError);
            onError?.(scriptError?.message || 'Ошибка при оплате');
          }
        });
        return;
      } else {
        // Fallback: используем PaymentService если скрипт не загружен
        console.log('TinkoffPayment: Script not loaded, using PaymentService fallback');
        
        const result = await PaymentService.initPayment({
          amount,
          orderId,
          description,
          customerKey: `customer_${Date.now()}`
        });

        if (result.success && result.paymentUrl) {
          console.log('TinkoffPayment: PaymentService fallback success', result);
          
          // Открываем платежную форму в новом окне
          const paymentWindow = window.open(
            result.paymentUrl,
            'tinkoff_payment',
            'width=800,height=600,scrollbars=yes,resizable=yes'
          );

          if (!paymentWindow) {
            alert('Разрешите всплывающие окна для этого сайта.');
          } else {
            onSuccess?.();
          }
        } else {
          throw new Error(result.message || 'Ошибка инициализации платежа');
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Ошибка инициализации платежа';
      console.error('TinkoffPayment: Error:', errorMessage);
      onError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      ref={buttonRef}
      className={className}
      onClick={handlePayment}
      disabled={isLoading}
      type="button"
      style={{ opacity: isLoading ? 0.6 : 1 }}
    >
      {isLoading ? 'Обработка...' : children}
    </button>
  );
};