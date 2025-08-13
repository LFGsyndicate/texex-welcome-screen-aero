import React from 'react';
import { PaymentButtonSimple } from '@/components/PaymentButtonSimple/PaymentButtonSimple';

export const PaymentOnly: React.FC = () => {
  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
      color: '#f1f5f9',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center' }}>
        🚀 Тест платежей Tinkoff
      </h1>

      <div style={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '2rem',
        maxWidth: '800px',
        width: '100%'
      }}>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Тест 1000 ₽</h3>
          <PaymentButtonSimple
            amount={1000}
            description="Тестовый платеж 1000 рублей"
            className="btn-gold"
            type="payment"
          >
            Оплатить 1000 ₽
          </PaymentButtonSimple>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Рассрочка 1000 ₽</h3>
          <PaymentButtonSimple
            amount={1000}
            description="Тестовая рассрочка 1000 рублей"
            className="btn-black"
            type="installment"
          >
            Рассрочка 1000 ₽
          </PaymentButtonSimple>
        </div>

        <div style={{ 
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '2rem',
          borderRadius: '1rem',
          textAlign: 'center'
        }}>
          <h3 style={{ marginBottom: '1rem' }}>Премиум 50000 ₽</h3>
          <PaymentButtonSimple
            amount={50000}
            description="Услуги по реализации автоматизированных программных решений"
            className="btn-premium"
            type="payment"
          >
            Премиум 50000 ₽
          </PaymentButtonSimple>
        </div>
      </div>

      <div style={{ 
        marginTop: '3rem',
        padding: '1.5rem',
        background: 'rgba(59, 130, 246, 0.1)',
        borderRadius: '1rem',
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <h3 style={{ marginBottom: '1rem' }}>📋 Тестовые данные:</h3>
        <p><strong>Карта:</strong> 4300000000000777</p>
        <p><strong>CVV:</strong> любой трехзначный</p>
        <p><strong>Срок:</strong> любая будущая дата</p>
      </div>

      <style>{`
        .btn-gold, .btn-black, .btn-premium {
          padding: 1rem 2rem;
          border: none;
          border-radius: 0.75rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 1rem;
          width: 100%;
        }
        
        .btn-gold {
          background: #F2CC66;
          color: #000;
        }
        
        .btn-gold:hover {
          background: #F5D77F;
          transform: translateY(-2px);
        }
        
        .btn-black {
          background: #000;
          color: white;
        }
        
        .btn-black:hover {
          background: #333;
          transform: translateY(-2px);
        }

        .btn-premium {
          background: linear-gradient(135deg, #FFD700, #FFA500);
          color: #000;
        }
        
        .btn-premium:hover {
          background: linear-gradient(135deg, #FFED4E, #FFB84D);
          transform: translateY(-2px);
        }
        
        .btn-gold:disabled, .btn-black:disabled, .btn-premium:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none;
        }
      `}</style>
    </div>
  );
};