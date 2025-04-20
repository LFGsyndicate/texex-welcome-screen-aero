
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only initialize if effect doesn't exist and container is available
    if (!vantaEffect && containerRef.current) {
      // Dynamic import for Vanta TRUNK
      import('vanta/dist/vanta.trunk.min').then((TRUNK) => {
        const effect = TRUNK.default({
          el: containerRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.00,
          minWidth: 200.00,
          scale: 1.00,
          scaleMobile: 1.00,
          color: 0x5569ac,
          backgroundColor: 0x3443b9,
          spacing: 0,
          chaos: 1
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
