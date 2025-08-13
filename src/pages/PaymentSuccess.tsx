import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Download, Mail } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface PaymentDetails {
  orderId?: string;
  paymentId?: string;
  amount?: string;
  status?: string;
}

export const PaymentSuccess: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState<PaymentDetails>({});

  useEffect(() => {
    // Извлекаем параметры из URL, которые передает Tinkoff
    const details: PaymentDetails = {
      orderId: searchParams.get('OrderId') || undefined,
      paymentId: searchParams.get('PaymentId') || undefined,
      amount: searchParams.get('Amount') || undefined,
      status: searchParams.get('Status') || undefined
    };

    setPaymentDetails(details);

    // Логируем успешный платеж для аналитики
    console.log('Payment success:', details);
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

  const handleBackToHome = () => {
    navigate('/', { replace: true });
  };

  const handleContactSupport = () => {
    window.open('https://t.me/ruhunt', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <Card className="w-full max-w-md glass-card border-green-500/30">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
          <CardTitle className="text-2xl font-bold text-light-cream">
            Платеж успешно завершен!
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center">
            <p className="text-light-cream/80 mb-4">
              Спасибо за ваш заказ! Мы получили ваш платеж и скоро свяжемся с вами для начала работы.
            </p>
            
            {paymentDetails.amount && (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 mb-4">
                <div className="text-green-400 font-semibold text-lg">
                  {formatAmount(paymentDetails.amount)}
                </div>
                <div className="text-green-300/80 text-sm">
                  Сумма платежа
                </div>
              </div>
            )}
          </div>

          {(paymentDetails.orderId || paymentDetails.paymentId) && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-light-cream/90">Детали платежа:</h3>
              
              {paymentDetails.orderId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">Номер заказа:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {paymentDetails.orderId}
                  </Badge>
                </div>
              )}
              
              {paymentDetails.paymentId && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">ID платежа:</span>
                  <Badge variant="outline" className="font-mono text-xs">
                    {paymentDetails.paymentId}
                  </Badge>
                </div>
              )}
              
              {paymentDetails.status && (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-light-cream/70">Статус:</span>
                  <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
                    {paymentDetails.status}
                  </Badge>
                </div>
              )}
            </div>
          )}

          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">Что дальше?</h3>
            <ul className="text-sm text-blue-300/80 space-y-1">
              <li>• В течение 24 часов с вами свяжется наш менеджер</li>
              <li>• Мы обсудим детали проекта и сроки реализации</li>
              <li>• Начнем работу над вашим AI-решением</li>
            </ul>
          </div>

          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleBackToHome}
              className="w-full bg-[#F2CC66] hover:bg-[#F5D77F] text-black font-semibold"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Вернуться на главную
            </Button>
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-light-cream/30 text-light-cream hover:bg-light-cream/10"
                onClick={handleContactSupport}
              >
                <Mail className="w-4 h-4 mr-2" />
                Поддержка
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="flex-1 border-light-cream/30 text-light-cream hover:bg-light-cream/10"
                onClick={() => window.print()}
              >
                <Download className="w-4 h-4 mr-2" />
                Чек
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};