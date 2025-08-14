/**
 * Утилиты для работы с мета-тегами и SEO
 */

import { env, getMetaUrl } from './env';
import { services } from '../data/services';

export interface MetaData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  price?: string;
  category?: string;
}

export interface ServiceMetaData {
  serviceId?: string;
  category?: string;
  packageName?: string;
  description?: string;
  price?: string;
}

/**
 * Обновляет мета-теги страницы
 */
export const updateMetaTags = (meta: MetaData) => {
  const {
    title = 'TEXEX — готовые AI-решения для бизнеса | 60+ услуг автоматизации с ИИ',
    description = '🤖 Готовые AI-решения для автоматизации бизнеса: AI-сотрудники, чат-боты, генераторы контента, аналитика. 60+ услуг от 105,000₽. Фиксированная цена, гарантированный результат.',
    image = '/lovable-uploads/55ba05a5-2718-4715-9f97-cda517cbf943.png',
    url = env.APP_URL,
    type = 'website',
    keywords = 'AI решения для бизнеса, автоматизация, чат-боты, нейросети, машинное обучение'
  } = meta;

  // Обновляем title
  document.title = title;

  // Обновляем мета-теги
  const metaTags = [
    { name: 'description', content: description },
    { name: 'keywords', content: keywords },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: getMetaUrl(image) },
    { property: 'og:image:alt', content: 'TEXEX - AI решения для бизнеса' },
    { property: 'og:site_name', content: 'TEXEX AI Solutions' },
    { property: 'og:locale', content: 'ru_RU' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: getMetaUrl(image) },
    { name: 'twitter:site', content: '@texex_ai' },
  ];

  metaTags.forEach(({ name, property, content }) => {
    const selector = name ? `meta[name="${name}"]` : `meta[property="${property}"]`;
    let element = document.querySelector(selector) as HTMLMetaElement;
    
    if (!element) {
      element = document.createElement('meta');
      if (name) element.setAttribute('name', name);
      if (property) element.setAttribute('property', property);
      document.head.appendChild(element);
    }
    
    element.setAttribute('content', content);
  });
};

/**
 * Генерирует мета-теги для конкретной услуги
 */
export const generateServiceMeta = (serviceMeta: ServiceMetaData): MetaData => {
  if (!serviceMeta.serviceId && !serviceMeta.packageName) {
    return {};
  }

  const service = services.find(s =>
    s.packageId === serviceMeta.serviceId ||
    s.packageName === serviceMeta.packageName ||
    s.category === serviceMeta.category
  );

  if (!service) return {};

  const title = `${service.packageName} | TEXEX - AI решения для бизнеса`;
  const description = `${service.persuasiveDescription.slice(0, 150)}... Цена: от ${service.pricingTier1_Price.toLocaleString('ru')}₽. ${service.quantifiableBenefit}`;
  const keywords = [
    service.packageName.toLowerCase(),
    service.category.toLowerCase(),
    service.targetAudience.toLowerCase(),
    'ai решения',
    'автоматизация бизнеса',
    'искусственный интеллект'
  ].join(', ');

  return {
    title,
    description,
    keywords,
    price: service.pricingTier1_Price.toString(),
    category: service.category,
    type: 'product'
  };
};

/**
 * Добавляет структурированные данные для поисковых систем
 */
export const addStructuredData = () => {
  // Основные данные организации
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "TEXEX AI Solutions",
    "alternateName": "Texex",
    "url": env.APP_URL,
    "logo": getMetaUrl('/lovable-uploads/55ba05a5-2718-4715-9f97-cda517cbf943.png'),
    "description": "Компания TEXEX предоставляет готовые AI-решения для автоматизации бизнеса. Более 60 услуг: AI-сотрудники, чат-боты, генераторы контента.",
    "foundingDate": "2023",
    "numberOfEmployees": "10-50",
    "industry": "Artificial Intelligence, Business Automation",
    "contactPoint": {
      "@type": "ContactPoint",
      "email": env.CONTACT_EMAIL,
      "telephone": env.CONTACT_PHONE,
      "contactType": "customer service",
      "availableLanguage": ["ru", "en"]
    },
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "RU",
      "addressRegion": "Russia"
    },
    "sameAs": [
      env.TELEGRAM_URL,
      env.WHATSAPP_URL
    ],
    "priceRange": "105000-490000 RUB"
  };

  // Добавляем структурированные данные для услуг
  const servicesData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "AI решения TEXEX",
    "description": "Каталог готовых AI-решений для автоматизации бизнеса",
    "numberOfItems": services.length,
    "itemListElement": services.map((service, index) => ({
      "@type": "Service",
      "position": index + 1,
      "name": service.packageName,
      "description": service.persuasiveDescription.slice(0, 200),
      "category": service.category,
      "audience": service.targetAudience,
      "provider": {
        "@type": "Organization",
        "name": "TEXEX AI Solutions"
      },
      "offers": {
        "@type": "Offer",
        "price": service.pricingTier1_Price,
        "priceCurrency": "RUB",
        "availability": "https://schema.org/InStock",
        "validFrom": "2024-01-01",
        "priceValidUntil": "2025-12-31"
      },
      "additionalProperty": [
        {
          "@type": "PropertyValue",
          "name": "Тип услуги",
          "value": service.serviceType
        },
        {
          "@type": "PropertyValue",
          "name": "Решаемая проблема",
          "value": service.coreProblemSolved
        },
        {
          "@type": "PropertyValue",
          "name": "Ключевые результаты",
          "value": service.keyDeliverables
        },
        {
          "@type": "PropertyValue",
          "name": "Количественная выгода",
          "value": service.quantifiableBenefit
        }
      ]
    }))
  };

  // Данные для хлебных крошек
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Главная",
        "item": env.APP_URL
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": "AI решения",
        "item": `${env.APP_URL}/#services`
      }
    ]
  };

  // Добавляем все структурированные данные
  const scripts = [
    { data: organizationData, id: 'organization-schema' },
    { data: servicesData, id: 'services-schema' },
    { data: breadcrumbData, id: 'breadcrumb-schema' }
  ];

  scripts.forEach(({ data, id }) => {
    // Удаляем существующий скрипт если есть
    const existingScript = document.getElementById(id);
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
  });
};

/**
 * Добавляет структурированные данные для конкретной услуги
 */
export const addServiceStructuredData = (serviceId: string) => {
  const service = services.find(s => s.packageId === serviceId);
  if (!service) return;

  const serviceData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": service.packageName,
    "description": service.persuasiveDescription,
    "category": service.category,
    "audience": service.targetAudience,
    "brand": {
      "@type": "Brand",
      "name": "TEXEX AI Solutions"
    },
    "offers": {
      "@type": "Offer",
      "price": service.pricingTier1_Price,
      "priceCurrency": "RUB",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "TEXEX AI Solutions"
      }
    },
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Решаемая проблема",
        "value": service.coreProblemSolved
      },
      {
        "@type": "PropertyValue",
        "name": "Ключевые результаты",
        "value": service.keyDeliverables
      },
      {
        "@type": "PropertyValue",
        "name": "Количественная выгода",
        "value": service.quantifiableBenefit
      },
      {
        "@type": "PropertyValue",
        "name": "Пример использования",
        "value": service.example
      }
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.id = `service-${serviceId}-schema`;
  script.textContent = JSON.stringify(serviceData);
  document.head.appendChild(script);
};

/**
 * Генерирует ключевые слова на основе всех услуг
 */
export const generateGlobalKeywords = (): string => {
  const categories = [...new Set(services.map(s => s.category))];
  const commonTerms = [
    'AI решения для бизнеса',
    'искусственный интеллект',
    'автоматизация бизнес-процессов',
    'машинное обучение',
    'нейросети для компаний',
    'цифровая трансформация'
  ];
  
  const categoryKeywords = categories.map(cat => cat.toLowerCase());
  const serviceKeywords = services.slice(0, 10).map(s => s.packageName.toLowerCase());
  
  return [...commonTerms, ...categoryKeywords, ...serviceKeywords].join(', ');
};
