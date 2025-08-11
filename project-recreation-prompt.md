# Texex AI Solutions Platform - Recreation Prompt

Create a modern React-TypeScript web application for an AI solutions marketplace with the following specifications:

## Tech Stack
- **React 18.3.1** + **TypeScript 5.5.3** + **Vite 5.4.1**
- **Tailwind CSS 3.4.11** + **shadcn/ui** components
- **Framer Motion 12.23.12** (LazyMotion + domAnimation)
- **Vanta.js 0.5.24** + **Three.js 0.158.0** for 3D backgrounds
- **React Router DOM**, **React Query**, **React Hook Form + Zod**
- **Radix UI** primitives, **Lucide React** icons

## Design System
**Colors**: Primary Blue (#0D19A3), Dark Blue (#080F5B), Accent Green (#15D895), Light Cream (#F4E4C1), Gold (#E4C580)
**Style**: Glass morphism with backdrop blur, semi-transparent cards, smooth transitions
**Typography**: Inter font family (400-700 weights)
**Layout**: Mobile-first responsive design

## Core Features

### 1. Hero Section
- Dynamic carousel with 7 slides (Marketing, Customer Service, Internal Processes, Content & Media, Small Business, IT Development, Analytics)
- Each slide: category title, value proposition, CTA button
- Embla Carousel with navigation controls
- Smooth scroll to services section

### 2. AI Services Catalog
- 32 services across 7 categories (4-6 services each)
- Service structure: packageId, name, category, targetAudience, painPoint, description, example, price (₽1000), serviceType (Recurring/One-Time)
- Real-time category filtering with debounced search (300ms)
- Glass morphism cards with hover effects
- Payment options: full payment, installments, split payments
- Grid layout: 1-3 columns responsive

### 3. Customer Testimonials
- 15 testimonials with name, title, company, avatar, service used, detailed quote
- Carousel presentation with lazy-loaded avatars
- Variable column display (1-3 based on screen size)

### 4. FAQ Section
- Accordion-style with 3 main questions
- Topics: delivery timelines, technical requirements, custom solutions
- Smooth expand/collapse animations

## Performance Optimizations

### Custom Components
1. **LazyImage**: Intersection Observer API, progressive loading, error fallbacks, smooth transitions
2. **ErrorBoundary**: Component error catching, graceful degradation, fallback UI
3. **PerformanceMonitor**: Web Vitals tracking (LCP, FID, CLS), load time measurement, development logging
4. **VantaBackground**: 3D trunk animation, 2s delayed loading, mobile detection (disabled <768px), reduced motion support, resource cleanup

### Custom Hooks
1. **useDebounce**: Generic debouncing with 300ms delay, proper cleanup
2. **useLoadingState**: Centralized loading states (vanta, images, animations), error tracking

### Optimizations
- React.memo, useMemo, useCallback for expensive operations
- Conditional animations based on prefers-reduced-motion
- Mobile-specific optimizations (Vanta.js disabled)
- Tree shaking and code splitting

## File Structure
```
src/
├── components/
│   ├── ui/ (shadcn components)
│   ├── ErrorBoundary.tsx
│   ├── LazyImage.tsx
│   ├── PerformanceMonitor.tsx
│   └── VantaBackground.tsx
├── data/
│   ├── services.ts (32 AI services)
│   └── testimonials.ts (15 testimonials)
├── hooks/
│   ├── useDebounce.ts
│   └── useLoadingState.ts
├── pages/
│   ├── Index.tsx (main page)
│   └── liquid-glass.css (glass effects)
└── contexts/
    └── LanguageContext.tsx (RU/EN support)
```

## CSS Implementation
**Glass Effects** (liquid-glass.css):
```css
.glass-card {
  background: rgba(244, 228, 193, 0.08);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(244, 228, 193, 0.15);
  box-shadow: 0 8px 32px 0 rgba(8, 15, 91, 0.4);
}
.glass-card:hover {
  background: rgba(21, 216, 149, 0.12);
  border: 1px solid rgba(21, 216, 149, 0.25);
}
```

**Liquid Button**:
```css
.liquid-button {
  background: #15D895;
  border-radius: 9999px;
  transition: all 0.3s ease;
}
.liquid-button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 25px rgba(21, 216, 149, 0.4);
}
```

## Key Implementation Details

### VantaBackground Component
- Import Vanta dynamically with 2s setTimeout
- Check mobile (window.innerWidth < 768) and prefers-reduced-motion
- Set fallback gradient background immediately
- Proper cleanup: destroy effect, delete window.p5
- Error handling with console logging

### Service Filtering
- Categories array from services.map(s => s.category)
- Debounced filter state for smooth UX
- Framer Motion animations with reduced motion support
- Filter buttons with active/inactive states

### Accessibility
- WCAG AA color contrast ratios
- Keyboard navigation support
- ARIA labels and semantic HTML
- Screen reader compatibility
- Focus indicators

### Performance Targets
- <3s initial load time
- <100ms interaction delays
- Lighthouse score >90
- Mobile-optimized bundle size
- Lazy loading for images and heavy components

## Content Structure
**Hero Slides**: 7 category-specific value propositions
**Services**: Detailed AI solutions with pain points, benefits, examples
**Testimonials**: Customer success stories with specific results
**FAQ**: Common concerns about delivery, technical requirements, customization

Create a production-ready application with these specifications, ensuring optimal performance, accessibility, and user experience across all devices.