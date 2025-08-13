import React, { useState } from 'react';
import { PaymentButtonSimple } from '@/components/PaymentButtonSimple/PaymentButtonSimple';

const IndexSimple: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');

  const testServices = [
    {
      id: 'ai-content',
      name: 'AI-Мастер Контента',
      price: 90000,
      description: 'Автоматизация создания контента для SMM'
    },
    {
      id: 'ai-assistant',
      name: 'AI-Ассистент',
      price: 120000,
      description: 'Умный помощник для клиентского сервиса'
    },
    {
      id: 'ai-analytics',
      name: 'AI-Аналитика',
      price: 150000,
      description: 'Анализ данных и прогнозирование'
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0D19A3 0%, #080F5B 100%)',
      color: '#F4E4C1',
      padding: '2rem'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: 'bold' }}>
          TEXEX AI Solutions
        </h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
          Готовые AI-решения для вашего бизнеса
        </p>
      </header>

      {/* Services Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {testServices.map((service) => (
          <div
            key={service.id}
            style={{
              background: 'rgba(244, 228, 193, 0.08)',
              backdropFilter: 'blur(20px)',
              borderRadius: '20px',
              border: '1px solid rgba(244, 228, 193, 0.15)',
              padding: '2rem',
              transition: 'all 0.3s ease'
            }}
          >
            <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>
              {service.name}
            </h3>
            <p style={{ marginBottom: '1.5rem', opacity: 0.9 }}>
              {service.description}
            </p>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1.5rem', color: '#15D895' }}>
              {service.price.toLocaleString('ru-RU')} ₽
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <PaymentButtonSimple
                amount={service.price}
                description={`Услуги по реализации автоматизированных программных решений: ${service.name}`}
                className="payment-btn payment-btn--primary"
                type="payment"
              >
                💳 Оплатить
              </PaymentButtonSimple>
              
              <PaymentButtonSimple
                amount={service.price}
                description={`Услуги по реализации автоматизированных программных решений: ${service.name} (рассрочка)`}
                className="payment-btn payment-btn--secondary"
                type="installment"
              >
                📅 Рассрочка
              </PaymentButtonSimple>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '4rem', opacity: 0.7 }}>
        <p>© 2024 TEXEX. Все права защищены.</p>
        <div style={{ marginTop: '1rem' }}>
          <a href="/payment/quick" style={{ color: '#15D895', marginRight: '2rem' }}>
            Быстрый тест
          </a>
          <a href="/payment/debug" style={{ color: '#15D895' }}>
            Отладка
          </a>
        </div>
      </footer>

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
      `}</style>
    </div>
  );
};

export default IndexSimple;