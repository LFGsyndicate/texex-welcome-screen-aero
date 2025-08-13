import React from 'react';
import { Link } from 'react-router-dom';
import { XCircle, Home, MessageCircle, Phone, RefreshCw } from 'lucide-react';

export const PaymentErrorSimple: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Иконка ошибки */}
        <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <XCircle className="w-12 h-12 text-red-600" />
        </div>

        {/* Заголовок */}
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Ошибка при оплате
        </h1>

        {/* Описание */}
        <p className="text-gray-600 mb-8">
          К сожалению, произошла ошибка при обработке платежа. Не волнуйтесь, с вашего счета ничего не списалось.
        </p>

        {/* Информация о компании */}
        <div className="bg-blue-50 rounded-lg p-4 mb-8">
          <h2 className="font-semibold text-blue-900 mb-2">TEXEX AI</h2>
          <p className="text-sm text-blue-700">
            Услуги по реализации автоматизированных программных решений
          </p>
        </div>

        {/* Возможные причины */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Возможные причины:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Недостаточно средств на карте</li>
            <li>• Банк отклонил операцию</li>
            <li>• Проблемы с интернет-соединением</li>
            <li>• Технические неполадки</li>
          </ul>
        </div>

        {/* Что делать */}
        <div className="text-left mb-8">
          <h3 className="font-semibold text-gray-900 mb-3">Что делать?</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>• Проверьте баланс карты</li>
            <li>• Убедитесь, что карта не заблокирована</li>
            <li>• Попробуйте повторить оплату</li>
            <li>• Обратитесь в поддержку, если проблема повторяется</li>
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
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Повторить оплату</span>
          </button>
          
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
            Если у вас есть вопросы по оплате, свяжитесь с нами любым удобным способом.
            Мы поможем решить проблему!
          </p>
        </div>
      </div>
    </div>
  );
};