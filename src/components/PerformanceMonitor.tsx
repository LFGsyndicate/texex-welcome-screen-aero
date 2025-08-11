import { useEffect, useRef } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  interactionDelay: number;
  lcp?: number;
  fid?: number;
  cls?: number;
}

interface PerformanceMonitorProps {
  onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
  enableLogging?: boolean;
}

const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({ 
  onMetricsUpdate,
  enableLogging = process.env.NODE_ENV === 'development'
}) => {
  const metricsRef = useRef<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    interactionDelay: 0
  });

  useEffect(() => {
    const startTime = performance.now();

    // Measure initial load time
    const measureLoadTime = () => {
      const loadTime = performance.now() - startTime;
      metricsRef.current.loadTime = loadTime;
      
      if (enableLogging) {
        console.log(`🚀 Page load time: ${loadTime.toFixed(2)}ms`);
      }
    };

    // Measure render time
    const measureRenderTime = () => {
      const renderTime = performance.now() - startTime;
      metricsRef.current.renderTime = renderTime;
      
      if (enableLogging) {
        console.log(`🎨 Render time: ${renderTime.toFixed(2)}ms`);
      }
    };

    // Measure Web Vitals if available
    const measureWebVitals = () => {
      if ('web-vitals' in window || typeof window !== 'undefined') {
        // LCP (Largest Contentful Paint)
        const observer = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          metricsRef.current.lcp = lastEntry.startTime;
          
          if (enableLogging) {
            console.log(`📊 LCP: ${lastEntry.startTime.toFixed(2)}ms`);
          }
        });
        
        try {
          observer.observe({ entryTypes: ['largest-contentful-paint'] });
        } catch (e) {
          // LCP not supported
        }

        // CLS (Cumulative Layout Shift)
        const clsObserver = new PerformanceObserver((list) => {
          let clsValue = 0;
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value;
            }
          }
          metricsRef.current.cls = clsValue;
          
          if (enableLogging && clsValue > 0) {
            console.log(`📐 CLS: ${clsValue.toFixed(4)}`);
          }
        });
        
        try {
          clsObserver.observe({ entryTypes: ['layout-shift'] });
        } catch (e) {
          // CLS not supported
        }
      }
    };

    // Measure interaction delay
    const measureInteractionDelay = () => {
      let interactionStart = 0;
      
      const handleInteractionStart = () => {
        interactionStart = performance.now();
      };
      
      const handleInteractionEnd = () => {
        if (interactionStart > 0) {
          const delay = performance.now() - interactionStart;
          metricsRef.current.interactionDelay = delay;
          
          if (enableLogging && delay > 100) {
            console.log(`⚡ Interaction delay: ${delay.toFixed(2)}ms`);
          }
        }
      };

      document.addEventListener('click', handleInteractionStart);
      document.addEventListener('click', handleInteractionEnd);
      
      return () => {
        document.removeEventListener('click', handleInteractionStart);
        document.removeEventListener('click', handleInteractionEnd);
      };
    };

    // Run measurements
    measureLoadTime();
    
    // Measure render time after next frame
    requestAnimationFrame(() => {
      measureRenderTime();
    });

    measureWebVitals();
    const cleanupInteraction = measureInteractionDelay();

    // Report metrics periodically
    const reportInterval = setInterval(() => {
      if (onMetricsUpdate) {
        onMetricsUpdate({ ...metricsRef.current });
      }
    }, 5000);

    // Cleanup
    return () => {
      cleanupInteraction();
      clearInterval(reportInterval);
    };
  }, [onMetricsUpdate, enableLogging]);

  // This component doesn't render anything
  return null;
};

export default PerformanceMonitor;