import React from 'react';
import { PaymentButtonSimple } from '@/components/PaymentButtonSimple/PaymentButtonSimple';

export const PaymentTestQuick: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      padding: '2rem',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '2rem', textAlign: 'center' }}>
        🚀 Быстрый тест платежей
      </h1>

      <div style={{ 
        display: 'flex', 
        gap: '2rem', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        maxWidth: '600px'
      }}>
        <PaymentButtonSimple
          amount={1000}
          description="Тестовый платеж 1000 рублей"
          className="payment-btn payment-btn--primary"
          type="payment"
        >
          💳 Оплатить 1000 ₽
        </PaymentButtonSimple>
        
        <PaymentButtonSimple
          amount={1000}
          description="Тестовая рассрочка 1000 рублей"
          className="payment-btn payment-btn--secondary"
          type="installment"
        >
          📅 Рассрочка 1000 ₽
        </PaymentButtonSimple>

        <PaymentButtonSimple
          amount={50000}
          description="Услуги по реализации автоматизированных программных решений"
          className="payment-btn payment-btn--gold"
          type="payment"
        >
          ⭐ Премиум 50000 ₽
        </PaymentButtonSimple>
      </div>

      <div style={{ 
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '1rem',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>📋 Инструкции:</h3>
        <ul style={{ textAlign: 'left', lineHeight: '1.6' }}>
          <li>Нажмите любую кнопку для тестирования</li>
          <li>Откроется новое окно с формой Tinkoff</li>
          <li>Используйте тестовую карту: <code>4300000000000777</code></li>
          <li>CVV: любой трехзначный код</li>
          <li>Срок: любая будущая дата</li>
        </ul>
      </div>

      <style>{`
        .payment-btn {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1.1rem;
          min-width: 180px;
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

        .payment-btn--gold {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
        }
        
        .payment-btn--gold:hover {
          background: linear-gradient(135deg, #FFED4E, #FFB84D);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
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