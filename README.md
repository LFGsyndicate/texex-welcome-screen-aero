# Texex AI Solutions Platform

Modern React-TypeScript web application for AI solutions marketplace with performance optimizations and glass morphism design.

## 🚀 Features

- 32 AI services across 7 categories
- Performance-optimized with lazy loading and debouncing
- Glass morphism design system with modern aesthetics
- Mobile-responsive with accessibility support
- 3D background animations with Vanta.js
- Real-time filtering with smooth transitions
- Error boundaries and performance monitoring
- WCAG AA accessibility compliance

## 🛠️ Tech Stack

- **Frontend**: React 18.3.1 + TypeScript 5.5.3
- **Build Tool**: Vite 5.4.1
- **Styling**: Tailwind CSS 3.4.11 + Glass morphism effects
- **UI Components**: shadcn/ui + Radix UI primitives
- **Animations**: Framer Motion 12.23.12 + Vanta.js + Three.js
- **State Management**: React Query + Custom hooks
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation

## 📦 Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── ErrorBoundary.tsx    # Error handling
│   ├── LazyImage.tsx        # Optimized image loading
│   ├── PerformanceMonitor.tsx # Performance tracking
│   └── VantaBackground.tsx   # 3D background effects
├── data/               # Static data and types
│   ├── services.ts     # AI services catalog (32 services)
│   └── testimonials.ts # Customer testimonials (15 items)
├── hooks/              # Custom React hooks
│   ├── useDebounce.ts  # Debouncing utility
│   └── useLoadingState.ts # Loading state management
├── pages/              # Page components
│   ├── Index.tsx       # Main landing page
│   └── liquid-glass.css # Glass morphism styles
└── contexts/           # React contexts
    └── LanguageContext.tsx # Internationalization (RU/EN)
```

## ⚡ Performance Optimizations

- **Lazy Loading**: Images and heavy components load on demand
- **Debounced Filtering**: Smooth category filtering with 300ms delay
- **Mobile Optimizations**: Vanta.js disabled on mobile devices
- **Error Boundaries**: Graceful error handling with fallbacks
- **Performance Monitoring**: Web Vitals tracking (LCP, FID, CLS)
- **Reduced Motion Support**: Accessibility for motion-sensitive users
- **Bundle Optimization**: Tree shaking and code splitting

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#0D19A3` - Main brand color
- **Dark Blue**: `#080F5B` - Depth and contrast
- **Accent Green**: `#15D895` - Call-to-action elements
- **Light Cream**: `#F4E4C1` - Primary text color
- **Gold**: `#E4C580` - Accent highlights

### Glass Morphism Effects
- Semi-transparent backgrounds with backdrop blur
- Subtle borders and shadows for depth
- Smooth hover transitions
- Layered visual hierarchy

## 📊 AI Services Catalog

The platform showcases **32 AI services** across **7 categories**:

1. **Marketing & Sales** (6 services) - Content creation, copywriting, ad optimization
2. **Customer Service** (4 services) - Chatbots, voice assistants, predictive support
3. **Internal Processes** (5 services) - Document automation, HR, financial forecasting
4. **Content & Media** (5 services) - Video production, music generation, content ideas
5. **Small Business & Startups** (4 services) - Business assistants, landing pages
6. **IT & Development** (2 services) - Developer tools, security auditing
7. **Analytics & Solutions** (2 services) - Business intelligence, reputation monitoring

## 📱 Responsive Design

- **Mobile-first approach** with optimized performance
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly interactions** with proper tap targets
- **Adaptive layouts** for all screen sizes

## ♿ Accessibility Features

- **WCAG AA compliance** with proper color contrast ratios
- **Keyboard navigation** support for all interactive elements
- **Screen reader compatibility** with semantic HTML and ARIA labels
- **Reduced motion support** for users with vestibular disorders
- **Focus indicators** for better navigation visibility

## 📚 Documentation

- **`concept.md`** - Complete technical documentation and architecture overview
- **`project-recreation-prompt.md`** - Condensed recreation guide for developers
- **Performance reports** - Optimization details and metrics

## 🚀 Performance Metrics

- **Development server startup**: 688ms (37% improvement)
- **Build time**: Optimized with Vite
- **Lighthouse score**: 90+ target
- **Core Web Vitals**: LCP, FID, CLS monitoring
- **Bundle size**: Optimized with tree shaking

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Code Quality

- **TypeScript** for type safety
- **ESLint** for code consistency
- **Prettier** for code formatting
- **Tailwind CSS** for consistent styling

## 📄 License

This project is proprietary software developed for Texex AI Solutions Platform.

---

**Built with ❤️ using modern web technologies and performance best practices.**
