import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Home, MessageCircle, Phone } from 'lucide-react';

export const PaymentSuccessSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Иконка успеха */}
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Платеж успешно завершен!
        </h1>

        {/* Описание */}
        <p className="text-gray-600 mb-8">
          Спасибо за ваш заказ! Мы получили подтверждение платежа и уже начали работу над вашим проектом.
        </p>

        {/* Информация о компании */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">TEXEX AI</h2>
          <p className="text-sm text-blue-700">
            Услуги по реализации автоматизированных программных решений
          </p>
        </div>

        {/* Следующие шаги */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Что дальше?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• В течение 24 часов мы свяжемся с вами для уточнения деталей</li>
            <li>• Начнем работу над проектом согласно выбранному пакету</li>
            <li>• Будем держать вас в курсе прогресса</li>
          </ul>
        </div>

        {/* Контакты */}
        <div className="space-y-3 mb-8">
          <h3 className="font-semibold text-gray-900">Нужна помощь?</h3>
          <div className="flex flex-col space-y-2">
            <a
              href="https://t.me/ruhunt"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Telegram</span>
            </a>
            <a
              href="https://wa.me/79097878786"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-green-600 hover:text-green-700 transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="space-y-3">
          <Link
            to="/"
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Вернуться на главную</span>
          </Link>
          
          <button
            onClick={() => window.close()}
            className="w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Закрыть окно
          </button>
        </div>

        {/* Дополнительная информация */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Если у вас есть вопросы, свяжитесь с нами любым удобным способом.
            Мы всегда готовы помочь!
          </p>
        </div>
      </div>
    </div>
  );
};