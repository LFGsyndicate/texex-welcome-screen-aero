# Design Document

## Overview

Данный документ описывает техническое решение для обновления цветовой схемы проекта на основе современной палитры цветов из предоставленного скриншота. Основная цель - создать качественную, современную и читаемую цветовую схему, исправить ошибки в коде и оптимизировать производительность.

## Architecture

### Цветовая система
Новая цветовая схема будет основана на следующих ключевых цветах:
- **Primary Blue**: #0D19A3 (основной синий)
- **Dark Blue**: #080F5B (темно-синий для акцентов)
- **Accent Green**: #15D895 (зеленый для кнопок действий)
- **Light Cream**: #F4E4C1 (светлый бежевый для фонов)
- **Gold**: #E4C580 (золотистый для акцентов)

### CSS Variables Structure
Все цвета будут определены как CSS-переменные в `:root` для легкого управления и консистентности:

```css
:root {
  --primary-blue: #0D19A3;
  --dark-blue: #080F5B;
  --accent-green: #15D895;
  --light-cream: #F4E4C1;
  --gold: #E4C580;
  
  /* HSL версии для прозрачности */
  --primary-blue-hsl: 233, 92%, 35%;
  --dark-blue-hsl: 233, 85%, 20%;
  --accent-green-hsl: 162, 77%, 47%;
  --light-cream-hsl: 42, 56%, 88%;
  --gold-hsl: 42, 56%, 70%;
}
```

## Components and Interfaces

### 1. Hero Section Redesign
- **Градиентный фон**: Комбинация primary-blue и dark-blue
- **Текстовые тени**: Оптимизированы для читаемости на новом фоне
- **Кнопки**: Используют accent-green с hover-эффектами

### 2. Glass Cards Update
- **Фон**: Полупрозрачные версии новых цветов
- **Границы**: Тонкие границы с использованием light-cream
- **Hover-эффекты**: Плавные переходы с accent-green

### 3. Vanta.js Background
- **Цвета**: Обновлены для соответствия новой палитре
- **Производительность**: Оптимизация для мобильных устройств
- **Интеграция**: Гармоничное сочетание с остальными элементами

### 4. Button System
- **Primary buttons**: accent-green фон с белым текстом
- **Secondary buttons**: прозрачный фон с accent-green границей
- **Liquid effects**: Обновлены для новой цветовой схемы

## Data Models

### Color Palette Model
```typescript
interface ColorPalette {
  primaryBlue: string;
  darkBlue: string;
  accentGreen: string;
  lightCream: string;
  gold: string;
}

interface ColorVariants {
  base: string;
  light: string;
  dark: string;
  transparent: string;
}
```

### Theme Configuration
```typescript
interface ThemeConfig {
  colors: ColorPalette;
  gradients: {
    hero: string;
    card: string;
    button: string;
  };
  effects: {
    glass: string;
    shadow: string;
    blur: string;
  };
}
```

## Error Handling

### CSS Loading
- Fallback цвета для случаев, когда CSS-переменные не поддерживаются
- Graceful degradation для старых браузеров

### Vanta.js Error Handling
- Try-catch блоки для динамического импорта
- Fallback статический фон при ошибке загрузки
- Проверка поддержки WebGL

### Performance Monitoring
- Lazy loading для тяжелых эффектов
- Оптимизация анимаций для 60fps
- Мониторинг памяти для Vanta.js

## Testing Strategy

### Visual Regression Testing
- Скриншоты ключевых компонентов до и после изменений
- Тестирование на различных размерах экранов
- Проверка читаемости текста на всех фонах

### Performance Testing
- Измерение времени загрузки страницы
- Профилирование использования памяти
- Тестирование плавности анимаций

### Cross-browser Testing
- Chrome, Firefox, Safari, Edge
- Мобильные браузеры iOS/Android
- Проверка поддержки CSS-переменных

### Accessibility Testing
- Контрастность цветов (WCAG 2.1 AA)
- Читаемость для пользователей с нарушениями зрения
- Поддержка высококонтрастных тем

## Implementation Approach

### Phase 1: CSS Variables Setup
1. Обновление `src/index.css` с новыми CSS-переменными
2. Конвертация существующих цветов в новую систему
3. Обновление Tailwind конфигурации

### Phase 2: Component Updates
1. Hero section градиент и текстовые стили
2. Glass cards с новыми цветами
3. Button system обновление
4. Vanta.js конфигурация

### Phase 3: Optimization
1. Удаление неиспользуемых стилей
2. Оптимизация CSS для производительности
3. Тестирование и исправление ошибок

### Phase 4: Quality Assurance
1. Visual testing на всех устройствах
2. Performance benchmarking
3. Accessibility audit
4. Cross-browser validation