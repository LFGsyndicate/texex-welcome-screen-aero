
import { useEffect, useRef } from 'react';
import TRUNK from 'vanta/dist/vanta.trunk.min';
import * as THREE from 'three';

export const VantaBackground = () => {
  const vantaRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!vantaRef.current && containerRef.current) {
      vantaRef.current = TRUNK({
        el: containerRef.current,
        THREE,
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
    }

    return () => {
      if (vantaRef.current) vantaRef.current.destroy();
    };
  }, []);

  return <div ref={containerRef} className="fixed inset-0 -z-10" />;
};

export default VantaBackground;
