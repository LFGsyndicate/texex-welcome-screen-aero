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