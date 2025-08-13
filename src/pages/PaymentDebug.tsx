import React, { useState, useEffect } from 'react';
import { PaymentService } from '@/services/paymentService';
import { TokenGenerator } from '@/utils/tokenGenerator';
import { tinkoffConfig } from '@/config/tinkoff.config';

export const PaymentDebug: React.FC = () => {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[PaymentDebug] ${message}`);
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const testTokenGeneration = async () => {
    addLog('🔧 Тестирование генерации токена...');
    
    try {
      const testParams = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: 100000, // 1000 рублей в копейках
        OrderId: 'debug-test-' + Date.now(),
        Description: 'Debug test payment'
      };

      addLog(`📝 Параметры: ${JSON.stringify(testParams, null, 2)}`);
      
      const tokenParams = TokenGenerator.prepareTokenParams(testParams);
      addLog(`🔑 Параметры для токена: ${JSON.stringify(tokenParams, null, 2)}`);
      
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);
      addLog(`✅ Токен сгенерирован: ${token}`);
      
      return token;
    } catch (error) {
      addLog(`❌ Ошибка генерации токена: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  };

  const testApiCall = async () => {
    addLog('🌐 Тестирование API вызова...');
    setIsLoading(true);
    
    try {
      const orderId = PaymentService.generateOrderId('debug');
      addLog(`📋 Сгенерирован OrderId: ${orderId}`);
      
      const paymentData = {
        amount: 1000,
        orderId,
        description: 'Debug test payment',
        customerKey: 'debug-customer-' + Date.now()
      };
      
      addLog(`📤 Отправляем запрос: ${JSON.stringify(paymentData, null, 2)}`);
      
      const result = await PaymentService.initPayment(paymentData);
      
      addLog(`📥 Получен ответ: ${JSON.stringify(result, null, 2)}`);
      
      if (result.success && result.paymentUrl) {
        addLog(`✅ Платеж инициализирован успешно!`);
        addLog(`🔗 URL для оплаты: ${result.paymentUrl}`);
      } else {
        addLog(`❌ Ошибка инициализации: ${result.message}`);
      }
      
      return result;
    } catch (error) {
      addLog(`❌ Ошибка API: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const testFullFlow = async () => {
    addLog('🚀 Запуск полного теста...');
    clearLogs();
    
    try {
      await testTokenGeneration();
      await new Promise(resolve => setTimeout(resolve, 1000)); // Пауза для читаемости
      const result = await testApiCall();
      
      if (result.success && result.paymentUrl) {
        addLog('🎉 Полный тест прошел успешно!');
        addLog('💡 Можно попробовать открыть платежную форму...');
        
        // Предлагаем открыть платежную форму
        if (window.confirm('Хотите открыть платежную форму для тестирования?')) {
          window.open(result.paymentUrl, '_blank');
        }
      }
    } catch (error) {
      addLog('💥 Полный тест завершился с ошибкой');
    }
  };

  const testDirectPayment = async () => {
    addLog('💳 Тестирование прямого платежа...');
    setIsLoading(true);
    
    try {
      // Создаем тестовые данные
      const orderId = 'direct-test-' + Date.now();
      const amount = 100000; // 1000 рублей в копейках
      
      // Подготавливаем запрос
      const requestData = {
        TerminalKey: tinkoffConfig.terminalKey,
        Amount: amount,
        OrderId: orderId,
        Description: 'Direct test payment'
      };
      
      // Генерируем токен
      const tokenParams = TokenGenerator.prepareTokenParams(requestData);
      const token = await TokenGenerator.generateToken(tokenParams, tinkoffConfig.password);
      
      const fullRequest = {
        ...requestData,
        Token: token
      };
      
      addLog(`📤 Прямой запрос к API: ${JSON.stringify(fullRequest, null, 2)}`);
      
      // Отправляем запрос напрямую
      const response = await fetch(`${tinkoffConfig.apiUrl}Init`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(fullRequest)
      });
      
      addLog(`📡 HTTP статус: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      addLog(`📥 Прямой ответ API: ${JSON.stringify(data, null, 2)}`);
      
      if (data.Success) {
        addLog('✅ Прямой вызов API успешен!');
        if (data.PaymentURL) {
          addLog(`🔗 URL для оплаты: ${data.PaymentURL}`);
        }
      } else {
        addLog(`❌ API вернул ошибку: ${data.Message || data.Details}`);
      }
      
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        addLog('🚫 CORS ошибка - это нормально для тестовой среды');
        addLog('💡 В продакшене запросы должны идти через backend');
      } else {
        addLog(`❌ Ошибка прямого вызова: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    addLog('🔧 Компонент отладки загружен');
    addLog(`🏪 Terminal Key: ${tinkoffConfig.terminalKey}`);
    addLog(`🌐 API URL: ${tinkoffConfig.apiUrl}`);
    addLog(`🔐 Password: ${tinkoffConfig.password ? '***установлен***' : '❌НЕ УСТАНОВЛЕН❌'}`);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      padding: '2rem',
      color: '#f1f5f9',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
          🔍 Отладка платежей Tinkoff
        </h1>

        {/* Кнопки управления */}
        <div style={{ 
          display: 'flex', 
          gap: '1rem', 
          marginBottom: '2rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <button
            onClick={testTokenGeneration}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            🔑 Тест токена
          </button>
          
          <button
            onClick={testApiCall}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            🌐 Тест API
          </button>
          
          <button
            onClick={testDirectPayment}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#f59e0b',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            💳 Прямой вызов
          </button>
          
          <button
            onClick={testFullFlow}
            disabled={isLoading}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#8b5cf6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.6 : 1
            }}
          >
            🚀 Полный тест
          </button>
          
          <button
            onClick={clearLogs}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            🗑️ Очистить
          </button>
        </div>

        {/* Логи */}
        <div style={{ 
          background: 'rgba(0, 0, 0, 0.4)', 
          padding: '1.5rem', 
          borderRadius: '1rem',
          minHeight: '400px',
          maxHeight: '600px',
          overflowY: 'auto'
        }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', color: '#fbbf24' }}>
            📋 Логи отладки {isLoading && '(выполняется...)'}
          </h2>
          
          {logs.length === 0 ? (
            <div style={{ color: '#9ca3af', fontStyle: 'italic' }}>
              Нажмите на любую кнопку для начала тестирования...
            </div>
          ) : (
            <div style={{
              fontFamily: 'monospace',
              fontSize: '0.85rem',
              lineHeight: '1.4'
            }}>
              {logs.map((log, index) => (
                <div key={index} style={{ 
                  marginBottom: '0.5rem',
                  padding: '0.25rem 0',
                  borderBottom: index < logs.length - 1 ? '1px solid rgba(255,255,255,0.1)' : 'none'
                }}>
                  {log}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Инструкции */}
        <div style={{ 
          background: 'rgba(59, 130, 246, 0.1)', 
          border: '1px solid rgba(59, 130, 246, 0.3)',
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          marginTop: '2rem',
          fontSize: '0.9rem'
        }}>
          <strong>💡 Инструкции по отладке:</strong>
          <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
            <li><strong>Тест токена:</strong> Проверяет корректность генерации SHA-256 токена</li>
            <li><strong>Тест API:</strong> Проверяет работу PaymentService с обработкой CORS</li>
            <li><strong>Прямой вызов:</strong> Отправляет запрос напрямую к Tinkoff API</li>
            <li><strong>Полный тест:</strong> Выполняет все тесты последовательно</li>
            <li><strong>Консоль браузера:</strong> Откройте F12 для дополнительных логов</li>
          </ul>
        </div>
      </div>
    </div>
  );
};