import React, { useEffect, useRef, useState } from 'react';

type Props = {
  children: React.ReactNode;
  color?: number;
  backgroundColor?: number;
  chaos?: number;
  disableOnMobile?: boolean;
  respectReducedMotion?: boolean;
  scaleMobile?: number;
};

const TrunkVanta: React.FC<Props> = ({
  children,
  color = 0xc55bf2,
  backgroundColor = 0x2525c3,
  chaos = 3.5,
  disableOnMobile = false,
  respectReducedMotion = false,
  scaleMobile = 0.7,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [effect, setEffect] = useState<any>(null);

  useEffect(() => {
    let mounted = true;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isNarrow = window.innerWidth < 768;

    if (containerRef.current) {
      containerRef.current.style.background = 'linear-gradient(135deg, #0D19A3 0%, #080F5B 100%)';
    }

    if ((respectReducedMotion && prefersReducedMotion) || (disableOnMobile && isNarrow)) {
      return () => {};
    }

    const instantiate = (TRUNK: any) => {
      if (!mounted || !containerRef.current) return false;
      const inst = TRUNK({
        el: containerRef.current,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile,
        color,
        backgroundColor,
        chaos,
      });
      if (!mounted) {
        inst?.destroy?.();
        return true;
      }
      setEffect(inst);
      return true;
    };

    const tryInit = async () => {
      if (!mounted) return false;
      const V = (window as any).VANTA;
      const TRUNK = V?.TRUNK;
      if (TRUNK) return instantiate(TRUNK);

      try {
        const [{ default: p5 }, vanta] = await Promise.all([
          import('p5'),
          import('vanta/dist/vanta.trunk.min'),
        ]);
        (window as any).p5 = p5;
        const effectFactory = (vanta as any).default || (vanta as any);
        return instantiate(effectFactory);
      } catch (e) {
        console.error('Vanta dynamic import failed', e);
        return false;
      }
    };

    let cancelled = false;
    const startedAt = Date.now();
    (async function loopInit() {
      while (!cancelled && Date.now() - startedAt <= 10000) {
        const ok = await tryInit();
        if (ok) break;
        await new Promise(r => setTimeout(r, 250));
      }
    })();

    return () => {
      cancelled = true;
      mounted = false;
      try {
        effect?.destroy?.();
      } catch {}
    };
  }, [color, backgroundColor, chaos, disableOnMobile, respectReducedMotion, scaleMobile]);

  return (
    <div className="relative w-full" style={{ minHeight: '100vh' }}>
      <div ref={containerRef} className="absolute inset-0 z-0 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default TrunkVanta;
