import { useState, useCallback } from 'react';
import { NotificationType } from '../components/PaymentNotification';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title?: string;
  message: string;
  duration?: number;
  retryable?: boolean;
  onRetry?: () => void;
}

export const usePaymentNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notification: Omit<NotificationItem, 'id'>) => {
    const id = `notification_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newNotification: NotificationItem = {
      ...notification,
      id
    };

    setNotifications(prev => [...prev, newNotification]);

    // Автоматически удаляем уведомление через указанное время
    if (notification.duration !== 0) {
      const duration = notification.duration || 5000;
      setTimeout(() => {
        removeNotification(id);
      }, duration + 300); // +300ms для анимации
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  // Удобные методы для разных типов уведомлений
  const showSuccess = useCallback((message: string, options?: Partial<Omit<NotificationItem, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'success',
      message,
      ...options
    });
  }, [addNotification]);

  const showError = useCallback((message: string, options?: Partial<Omit<NotificationItem, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'error',
      message,
      duration: 0, // Ошибки не скрываются автоматически
      ...options
    });
  }, [addNotification]);

  const showWarning = useCallback((message: string, options?: Partial<Omit<NotificationItem, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'warning',
      message,
      ...options
    });
  }, [addNotification]);

  const showInfo = useCallback((message: string, options?: Partial<Omit<NotificationItem, 'id' | 'type' | 'message'>>) => {
    return addNotification({
      type: 'info',
      message,
      ...options
    });
  }, [addNotification]);

  // Специальные методы для платежных уведомлений
  const showPaymentSuccess = useCallback((serviceName: string, amount: number) => {
    return showSuccess(
      `Платеж за "${serviceName}" на сумму ${amount.toLocaleString('ru-RU')} ₽ успешно инициализирован`,
      {
        title: 'Платеж инициализирован',
        duration: 7000
      }
    );
  }, [showSuccess]);

  const showPaymentError = useCallback((message: string, retryable: boolean = false, onRetry?: () => void) => {
    return showError(message, {
      title: 'Ошибка платежа',
      retryable,
      onRetry
    });
  }, [showError]);

  const showNetworkError = useCallback((onRetry?: () => void) => {
    return showError(
      'Проблемы с подключением к интернету. Проверьте соединение и попробуйте снова.',
      {
        title: 'Ошибка сети',
        retryable: true,
        onRetry
      }
    );
  }, [showError]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showPaymentSuccess,
    showPaymentError,
    showNetworkError
  };
};