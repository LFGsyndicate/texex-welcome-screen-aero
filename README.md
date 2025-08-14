# 🚀 TEXEX AI - Витрина автоматизированных программных решений

Современный веб-сайт для демонстрации и продажи AI-решений с интегрированной системой оплаты Tinkoff.

## 🎯 О проекте

TEXEX AI предлагает готовые решения в области искусственного интеллекта:
- **AI-Мастер Контента для SMM**
- **AI-Копирайтер для E-commerce**
- **AI-Аналитик Рекламных Кампаний**
- **AI-Лидогенератор 360**
- **AI-SEO Оптимизатор**
- **AI-Фабрика Виральных Видео**
- **AI-Чат-Бот для Первой Линии**
- **AI-Голос**

## 🛠️ Технологии

- **Frontend:** React 18 + TypeScript
- **Стили:** Tailwind CSS + CSS Modules
- **Сборка:** Vite
- **UI компоненты:** Shadcn/ui + Radix UI
- **Платежи:** Tinkoff API v2
- **Анимации:** Framer Motion + Vanta.js
- **Роутинг:** React Router DOM

## 🚀 Быстрый старт

### Предварительные требования
- Node.js 18+ 
- npm или yarn

### Установка и запуск
```bash
# Клонирование репозитория
git clone [your-repo-url]
cd texex-welcome-screen-aero

# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Предварительный просмотр сборки
npm run preview
```

## 💳 Система оплаты

### Интеграция с Tinkoff
- **Терминал:** 1754995728217
- **API:** https://securepay.tinkoff.ru/v2/
- **Страницы успеха/ошибки:** Стандартные Tinkoff

### Компоненты платежей
- `TinkoffPaymentCorrect` - основной компонент оплаты
- `TinkoffPaymentFinal` - через PaymentService
- `PaymentButton` - кнопка рассрочки

### Особенности
- ✅ Автоматическая генерация ID заказов
- ✅ Передача фискальных данных (Receipt)
- ✅ Динамические описания с названиями карточек
- ✅ Страницы успеха/ошибки с блоками контактов

## 📱 Адаптивность

- **Desktop:** Полнофункциональный интерфейс
- **Mobile:** Оптимизированная мобильная версия
- **Responsive:** Адаптация под все размеры экранов

## 🎨 Дизайн

### Цветовая схема
- **Основной синий:** #2A3BD6
- **Темно-синий:** #1427B0
- **Акцентный зеленый:** #15D895
- **Светло-кремовый:** #F4E4C1
- **Золотой:** #E4C580

### Стили
- **Liquid Glass:** Стеклянные эффекты с размытием
- **Анимации:** Плавные переходы и hover-эффекты
- **Типографика:** Inter, Manrope, Noto Sans

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── TinkoffPaymentCorrect/    # Основной платежный компонент
│   ├── TinkoffPaymentFinal/      # Платежи через сервис
│   ├── PaymentButton/            # Кнопка рассрочки
│   ├── ui/                       # UI компоненты (Shadcn)
│   └── Navbar.tsx               # Навигация
├── pages/               # Страницы приложения
│   ├── Index.tsx                # Главная страница
│   ├── PaymentSuccess.tsx       # Успешная оплата
│   ├── PaymentError.tsx         # Ошибка оплаты
│   └── NotFound.tsx             # 404 страница
├── services/            # Бизнес-логика
│   └── paymentService.ts        # Сервис платежей
├── config/              # Конфигурация
│   └── tinkoff.config.ts        # Настройки Tinkoff
├── utils/               # Утилиты
│   └── tokenGenerator.ts        # Генерация токенов
└── types/               # TypeScript типы
    └── payment.types.ts         # Типы платежей
```

## 🔧 Конфигурация

### Переменные окружения
Создайте файл `.env.local`:
```env
VITE_TINKOFF_TERMINAL_KEY=1754995728217
VITE_TINKOFF_PASSWORD=Ut8FxLDYq2t3563u
VITE_TINKOFF_API_URL=https://securepay.tinkoff.ru/v2/
```

### Tinkoff API
- **Init метод:** Инициализация платежа
- **SHA-256 токены:** Безопасная аутентификация
- **Fiscal данные:** Передача Receipt для чеков

## 📊 SEO и индексация

### Запрещенные страницы
- `/payment/*` - все страницы оплаты
- `/test/*` - тестовые страницы
- `/debug/*` - отладочные страницы

### Файлы
- `robots.txt` - запрет индексации платежных страниц
- `sitemap.xml` - карта сайта

## 🚀 Деплой

### GitHub Pages
```bash
npm run deploy
```

### Vercel
```bash
npm run build
# Загрузить dist/ в Vercel
```

### Ручной деплой
```bash
npm run build
# Загрузить содержимое dist/ на хостинг
```

## 🐛 Отладка

### Логи платежей
- Проверьте консоль браузера
- Логи в компонентах платежей
- API ответы Tinkoff

### Частые проблемы
1. **"Неверные параметры"** - проверьте TerminalKey
2. **Ошибки токена** - проверьте SHA-256 генерацию
3. **Проблемы с Receipt** - убедитесь в правильном формате

## 📞 Контакты

- **Telegram:** [@ruhunt](https://t.me/ruhunt)

## 📄 Лицензия

Проект разработан для TEXEX AI. Все права защищены.

## 📈 Changelog - Major Service Optimization (v2.1.0)

### 🎯 Comprehensive Pricing Strategy Implementation
- **✅ Minimum Price Policy:** All services now meet 100,000 ₽ minimum requirement
- **✅ Target Average:** Achieved 185k ₽ average across 52 services (within 180-270k target)
- **✅ Premium Tiers:** Strategic pricing caps at 550k ₽ for ultra-premium services
- **✅ Conversion Optimization:** Enhanced copy with compelling pain points and persuasive descriptions

### 🚀 New Featured Services Category: "AI-сотрудники"
1. **EMP-01: Виртуальный AI-сотрудник** (255,000 ₽)
   - Premium featured service with golden animated border
   - Targets executives and decision makers
   - 20-30 hours weekly time savings benefit

2. **EMP-BC-01: AI-сотрудник для блокчейна/DAO/трейдинга** (550,000 ₽)
   - Ultra-premium service with teal animated border
   - Crypto/fintech specialization
   - Up to 40% trading profitability improvement

3. **EMP-02: AI-сотрудник для Финтеха и Банков** (420,000 ₽)
   - Financial compliance and automation
   - 60% risk reduction, 5x faster processing

### 📊 Service Catalog Expansion: 28 → 52 Services
**Added 14 strategic services across all categories:**

**Marketing & Sales (3 new):**
- MKT-07: AI-Таргетолог Pro (180k ₽)
- MKT-08: AI-Воронка Продаж (195k ₽)  
- MKT-09: AI-Влияние для Блогеров (165k ₽)

**Customer Service (3 new):**
- SRV-05: AI-Менеджер Отзывов (145k ₽)
- SRV-06: AI-Консультант E-learning (220k ₽)
- SRV-07: AI-Переводчик Real-time (185k ₽)

**Internal Operations (3 new):**
- OPS-06: AI-Планировщик Ресурсов (290k ₽)
- OPS-07: AI-Аудитор Безопасности (245k ₽)
- OPS-08: AI-Оптимизатор Затрат (215k ₽)

**Content & Media (3 new):**
- CNT-06: AI-Подкаст Автопилот (150k ₽)
- CNT-07: AI-Креативная Студия (165k ₽)
- CNT-08: AI-Тренды Охотник (125k ₽)

**Small Business (4 new):**
- SMB-05: AI-Бухгалтер для ИП (105k ₽)
- SMB-06: AI-Мастер Конверсий (135k ₽)
- SMB-07: AI-Помощник Ресторатора (155k ₽)
- SMB-08: AI-Строитель Аудитории (115k ₽)

**IT & Development (3 new):**
- IT-03: AI-DevOps Инженер (165k ₽)
- IT-04: AI-Оптимизатор Базы Данных (185k ₽)
- IT-05: AI-Генератор API (145k ₽)

**Analytics & Solutions (4 new):**
- ANL-03: AI-Предсказатель Трендов (275k ₽)
- ANL-04: AI-Ценовой Стратег (195k ₽)
- ANL-05: AI-Аналитик Кадров (165k ₽)
- ANL-06: AI-Советчик Инвестора (315k ₽)

### 🎨 Visual & UX Improvements
- **✅ Animated Featured Borders:** Liquid glass effects with primary/secondary variants
- **✅ Enhanced Service Cards:** Professional styling with gradient stripes
- **✅ Monthly Cost Logic:** Dynamic calculation with service-specific overrides
- **✅ Cost Breakdown Modals:** Detailed project composition with percentages

### 💳 Payment System Integration
- **✅ Tinkoff Integration:** All services properly mapped to payment system
- **✅ Dynamic Pricing:** Real-time price display with monthly cost estimates
- **✅ Multiple Payment Options:** Direct payment, installments, and consulting
- **✅ Receipt Generation:** Compliant fiscal data for all transactions

### 📁 Technical Implementation
**Files Modified:**
- `src/data/services.ts` - Extended interface + 52 comprehensive service definitions
- `src/pages/Index.tsx` - Featured card logic + monthly cost overrides
- `src/pages/liquid-glass.css` - Animated border styles for featured services
- `paymentintegrationinstructions/services_updated.html` - Complete service documentation

**Key Features:**
- TypeScript interface extensions (`isFeatured`, `featuredVariant`)
- Conditional CSS classes with animation support
- Monthly cost calculation with service-specific rules
- Complete payment integration validation

### 📊 Business Impact
- **Price Floor:** 100% compliance with minimum pricing policy
- **Service Variety:** 85% increase in available services (28→52)
- **Premium Positioning:** Featured services for high-value segments
- **Conversion Focus:** Optimized copy with psychological triggers

---

**Версия:** 2.1.0  
**Последнее обновление:** Август 2025  
**Статус:** Готов к продакшену ✅
