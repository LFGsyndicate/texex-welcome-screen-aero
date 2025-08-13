# Интеграция с платежной системой Tinkoff

## Обзор

Данная документация описывает полную интеграцию с платежной системой Tinkoff для витрины AI-решений TEXEX AI. Интеграция включает в себя безопасную обработку платежей, генерацию токенов, обработку ошибок и пользовательский интерфейс.

## Архитектура

### Основные компоненты

1. **PaymentService** - Сервис для работы с API Tinkoff
2. **PaymentButton** - React компонент кнопки оплаты
3. **PaymentModal** - Модальное окно процесса оплаты
4. **TokenGenerator** - Утилита для генерации токенов безопасности
5. **PaymentErrorHandler** - Система обработки ошибок
6. **RetryLogic** - Логика повторных попыток

### Поток данных

```
Пользователь нажимает кнопку → PaymentButton → PaymentService → Tinkoff API → Платежная форма
```

## Установка и настройка

### 1. Переменные окружения

Создайте файл `.env` в корне проекта:

```env
REACT_APP_TINKOFF_PASSWORD=Ut8FxLDYq2t3563u
```

### 2. Конфигурация

Конфигурация находится в `src/config/tinkoff.config.ts`:

```typescript
export const tinkoffConfig: TinkoffConfig = {
  terminalKey: '25801389',
  merchantId: '200000001673251',
  password: process.env.REACT_APP_TINKOFF_PASSWORD || 'Ut8FxLDYq2t3563u',
  apiUrl: 'https://securepay.tinkoff.ru/v2/',
  successUrl: '/payment/success',
  failUrl: '/payment/error'
};
```

## Использование

### Базовое использование

```tsx
import { PaymentButton } from '@/components/PaymentButton';

const service = {
  packageId: 'ai-service-1',
  packageName: 'AI-Копирайтер',
  price: 60000,
  description: 'Услуги по реализации автоматизированных программных решений'
};

<PaymentButton
  service={service}
  paymentType="payment"
  onPaymentStart={() => console.log('Payment started')}
  onPaymentError={(error) => console.error('Payment error:', error)}
/>
```

### Рассрочка

```tsx
<PaymentButton
  service={service}
  paymentType="installment"
  onPaymentStart={() => console.log('Installment started')}
  onPaymentError={(error) => console.error('Installment error:', error)}
/>
```

## API Reference

### PaymentService

#### `initPayment(paymentData: PaymentInitData): Promise<PaymentInitResponse>`

Инициализирует платеж через Tinkoff API.

**Параметры:**
- `paymentData.amount` - Сумма в рублях
- `paymentData.orderId` - Уникальный ID заказа
- `paymentData.description` - Описание платежа
- `paymentData.customerKey` - ID клиента (опционально)

**Возвращает:**
```typescript
{
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  errorCode?: string;
  message?: string;
}
```

#### `generateOrderId(prefix?: string): string`

Генерирует уникальный ID заказа.

### TokenGenerator

#### `generateToken(params: TokenParams, password: string): string`

Генерирует SHA-256 токен для запроса к Tinkoff API согласно документации.

### PaymentErrorHandler

#### `handleError(error: unknown): PaymentError`

Обрабатывает ошибки и возвращает пользовательское сообщение.

## Обработка ошибок

### Типы ошибок

1. **Сетевые ошибки** - Проблемы с подключением
2. **Ошибки валидации** - Некорректные данные
3. **Ошибки API** - Ошибки от Tinkoff
4. **Ошибки браузера** - Блокировка всплывающих окон

### Retry логика

Система автоматически повторяет запросы при сетевых ошибках:

```typescript
import { paymentRetry } from '@/utils/retryLogic';

const result = await paymentRetry(() => PaymentService.initPayment(data));
```

## Безопасность

### Генерация токенов

Токены генерируются согласно документации Tinkoff:
1. Параметры сортируются по алфавиту
2. Добавляется пароль терминала
3. Значения конкатенируются
4. Вычисляется SHA-256 хеш

### Защита данных

- Пароль хранится в переменных окружения
- Чувствительные данные не логируются
- Используется HTTPS для всех запросов
- Валидация входящих данных

## Тестирование

### Unit тесты

```bash
npm test
```

### Интеграционные тесты

```bash
npm test -- --testPathPattern=paymentIntegration
```

### Тестовая страница

Перейдите на `/payment/test` для интерактивного тестирования.

## Мониторинг и логирование

### Логирование ошибок

Все ошибки логируются с подробной информацией:

```typescript
PaymentErrorHandler.logError(error, {
  orderId: 'order_123',
  amount: 1000,
  timestamp: new Date().toISOString()
});
```

### Метрики

Рекомендуется отслеживать:
- Успешность платежей
- Время инициализации
- Частота ошибок
- Конверсия по типам платежей

## Производительность

### Оптимизации

1. **Lazy loading** - Компоненты загружаются по требованию
2. **Retry с backoff** - Экспоненциальная задержка между попытками
3. **Таймауты** - 10 секунд для API запросов
4. **Кэширование** - Конфигурация кэшируется

### Рекомендации

- Используйте `React.memo` для PaymentButton
- Дебаунсинг для множественных кликов
- Предзагрузка критических ресурсов

## Accessibility

### Поддержка скринридеров

```tsx
<button
  aria-label={`Оплата - ${service.packageName}`}
  role="button"
>
  Оплата
</button>
```

### Клавиатурная навигация

- Tab для навигации между кнопками
- Enter/Space для активации
- Escape для закрытия модальных окон

### Цветовая схема

- Высокий контраст для текста
- Альтернативные индикаторы состояния
- Поддержка темной темы

## Мобильная адаптивность

### Responsive дизайн

```css
@media (max-width: 640px) {
  .payment-button {
    width: 100%;
    font-size: 0.875rem;
  }
}
```

### Touch-friendly

- Минимальный размер кнопок 44px
- Увеличенные отступы для касаний
- Оптимизация для мобильных браузеров

## Развертывание

### Production checklist

- [ ] Переменные окружения настроены
- [ ] HTTPS включен
- [ ] Мониторинг настроен
- [ ] Тесты проходят
- [ ] Документация обновлена

### Environment variables

```env
# Production
REACT_APP_TINKOFF_PASSWORD=your_production_password

# Staging
REACT_APP_TINKOFF_PASSWORD=your_staging_password
```

## Поддержка и обновления

### Контакты

- **Техническая поддержка**: https://t.me/ruhunt
- **Документация Tinkoff**: https://www.tinkoff.ru/kassa/dev/

### Обновления

1. Следите за обновлениями API Tinkoff
2. Регулярно обновляйте зависимости
3. Тестируйте изменения в staging среде
4. Ведите changelog изменений

## Troubleshooting

### Частые проблемы

**Ошибка "Invalid token"**
- Проверьте правильность пароля
- Убедитесь в корректности алгоритма генерации токена

**Блокировка всплывающих окон**
- Добавьте инструкции для пользователей
- Рассмотрите альтернативные способы открытия формы

**Таймауты запросов**
- Проверьте стабильность интернет-соединения
- Увеличьте таймауты при необходимости

### Отладка

Включите детальное логирование:

```typescript
console.log('Payment debug:', {
  service,
  paymentData,
  token,
  response
});
```

## Лицензия

Интеграция разработана для проекта TEXEX AI. Все права защищены.