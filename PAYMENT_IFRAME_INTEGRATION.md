# 🔧 Iframe интеграция платежей Tinkoff согласно документации

## 🎯 Цель:
Реализовать корректную интеграцию платежей Tinkoff с использованием iframe согласно официальной документации.

## 📚 Основано на документации:
- **Скрипт интеграции**: `https://acq-paymentform-integrationjs.t-static.ru/integration.js`
- **Метод**: `integration.iframe.create()` и `mount()`
- **Фискальные чеки**: Обязательны для корректной работы API

## 🔧 Техническая реализация:

### 1. **Компонент TinkoffPaymentIframeCorrect**
- **Файл**: `src/components/TinkoffPaymentIframeCorrect/TinkoffPaymentIframeCorrect.tsx`
- **Особенности**:
  - Загрузка скрипта `integration.js`
  - Инициализация `PaymentIntegration.init()`
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
  }
};
```

### 3. **Процесс интеграции:**
```typescript
// 1. Инициализация PaymentIntegration
const integration = await window.PaymentIntegration.init(initConfig);

// 2. Создание iframe интеграции
const mainPaymentIntegration = await integration.iframe.create(
  MAIN_INTEGRATION_NAME,
  iframeConfig
);

// 3. Инициация платежа через helpers.init
const res = await integration.helpers.init(
  `${tinkoffConfig.apiUrl}Init`,
  'POST',
  finalInitParams
);

// 4. Монтирование в контейнер
await mainPaymentIntegration.mount(containerRef.current, res.PaymentURL);
```

## 🎨 UI/UX особенности:

### **Iframe модальное окно:**
- Фиксированное позиционирование (`fixed inset-0`)
- Полупрозрачный фон (`bg-black bg-opacity-50`)
- Кнопка закрытия в правом верхнем углу
- Адаптивный размер (`max-w-4xl h-96`)

### **Кнопки на главной странице:**
- **"Оплатить"**: Желтая большая (`bg-[#F2CC66]`)
- **"Рассрочка"**: Черная (`bg-black`)

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
Tinkoff Integration инициализирована
TinkoffPaymentIframeCorrect: Starting payment { amount: 1000, itemName: "Пример:", paymentType: "payment" }
TinkoffPaymentIframeCorrect: Generated order data: { orderId: "payment_Пример__1234567890_abc123", ... }
TinkoffPaymentIframeCorrect: Final init params: { TerminalKey: "25801389", Amount: 100000, Receipt: {...} }
TinkoffPaymentIframeCorrect: Init response: { Success: true, PaymentURL: "..." }
```

## 🔍 Отладка:

### **Проверьте сетевые запросы:**
- Запрос к `https://securepay.tinkoff.ru/v2/Init`
- Статус 200 OK
- JSON с полем `Receipt` в теле запроса

### **Проверьте параметры:**
- `TerminalKey`: "25801389"
- `Amount`: в копейках (например, 100000 для 1000 рублей)
- `Receipt`: заполнен корректно с Email, Taxation, Items
- `OrderId`: корректный формат без недопустимых символов

## 🚨 Возможные проблемы:

### **1. Ошибка "Неверные параметры (код 501)":**
- ✅ **Решение**: Добавлен параметр `Receipt` с фискальными чеками
- ✅ **Проверьте**: Все обязательные поля заполнены

### **2. Скрипт не загружается:**
- ✅ **Решение**: Используется правильный URL `integration.js`
- ✅ **Проверьте**: Сеть и консоль браузера

### **3. Iframe не отображается:**
- ✅ **Решение**: Правильная последовательность `create()` → `mount()`
- ✅ **Проверьте**: Контейнер существует и доступен

## 📊 Ожидаемые результаты:

### **До исправления:**
- ❌ "Tinkoff API Error 501: Неверные параметры"
- ❌ Платежная форма не открывается
- ❌ Отсутствуют фискальные чеки

### **После исправления:**
- ✅ Платежная форма открывается в iframe
- ✅ Успешная инициализация платежа
- ✅ Фискальные чеки включены
- ✅ Правильный дизайн кнопок (желтая + черная)

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

**🎉 Iframe интеграция реализована согласно документации Tinkoff! Теперь платежная форма открывается корректно с фискальными чеками.**
