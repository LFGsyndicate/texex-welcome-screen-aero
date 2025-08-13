# 🔧 Официальная интеграция платежей Tinkoff согласно документации

## 🎯 Цель:
Реализовать корректную интеграцию платежей Tinkoff согласно официальной документации Integration.js.

## 📚 Основано на официальной документации:
- **Скрипт интеграции**: `https://acq-paymentform-integrationjs.t-static.ru/integration.js`
- **Метод**: `PaymentIntegration.init()` с `paymentStartCallback`
- **Фискальные чеки**: Обязательны для корректной работы API
- **connection_type**: `Widget` для корректной работы виджета

## 🔧 Техническая реализация:

### 1. **Компонент TinkoffPaymentOfficial**
- **Файл**: `src/components/TinkoffPaymentOfficial/TinkoffPaymentOfficial.tsx`
- **Особенности**:
  - Загрузка скрипта `integration.js` согласно документации
  - Инициализация `PaymentIntegration.init(initConfig)`
  - Использование `paymentStartCallback` для инициации платежа
  - Создание iframe интеграции через `integration.iframe.create()`
  - Монтирование через `mainPaymentIntegration.mount()`

### 2. **Ключевые параметры API:**
```typescript
const initParams = {
  TerminalKey: tinkoffConfig.terminalKey,
  Amount: amountInKopecks,
  OrderId: orderId,
  Description: description,
  SuccessURL: tinkoffConfig.successUrl,
  FailURL: tinkoffConfig.failUrl,
  Language: 'ru',
  CustomerKey: `customer_${Date.now()}`,
  // Фискальные чеки - обязательны для корректной работы
  Receipt: {
    Email: 'customer@example.com',
    Taxation: 'usn_income',
    Items: [
      {
        Name: description,
        Price: amountInKopecks,
        Quantity: 1.00,
        Amount: amountInKopecks,
        Tax: 'none'
      }
    ]
  },
  // Обязательно для корректной работы виджета
  DATA: {
    connection_type: 'Widget'
  }
};
```

### 3. **Процесс интеграции согласно документации:**
```typescript
// 1. Конфигурация с paymentStartCallback
const initConfig = {
  terminalKey: tinkoffConfig.terminalKey,
  product: 'eacq',
  features: {
    iframe: {
      container: containerRef.current,
      paymentStartCallback: async () => {
        // Вызов helpers.init для инициации платежа
        const res = await integrationRef.current.helpers.init(
          `${tinkoffConfig.apiUrl}Init`,
          'POST',
          initParams
        );
        return res.PaymentURL;
      }
    }
  }
};

// 2. Инициализация PaymentIntegration
const integration = await window.PaymentIntegration.init(initConfig);

// 3. Создание iframe интеграции
const mainPaymentIntegration = await integration.iframe.create(
  MAIN_INTEGRATION_NAME,
  iframeConfig
);

// 4. Монтирование в контейнер
await mainPaymentIntegration.mount(containerRef.current);
```

## 🎨 UI/UX особенности:

### **Iframe модальное окно:**
- Фиксированное позиционирование (`fixed inset-0`)
- Полупрозрачный фон (`bg-black bg-opacity-50`)
- Кнопка закрытия в правом верхнем углу
- Адаптивный размер (`max-w-4xl h-96`)

### **Кнопки на главной странице:**
- **"Оплатить"**: Желтая большая (`bg-[#F2CC66]`)
- **"Рассрочка"**: Убрана (как требовалось)

## 🧪 Тестирование:

### **1. Перезапустите проект:**
```bash
npm run dev
```

### **2. Главная страница:**
```
http://localhost:8080
```

### **3. Тестовая страница:**
```
http://localhost:8080/payment/test
```

### **4. Проверьте консоль браузера:**
Должны увидеть логи:
```
Tinkoff Integration инициализирована согласно документации
TinkoffPaymentOfficial: Starting payment { amount: 1000, itemName: "Пример:", paymentType: "payment" }
TinkoffPaymentOfficial: Generated order data: { orderId: "payment_Пример__1234567890_abc123", ... }
TinkoffPaymentOfficial: Init params: { TerminalKey: "25801389", Amount: 100000, Receipt: {...}, DATA: {...} }
TinkoffPaymentOfficial: Init response: { Success: true, PaymentURL: "..." }
```

## 🔍 Отладка:

### **Проверьте сетевые запросы:**
- Запрос к `https://securepay.tinkoff.ru/v2/Init`
- Статус 200 OK
- JSON с полями `Receipt` и `DATA.connection_type: 'Widget'`

### **Проверьте параметры:**
- `TerminalKey`: "25801389"
- `Amount`: в копейках (например, 100000 для 1000 рублей)
- `Receipt`: заполнен корректно с Email, Taxation, Items
- `DATA.connection_type`: "Widget"
- `OrderId`: корректный формат без недопустимых символов

## 🚨 Возможные проблемы:

### **1. Ошибка "Cannot read properties of undefined (reading 'init')":**
- ✅ **Решение**: Используется правильный скрипт `integration.js` и `PaymentIntegration.init()`
- ✅ **Проверьте**: Скрипт загружается и `window.PaymentIntegration` доступен

### **2. Ошибка "501: Неверные параметры":**
- ✅ **Решение**: Добавлен параметр `Receipt` с фискальными чеками
- ✅ **Решение**: Добавлен `DATA.connection_type: 'Widget'`
- ✅ **Проверьте**: Все обязательные поля заполнены

### **3. Iframe не отображается:**
- ✅ **Решение**: Правильная последовательность `create()` → `mount()`
- ✅ **Проверьте**: Контейнер существует и доступен

## 📊 Ожидаемые результаты:

### **До исправления:**
- ❌ "Cannot read properties of undefined (reading 'init')"
- ❌ "Скрипт Tinkoff не загружен"
- ❌ "Tinkoff API Error 501: Неверные параметры"
- ❌ Iframe не работает

### **После исправления:**
- ✅ Платежная форма открывается в iframe
- ✅ Успешная инициализация платежа
- ✅ Фискальные чеки включены
- ✅ Правильный дизайн кнопок (только желтая "Оплатить")
- ✅ Интеграция согласно официальной документации

## 🎯 Следующие шаги:

1. **Протестируйте все кнопки оплаты**
2. **Проверьте работу iframe в разных браузерах**
3. **Убедитесь в корректности платежной формы**
4. **Проверьте обработку статусов платежа**

## 📞 Поддержка:

При возникновении проблем:
- **Проверьте консоль браузера**
- **Запустите тесты на странице `/payment/test`**
- **Обратитесь в поддержку**: https://t.me/ruhunt

---

**🎉 Официальная интеграция реализована согласно документации Tinkoff! Теперь платежная форма открывается корректно в iframe с фискальными чеками и правильной конфигурацией.**
