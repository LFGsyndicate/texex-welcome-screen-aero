import React, { useState } from 'react';
import { TinkoffPayment } from '@/components/TinkoffPayment';
import { TinkoffPaymentFinal } from '@/components/TinkoffPaymentFinal/TinkoffPaymentFinal';
import { TinkoffPaymentCorrect } from '@/components/TinkoffPaymentCorrect/TinkoffPaymentCorrect';
import { PaymentService } from '@/services/paymentService';
import { TokenGenerator } from '@/utils/tokenGenerator';

export const TinkoffTest: React.FC = () => {
  const [testResults, setTestResults] = useState<{[key: string]: any}>({});
  const [isLoading, setIsLoading] = useState<{[key: string]: boolean}>({});

  const testService = {
    packageId: 'test-service',
    packageName: 'Тестовый AI-Сервис',
    price: 1000, // 1000 рублей для тестирования
    description: 'Услуги по реализации автоматизированных программных решений'
  };

  const runTest = async (testName: string, testFn: () => Promise<any>) => {
    setIsLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFn();
      setTestResults(prev => ({ ...prev, [testName]: { success: true, data: result } }));
    } catch (error) {
      setTestResults(prev => ({ 
        ...prev, 
        [testName]: { 
          success: false, 
          error: error instanceof Error ? error.message : 'Неизвестная ошибка' 
        } 
      }));
    } finally {
      setIsLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const testTokenGeneration = async () => {
    const testParams = {
      TerminalKey: "1754995728217", // Правильный TerminalKey
      Amount: 100000,
      OrderId: "test_order_123",
      Description: "Test payment"
    };
    
    const token = await TokenGenerator.generateToken(testParams, 'Ut8FxLDYq2t3563u');
    return { token, params: testParams };
  };

  const testPaymentService = async () => {
    // Используем простой ID заказа
    const orderId = PaymentService.generateOrderId('test');
    
    console.log('Testing PaymentService with orderId:', orderId);
    
    const result = await PaymentService.initPayment({
      amount: 1000,
      orderId: orderId,
      description: 'Тестовый платеж через PaymentService',
      itemName: 'Тестовый AI-Сервис'
    });
    return result;
  };

  const testTinkoffScript = async () => {
    return new Promise((resolve, reject) => {
      if (window.PaymentIntegration) {
        resolve({ success: true, message: 'Скрипт Tinkoff PaymentIntegration загружен' });
      } else {
        reject(new Error('Скрипт Tinkoff PaymentIntegration не загружен'));
      }
    });
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      padding: '2rem',
      color: '#f1f5f9'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          🧪 Тестирование платежей Tinkoff
        </h1>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Конфигурация</h2>
          <div style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}>
            <div><strong>Terminal Key:</strong> 1754995728217 (исправлено!)</div>
            <div><strong>Merchant ID:</strong> 200000001673251</div>
            <div><strong>Password:</strong> Ut8FxLDYq2t3563u</div>
            <div><strong>API URL:</strong> https://securepay.tinkoff.ru/v2/</div>
            <div><strong>Метод:</strong> Прямой API вызов с правильными параметрами</div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Тесты компонентов</h2>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
            <button
              onClick={() => runTest('token', testTokenGeneration)}
              disabled={isLoading['token']}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: isLoading['token'] ? 0.6 : 1
              }}
            >
              {isLoading['token'] ? 'Тестирование...' : '🔐 Тест генерации токена'}
            </button>

            <button
              onClick={() => runTest('paymentService', testPaymentService)}
              disabled={isLoading['paymentService']}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: isLoading['paymentService'] ? 0.6 : 1
              }}
            >
              {isLoading['paymentService'] ? 'Тестирование...' : '🌐 Тест API вызова'}
            </button>

            <button
              onClick={() => runTest('tinkoffScript', testTinkoffScript)}
              disabled={isLoading['tinkoffScript']}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#f59e0b',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer',
                opacity: isLoading['tinkoffScript'] ? 0.6 : 1
              }}
            >
              {isLoading['tinkoffScript'] ? 'Тестирование...' : '📜 Тест загрузки скрипта'}
            </button>
          </div>

          {/* Результаты тестов */}
          {Object.keys(testResults).length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>Результаты тестов:</h3>
              {Object.entries(testResults).map(([testName, result]) => (
                <div key={testName} style={{
                  padding: '1rem',
                  marginBottom: '1rem',
                  borderRadius: '0.5rem',
                  background: result.success ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  border: `1px solid ${result.success ? '#10b981' : '#ef4444'}`
                }}>
                  <h4 style={{ margin: '0 0 0.5rem 0', color: result.success ? '#10b981' : '#ef4444' }}>
                    {testName}: {result.success ? '✅ Успех' : '❌ Ошибка'}
                  </h4>
                  <pre style={{ 
                    fontSize: '0.8rem', 
                    overflow: 'auto', 
                    background: 'rgba(0,0,0,0.3)', 
                    padding: '0.5rem',
                    borderRadius: '0.25rem'
                  }}>
                    {JSON.stringify(result, null, 2)}
                  </pre>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Тестовые кнопки оплаты</h2>
          
          <div style={{ display: 'grid', gap: '1rem', marginBottom: '1rem' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>TinkoffPaymentCorrect (исправленные параметры):</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <TinkoffPaymentCorrect
                amount={testService.price}
                itemName={testService.packageName}
                paymentType="payment"
                className="payment-btn payment-btn--primary"
                onSuccess={() => console.log('Payment success!')}
                onError={(error) => console.error('Payment error:', error)}
              >
                💳 Оплатить {testService.price} ₽
              </TinkoffPaymentCorrect>
            </div>

            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', marginTop: '1rem' }}>TinkoffPaymentFinal (наш сервис):</h3>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <TinkoffPaymentFinal
                amount={testService.price}
                itemName={testService.packageName}
                paymentType="payment"
                className="payment-btn payment-btn--primary"
              >
                💳 Оплатить {testService.price} ₽
              </TinkoffPaymentFinal>
            </div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 193, 7, 0.1)', 
          border: '1px solid rgba(255, 193, 7, 0.3)',
          padding: '1rem', 
          borderRadius: '0.5rem',
          fontSize: '0.9rem'
        }}>
          <strong>📋 Инструкции:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li>Сначала запустите тесты компонентов для проверки работоспособности</li>
            <li>Кнопки используют исправленные параметры с правильным TerminalKey</li>
            <li>Платежная форма откроется в новом окне с фискальными чеками</li>
            <li>Используйте тестовые карты: 4300000000000777 (успех), 4300000000000785 (недостаточно средств)</li>
            <li>Проверьте консоль браузера для логов</li>
            <li>Фискальные чеки включены для корректной работы API</li>
            <li>Используется правильный TerminalKey: 1754995728217</li>
          </ul>
        </div>

        <style>{`
          .payment-btn {
            padding: 0.75rem 1.5rem;
            border: none;
            border-radius: 0.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            font-size: 1rem;
          }
          
          .payment-btn--primary {
            background: #3b82f6;
            color: white;
          }
          
          .payment-btn--primary:hover {
            background: #2563eb;
          }
          
          .payment-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
};