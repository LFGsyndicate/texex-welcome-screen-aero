
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export const VantaBackground = () => {
  const vantaRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<any>(null);

  useEffect(() => {
    // Wait for the component to be mounted before loading Vanta
    const loadVantaEffect = async () => {
      try {
        // Dynamically import Vanta TRUNK
        const VANTA = (await import('vanta/dist/vanta.trunk.min')).default;
        
        if (!vantaEffect && containerRef.current) {
          const effect = VANTA({
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
        }
      } catch (error) {
        console.error("Failed to load Vanta effect:", error);
      }
    };

    loadVantaEffect();

    // Cleanup function
    return () => {
      if (vantaEffect) {
        vantaEffect.destroy();
      }
    };
  }, [vantaEffect]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;
