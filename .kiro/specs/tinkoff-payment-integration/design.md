# Design Document

## Overview

Техническое решение для интеграции платежной системы Тинькофф в витрину AI-решений TEXEX AI. Интеграция будет реализована через Merchant API Тинькофф с использованием метода Init для создания платежей и последующим редиректом на платежную форму. Решение обеспечит безопасную передачу данных с генерацией токенов и корректную обработку всех типов платежей.

## Architecture

### Компонентная архитектура
- **PaymentService**: Сервис для работы с API Тинькофф
- **PaymentButton**: Компонент кнопки оплаты
- **PaymentModal**: Модальное окно для отображения процесса оплаты
- **TokenGenerator**: Утилита для генерации токенов безопасности
- **PaymentConfig**: Конфигурация с идентификаторами Тинькофф

### Поток данных
1. **Инициация платежа**: Пользователь нажимает кнопку оплаты
2. **Подготовка данных**: Система собирает данные о товаре и генерирует токен
3. **Вызов API**: Отправка запроса Init к Тинькофф API
4. **Редирект**: Переход на платежную форму по полученному PaymentUrl
5. **Обработка результата**: Возврат на страницы успеха/ошибки

## Components and Interfaces

### 1. PaymentService
```typescript
interface PaymentService {
  initPayment(paymentData: PaymentInitData): Promise<PaymentInitResponse>;
  generateToken(params: TokenParams): string;
}

interface PaymentInitData {
  amount: number;
  orderId: string;
  description: string;
  customerKey?: string;
}

interface PaymentInitResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
  paymentId?: string;
  paymentUrl?: string;
}
```

### 2. PaymentButton Component
```typescript
interface PaymentButtonProps {
  service: Service;
  paymentType: 'payment' | 'installment';
  onPaymentStart?: () => void;
  onPaymentError?: (error: string) => void;
}
```

### 3. PaymentConfig
```typescript
interface TinkoffConfig {
  terminalKey: string;
  merchantId: string;
  password: string;
  apiUrl: string;
  successUrl: string;
  failUrl: string;
}
```

## Data Models

### Payment Request Model
```typescript
interface TinkoffInitRequest {
  TerminalKey: string;
  Amount: number; // в копейках
  OrderId: string;
  Description: string;
  CustomerKey?: string;
  Token: string;
  DATA?: {
    connection_type?: string;
  };
}
```

### Service Integration Model
```typescript
interface PaymentServiceData {
  packageId: string;
  packageName: string;
  price: number; // в рублях
  description: string;
}
```

## Error Handling

### Типы ошибок
1. **Network Errors**: Проблемы с подключением к API
2. **Validation Errors**: Некорректные данные платежа  
3. **API Errors**: Ошибки от Тинькофф API
4. **Token Errors**: Ошибки генерации токена

### Стратегия обработки
- **Retry Logic**: Повторные попытки для сетевых ошибок
- **User Feedback**: Понятные сообщения об ошибках
- **Logging**: Детальное логирование для отладки
- **Fallback**: Альтернативные способы оплаты при критических ошибках

## Testing Strategy

### Unit Tests
- Тестирование генерации токенов
- Валидация данных платежа
- Обработка ошибок API

### Integration Tests  
- Тестирование с Тинькофф API (тестовая среда)
- Проверка корректности редиректов
- Тестирование различных сценариев оплаты

### E2E Tests
- Полный цикл оплаты от кнопки до результата
- Тестирование на различных устройствах
- Проверка UX потока

## Security Considerations

### Token Generation
- Использование SHA-256 для генерации токенов
- Сортировка параметров по алфавиту
- Исключение вложенных объектов из токена
- Безопасное хранение пароля в переменных окружения

### Data Protection
- Передача минимально необходимых данных
- Использование HTTPS для всех запросов
- Валидация входящих данных
- Защита от CSRF атак

## Implementation Approach

### Phase 1: Core Infrastructure
1. Создание PaymentService с базовой функциональностью
2. Реализация генерации токенов
3. Настройка конфигурации Тинькофф
4. Базовое тестирование API

### Phase 2: UI Integration  
1. Создание PaymentButton компонента
2. Интеграция в существующие карточки сервисов
3. Реализация модального окна для процесса оплаты
4. Обработка состояний загрузки

### Phase 3: Error Handling & UX
1. Реализация обработки ошибок
2. Добавление пользовательских уведомлений
3. Оптимизация UX потока
4. Тестирование на различных устройствах

### Phase 4: Testing & Deployment
1. Комплексное тестирование с тестовой средой Тинькофф
2. Проверка безопасности и производительности
3. Подготовка к продакшену
4. Мониторинг и логирование