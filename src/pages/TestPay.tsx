import { useEffect } from 'react';

const TestPay = () => {
  useEffect(() => {
    // Подключаем скрипт Т-Банка
    const script = document.createElement('script');
    script.src = 'https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js';
    script.async = true;
    document.head.appendChild(script);

    return () => {
      // Убираем скрипт при размонтировании компонента
      const existingScript = document.querySelector('script[src="https://securepay.tinkoff.ru/html/payForm/js/tinkoff_v2.js"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Платежи с чеком
          </h1>
          <p className="text-gray-600 text-sm">
            Страница для проведения платежей через Т-Банк с формированием фискального чека
          </p>
        </div>

        <style dangerouslySetInnerHTML={{
          __html: `
            .payform-tbank {
              display: -webkit-box;
              display: -ms-flexbox;
              display: flex;
              margin: 2px auto;
              -webkit-box-orient: vertical;
              -webkit-box-direction: normal;
              -ms-flex-direction: column;
              flex-direction: column;
              max-width: 100%;
            }
            .payform-tbank-row {
              margin: 8px 0;
              border-radius: 8px;
              -webkit-box-flex: 1;
              -ms-flex: 1;
              flex: 1;
              -webkit-transition: 0.3s;
              -o-transition: 0.3s;
              transition: 0.3s;
              border: 1px solid #E5E7EB;
              padding: 16px;
              outline: none;
              background-color: #F9FAFB;
              font-size: 16px;
              font-family: inherit;
            }
            .payform-tbank-row:focus {
              background-color: #FFFFFF;
              border: 1px solid #3B82F6;
              border-radius: 8px;
              box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            .payform-tbank-btn {
              background-color: #FBC520;
              border: 1px solid #FBC520;
              color: #3C2C0B;
              font-weight: 600;
              cursor: pointer;
              margin-top: 16px;
            }
            .payform-tbank-btn:hover {
              background-color: #FAB619;
              border: 1px solid #FAB619;
              transform: translateY(-1px);
              box-shadow: 0 4px 8px rgba(251, 197, 32, 0.3);
            }
            .payform-tbank-btn:active {
              transform: translateY(0);
            }
          `
        }} />

        <form 
          className="payform-tbank" 
          name="payform-tbank" 
          id="payform-tbank"
          onSubmit={(e) => {
            e.preventDefault();
            const form = e.target as HTMLFormElement;
            const formData = new FormData(form);
            
            const email = formData.get('email') as string;
            const phone = formData.get('phone') as string;
            const amount = formData.get('amount') as string;
            const description = formData.get('description') as string;
            
            // Проверяем наличие email или phone для чека
            if (!email && !phone) {
              alert("Поле E-mail или Phone не должно быть пустым");
              return false;
            }

            // Формируем объект Receipt
            const receiptObj: any = {
              "EmailCompany": "info@texex.ru",
              "Taxation": "patent",
              "FfdVersion": "1.2",
              "Items": [
                {
                  "Name": description || "Оплата",
                  "Price": Math.round(parseFloat(amount) * 100),
                  "Quantity": 1.00,
                  "Amount": Math.round(parseFloat(amount) * 100),
                  "PaymentMethod": "full_prepayment",
                  "PaymentObject": "service",
                  "Tax": "none",
                  "MeasurementUnit": "pc"
                }
              ]
            };
            
            // Добавляем Email и Phone если они заполнены
            if (email) {
              receiptObj.Email = email;
            }
            if (phone) {
              receiptObj.Phone = phone;
            }
            
            // Устанавливаем значение receipt
            const receiptInput = form.querySelector('input[name="receipt"]') as HTMLInputElement;
            if (receiptInput) {
              receiptInput.value = JSON.stringify(receiptObj);
            }
            
            // Вызываем функцию pay
            if (window.pay) {
              console.log('Receipt object:', receiptObj);
              console.log('Calling pay() function with form');
              window.pay(form);
            } else {
              alert('Скрипт Т-Банка еще загружается. Попробуйте через несколько секунд.');
            }
            
            return false;
          }}
        >
          {/* Скрытые поля конфигурации */}
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            name="terminalkey" 
            value="1754995728217" 
          />
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            name="frame" 
            value="false" 
          />
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            name="language" 
            value="ru" 
          />
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            name="receipt" 
            value="" 
          />
          
          {/* Видимые поля формы */}
          <input 
            className="payform-tbank-row" 
            type="number" 
            placeholder="Сумма заказа (в рублях)" 
            name="amount" 
            required 
            min="1"
            step="0.01"
          />
          
          <input 
            className="payform-tbank-row" 
            type="hidden" 
            placeholder="Номер заказа" 
            name="order" 
          />
          
          <input 
            className="payform-tbank-row" 
            type="text" 
            placeholder="Описание заказа" 
            name="description"
            defaultValue="Оплата услуг" 
          />
          
          <input 
            className="payform-tbank-row" 
            type="text" 
            placeholder="ФИО плательщика" 
            name="name" 
          />
          
          <input 
            className="payform-tbank-row" 
            type="email" 
            placeholder="E-mail (для чека)" 
            name="email"
          />
          
          <input 
            className="payform-tbank-row" 
            type="tel" 
            placeholder="Контактный телефон (для чека)" 
            name="phone" 
          />
          
          <input 
            className="payform-tbank-row payform-tbank-btn" 
            type="submit" 
            value="Оплатить" 
          />
        </form>

        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-sm font-semibold text-green-800 mb-2">
            Данные терминала:
          </h3>
          <div className="text-xs text-green-700 space-y-1">
            <div><strong>Терминал:</strong> 1754995728217</div>
            <div><strong>Пароль:</strong> Ut8FxLDYq2t3563u</div>
            <div><strong>Подключение:</strong> Универсальное</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-800 mb-2">
            Настройки чека:
          </h3>
          <div className="text-xs text-blue-700 space-y-1">
            <div><strong>Налогообложение:</strong> Патентная система</div>
            <div><strong>Предмет расчета:</strong> Услуга</div>
            <div><strong>Способ расчета:</strong> Предоплата 100%</div>
            <div><strong>НДС:</strong> Без НДС</div>
            <div><strong>Email продавца:</strong> info@texex.ru</div>
            <div><strong>Версия ФФД:</strong> 1.2</div>
          </div>
        </div>

        <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <h3 className="text-sm font-semibold text-amber-800 mb-2">
            ⚠️ Внимание:
          </h3>
          <div className="text-xs text-amber-700 space-y-1">
            <div>Используется рабочий терминал</div>
            <div>Платежи будут реальными!</div>
            <div>Убедитесь в корректности суммы перед оплатой</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestPay;
