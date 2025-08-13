import React, { useState } from 'react';
import { TinkoffPaymentButton } from '@/components/TinkoffPaymentButton/TinkoffPaymentButton';
import { PaymentService } from '@/services/paymentService';
import { tinkoffConfig } from '@/config/tinkoff.config';

export const TinkoffApiTest: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testApiDirectly = async () => {
    setIsLoading(true);
    setTestResult('Тестирование API...');
    
    try {
      const orderId = PaymentService.generateOrderId('api_test');
      const paymentData = {
        amount: 1000, // 1000 рублей
        orderId,
        description: 'Услуги по реализации автоматизированных программных решений: Тестовый платеж',
        customerKey: 'test_customer_' + Date.now()
      };

      console.log('Testing API with data:', paymentData);
      
      const result = await PaymentService.initPayment(paymentData);
      
      console.log('API test result:', result);
      
      if (result.success && result.paymentUrl) {
        setTestResult(`✅ API работает!\nPayment ID: ${result.paymentId}\nPayment URL: ${result.paymentUrl}`);
      } else {
        setTestResult(`❌ API ошибка: ${result.message}\nError Code: ${result.errorCode}`);
      }
    } catch (error) {
      console.error('API test error:', error);
      setTestResult(`💥 Исключение: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testServices = [
    {
      name: 'AI-Мастер Контента для SMM',
      price: 90000
    },
    {
      name: 'AI-Ассистент для клиентского сервиса', 
      price: 120000
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
        <h1 style={{ fontSize: '2.5rem', textAlign: 'center', marginBottom: '2rem' }}>
          🔧 Тест API Tinkoff
        </h1>
        
        {/* Конфигурация */}
        <div style={{ 
          background: 'rgba(244, 228, 193, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>⚙️ Конфигурация:</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem', lineHeight: '1.6' }}>
            <div><strong>Terminal Key:</strong> {tinkoffConfig.terminalKey}</div>
            <div><strong>Merchant ID:</strong> {tinkoffConfig.merchantId}</div>
            <div><strong>API URL:</strong> {tinkoffConfig.apiUrl}</div>
            <div><strong>Success URL:</strong> {tinkoffConfig.successUrl}</div>
            <div><strong>Fail URL:</strong> {tinkoffConfig.failUrl}</div>
            <div><strong>Password:</strong> {tinkoffConfig.password ? '***установлен***' : '❌НЕ УСТАНОВЛЕН❌'}</div>
          </div>
        </div>

        {/* Тест API */}
        <div style={{ 
          background: 'rgba(244, 228, 193, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>🧪 Прямой тест API:</h2>
          <button
            onClick={testApiDirectly}
            disabled={isLoading}
            style={{
              padding: '1rem 2rem',
              background: isLoading ? '#666' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginBottom: '1rem'
            }}
          >
            {isLoading ? 'Тестирование...' : '🚀 Тест API Init'}
          </button>
          
          {testResult && (
            <div style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.8rem',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all'
            }}>
              {testResult}
            </div>
          )}
        </div>

        {/* Тест кнопок */}
        <div style={{ 
          background: 'rgba(244, 228, 193, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ marginBottom: '1rem' }}>🎯 Тест кнопок платежей:</h2>
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
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
                <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                  {service.name}
                </h3>
                <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#15D895' }}>
                  {service.price.toLocaleString('ru-RU')} ₽
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <TinkoffPaymentButton
                    amount={service.price}
                    itemName={service.name}
                    paymentType="payment"
                    className="payment-btn payment-btn--primary"
                  >
                    💳 Оплатить
                  </TinkoffPaymentButton>
                  
                  <TinkoffPaymentButton
                    amount={service.price}
                    itemName={service.name}
                    paymentType="installment"
                    className="payment-btn payment-btn--secondary"
                  >
                    📅 Рассрочка
                  </TinkoffPaymentButton>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Инструкции */}
        <div style={{ 
          background: 'rgba(21, 216, 149, 0.1)',
          padding: '1.5rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>📋 Как тестировать:</h3>
          <ol style={{ textAlign: 'left', lineHeight: '1.6', maxWidth: '600px', margin: '0 auto' }}>
            <li>Сначала нажмите "Тест API Init" для проверки подключения</li>
            <li>Если API работает, тестируйте кнопки платежей</li>
            <li>Кнопки должны открывать правильную форму Tinkoff</li>
            <li>Проверьте консоль браузера для детальных логов</li>
            <li>Используйте тестовую карту: <code>4300000000000777</code></li>
          </ol>
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
        
        .payment-btn--primary:hover {
          background: #F5D77F;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(242, 204, 102, 0.3);
        }
        
        .payment-btn--secondary {
          background: #000;
          color: white;
        }
        
        .payment-btn--secondary:hover {
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