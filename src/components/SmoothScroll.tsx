import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

interface SmoothScrollProps {
  children: React.ReactNode;
  onLenisReady?: (lenis: Lenis) => void;
}

export const SmoothScroll: React.FC<SmoothScrollProps> = ({
  children,
  onLenisReady,
}) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.095,
      smoothWheel: true,
    });
    lenisRef.current = lenis;
    onLenisReady?.(lenis);

    lenis.on('scroll', ScrollTrigger.update);
    const raf = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [onLenisReady]);

  return <>{children}</>;
};
