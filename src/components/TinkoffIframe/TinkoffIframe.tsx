import React, { useEffect, useRef, useState } from 'react';

interface TinkoffIframeProps {
  terminalKey: string;
  amount: number; // в рублях
  orderId: string;
  description: string;
  onSuccess?: () => void;
  onError?: (error: string) => void;
  onClose?: () => void;
  isOpen: boolean;
}

// Типы объявлены в src/types/global.d.ts

export const TinkoffIframe: React.FC<TinkoffIframeProps> = ({
  terminalKey,
  amount,
  orderId,
  description,
  onSuccess,
  onError,
  onClose,
  isOpen
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  useEffect(() => {
    // Загружаем скрипт Tinkoff
    const script = document.createElement('script');
    script.src = 'https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js';
    script.async = true;
    script.onload = () => {
      setScriptLoaded(true);
      console.log('Tinkoff script loaded for iframe');
    };
    script.onerror = () => {
      console.error('Failed to load Tinkoff script');
      onError?.('Не удалось загрузить скрипт оплаты');
    };
    document.head.appendChild(script);

    return () => {
      // Очищаем скрипт при размонтировании
      const existingScript = document.querySelector('script[src="https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [onError]);

  useEffect(() => {
    if (isOpen && scriptLoaded && window.tinkoffPayRow && iframeRef.current) {
      try {
        // Конвертируем рубли в копейки
        const amountInKopecks = Math.round(amount * 100);

        console.log('Initiating iframe payment:', {
          terminalKey,
          amount: amountInKopecks,
          orderId,
          description
        });

        // Создаем URL для iframe вместо использования container
        const params = new URLSearchParams({
          terminalkey: terminalKey,
          amount: amountInKopecks.toString(),
          order: orderId,
          description: description,
          language: 'ru'
        });

        const iframeUrl = `https://securepay.tinkoff.ru/new/redirect?${params.toString()}`;
        
        if (iframeRef.current) {
          iframeRef.current.src = iframeUrl;
        }

        // Слушаем сообщения от iframe
        const handleMessage = (event: MessageEvent) => {
          if (event.origin !== 'https://securepay.tinkoff.ru') return;
          
          if (event.data === 'payment_success') {
            console.log('Iframe payment success');
            onSuccess?.();
          } else if (event.data === 'payment_error') {
            console.log('Iframe payment error');
            onError?.('Ошибка при оплате');
          }
        };

        window.addEventListener('message', handleMessage);
        
        return () => {
          window.removeEventListener('message', handleMessage);
        };
      } catch (error) {
        console.error('Iframe payment initialization error:', error);
        onError?.(error instanceof Error ? error.message : 'Ошибка инициализации платежа');
      }
    }
  }, [isOpen, scriptLoaded, terminalKey, amount, orderId, description, onSuccess, onError]);

  if (!isOpen) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '1rem',
        padding: '1rem',
        maxWidth: '600px',
        width: '100%',
        maxHeight: '80vh',
        position: 'relative'
      }}>
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            zIndex: 1001
          }}
        >
          ✕
        </button>
        
        <div style={{ padding: '2rem 1rem' }}>
          {!scriptLoaded ? (
            <div style={{ textAlign: 'center', padding: '2rem' }}>
              <div>Загрузка платежной формы...</div>
            </div>
          ) : (
            <iframe
              ref={iframeRef}
              style={{
                width: '100%',
                height: '500px',
                border: 'none',
                borderRadius: '0.5rem'
              }}
              title="Tinkoff Payment Form"
            />
          )}
        </div>
      </div>
    </div>
  );
};