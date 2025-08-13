import React from 'react';
import { TinkoffPaymentCorrect } from '@/components/TinkoffPaymentCorrect/TinkoffPaymentCorrect';
import { PaymentButton } from '@/components/PaymentButton/PaymentButton';

const TestPayment: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-blue via-primary-blue to-dark-blue flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="liquid-surface rounded-2xl p-8 text-center border border-gold/30">
          {/* Заголовок */}
          <h1 className="text-3xl font-bold text-light-cream mb-6">
            Тестовая страница платежей
          </h1>
          
          {/* Описание */}
          <p className="text-light-cream/80 mb-8 text-lg">
            Тестирование платежной системы Tinkoff
          </p>
          
          {/* Информация о платеже */}
          <div className="bg-black/20 rounded-lg p-4 mb-6">
            <div className="text-light-cream/90 mb-2">Сумма к оплате:</div>
            <div className="text-2xl font-bold text-gold">5 ₽</div>
            <div className="text-sm text-light-cream/70 mt-1">Тестовый платеж</div>
          </div>
          
          {/* Кнопка оплаты */}
          <TinkoffPaymentCorrect
            amount={5}
            itemName="Тестовый платеж"
            paymentType="payment"
            className="w-full rounded-lg font-bold text-black bg-[#F2CC66] hover:bg-[#F5D77F] text-center flex items-center justify-center py-3 text-lg"
            onSuccess={() => console.log('Test payment successful')}
            onError={(error) => console.error('Test payment error:', error)}
          >
            Оплатить 5 ₽
          </TinkoffPaymentCorrect>
          
          {/* Кнопка рассрочки */}
          <PaymentButton
            service={{
              packageId: 'test-01',
              packageName: 'Тестовый платеж',
              price: 5
            }}
            paymentType="installment"
            className="w-full text-xs py-2 h-auto rounded-md bg-black text-white hover:bg-black/90 text-center flex items-center justify-center mt-3"
            onPaymentStart={() => console.log('Test installment started for: Тестовый платеж')}
            onError={(error) => console.error('Test installment error:', error)}
          >
            Рассрочка
          </PaymentButton>
          

          
          {/* Ссылка на главную */}
          <div className="mt-6">
            <a 
              href="/"
              className="text-light-cream/70 hover:text-light-cream text-sm underline"
            >
              Вернуться на главную
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPayment;
