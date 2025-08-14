// Базовые интерфейсы для платежных данных

export interface PaymentInitData {
  amount: number; // в рублях
  orderId: string;
  description: string;
  customerKey?: string;
}

export interface PaymentInitResponse {
  success: boolean;
  errorCode?: string;
  message?: string;
  paymentId?: string;
  paymentUrl?: string;
}

// ✅ НОВОЕ: Интерфейсы для фискальных данных
export interface FiscalData {
  email?: string;
  phone?: string;
  preferredContact: 'email' | 'phone';
}

export interface EnhancedPaymentData {
  amount: number;
  orderId: string;
  description: string;
  itemName?: string;
  customerKey?: string;
  fiscalData: FiscalData; // ✅ Обязательное поле для фискализации
}

export interface TinkoffInitRequest {
  TerminalKey: string;
  Amount: number; // в копейках
  OrderId: string;
  Description: string;
  CustomerKey?: string;
  SuccessURL?: string;
  FailURL?: string;
  Language?: string;
  Token: string;
  Receipt?: {
    Email?: string; // Email для фискализации (теперь необязателен)
    Phone?: string; // Телефон для фискализации (теперь необязателен, но одно из двух должно быть)
    Taxation: string;
    Items: Array<{
      Name: string;
      Price: number;
      Quantity: number;
      Amount: number;
      Tax: string;
      PaymentMethod?: string; // full_prepayment, prepayment, advance, full_payment, partial_payment
    }>;
  };
  DATA?: {
    connection_type?: string; // Тип интеграции (Widget2.0, connection_type_pf и т.д.)
  };
}

export interface TinkoffInitResponse {
  Success: boolean;
  ErrorCode?: string;
  Message?: string;
  Details?: string;
  PaymentId?: string;
  PaymentURL?: string;
}

export interface PaymentServiceData {
  packageId: string;
  packageName: string;
  price: number; // в рублях
  description: string;
}

export interface TokenParams {
  [key: string]: string | number | boolean;
}

export type PaymentType = 'payment' | 'installment';

export interface PaymentButtonProps {
  service: PaymentServiceData;
  paymentType: PaymentType;
  onPaymentStart?: () => void;
  onPaymentError?: (error: string) => void;
}

// ✅ НОВОЕ: Интерфейсы для компонента FiscalDataModal
export interface FiscalDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FiscalData) => void;
  isLoading?: boolean;
}

// ✅ НОВОЕ: Расширенные типы для обработки ошибок фискализации
export interface FiscalError {
  code: string;
  message: string;
  details?: string;
  userMessage: string; // Сообщение для показа пользователю
}

export interface PaymentResult {
  success: boolean;
  paymentUrl?: string;
  paymentId?: string;
  orderId?: string;
  error?: FiscalError;
}

// ✅ НОВОЕ: Расширенный интерфейс для Receipt с улучшенной типизацией
export interface TinkoffReceiptItem {
  Name: string;
  Price: number; // в копейках
  Quantity: number;
  Amount: number; // в копейках (Price * Quantity)
  Tax: 'none' | 'vat0' | 'vat10' | 'vat18' | 'vat20';
  PaymentMethod?: 'full_prepayment' | 'prepayment' | 'advance' | 'full_payment' | 'partial_payment';
}

export interface TinkoffReceipt {
  Email?: string; // ✅ Динамический - получается от пользователя
  Phone?: string; // ✅ Динамический - получается от пользователя
  Taxation: 'usn_income' | 'osn' | 'usn_income_out' | 'usn_expenses';
  Items: TinkoffReceiptItem[];
}

// ✅ НОВОЕ: Обновленный интерфейс Tinkoff Init Request
export interface EnhancedTinkoffInitRequest {
  TerminalKey: string;
  Amount: number; // в копейках
  OrderId: string;
  Description: string;
  CustomerKey?: string;
  SuccessURL?: string;
  FailURL?: string;
  Language?: string;
  Token: string;
  Receipt: TinkoffReceipt; // ✅ Обязательный для фискализации
  DATA?: {
    connection_type?: string;
  };
}