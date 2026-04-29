'use client';

import { ReactLenis } from 'lenis/react';
import { ReactNode, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    // Synchronize Lenis with GSAP ScrollTrigger
    const update = (time: number) => {
      ScrollTrigger.update();
    };

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
  }, []);

  return (
    <ReactLenis root options={{ lerp: 0.15, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  );
}
