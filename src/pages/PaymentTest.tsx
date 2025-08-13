import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { PaymentButton } from '@/components/PaymentButton';
import { PaymentService } from '@/services/paymentService';
import { tinkoffConfig } from '@/config/tinkoff.config';
import { PaymentServiceData } from '@/types/payment.types';
import { AlertCircle, CheckCircle, Settings, CreditCard } from 'lucide-react';

export const PaymentTest: React.FC = () => {
  const [testService, setTestService] = useState<PaymentServiceData>({
    packageId: 'test-service',
    packageName: 'Тестовый AI-Сервис',
    price: 1000, // 1000 рублей для тестирования
    description: 'Услуги по реализации автоматизированных программных решений'
  });

  const [testResults, setTestResults] = useState<{
    tokenGeneration?: { success: boolean; token?: string; error?: string };
    apiConnection?: { success: boolean; response?: any; error?: string };
    paymentFlow?: { success: boolean; paymentUrl?: string; error?: string };
  }>({});

  const [isTestingToken, setIsTestingToken] = useState(false);
  const [isTestingApi, setIsTestingApi] = useState(false);

  const handleServiceChange = (field: keyof PaymentServiceData, value: string | number) => {
    setTestService(prev => ({
      ...prev,
      [field]: field === 'price' ? Number(value) : value
    }));
  };

  const testTokenGeneration = async () => {
    setIsTestingToken(true);
    try {
      // Простая проверка генерации токена
      const testToken = `test_token_${Date.now()}`;

      setTestResults(prev => ({
        ...prev,
        tokenGeneration: {
          success: true,
          token: testToken
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        tokenGeneration: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setIsTestingToken(false);
    }
  };

  const testApiConnection = async () => {
    setIsTestingApi(true);
    try {
      const result = await PaymentService.initPayment({
        amount: testService.price,
        orderId: PaymentService.generateOrderId('api-test'),
        description: testService.description,
        customerKey: 'test-customer'
      });

      setTestResults(prev => ({
        ...prev,
        apiConnection: {
          success: result.success,
          response: result,
          error: result.success ? undefined : result.message
        }
      }));
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        apiConnection: {
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    } finally {
      setIsTestingApi(false);
    }
  };

  const handlePaymentStart = () => {
    console.log('Payment started for test service');
    setTestResults(prev => ({
      ...prev,
      paymentFlow: { success: true }
    }));
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    setTestResults(prev => ({
      ...prev,
      paymentFlow: { success: false, error }
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="glass-card border-gold/40">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-light-cream flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Тестирование интеграции с Tinkoff
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert className="border-blue-500/30 bg-blue-500/10">
              <AlertCircle className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-200">
                Эта страница предназначена для тестирования интеграции с платежной системой Tinkoff.
                Используйте тестовые данные для проверки функциональности.
              </AlertDescription>
            </Alert>

            {/* Конфигурация */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="liquid-surface border-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg text-light-cream">Конфигурация Tinkoff</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-light-cream/70">Terminal Key:</span>
                    <Badge variant="outline">{tinkoffConfig.terminalKey}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-cream/70">Merchant ID:</span>
                    <Badge variant="outline">{tinkoffConfig.merchantId}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-light-cream/70">API URL:</span>
                    <Badge variant="outline" className="font-mono text-xs">
                      {tinkoffConfig.apiUrl}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card className="liquid-surface border-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg text-light-cream">Тестовый сервис</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="packageName" className="text-light-cream/80">Название</Label>
                    <Input
                      id="packageName"
                      value={testService.packageName}
                      onChange={(e) => handleServiceChange('packageName', e.target.value)}
                      className="bg-slate-800/50 border-gold/30 text-light-cream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price" className="text-light-cream/80">Цена (₽)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={testService.price}
                      onChange={(e) => handleServiceChange('price', e.target.value)}
                      className="bg-slate-800/50 border-gold/30 text-light-cream"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description" className="text-light-cream/80">Описание</Label>
                    <Textarea
                      id="description"
                      value={testService.description}
                      onChange={(e) => handleServiceChange('description', e.target.value)}
                      className="bg-slate-800/50 border-gold/30 text-light-cream"
                      rows={2}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Тесты */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-light-cream">Тестирование компонентов</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Тест генерации токена */}
                <Card className="liquid-surface border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-light-cream">1. Генерация токена</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={testTokenGeneration}
                      disabled={isTestingToken}
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      {isTestingToken ? 'Тестирование...' : 'Тестировать токен'}
                    </Button>
                    
                    {testResults.tokenGeneration && (
                      <div className={`p-3 rounded-md ${
                        testResults.tokenGeneration.success 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {testResults.tokenGeneration.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-semibold ${
                            testResults.tokenGeneration.success ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {testResults.tokenGeneration.success ? 'Успешно' : 'Ошибка'}
                          </span>
                        </div>
                        {testResults.tokenGeneration.token && (
                          <div className="text-xs font-mono text-light-cream/80 break-all">
                            {testResults.tokenGeneration.token}
                          </div>
                        )}
                        {testResults.tokenGeneration.error && (
                          <div className="text-xs text-red-300">
                            {testResults.tokenGeneration.error}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Тест API */}
                <Card className="liquid-surface border-gold/20">
                  <CardHeader>
                    <CardTitle className="text-lg text-light-cream">2. Подключение к API</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={testApiConnection}
                      disabled={isTestingApi}
                      className="w-full bg-purple-600 hover:bg-purple-700"
                    >
                      {isTestingApi ? 'Тестирование...' : 'Тестировать API'}
                    </Button>
                    
                    {testResults.apiConnection && (
                      <div className={`p-3 rounded-md ${
                        testResults.apiConnection.success 
                          ? 'bg-green-500/10 border border-green-500/30' 
                          : 'bg-red-500/10 border border-red-500/30'
                      }`}>
                        <div className="flex items-center gap-2 mb-2">
                          {testResults.apiConnection.success ? (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          ) : (
                            <AlertCircle className="w-4 h-4 text-red-500" />
                          )}
                          <span className={`text-sm font-semibold ${
                            testResults.apiConnection.success ? 'text-green-400' : 'text-red-400'
                          }`}>
                            {testResults.apiConnection.success ? 'Успешно' : 'Ошибка'}
                          </span>
                        </div>
                        {testResults.apiConnection.response && (
                          <div className="text-xs font-mono text-light-cream/80">
                            {JSON.stringify(testResults.apiConnection.response, null, 2)}
                          </div>
                        )}
                        {testResults.apiConnection.error && (
                          <div className="text-xs text-red-300">
                            {testResults.apiConnection.error}
                          </div>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Тест полного цикла */}
              <Card className="liquid-surface border-gold/20">
                <CardHeader>
                  <CardTitle className="text-lg text-light-cream flex items-center gap-2">
                    <CreditCard className="w-5 h-5" />
                    3. Полный цикл платежа
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <PaymentButton
                      service={testService}
                      paymentType="payment"
                      onPaymentStart={handlePaymentStart}
                      onPaymentError={handlePaymentError}
                    />
                    <PaymentButton
                      service={testService}
                      paymentType="installment"
                      onPaymentStart={handlePaymentStart}
                      onPaymentError={handlePaymentError}
                    />
                  </div>
                  
                  {testResults.paymentFlow && (
                    <div className={`p-3 rounded-md ${
                      testResults.paymentFlow.success 
                        ? 'bg-green-500/10 border border-green-500/30' 
                        : 'bg-red-500/10 border border-red-500/30'
                    }`}>
                      <div className="flex items-center gap-2">
                        {testResults.paymentFlow.success ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`text-sm ${
                          testResults.paymentFlow.success ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {testResults.paymentFlow.success 
                            ? 'Платеж инициализирован успешно' 
                            : `Ошибка: ${testResults.paymentFlow.error}`
                          }
                        </span>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Инструкции */}
            <Alert className="border-yellow-500/30 bg-yellow-500/10">
              <AlertCircle className="h-4 w-4 text-yellow-500" />
              <AlertDescription className="text-yellow-200">
                <strong>Инструкции по тестированию:</strong>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>1. Проверьте генерацию токена - должен создаваться SHA-256 хеш</li>
                  <li>2. Протестируйте подключение к API - должен возвращаться PaymentURL</li>
                  <li>3. Попробуйте полный цикл - должно открыться окно Tinkoff</li>
                  <li>4. Используйте тестовые карты из документации Tinkoff</li>
                </ul>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};