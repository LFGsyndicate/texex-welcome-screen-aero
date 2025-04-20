
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // We need to dynamically import Vanta since it expects the window to be defined
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
          // Adjusting colors to match the screenshot's blue color
          color: 0x4C5ADF,
          backgroundColor: 0x3443b9,
          spacing: 4.00,
          chaos: 5.00
        });
        
        setVantaEffect(effect);
      });
    }

    // Cleanup function
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;
