import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import './PaymentModal.css';

export interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: 'loading' | 'success' | 'error' | 'idle';
  serviceName?: string;
  amount?: number;
  errorMessage?: string;
  paymentType?: 'payment' | 'installment';
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  status,
  serviceName,
  amount,
  errorMessage,
  paymentType = 'payment'
}) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-8 w-8 animate-spin text-blue-500" />;
      case 'success':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case 'error':
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusTitle = () => {
    switch (status) {
      case 'loading':
        return 'Обработка платежа...';
      case 'success':
        return 'Платеж успешно инициализирован';
      case 'error':
        return 'Ошибка при обработке платежа';
      default:
        return 'Подготовка к оплате';
    }
  };

  const getStatusDescription = () => {
    switch (status) {
      case 'loading':
        return 'Пожалуйста, подождите. Мы подготавливаем платежную форму...';
      case 'success':
        return 'Платежная форма откроется в новом окне. Если окно не открылось, проверьте настройки блокировщика всплывающих окон.';
      case 'error':
        return errorMessage || 'Произошла ошибка при инициализации платежа. Попробуйте еще раз.';
      default:
        return 'Подготавливаем данные для оплаты...';
    }
  };

  const formatAmount = (amount: number) => {
    return amount.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getPaymentTypeText = (type: 'payment' | 'installment') => {
    return type === 'payment' ? 'Оплата' : 'Рассрочка';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="payment-modal liquid-surface border-gold/40 text-light-cream max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            {getStatusIcon()}
            {getStatusTitle()}
          </DialogTitle>
          {serviceName && amount && (
            <DialogDescription className="text-light-cream/80 mt-2">
              <div className="space-y-1">
                <div><strong>Услуга:</strong> {serviceName}</div>
                <div><strong>Сумма:</strong> {formatAmount(amount)}</div>
                <div><strong>Тип оплаты:</strong> {getPaymentTypeText(paymentType)}</div>
              </div>
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="mt-4">
          {status === 'error' && (
            <Alert className="mb-4 border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-200">
                {errorMessage || 'Произошла неожиданная ошибка'}
              </AlertDescription>
            </Alert>
          )}

          <p className="text-light-cream/90 text-sm leading-relaxed">
            {getStatusDescription()}
          </p>

          {status === 'loading' && (
            <div className="mt-4 flex items-center justify-center">
              <div className="payment-modal__progress">
                <div className="payment-modal__progress-bar"></div>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-md">
              <p className="text-green-200 text-sm">
                ✓ Переход к оплате через платежную систему Тинькофф
              </p>
            </div>
          )}

          {status === 'error' && (
            <div className="mt-4 flex gap-2">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors"
              >
                Закрыть
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
              >
                Попробовать снова
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};