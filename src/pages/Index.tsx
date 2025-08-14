import { useState, useMemo, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";

import { services, Service } from '@/data/services';
import { testimonials, Testimonial } from '@/data/testimonials';
import { motion, LazyMotion, domAnimation } from 'framer-motion';
import { HelpCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/useDebounce';
import './liquid-glass.css';
import TrunkVanta from '@/components/TrunkVanta';
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import { UI_CONFIG } from '@/config/ui';
import LogoWrapper from '@/components/Logo';
import { YCLogo, ForbesLogo, SkolkovoLogo, OpenAILogo, GoogleCloudLogo, AWSLogo, VercelLogo, GithubLogo, AnthropicLogo } from '@/components/logos';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PaymentButton } from '@/components/PaymentButton/PaymentButton';
import React from 'react';
import { TinkoffPaymentCorrect } from '@/components/TinkoffPaymentCorrect/TinkoffPaymentCorrect';
import { updateMetaTags, addStructuredData, generateGlobalKeywords } from '@/utils/meta';

const CATEGORY_EVENT = 'texex:set-category';
const PKG_EVENT = 'texex:scroll-to-package';

const heroSlides = [
  { 
    intro: true, 
    title: 'Готовые AI-решения с гарантированным ROI', 
    subtitle: '50+ проверенных решений от 105,000₽. Внедрение за 1-4 недели. Фиксированная цена. Гарантированный результат. Перестаньте экспериментировать — начните зарабатывать на AI уже через месяц.' 
  },
  { 
    category: "Маркетинг и Продажи", 
    title: "Маркетинг, который окупается в 3-5 раз", 
    subtitle: "AI находит ваших клиентов, создает контент-магниты и оптимизирует рекламу в реальном времени. Результат: +40% лидов, -60% стоимости привлечения. Автоматизация, которая приносит прибыль." 
  },
  { 
    category: "Малый бизнес и Стартапы", 
    title: "AI-суперсила для малого бизнеса. С первого дня.", 
    subtitle: "Запустите сайт за 3 минуты, наймите AI-ассистента за 105,000₽ или автоматизируйте продажи за 150,000₽. Решения, которые окупаются за 2-3 месяца. Большой бизнес в маленьком формате." 
  },
  { 
    category: "IT и Разработка", 
    title: "Разработка в 3 раза быстрее. Безопасность на максимуме.", 
    subtitle: "AI-помощники пишут код, находят баги и аудируют безопасность. Ваша команда работает как 3 команды. Результат: +200% скорости разработки, -90% критических ошибок. Опережайте конкурентов и угрозы." 
  },
  { 
    category: "Аналитика и Решения", 
    title: "Данные превращаются в деньги. Автоматически.", 
    subtitle: "AI анализирует большие данные, находит скрытые инсайты и предсказывает тренды. Принимайте решения на основе фактов, а не интуиции. Результат: +60% точности прогнозов, +35% прибыльности решений." 
  },
  { 
    category: "Клиентский сервис", 
    title: "Клиенты получают ответ за 3 секунды. 24/7.", 
    subtitle: "AI-ассистенты решают 70% вопросов без участия человека. Ваши менеджеры фокусируются на сложных кейсах, а клиенты получают поддержку премиум-уровня. Результат: +45% лояльности, -80% издержек." 
  },
  { 
    category: "Внутренние процессы", 
    title: "Освободите команду от рутины на 70%", 
    subtitle: "AI автоматизирует документооборот, финансы и HR. Ваши топ-специалисты перестают быть секретарями и начинают создавать ценность. Результат: +50% продуктивности, -40% операционных расходов." 
  },
  { 
    category: "Контент и Медиа", 
    title: "Студийное качество без студийного бюджета", 
    subtitle: "AI-аватары, генераторы музыки и виральных идей. Создавайте контент в 10 раз быстрее и дешевле. Результат: +300% объема контента, -80% затрат на производство. Ваш креатив теперь не ограничен ресурсами." 
  }
];

const logoComponents = [
  { comp: YCLogo, label: 'Y Combinator' },
  { comp: ForbesLogo, label: 'Forbes' },
  { comp: SkolkovoLogo, label: 'Сколково' },
  { comp: OpenAILogo, label: 'OpenAI' },
  { comp: GoogleCloudLogo, label: 'Google Cloud' },
  { comp: AWSLogo, label: 'AWS' },
  { comp: VercelLogo, label: 'Vercel' },
  { comp: GithubLogo, label: 'GitHub' },
  { comp: AnthropicLogo, label: 'Anthropic' },
  // дополнительные (повторно используем простые формы для стилевого консистентного ряда)
  { comp: SkolkovoLogo, label: 'СБЕР' },
  { comp: GoogleCloudLogo, label: 'VC.ru' },
  { comp: AWSLogo, label: 'TechCrunch' },
  { comp: VercelLogo, label: 'Next.js' },
  { comp: GithubLogo, label: 'TypeScript' },
  { comp: OpenAILogo, label: 'Node.js' },
  { comp: GoogleCloudLogo, label: 'Python' },
  { comp: YCLogo, label: 'Supabase' },
  { comp: AnthropicLogo, label: 'LangChain' },
];

const gradientStripes = UI_CONFIG.gradientStripes;

const Index = () => {
  const [filter, setFilter] = useState('Все');
  const [accordionValue, setAccordionValue] = useState<string | undefined>(undefined);
  const debouncedFilter = useDebounce(filter, 150);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // SEO: Инициализация мета-тегов и структурированных данных
  useEffect(() => {
    // Обновляем мета-теги с улучшенным содержанием
    updateMetaTags({
      title: 'TEXEX — готовые AI-решения для бизнеса | 60+ услуг автоматизации с ИИ',
      description: '🤖 Готовые AI-решения для автоматизации бизнеса: AI-сотрудники, чат-боты, генераторы контента, аналитика. 60+ услуг от 105,000₽. Фиксированная цена, гарантированный результат. Внедрение за 1-4 недели.',
      keywords: generateGlobalKeywords(),
      url: window.location.href,
      type: 'website'
    });

    // Добавляем структурированные данные
    addStructuredData();

    // Добавляем дополнительные мета-теги для конкретных категорий
    const categoriesMeta = document.querySelector('meta[name="categories"]');
    if (!categoriesMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'categories');
      meta.setAttribute('content', [...new Set(services.map(s => s.category))].join(', '));
      document.head.appendChild(meta);
    }

    // Добавляем мета-тег с количеством услуг
    const serviceCountMeta = document.querySelector('meta[name="service-count"]');
    if (!serviceCountMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'service-count');
      meta.setAttribute('content', services.length.toString());
      document.head.appendChild(meta);
    }

    // Добавляем мета-тег с ценовым диапазоном
    const prices = services.map(s => s.pricingTier1_Price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRangeMeta = document.querySelector('meta[name="price-range"]');
    if (!priceRangeMeta) {
      const meta = document.createElement('meta');
      meta.setAttribute('name', 'price-range');
      meta.setAttribute('content', `${minPrice.toLocaleString('ru')}-${maxPrice.toLocaleString('ru')} RUB`);
      document.head.appendChild(meta);
    }
  }, []);

  useEffect(() => {
    const handler = (e: any) => setFilter(e.detail || 'Все');
    window.addEventListener(CATEGORY_EVENT as any, handler as any);
    return () => window.removeEventListener(CATEGORY_EVENT as any, handler as any);
  }, []);
  
  const categories = useMemo(() => {
    if (!services || services.length === 0) return ['Все'];
    return ['Все', ...Array.from(new Set(services.map(s => s.category)))];
  }, []);
  
  const filteredServices = useMemo(() => {
    if (!services || services.length === 0) return [];
    return debouncedFilter === 'Все' ? services : services.filter(s => s.category === debouncedFilter);
  }, [debouncedFilter]);

  const handlePayment = useCallback((serviceName: string, type: string) => {
    try { alert(`Вы выбрали ${serviceName}. Вариант оплаты: ${type}. Интеграция будет добавлена позже.`); } catch (error) { console.error('Payment handler error:', error); }
  }, []);

  const handleHelp = useCallback(() => {
    try { alert('Ссылка на страницу помощи будет добавлена позже.'); } catch (error) { console.error('Help handler error:', error); }
  }, []);

  const scrollToServices = useCallback(() => {
    try {
      const element = document.getElementById('services');
      if (element) element.scrollIntoView({ behavior: 'auto' });
    } catch (error) { console.error('Scroll handler error:', error); }
  }, []);

  const scrollToPackage = useCallback((id: string) => {
    try {
      const el = document.getElementById(`pkg-${id}`);
      if (el) el.scrollIntoView({ behavior: 'auto', block: 'center' });
    } catch (e) { console.error('scrollToPackage error', e) }
  }, []);

  useEffect(() => {
    const onPkg = (e: any) => {
      const id = e?.detail;
      if (id) scrollToPackage(id);
    };
    window.addEventListener(PKG_EVENT as any, onPkg as any);
    return () => window.removeEventListener(PKG_EVENT as any, onPkg as any);
  }, [scrollToPackage]);

  // Обработчик для открытия вопроса об оплате
  useEffect(() => {
    const handlePaymentFocus = () => {
      console.log('Opening payment FAQ accordion...');
      
      // Устанавливаем состояние аккордеона
      setAccordionValue('item-4');
      
      // Добавляем класс expanded для усиленной подсветки
      const paymentItem = document.getElementById('payment-accordion-item');
      if (paymentItem) {
        paymentItem.classList.add('expanded');
        console.log('Added expanded class to payment question');
      }
      
      // Если нужно, кликаем на триггер
      const paymentTrigger = document.getElementById('payment-accordion-trigger') as HTMLButtonElement;
      if (paymentTrigger && paymentTrigger.getAttribute('data-state') === 'closed') {
        console.log('Clicking payment accordion trigger...');
        paymentTrigger.click();
        
        // Добавляем класс expanded после клика
        const paymentItemAfterClick = document.getElementById('payment-accordion-item');
        if (paymentItemAfterClick) {
          paymentItemAfterClick.classList.add('expanded');
        }
      }
      
      console.log('Accordion value set to item-4');
    };
    
    window.addEventListener('texex:open-payment-faq', handlePaymentFocus);
    return () => window.removeEventListener('texex:open-payment-faq', handlePaymentFocus);
  }, []);

  // ✅ НОВОЕ: Обработчик для открытия условий использования
  useEffect(() => {
    const handleTermsOpen = () => {
      console.log('Opening terms dialog...');
      
      // Находим триггер модального окна с условиями и кликаем на него
      const termsButton = document.querySelector('[data-terms-trigger]') as HTMLButtonElement;
      if (termsButton) {
        termsButton.click();
        console.log('Terms dialog opened');
      }
    };
    
    window.addEventListener('texex:open-terms', handleTermsOpen);
    return () => window.removeEventListener('texex:open-terms', handleTermsOpen);
  }, []);

  // Отслеживаем изменения состояния аккордеона для управления подсветкой
  useEffect(() => {
    const paymentItem = document.getElementById('payment-accordion-item');
    if (!paymentItem) return;

    // Добавляем класс expanded когда аккордеон раскрыт
    if (accordionValue === 'item-4') {
      paymentItem.classList.add('expanded');
    } else {
      paymentItem.classList.remove('expanded');
    }
  }, [accordionValue]);

  const formatCurrency = useCallback((value: number) => {
    try { return Math.round(value).toLocaleString('ru-RU'); } catch { return `${value}`; }
  }, []);

  // Monthly expenses ranges by category and overrides per service
  const getMonthlyCostsRange = useCallback((service: Service): [number, number] | null => {
    if (!service.hasMonthlyCosts) return null;
    const overrides: Record<string, [number, number]> = {
      'EMP-01': [10000, 30000], // Виртуальный AI-сотрудник — высокая нагрузка
      'EMP-BC-01': [20000, 60000], // Блокчейн/DAO/трейдинг — повышенная нагрузка
      'EMP-02': [18000, 55000], // Финтех/банки — высоконагруженные системы
      'SRV-02': [15000, 50000], // Голосовой ассистент: ASR/TTS дороже
      'OPS-05': [20000, 60000], // Контроль качества CV-инференс
      'CNT-01': [12000, 35000], // Видеостудия — рендеринг и обработка
      'CNT-06': [8000, 25000], // Подкаст автопилот — аудио обработка
      'MKT-07': [10000, 30000], // Таргетолог Pro — частые API запросы
      'ANL-03': [15000, 45000], // Предсказатель трендов — большие объемы данных
      'ANL-06': [12000, 40000], // Инвестиционный советчик — финансовые API
    };
    if (overrides[service.packageId]) return overrides[service.packageId];
    const byCategory: Record<string, [number, number]> = {
      'Маркетинг и Продажи': [2000, 10000],
      'Клиентский сервис': [5000, 25000],
      'Внутренние процессы': [5000, 20000],
      'Контент и Медиа': [1000, 8000],
      'Малый бизнес и Стартапы': [2000, 8000],
      'IT и Разработка': [3000, 15000],
      'Аналитика и Решения': [5000, 20000],
      'AI-сотрудники': [5000, 25000],
    };
    return byCategory[service.category] || [2000, 15000];
  }, []);

  // Cost breakdown by category
  const getCostBreakdown = useCallback((service: Service) => {
    const map: Record<string, Array<{ title: string; pct: number }>> = {
      'Маркетинг и Продажи': [
        { title: 'Аналитика и стратегия', pct: 15 },
        { title: 'Креатив/дизайн', pct: 15 },
        { title: 'Разработка и интеграции', pct: 45 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 15 },
      ],
      'Клиентский сервис': [
        { title: 'Аналитика сценариев', pct: 15 },
        { title: 'Проектирование диалогов', pct: 15 },
        { title: 'Разработка и интеграции', pct: 50 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 10 },
      ],
      'Внутренние процессы': [
        { title: 'Аналитика процессов', pct: 15 },
        { title: 'Моделирование/регламенты', pct: 10 },
        { title: 'Разработка и интеграции', pct: 55 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 10 },
      ],
      'Контент и Медиа': [
        { title: 'Креатив и сценарии', pct: 25 },
        { title: 'Настройка пайплайнов/разработка', pct: 45 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 20 },
      ],
      'Малый бизнес и Стартапы': [
        { title: 'Аналитика и настройка', pct: 10 },
        { title: 'Внедрение/интеграции', pct: 50 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 30 },
      ],
      'IT и Разработка': [
        { title: 'Аналитика требований', pct: 10 },
        { title: 'Разработка', pct: 65 },
        { title: 'Безопасность/тестирование', pct: 15 },
        { title: 'Документация и передача', pct: 10 },
      ],
      'Аналитика и Решения': [
        { title: 'Анализ данных', pct: 20 },
        { title: 'Моделирование/разработка', pct: 50 },
        { title: 'Тестирование и запуск', pct: 10 },
        { title: 'Обучение и передача', pct: 20 },
      ],
    };
    return map[service.category] || [
      { title: 'Аналитика и планирование', pct: 10 },
      { title: 'Разработка и интеграции', pct: 60 },
      { title: 'Тестирование и запуск', pct: 15 },
      { title: 'Обучение и передача', pct: 15 },
    ];
  }, []);

return (
    <div className="bg-gradient-to-br from-primary-blue to-dark-blue text-light-cream">
    <Navbar />

      <main>
      {/* Hero */}
      <section id="hero" className="relative min-h-screen overflow-hidden">
        <TrunkVanta>
          <div className="flex flex-col items-center justify-center text-center px-4 pt-36 pb-16 md:pt-40 md:pb-24">
            <div className="relative z-10 w-full max-w-5xl lg:max-w-6xl">
              <Carousel opts={{ loop: true }} autoplayMs={7000} arrowsPosition="bottom" className="w-full">
              <CarouselContent>
                {heroSlides.map((slide, index) => (
                  <CarouselItem key={index}>
                    <div className="p-1">
                        <div className="flex flex-col items-center justify-center p-4 md:p-6 min-h-[300px]">
                          <h1 className="text-3xl md:text-5xl font-bold mb-3 md:mb-4 text-shadow-lg text-light-cream leading-tight">{slide.title}</h1>
                          <p className="text-base sm:text-lg md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto text-light-cream/90 text-shadow">{slide.subtitle}</p>
                          <Button size="lg" className="liquid-button text-light-cream font-bold border-0 shadow-xl bg-transparent hover:bg-transparent" onClick={scrollToServices}>
                            Подобрать решение за 2 минуты
                          </Button>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          </div>
        </TrunkVanta>
      </section>

      {/* Разделитель между Hero и партнёрами */}
      <div className="container mx-auto px-4">
        <hr className="liquid-separator my-6 md:my-10 animate-[connectorFlowX_4s_linear_infinite]" />
      </div>

      {/* Social Proof Logos */}
      <section className="py-10 glass-section">
        <div className="container mx-auto">
          <h3 className="text-xs md:text-sm uppercase text-gold mb-6 text-center">Технологии мирового уровня. Доверие лидеров индустрии</h3>
          <Carousel opts={{ align: 'start', loop: true }} autoplayMs={5000} arrowsPosition="bottom" className="w-full max-w-5xl lg:max-w-6xl mx-auto">
            <CarouselContent>
              {Array.from({ length: Math.ceil(logoComponents.length / 10) }).map((_, slideIndex) => (
                <CarouselItem key={slideIndex} className="basis-full">
                                      <div className="flex flex-wrap sm:flex-nowrap gap-4 md:gap-6 justify-center items-center" style={{ color: UI_CONFIG.logoTone }}>
                    {logoComponents.slice(slideIndex * 10, slideIndex * 10 + 10).map(({ comp: Comp, label }) => (
                      <LogoWrapper key={label} size={48} label={label}>
                        <Comp />
                      </LogoWrapper>
                    ))}
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

      {/* Services */}
      {/* Разделитель между партнёрами и блоком "Как мы работаем" */}
      <div className="container mx-auto px-4">
        <hr className="liquid-separator my-6 md:my-10 animate-[connectorFlowX_4s_linear_infinite]" />
      </div>

      {/* How it works */}
      <section className="py-12">
        <div className="container mx-auto max-w-5xl lg:max-w-6xl">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-light-cream">От идеи до результата за 4 недели</h2>
          <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { title: 'Выбор пакета', desc: 'Подберите решение за 2 минуты или получите бесплатную консультацию' },
              { title: 'Оплата или Рассрочка', desc: 'Оплачиваете удобным способом. Рассрочка 0% на 12 месяцев' },
              { title: 'Реализация', desc: 'Внедряем решение за 1-4 недели с гарантированным результатом' },
            ].map((step, idx) => (
              <>
                <motion.div key={`step-${idx}`} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="liquid-surface rounded-xl p-6 text-center relative overflow-hidden group z-10">
                  <div className="text-gold text-sm mb-2">Шаг {idx + 1}</div>
                  <div className="text-xl font-semibold text-light-cream mb-2">{step.title}</div>
                  <div className="text-light-cream/90">{step.desc}</div>
                  <hr className="liquid-separator my-4" />
                  <div className="h-1 w-16 mx-auto rounded-full bg-gradient-to-r from-accent-green via-gold to-light-cream animate-[pulse_2.8s_ease-in-out_infinite]" />
                  {/* подсветка */}
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{background: 'radial-gradient(300px 120px at 20% 10%, rgba(244,228,193,0.12), transparent 60%)'}} />
                </motion.div>
                {idx < 2 && (
                  <div className="md:hidden flex justify-center py-2">
                    <div className="liquid-connector-v-mobile" style={{ height: 24 }} />
                  </div>
                )}
              </>
            ))}
            {/* Внешние соединители: размещены только в зазорах, чтобы не заходить на карточки */}
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[calc(33.333%-2.5rem)] w-20 h-3 liquid-connector-h z-0" />
            <div className="hidden md:block absolute top-1/2 -translate-y-1/2 left-[calc(66.666%-2.5rem)] w-20 h-3 liquid-connector-h z-0" />
            {/* Мобильные вертикальные соединители перенесены внутрь потока между карточками */}
            </div>
          </div>
        </section>
      {/* Разделитель между "Как мы работаем" и витриной */}
      <div className="container mx-auto px-4">
        <hr className="liquid-separator my-6 md:my-10 animate-[connectorFlowX_4s_linear_infinite]" />
      </div>

      <section id="services" className="py-14 md:py-20">
          <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-light-cream">50+ готовых AI-решений с гарантированным ROI</h2>
          <div className="flex justify-center flex-wrap gap-1.5 md:gap-2 mb-6 md:mb-12">
              {categories.map(category => (
                <Button
                  key={category}
                  variant="outline"
                  onClick={() => setFilter(category)}
                  className={`category-filter-btn rounded-full transition-all duration-300 px-3 py-1 h-8 text-xs sm:text-sm ${
                    filter === category ? 'active' : ''
                  }`}
                >
                  {category}
                </Button>
              ))}
            </div>
            <LazyMotion features={domAnimation}>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                {filteredServices.map((service: Service, index) => (
                  <motion.div
                    key={service.packageId}
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                  whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
                    className="flex"
                  id={`pkg-${service.packageId}`}
                >
                  <Card
                    className={`glass-card ${service.isFeatured ? ('featured-card ' + (service.featuredVariant === 'secondary' ? 'featured-secondary' : 'featured-primary')) : ''} flex flex-col h-full w-full animate-float`}
                    style={{ animationDuration: `${UI_CONFIG.floatAnimationSeconds}s` }}
                  >
                    {/* Полоса-градиент с заголовком карточки */}
                    <div className={`relative h-[70px] sm:h-[80px] w-full bg-gradient-to-r ${gradientStripes[index % gradientStripes.length]} liquid-gradient-stripe overflow-hidden flex items-center justify-center`}>
                      <div className="liquid-stripe-shimmer" style={{ ['--stripe-speed' as any]: `${UI_CONFIG.liquidStripeSeconds}s` }} />
                      {/* Заголовок карточки на цветной плашке */}
                      <div className="relative z-10 text-center px-2 sm:px-4">
                        <h3 className="text-sm sm:text-lg md:text-xl font-bold text-blue-600 drop-shadow-lg leading-tight">{service.packageName}</h3>
                      </div>
                    </div>
                    <CardHeader className="p-4 md:p-6">
                      <CardDescription className="text-light-cream/80 pt-2">{service.painPoint}</CardDescription>
                    </CardHeader>
                    <CardContent className="p-4 md:p-6 flex-grow flex flex-col">
                      <Separator className="my-3 liquid-separator" />
                      <p className="mb-4 text-light-cream/90">{service.persuasiveDescription}</p>
                      <Separator className="my-3 liquid-separator" />
                      <div className="mt-auto">
                        <p className="text-xs md:text-sm text-gold mb-1">Пример:</p>
                        <p className="text-xs md:text-sm not-italic font-examples liquid-surface p-3 rounded-md mb-4 md:mb-6 text-light-cream/90">{service.example}</p>
                        <Separator className="my-3 liquid-separator" />
                        <div className="text-2xl md:text-3xl font-bold mb-2 md:mb-3 text-accent-green">{service.pricingTier1_Price.toLocaleString('ru-RU')} ₽<span className="text-sm md:text-base font-normal text-gold">/проект</span></div>
                        {service.hasMonthlyCosts ? (
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="liquid-surface rounded-full border-gold/40 text-light-cream/90 px-2.5 py-0.5">
                              + ежемесячные расходы LLM/API
                            </Badge>
                            <Dialog>
                              <DialogTrigger asChild>
                                <button
                                  aria-label="Подробнее об ежемесячных расходах"
                                  className="text-gold/80 hover:text-gold focus:outline-none z-10 relative flex-shrink-0"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <HelpCircle size={16} />
                                </button>
                              </DialogTrigger>
                              <DialogContent className="liquid-surface border-gold/40 text-light-cream z-50">
                                <DialogHeader>
                                  <DialogTitle>Ежемесячные расходы LLM/API</DialogTitle>
                                   <DialogDescription className="text-light-cream/80">
                                    Зависит от трафика, объёма запросов и выбранных моделей.
                                   </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-2 text-sm">
                                  {(() => {
                                    const range = getMonthlyCostsRange(service);
                                    if (!range) return null;
                                    const [min, max] = range;
                                     const baseChanged = (service as any).pricingAdjusted ? 1.5 : 1;
                                     const viralityBoost = service.viralPotential >= 5 ? 2 : 1;
                                     const factor = baseChanged * viralityBoost;
                                     const adjMin = Math.round(min * factor);
                                     const adjMax = Math.round(max * factor);
                                     return <p className="text-gold">Обычно {adjMin.toLocaleString('ru-RU')}–{adjMax.toLocaleString('ru-RU')} ₽/мес</p>;
                                  })()}
                                  <p className="text-light-cream/80">Мы поможем оптимизировать расходы с учётом качества и скорости.</p>
                                </div>
                              </DialogContent>
                            </Dialog>
                        </div>
                        ) : null}
                        <Separator className="my-3 liquid-separator" />
                        <div className="flex flex-col space-y-2 relative z-20">
                          {/* Кнопка оплаты - желтая большая */}
                          <div className="relative z-30">
                            <TinkoffPaymentCorrect
                              amount={service.pricingTier1_Price}
                              itemName={service.packageName}
                              paymentType="payment"
                              customerKey={`customer-${service.packageId}`} // Уникальный CustomerKey для каждого пакета
                              className="w-full rounded-lg font-bold text-black bg-[#F2CC66] hover:bg-[#F5D77F] text-center flex items-center justify-center py-3 sm:py-2 text-sm sm:text-base relative z-40"
                              onSuccess={() => console.log('Payment successful for:', service.packageName)}
                              onError={(error) => console.error('Payment error:', error)}
                            >
                              Оплатить
                            </TinkoffPaymentCorrect>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2 sm:space-x-2 relative z-30">
                            <div className="w-full sm:w-1/2">
                              <PaymentButton
                                service={{
                                  packageId: service.packageId,
                                  packageName: service.packageName,
                                  price: service.pricingTier1_Price
                                }}
                                paymentType="installment"
                                className="w-full text-xs sm:text-sm py-2 sm:py-1 h-auto rounded-md bg-black text-white hover:bg-black/90 text-center flex items-center justify-center relative z-40"
                                onPaymentStart={() => console.log('Installment started for:', service.packageName)}
                                onPaymentError={(error) => console.error('Installment error:', error)}
                              >
                                Рассрочка
                              </PaymentButton>
                            </div>
                            <div className="w-full sm:w-1/2">
                              <a href="https://t.me/ruhunt" target="_blank" rel="noreferrer" className="w-full liquid-outline-btn text-xs sm:text-sm py-2 sm:py-1 h-auto rounded-md text-light-cream text-center flex items-center justify-center relative z-40" style={{ borderColor: 'rgba(244,228,193,0.35)' }}>Помощь с выбором</a>
                            </div>
                          </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button id="order-modal-trigger" className="w-full liquid-animated-btn text-xs sm:text-sm py-2 sm:py-1 h-auto rounded-md text-light-cream relative z-40" variant="outline">Состав стоимости</Button>
                          </DialogTrigger>
                            <DialogContent className="liquid-surface border-gold/40 text-light-cream">
                              <DialogHeader>
                                <DialogTitle>Состав стоимости: {service.packageName}</DialogTitle>
                                <DialogDescription className="text-light-cream/80">
                                  Фиксированная цена за проект — {formatCurrency(service.pricingTier1_Price)} ₽. {service.hasMonthlyCosts ? (() => { const r = getMonthlyCostsRange(service); return `Плюс ежемесячные расходы LLM/API ${r ? `~ ${formatCurrency(r[0])}–${formatCurrency(r[1])} ₽/мес` : ''} по факту использования.`; })() : 'Без ежемесячных расходов.'}
                                </DialogDescription>
                              </DialogHeader>
                              <div className="my-2 space-y-2">
                                {getCostBreakdown(service).map((row) => (
                                  <div key={row.title} className="flex items-center justify-between text-sm">
                                    <span className="text-light-cream/90">{row.title}</span>
                                    <span className="text-gold">{row.pct}% ≈ {formatCurrency(service.pricingTier1_Price * row.pct / 100)} ₽</span>
                                  </div>
                                ))}
                              </div>
                              <Separator className="my-2 liquid-separator" />
                              <p className="text-xs text-light-cream/70">
                                Пропорции ориентировочные и могут меняться в зависимости от сложности и интеграций.
                              </p>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  </motion.div>
                ))}
              </div>
            </LazyMotion>
          </div>
        </section>

      {/* Testimonials */}
      <section id="cases" className="py-20">
          <div className="container mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-light-cream">Нас благодарят</h2>
          <Carousel opts={{ align: "start", loop: true }} autoplayMs={7000} arrowsPosition="bottom" className="w-full max-w-6xl mx-auto">
              <CarouselContent>
              {testimonials && testimonials.length > 0 ? testimonials.map((testimonial: Testimonial, index) => (
                <CarouselItem key={testimonial.id} className="md:basis-1/2 lg:basis-1/2 xl:basis-1/3">
                  <motion.div
                    initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
                    whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.4) }}
                    className="p-2 h-full"
                  >
                    <Card className="glass-card flex flex-col h-full p-6 animate-float" style={{ animationDuration: `${UI_CONFIG.floatAnimationSeconds}s` }}>
                      <p className="text-base md:text-lg mb-4 flex-grow text-light-cream/90">"{testimonial.quote}"</p>
                      <Separator className="liquid-separator my-2" />
                      <div className="flex items-center mt-auto justify-between text-xs sm:text-sm">
                        <p className="font-semibold text-light-cream/90">{testimonial.name}</p>
                        <p className="text-gold/90">{testimonial.title}, {testimonial.company}</p>
                        </div>
                      </Card>
                  </motion.div>
                  </CarouselItem>
                )) : null}
              </CarouselContent>
            </Carousel>
          </div>
        </section>

      {/* Контакты (теперь перед FAQ) */}
      <div className="container mx-auto px-4">
        <hr className="liquid-separator my-6 md:my-10 animate-[connectorFlowX_4s_linear_infinite]" />
      </div>
      <section id="contacts" className="py-14">
        <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 text-light-cream">Свяжитесь с нами. Получите консультацию за 5 минут</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <a href="https://t.me/ruhunt" target="_blank" rel="noreferrer" className="liquid-animated-btn liquid-btn-telegram rounded-lg px-4 py-3 text-center">Telegram</a>
            <a href="https://wa.me/79097878786" target="_blank" rel="noreferrer" className="liquid-animated-btn liquid-btn-whatsapp rounded-lg px-4 py-3 text-center">WhatsApp</a>
            <a href="mailto:info@texex.ru" className="liquid-animated-btn liquid-btn-email rounded-lg px-4 py-3 text-center">info@texex.ru</a>
          </div>
        </div>
      </section>

      {/* FAQ (теперь после контактов) */}
      <div className="container mx-auto px-4">
        <hr className="liquid-separator my-6 md:my-10 animate-[connectorFlowX_4s_linear_infinite]" />
      </div>
      <section id="faq" className="py-20 glass-section">
          <div className="container mx-auto max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-light-cream">Остались вопросы? Получите ответы за 30 секунд</h2>
            <Accordion type="single" collapsible className="w-full" value={accordionValue} onValueChange={setAccordionValue}>
              <AccordionItem value="item-1" className="border-b border-gold/30">
                <AccordionTrigger className="text-base md:text-lg font-semibold text-left hover:no-underline text-light-cream">Как быстро я увижу результат?</AccordionTrigger>
                <AccordionContent className="text-light-cream/80 pt-2">Зависит от задачи и выбранного пакета. В среднем первые измеримые результаты появляются в диапазоне от нескольких дней до нескольких недель. Конкретные сроки согласуем на старте и фиксируем KPI.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-b border-gold/30">
              <AccordionTrigger className="text-base md:text-lg font-semibold text-left hover:no-underline text-light-cream">Нужны ли мне технические знания?</AccordionTrigger>
              <AccordionContent className="text-light-cream/80 pt-2">Абсолютно нет. В этом и заключается наша ценность. Мы предоставляем решения "под ключ". Всю техническую интеграцию, настройку и поддержку мы берем на себя.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b border-gold/30">
              <AccordionTrigger className="text-base md:text-lg font-semibold text-left hover:no-underline text-light-cream">Что если ни один пакет мне не подходит?</AccordionTrigger>
              <AccordionContent className="text-light-cream/80 pt-2">Свяжитесь с нами. Для крупных клиентов мы можем разработать индивидуальное решение, комбинируя наши технологии для решения вашей уникальной задачи.</AccordionContent>
              </AccordionItem>
              <div id="faq-payments" className="h-0" />
              <AccordionItem value="item-4" className="border-b-0 border-gold/30 payment-question-highlight" id="payment-accordion-item">
                <AccordionTrigger id="payment-accordion-trigger" className="text-base md:text-lg font-semibold text-left hover:no-underline text-light-cream">Оплата и рассрочка: провайдеры платежей?</AccordionTrigger>
                <AccordionContent className="text-light-cream/80 pt-2 space-y-3">
                  <p className="text-light-cream/90 font-semibold">Оплата и безопасность</p>
                  <p>Мы стремимся сделать процесс покупки максимально удобным и безопасным для вас. Вы можете оплатить наши услуги онлайн с помощью банковской карты, а также воспользоваться опциями рассрочки от нашего партнёра.</p>
                  <p className="text-light-cream/90 font-semibold">Способы оплаты</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Банковская карта: принимаем Visa, Mastercard и Мир.</li>
                    <li>Долями и рассрочка: можно разделить оплату на несколько платежей. Сервис «Долями» и другие опции рассрочки предоставляет наш партнёр, АО «Т-Банк». Доступно пользователям 18+.</li>
                  </ul>
                  <p className="text-light-cream/90 font-semibold">Безопасность платежей</p>
                  <p>Оплата проходит на защищённой странице банка-партнёра АО «Т-Банк». Обработка данных карты выполняется на стороне банка. Соединение защищено по стандарту SSL. Мы не храним и не обрабатываем данные вашей карты.</p>
                  <p className="text-light-cream/90 font-semibold">Электронные чеки (54‑ФЗ)</p>
                  <p>После успешной оплаты электронный кассовый чек будет отправлен на указанный телефон или e‑mail. В чеке — вся информация о заказе и продавце.</p>
                  <p className="text-light-cream/90 font-semibold">Ссылки</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li><a className="underline" href="https://dolyame.ru/help/customer/about/" target="_blank" rel="noreferrer">Описание сервиса «Долями»</a></li>
                    <li><a className="underline" href="https://www.tbank.ru/business/loans/" target="_blank" rel="noreferrer">Условия рассрочки от Т‑Банка</a></li>
                    <li><a className="underline" href="https://www.tbank.ru/business/help/business-payments/internet-acquiring/" target="_blank" rel="noreferrer">Помощь по интернет‑эквайрингу</a></li>
                    <li><a className="underline" href="https://www.nalog.gov.ru/rn86/news/activities_fts/15656304/" target="_blank" rel="noreferrer">Положения закона № 54‑ФЗ</a></li>
                  </ul>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

      <footer className="py-12">
        <div className="container mx-auto text-center text-gold text-sm">
          <p>© 2014–2025. Все права защищены.</p>
          <p>Vtrende LLC, Texex AI solution · ИНН 3914803905</p>
          <div className="flex justify-center mt-4">
            <Dialog>
              <DialogTrigger asChild>
                <button
                  data-terms-trigger
                  className="liquid-outline-btn px-4 py-2 rounded-md text-light-cream/95 hover:text-light-cream"
                >
                  Обработка ПД, Конфиденциальность и Условия использования
                </button>
              </DialogTrigger>
              <DialogContent className="liquid-surface border-gold/40 text-light-cream max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Юридическая информация</DialogTitle>
                  <DialogDescription className="text-light-cream/80">Дата публикации документов: 07.04.2015 · Сайт: <a className="underline" href="https://texex.ru" target="_blank" rel="noreferrer">texex.ru</a></DialogDescription>
                </DialogHeader>
                <ScrollArea className="max-h-[70vh] pr-2">
                  <div className="space-y-4 text-sm leading-relaxed">
                    <h3 className="text-gold font-semibold">ПОЛЬЗОВАТЕЛЬСКОЕ СОГЛАШЕНИЕ</h3>
                    <p>(Условия оказания услуг и использования сайта)</p>
                    <p>Настоящее Пользовательское соглашение (далее – «Соглашение») регулирует отношения между Администрацией сайта (далее – «Исполнитель») и Пользователем данного сайта.</p>
                    <h4 className="text-gold/90 font-semibold">1. Общие положения</h4>
                    <p>1.1. Сайт Интернет-магазина «TEXEX» (далее – «Сайт») принадлежит Vtrende LLC, Texex AI solution (ИНН: 3914803905), именуемому далее «Исполнитель».</p>
                    <p>1.2. Использование Сайта Пользователем означает согласие с настоящим Соглашением, а также со всеми приложениями к нему: Публичной офертой и Политикой конфиденциальности.</p>
                    <p>1.3. Исполнитель оставляет за собой право в любое время изменять, добавлять или удалять пункты настоящего Соглашения без уведомления Пользователя.</p>
                    <p>1.4. Продолжение использования Сайта Пользователем означает принятие Соглашения и изменений, внесенных в него.</p>
                    <p>1.5. Пользователь несет персональную ответственность за проверку настоящего Соглашения на наличие изменений.</p>
                    <p>1.6. Настоящее Соглашение является публичной офертой в соответствии со ст. 437 Гражданского кодекса РФ.</p>
                    <h4 className="text-gold/90 font-semibold">2. Предмет соглашения</h4>
                    <p>2.1. Предметом настоящего Соглашения является предоставление Пользователю доступа к содержащимся на Сайте IT-услугам, проектам и инструментам в области ИИ и автоматизации.</p>
                    <p>2.2. Под действие настоящего Соглашения подпадают все существующие услуги (сервисы) Сайта, а также любые их последующие модификации и появляющиеся в дальнейшем дополнительные услуги.</p>
                    <h4 className="text-gold/90 font-semibold">3. Права и обязанности сторон</h4>
                    <p>3.1. Исполнитель вправе: изменять правила пользования Сайтом, его содержание; ограничить доступ к Сайту при нарушении условий; изменять стоимость услуг (без ретроактивного действия на оплаченным Заказ).</p>
                    <p>3.2. Пользователь обязуется: предоставлять достоверные данные; соблюдать права авторов; не нарушать работу Сайта; не распространять незаконную/конфиденциальную информацию без согласия.</p>
                    <h4 className="text-gold/90 font-semibold">4. Ответственность сторон</h4>
                    <p>4.1. Убытки, понесенные Пользователем вследствие нарушения условий Соглашения или несанкционированного доступа, Исполнителем не возмещаются.</p>
                    <p>4.2. Исполнитель не несет ответственности за сбои, действия третьих лиц и отсутствие у Пользователя необходимых технических средств.</p>
                    <p>4.3. Пользователь несет полную ответственность за достоверность предоставленной информации и действия, совершенные с использованием его учетной записи.</p>
                    <h4 className="text-gold/90 font-semibold">5. Порядок разрешения споров</h4>
                    <p>5.1–5.4. Споры разрешаются переговорами; претензионный порядок обязателен (30 дней); подсудность — по месту нахождения Исполнителя; иск подается в течение 1 месяца с момента возникновения оснований.</p>
                    <h4 className="text-gold/90 font-semibold">6. Дополнительные условия</h4>
                    <p>6.1–6.2. Отзывы не являются конфиденциальной информацией; условия об ограничении ответственности сохраняют силу после прекращения Соглашения.</p>

                    <h3 className="text-gold font-semibold pt-2">ПУБЛИЧНАЯ ОФЕРТА (ДОГОВОР)</h3>
                    <p>Дата публикации: 07.04.2015</p>
                    <p>Vtrende LLC, Texex AI solution, ИНН: 3914803905, публикует настоящую Публичную оферту о продаже IT-услуг дистанционным способом.</p>
                    <p><span className="font-semibold">1. Общие положения.</span> Определения Заказа, Акцепта; договор считается заключенным с момента акцепта.</p>
                    <p><span className="font-semibold">2. Предмет и цена.</span> Исполнитель оказывает услуги, Покупатель оплачивает. Полная оплата подтверждает согласие со всеми условиями. Стоимость указана на <a className="underline" href="https://texex.ru" target="_blank" rel="noreferrer">texex.ru</a> и может изменяться без ретроактивного действия на оплаченные Заказы. Провайдер платежей — АО «Т-Банк».</p>
                    <p><span className="font-semibold">3. Условия исполнения.</span> Сроки согласуются индивидуально; возврат за фактически выполненные услуги не предусмотрен; при задержках по вине Покупателя может взиматься компенсация; Исполнитель не отвечает за решения сторонних организаций.</p>
                    <p><span className="font-semibold">4. Отказ от ответственности.</span> Исполнитель не несет ответственности за коммерческие результаты Покупателя, доходность, расходы, обязательства перед госорганами; вправе привлекать субподрядчиков.</p>
                    <p><span className="font-semibold">5. Заключительные положения.</span> Регулируется законодательством РФ; споры разрешаются по порядку, указанному в Пользовательском соглашении.</p>

                    <h3 className="text-gold font-semibold pt-2">ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ</h3>
                    <p>Дата публикации: 07.04.2015</p>
                    <p>Политика действует в отношении всей информации, которую Администрация сайта может получить о Пользователе при использовании <a className="underline" href="https://texex.ru" target="_blank" rel="noreferrer">www.texex.ru</a>.</p>
                    <p><span className="font-semibold">1. Определения.</span> Персональные данные; обработка; Пользователь.</p>
                    <p><span className="font-semibold">2. Общие положения.</span> Использование Сайта означает согласие; Администрация не проверяет достоверность; Политика действует только для <a className="underline" href="https://texex.ru" target="_blank" rel="noreferrer">texex.ru</a>.</p>
                    <p><span className="font-semibold">3. Предмет.</span> Обязательства по неразглашению; состав данных: ФИО, телефон, e‑mail, техническая информация (IP, cookies, браузер, время доступа).</p>
                    <p><span className="font-semibold">4. Цели обработки.</span> Идентификация, обратная связь, платежи, поддержка, реклама с согласия Пользователя.</p>
                    <p><span className="font-semibold">5. Способы и сроки.</span> Обработка без ограничения срока; возможна передача третьим лицам для выполнения Заказа; применяются необходимые меры защиты; исключения из ответственности при публичности/получении от третьих лиц/с согласия Пользователя.</p>
                    <p><span className="font-semibold">6. Обязанности сторон.</span> Пользователь предоставляет и актуализирует данные; Администрация использует данные только по целям, хранит в тайне (за исключениями), применяет меры защиты.</p>
                    <p><span className="font-semibold">7. Споры.</span> Разрешаются по порядку Пользовательского соглашения.</p>
                    <p><span className="font-semibold">8. Заключительные положения.</span> Изменения Политики возможны без согласия, вступают в силу с момента публикации на Сайте.</p>
                  </div>
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </footer>
      </main>

    {/* Удалена старая плавающая кнопка списка */}
    </div>
  );
};

export default Index;
