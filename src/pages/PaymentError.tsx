import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCw, Mail, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface PaymentErrorDetails {
  orderId?: string;
  paymentId?: string;
  errorCode?: string;
  errorMessage?: string;
  amount?: string;
}

export const PaymentError: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [errorDetails, setErrorDetails] = useState<PaymentErrorDetails>({});

  useEffect(() => {
    // Извлекаем параметры ошибки из URL, которые передает Tinkoff
    const details: PaymentErrorDetails = {
      orderId: searchParams.get('OrderId') || undefined,
      paymentId: searchParams.get('PaymentId') || undefined,
      errorCode: searchParams.get('ErrorCode') || undefined,
      errorMessage: searchParams.get('Message') || searchParams.get('Details') || undefined,
      amount: searchParams.get('Amount') || undefined
    };

    setErrorDetails(details);

    // Логируем ошибку платежа для аналитики
    console.error('Payment error:', details);
  }, [searchParams]);

  const formatAmount = (amount: string | undefined) => {
    if (!amount) return '';
    
    // Tinkoff передает сумму в копейках
    const rubles = parseInt(amount) / 100;
    return rubles.toLocaleString('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  };

  const getErrorMessage = () => {
    if (errorDetails.errorMessage) {
      return errorDetails.errorMessage;
    }

    // Стандартные сообщения для известных кодов ошибок
    switch (errorDetails.errorCode) {
      case '101':
        return 'Недостаточно средств на карте';
      case '116':
        return 'Превышен лимит по карте';
      case '120':
        return 'Операция отклонена банком-эмитентом';
      case '125':
        return 'Неверный код CVV';
      case '206':
        return 'Операция отменена пользователем';
      default:
        return 'Произошла ошибка при обработке платежа';
    }
  };

  const isRetryable = () => {
    const nonRetryableCodes = ['125', '206']; // Неверный CVV, отмена пользователем
    return !errorDetails.errorCode || !nonRetryableCodes.includes(errorDetails.errorCode);
  };

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const handleRetryPayment = () => {
    // Возвращаемся на главную страницу, где пользователь может повторить попытку
    navigate('/', { replace: true });
    // Можно добавить параметр для автоматического открытия платежной формы
  };

  const handleContactSupport = () => {
    const supportMessage = `Здравствуйте! У меня возникла проблема с платежом.%0A%0AДетали:%0A${
      errorDetails.orderId ? `Номер заказа: ${errorDetails.orderId}%0A` : ''
    }${
      errorDetails.paymentId ? `ID платежа: ${errorDetails.paymentId}%0A` : ''
    }${
      errorDetails.errorCode ? `Код ошибки: ${errorDetails.errorCode}%0A` : ''
    }${
      errorDetails.errorMessage ? `Сообщение: ${errorDetails.errorMessage}%0A` : ''
    }%0AПожалуйста, помогите решить эту проблему.`;
    
    window.open(`https://t.me/ruhunt?text=${supportMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-red-500/30">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <XCircle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-light-cream">
            Ошибка платежа
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <Alert className="border-red-500/30 bg-red-500/10">
            <AlertTriangle className="h-4 w-4 text-red-500" />
            <AlertDescription className="text-red-200">
              {getErrorMessage()}
            </AlertDescription>
          </Alert>

          {errorDetails.amount && (
            <div className="bg-slate-500/10 border border-slate-500/30 rounded-lg p-4">
              <div className="text-light-cream font-semibold text-lg">
                {formatAmount(errorDetails.amount)}
              </div>
              <div className="text-light-cream/60 text-sm">
                Сумма платежа
              </div>
            </div>
          )}

          {(errorDetails.orderId || errorDetails.paymentId || errorDetails.errorCode) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-light-cream/90">Детали ошибки:</h3>
              
              {errorDetails.orderId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">Номер заказа:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {errorDetails.orderId}
                  </Badge>
                </div>
              )}
              
              {errorDetails.paymentId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">ID платежа:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {errorDetails.paymentId}
                  </Badge>
                </div>
              )}
              
              {errorDetails.errorCode && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">Код ошибки:</span>
                  <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                    {errorDetails.errorCode}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Что можно сделать?</h3>
            <ul className="text-sm text-blue-300/80 space-y-1">
              {isRetryable() && <li>• Попробуйте повторить платеж</li>}
              <li>• Проверьте данные карты и баланс</li>
              <li>• Используйте другую карту</li>
              <li>• Обратитесь в службу поддержки</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            {isRetryable() && (
              <Button 
                onClick={handleRetryPayment}
                className="w-full bg-[#F2CC66] hover:bg-[#F5D77F] text-black font-semibold"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Повторить платеж
              </Button>
            )}
            
            <Button 
              onClick={handleBackToHome}
              variant="outline"
              className="w-full border-light-cream/30 text-light-cream hover:bg-light-cream/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
            
            <Button 
              onClick={handleContactSupport}
              variant="outline"
              size="sm"
              className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Mail className="w-4 h-4 mr-2" />
              Связаться с поддержкой
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};