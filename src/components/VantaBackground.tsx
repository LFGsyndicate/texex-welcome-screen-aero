
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [p5Loaded, setP5Loaded] = useState(false);

  useEffect(() => {
    // Load p5.js first as it's required for TRUNK effect
    const loadP5 = async () => {
      if (!window.p5) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.0/p5.min.js';
        script.async = true;
        script.onload = () => setP5Loaded(true);
        document.head.appendChild(script);
      } else {
        setP5Loaded(true);
      }
    };
    
    loadP5();
    
    return () => {
      // Cleanup function for p5.js script if needed
    };
  }, []);

  useEffect(() => {
    // Only initialize if p5 is loaded, effect doesn't exist and container is available
    if (p5Loaded && !vantaEffect && containerRef.current) {
      // Dynamic import for Vanta TRUNK
      import('vanta/dist/vanta.trunk.min').then((TRUNK) => {
        const effect = TRUNK.default({
          el: containerRef.current,
          THREE: THREE,
          p5: window.p5,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0xfc20d5,
          backgroundColor: 0x4111cf,
          spacing: 0.50,
          chaos: 1.50
        });
        
        setVantaEffect(effect);
      }).catch(error => {
        console.error("Failed to load TRUNK effect:", error);
      });
    }

    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [p5Loaded]); // Run when p5 is loaded

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;
