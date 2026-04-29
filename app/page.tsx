"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { SmoothScroll } from "@/components/SmoothScroll";
import ImageSequenceScrub from "@/components/ImageSequenceScrub";
import FeatureSections from "@/components/FeatureSections";
import Preloader from "@/components/Preloader";
import MagneticButton from "@/components/MagneticButton";

export default function Home() {
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Staggered entrance animation
    const ctx = gsap.context(() => {
      gsap.from(navRef.current, {
        y: -100,
        opacity: 0,
        duration: 1.2,
        ease: "expo.out",
        delay: 1.5, // Wait for preloader
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Preloader />
      <SmoothScroll>
        <main className="relative bg-black text-white selection:bg-white selection:text-black">
          {/* Navigation - Floating Modern Capsule */}
          <div className="fixed top-8 w-full z-50 flex justify-center px-6">
            <nav
              ref={navRef}
              className="w-full max-w-5xl grid grid-cols-3 items-center px-8 py-4 bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-full shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            >
              {/* Left: Logo */}
              <div className="text-2xl font-bold tracking-tighter text-gradient">
                Wingfi
              </div>

              {/* Center: Unique Pill Links */}
              <div className="hidden md:flex justify-center gap-2">
                {["Design", "Tech", "Specs"].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="px-4 py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-white/40 hover:text-white hover:bg-white/5 rounded-full transition-all duration-300"
                  >
                    {item}
                  </a>
                ))}
              </div>

              {/* Right: Modern Action */}
              <div className="flex justify-end items-center gap-4">
                <div className="h-4 w-[1px] bg-white/10 hidden md:block mr-2" />
                <MagneticButton>
                  <button className="group relative flex items-center justify-center px-8 py-3 bg-white text-black text-[10px] font-black uppercase tracking-[0.3em] rounded-full overflow-hidden transition-all duration-500 hover:scale-105 active:scale-95">
                    <span className="relative z-10">Notify</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-white opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                </MagneticButton>
              </div>
            </nav>
          </div>

          {/* Image Sequence Experience (Hero is now integrated) */}
          <ImageSequenceScrub frameCount={240}>
            <FeatureSections />
          </ImageSequenceScrub>

          {/* Footer */}
          <footer className="py-20 px-10 border-t border-white/10 text-center">
            <div className="text-4xl font-bold mb-6 tracking-tighter uppercase">
              Wingfi
            </div>
            <p className="text-white/40 max-w-md mx-auto mb-10">
              Designed by Apple in California. Experience the next era of
              portable power.
            </p>
            <div className="flex justify-center gap-6 text-sm text-white/60">
              <a href="#" className="hover:text-white transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Instagram
              </a>
              <a href="#" className="hover:text-white transition-colors">
                YouTube
              </a>
            </div>
          </footer>
        </main>
      </SmoothScroll>
    </>
  );
}
