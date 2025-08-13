import React, { useState } from 'react';
import { SimplePaymentButton } from '@/components/SimplePaymentButton';
import { PaymentService } from '@/services/paymentService';
import { TokenGenerator } from '@/utils/tokenGenerator';
import { tinkoffConfig } from '@/config/tinkoff.config';

export const PaymentTestSimple: React.FC = () => {
  const [testResult, setTestResult] = useState<string>('');

  const testService = {
    packageId: 'test-service',
    packageName: 'Тестовый AI-Сервис',
    price: 1000, // 1000 рублей для тестирования
    description: 'Услуги по реализации автоматизированных программных решений'
  };

  const testTokenGeneration = async () => {
    try {
      const testParams = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: 100000, // 1000 рублей в копейках
        OrderId: 'test-order-123',
        Description: 'Test payment'
      };

      const tokenParams = TokenGenerator.prepareTokenParams(testParams);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);

      setTestResult(`Token generated: ${token}`);
      console.log('Test token:', token);
      console.log('Test params:', testParams);
    } catch (error) {
      setTestResult(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testApiCall = async () => {
    try {
      const result = await PaymentService.initPayment({
        amount: 1000,
        orderId: PaymentService.generateOrderId('test'),
        description: 'Test payment',
        customerKey: 'test-customer'
      });

      setTestResult(`API Result: ${JSON.stringify(result, null, 2)}`);
      console.log('API test result:', result);
    } catch (error) {
      setTestResult(`API Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      padding: '2rem',
      color: '#f1f5f9'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
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
            <div><strong>Terminal Key:</strong> {tinkoffConfig.terminalKey}</div>
            <div><strong>Merchant ID:</strong> {tinkoffConfig.merchantId}</div>
            <div><strong>API URL:</strong> {tinkoffConfig.apiUrl}</div>
            <div><strong>Password:</strong> {tinkoffConfig.password ? '***' : 'NOT SET'}</div>
          </div>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Тесты</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button
              onClick={testTokenGeneration}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Тест генерации токена
            </button>
            
            <button
              onClick={testApiCall}
              style={{
                padding: '0.75rem 1.5rem',
                background: '#10b981',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                cursor: 'pointer'
              }}
            >
              Тест API вызова
            </button>
          </div>

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

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)', 
          padding: '2rem', 
          borderRadius: '1rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Тестовые кнопки оплаты</h2>
          
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <SimplePaymentButton
              service={testService}
              paymentType="payment"
              className="payment-btn payment-btn--primary"
            >
              💳 Оплатить {testService.price} ₽
            </SimplePaymentButton>
            
            <SimplePaymentButton
              service={testService}
              paymentType="installment"
              className="payment-btn payment-btn--secondary"
            >
              📅 Рассрочка {testService.price} ₽
            </SimplePaymentButton>
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
            <li>Нажмите "Тест генерации токена" для проверки алгоритма</li>
            <li>Нажмите "Тест API вызова" для проверки подключения к Tinkoff</li>
            <li>Используйте кнопки оплаты для полного тестирования</li>
            <li>Проверьте консоль браузера для детальных логов</li>
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
            background: #F2CC66;
            color: #000;
          }
          
          .payment-btn--primary:hover {
            background: #F5D77F;
            transform: translateY(-1px);
          }
          
          .payment-btn--secondary {
            background: #000;
            color: white;
          }
          
          .payment-btn--secondary:hover {
            background: #333;
            transform: translateY(-1px);
          }
          
          .payment-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
            transform: none;
          }
        `}</style>
      </div>
    </div>
  );
};