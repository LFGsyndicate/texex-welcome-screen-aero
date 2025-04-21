
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize if effect doesn't exist and container is available
    if (!vantaEffect && containerRef.current) {
      // Dynamic import for Vanta NET
      import('vanta/dist/vanta.net.min').then((NET) => {
        const effect = NET.default({
          el: containerRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x3f55ff,
          backgroundColor: 0x2100b6,
          points: 4.00,
          maxDistance: 10.00,
          spacing: 11.00,
          showDots: true
        });
        
        setVantaEffect(effect);
      });
    }

    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []); // Empty dependency array ensures effect runs only once on mount

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;

