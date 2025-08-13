import React from 'react';
import { TinkoffPaymentFinal } from '@/components/TinkoffPaymentFinal/TinkoffPaymentFinal';

export const TinkoffFinalTest: React.FC = () => {
  const testServices = [
    {
      name: 'AI-Мастер Контента для SMM',
      price: 90000
    },
    {
      name: 'AI-Ассистент для клиентского сервиса',
      price: 120000
    },
    {
      name: 'AI-Аналитика данных',
      price: 150000
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D19A3 0%, #080F5B 100%)',
      color: '#F4E4C1',
      padding: '2rem'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '1rem' }}>
          ✅ Финальная интеграция Tinkoff
        </h1>
        
        <div style={{ 
          background: 'rgba(244, 228, 193, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>📋 Исправленная интеграция:</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <div><strong>✅ Исправлены TypeScript ошибки</strong> - единые типы в global.d.ts</div>
            <div><strong>✅ Исправлена ошибка 404</strong> - используется POST форма к Init API</div>
            <div><strong>✅ Правильные параметры</strong> - TerminalKey, Amount, OrderId, Token</div>
            <div><strong>✅ Корректный токен</strong> - генерируется с паролем</div>
            <div><strong>✅ Стандартные URL</strong> - success.html и fail.html</div>
          </div>
        </div>

        <div style={{ 
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '2rem'
        }}>
          {testServices.map((service, index) => (
            <div
              key={index}
              style={{
                background: 'rgba(244, 228, 193, 0.08)',
                backdropFilter: 'blur(20px)',
                borderRadius: '20px',
                border: '1px solid rgba(244, 228, 193, 0.15)',
                padding: '2rem'
              }}
            >
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                {service.name}
              </h3>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#15D895' }}>
                {service.price.toLocaleString('ru-RU')} ₽
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <TinkoffPaymentFinal
                  amount={service.price}
                  itemName={service.name}
                  paymentType="payment"
                  className="payment-btn payment-btn--primary"
                >
                  💳 Оплатить
                </TinkoffPaymentFinal>
                
                <TinkoffPaymentFinal
                  amount={service.price}
                  itemName={service.name}
                  paymentType="installment"
                  className="payment-btn payment-btn--secondary"
                >
                  📅 Рассрочка
                </TinkoffPaymentFinal>
              </div>
            </div>
          ))}
        </div>

        <div style={{ 
          marginTop: '3rem',
          padding: '1.5rem',
          background: 'rgba(21, 216, 149, 0.1)',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>🔧 Как работает исправленная версия:</h3>
          <ul style={{ textAlign: 'left', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            <li>Создается HTML форма с методом POST</li>
            <li>Форма отправляется на <code>https://securepay.tinkoff.ru/v2/Init</code></li>
            <li>Передаются все необходимые параметры включая Token</li>
            <li>Tinkoff возвращает платежную форму без ошибок 404</li>
            <li>После оплаты редирект на стандартные страницы успеха/ошибки</li>
          </ul>
        </div>
      </div>

      <style>{`
        .payment-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          width: 100%;
        }
        
        .payment-btn--primary {
          background: #F2CC66;
          color: #000;
        }
        
        .payment-btn--primary:hover:not(:disabled) {
          background: #F5D77F;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(242, 204, 102, 0.3);
        }
        
        .payment-btn--secondary {
          background: #000;
          color: white;
        }
        
        .payment-btn--secondary:hover:not(:disabled) {
          background: #333;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .payment-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }

        code {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 0.4rem;
          border-radius: 0.25rem;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};