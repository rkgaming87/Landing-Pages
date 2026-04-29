'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 2;
      });
    }, 30);

    if (progress === 100) {
      const tl = gsap.timeline();
      
      tl.to(textRef.current, {
        opacity: 0,
        y: -20,
        duration: 0.5,
        ease: "power2.inOut"
      })
      .to(containerRef.current, {
        height: 0,
        duration: 1,
        ease: "expo.inOut",
        onComplete: () => {
          if (containerRef.current) containerRef.current.style.display = 'none';
        }
      });
    }

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center overflow-hidden"
    >
      <div ref={textRef} className="text-center">
        <h2 className="text-2xl font-bold tracking-[0.4em] uppercase mb-4 text-white">
          Wingfi
        </h2>
        <div className="w-48 h-[1px] bg-white/20 relative overflow-hidden">
          <div 
            ref={progressRef}
            className="absolute top-0 left-0 h-full bg-white transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-4 text-[10px] tracking-[0.2em] uppercase text-white/40">
          Loading Experience {progress}%
        </div>
      </div>
    </div>
  );
}
