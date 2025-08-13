import React, { useEffect, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import './PaymentNotification.css';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

export interface PaymentNotificationProps {
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number; // в миллисекундах, 0 = не скрывать автоматически
  onClose?: () => void;
  retryable?: boolean;
  onRetry?: () => void;
}

export const PaymentNotification: React.FC<PaymentNotificationProps> = ({
  type,
  title,
  message,
  duration = 5000,
  onClose,
  retryable = false,
  onRetry
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // Задержка для анимации
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
      default:
        return null;
    }
  };

  const getAlertClass = () => {
    const baseClass = 'payment-notification';
    switch (type) {
      case 'success':
        return `${baseClass} ${baseClass}--success`;
      case 'error':
        return `${baseClass} ${baseClass}--error`;
      case 'warning':
        return `${baseClass} ${baseClass}--warning`;
      case 'info':
        return `${baseClass} ${baseClass}--info`;
      default:
        return baseClass;
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose?.(), 300);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className={`${getAlertClass()} ${isVisible ? 'payment-notification--visible' : ''}`}>
      <Alert className="payment-notification__alert">
        <div className="payment-notification__content">
          <div className="payment-notification__icon">
            {getIcon()}
          </div>
          <div className="payment-notification__text">
            {title && (
              <div className="payment-notification__title">
                {title}
              </div>
            )}
            <AlertDescription className="payment-notification__message">
              {message}
            </AlertDescription>
          </div>
          <div className="payment-notification__actions">
            {retryable && onRetry && (
              <button
                onClick={onRetry}
                className="payment-notification__retry-btn"
                aria-label="Повторить попытку"
              >
                Повторить
              </button>
            )}
            {onClose && (
              <button
                onClick={handleClose}
                className="payment-notification__close-btn"
                aria-label="Закрыть уведомление"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};