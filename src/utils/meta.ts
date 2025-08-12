/**
 * Утилиты для работы с мета-тегами и SEO
 */

import { env, getMetaUrl } from './env';

export interface MetaData {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
}

/**
 * Обновляет мета-теги страницы
 */
export const updateMetaTags = (meta: MetaData) => {
  const {
    title = `${env.COMPANY_NAME} - создание ИТ-проектов`,
    description = 'Профессиональная разработка и создание ИТ-проектов от компании Texex',
    image = '/lovable-uploads/383c1323-5116-4631-bec5-1024285034e8.png',
    url = env.APP_URL,
    type = 'website'
  } = meta;

  // Обновляем title
  document.title = title;

  // Обновляем мета-теги
  const metaTags = [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: type },
    { property: 'og:url', content: url },
    { property: 'og:image', content: getMetaUrl(image) },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: getMetaUrl(image) },
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
 * Добавляет структурированные данные для поисковых систем
 */
export const addStructuredData = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": env.COMPANY_NAME,
    "url": env.APP_URL,
    "logo": getMetaUrl('/lovable-uploads/383c1323-5116-4631-bec5-1024285034e8.png'),
    "contactPoint": {
      "@type": "ContactPoint",
      "email": env.CONTACT_EMAIL,
      "telephone": env.CONTACT_PHONE,
      "contactType": "customer service"
    },
    "sameAs": [
      env.TELEGRAM_URL,
      env.WHATSAPP_URL
    ]
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
};
