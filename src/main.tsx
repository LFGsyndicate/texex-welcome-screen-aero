import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initAnalytics, trackViewItem } from './utils/analytics'

// Инициализируем аналитику до рендера
initAnalytics()
trackViewItem({ page: 'landing' })

createRoot(document.getElementById("root")!).render(<App />);
