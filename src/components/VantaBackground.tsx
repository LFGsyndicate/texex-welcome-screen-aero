
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import TRUNK from 'vanta/dist/vanta.trunk.min';

const VantaBackground = () => {
  const [vantaEffect, setVantaEffect] = useState<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaEffect && containerRef.current) {
      const effect = TRUNK({
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
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, [vantaEffect]);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;
