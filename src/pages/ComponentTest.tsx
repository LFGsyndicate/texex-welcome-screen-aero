import React, { useState } from 'react';
import { TinkoffPayment } from '../components/TinkoffPayment/TinkoffPayment';
import { TinkoffIframe } from '../components/TinkoffIframe/TinkoffIframe';

const ComponentTest = () => {
  const [showIframe, setShowIframe] = useState(false);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Тест компонентов Tinkoff</h1>
      
      <div style={{ marginBottom: '2rem' }}>
        <h2>TinkoffPayment компонент:</h2>
        <TinkoffPayment
          terminalKey="TestTerminalKey"
          amount={100}
          orderId={`order-${Date.now()}`}
          description="Тестовый платеж"
          onSuccess={() => alert('Платеж успешен!')}
          onError={(error) => alert(`Ошибка: ${error}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Оплатить 100 рублей
        </TinkoffPayment>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h2>TinkoffIframe компонент:</h2>
        <button
          onClick={() => setShowIframe(true)}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Открыть iframe платеж
        </button>
        
        <TinkoffIframe
          terminalKey="TestTerminalKey"
          amount={200}
          orderId={`iframe-order-${Date.now()}`}
          description="Тестовый iframe платеж"
          isOpen={showIframe}
          onClose={() => setShowIframe(false)}
          onSuccess={() => {
            alert('Iframe платеж успешен!');
            setShowIframe(false);
          }}
          onError={(error) => {
            alert(`Iframe ошибка: ${error}`);
            setShowIframe(false);
          }}
        />
      </div>
    </div>
  );
};

export default ComponentTest;