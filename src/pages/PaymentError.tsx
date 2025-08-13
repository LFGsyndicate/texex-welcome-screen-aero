import React from 'react';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PaymentError: React.FC = () => {
  return (
    <>
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
        <meta name="bingbot" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </head>
      <div className="min-h-screen bg-gradient-to-br from-dark-blue via-primary-blue to-dark-blue flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="liquid-surface rounded-2xl p-8 text-center border border-red-400/30">
          {/* Иконка ошибки */}
          <div className="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mb-6">
            <XCircle className="w-12 h-12 text-red-400" />
          </div>
          
          {/* Заголовок */}
          <h1 className="text-3xl font-bold text-light-cream mb-4">
            Ошибка оплаты
          </h1>
          
          {/* Описание */}
          <p className="text-light-cream/80 mb-8 text-lg">
            К сожалению, произошла ошибка при обработке платежа. Пожалуйста, попробуйте еще раз или свяжитесь с нами.
          </p>
          
          {/* Кнопка повторить оплату */}
          <Link 
            to="/"
            className="inline-flex items-center gap-2 liquid-button px-6 py-3 rounded-lg text-light-cream font-semibold hover:scale-105 transition-transform mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
            Вернуться на главную
          </Link>
          
          {/* Блок контактов */}
          <div className="border-t border-gold/20 pt-6">
            <div className="text-center text-light-cream/80 mb-4 text-sm font-medium">
              Нужна помощь? Свяжитесь с нами:
            </div>
            <div className="grid grid-cols-1 gap-3">
              <a 
                href="https://t.me/ruhunt" 
                target="_blank" 
                rel="noreferrer" 
                className="liquid-animated-btn liquid-btn-telegram rounded-lg px-4 py-2.5 text-light-cream flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                <span className="liquid-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.5 4.5L2.5 11l6 2 9-8-6.5 9.5 6 3.5 4.5-13.5z" fill="#55ACEE"/>
                  </svg>
                </span>
                Telegram
              </a>
              <a 
                href="https://wa.me/79097878786" 
                target="_blank" 
                rel="noreferrer" 
                className="liquid-animated-btn liquid-btn-whatsapp rounded-lg px-4 py-2.5 text-light-cream flex items-center justify-center gap-3 hover:scale-105 transition-transform"
              >
                <span className="liquid-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2a10 10 0 100 20 9.6 9.6 0 004.7-1.2l3.3 1-1-3.2A9.6 9.6 0 0022 12 10 10 0 0012 2zm4.7 13.4c-.2.6-1.3 1.1-1.8 1.2-.5.1-1 .1-1.7-.1-1.6-.5-3.5-2-4.3-3.5-.6-1-.8-1.9-.8-2.6 0-.7.4-1.6 1-1.8.3-.1.6-.1.8 0 .2.1.4.6.5.9.1.2.1.4.1.5 0 .2-.2.5-.3.7-.2.2-.3.3-.2.5.1.2.4.9 1 1.5.7.8 1.6 1.4 1.8 1.5.2.1.4.1.6 0 .2-.2.4-.6.6-.8.1-.2.2-.2.4-.1.2.1 1.3.5 1.6.7.2.1.3.2.4.4 0 .1 0 .4-.2.5z" fill="#25D366"/>
                  </svg>
                </span>
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default PaymentError;
