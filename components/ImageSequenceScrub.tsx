"use client";

import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { LucideChevronDown } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

interface ImageSequenceScrubProps {
  frameCount: number;
  className?: string;
  children?: React.ReactNode;
}

export default function ImageSequenceScrub({
  frameCount,
  className,
  children,
}: ImageSequenceScrubProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [images, setImages] = useState<HTMLImageElement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);

  const renderState = useRef({
    currentFrame: 0,
    targetFrame: 0,
    progress: 0,
    lastDrawnFrame: -1,
  });

  useEffect(() => {
    const loadedImages: HTMLImageElement[] = [];
    let loadedCount = 0;

    const preloadImages = () => {
      for (let i = 1; i <= frameCount; i++) {
        const img = new Image();
        const frameIndex = i.toString().padStart(3, "0");
        img.src = `/frames/ezgif-frame-${frameIndex}.jpg`;
        img.onload = () => {
          loadedCount++;
          setLoadProgress(Math.floor((loadedCount / frameCount) * 100));
          if (loadedCount === frameCount) {
            setImages(loadedImages);
            setIsLoading(false);
          }
        };
        loadedImages[i - 1] = img;
      }
    };

    preloadImages();
  }, [frameCount]);

  useEffect(() => {
    if (isLoading || images.length === 0) return;

    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: false });
    if (!canvas || !context) return;

    const renderFrame = (frame: number) => {
      const index = Math.min(Math.floor(frame), frameCount - 1);
      if (index === renderState.current.lastDrawnFrame) return;

      const img = images[index];
      if (!img) return;

      const canvasRatio = canvas.width / canvas.height;
      const imgRatio = img.width / img.height;

      let drawWidth, drawHeight, offsetX, offsetY;

      const scaleFactor = 0.95;

      if (canvasRatio > imgRatio) {
        drawHeight = canvas.height * 0.85;
        drawWidth = drawHeight * imgRatio;
      } else {
        drawWidth = canvas.width * scaleFactor;
        drawHeight = drawWidth / imgRatio;
      }

      offsetX = (canvas.width - drawWidth) / 2;
      offsetY = (canvas.height - drawHeight) / 2;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
      renderState.current.lastDrawnFrame = index;
    };

    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
      context.filter = "contrast(1.05) brightness(1.02)";
      context.scale(dpr, dpr);
      renderFrame(renderState.current.currentFrame);
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    // Initial Hero Entrance
    gsap.from(heroTextRef.current, {
      opacity: 0,
      y: 30,
      duration: 1.5,
      ease: "power4.out",
      delay: 1.8,
    });

    // Create a smooth scrub animation for the hero text
    const heroTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "30% top",
        scrub: 1.5,
      }
    });

    if (heroTextRef.current) {
      heroTl.to(heroTextRef.current, {
        x: "-28%", 
        y: 150,
        scale: 0.75,
        opacity: 1,
        ease: "power2.inOut",
      });
    }

    // SMOOTH EXIT: Lifts the whole stage during the last bit of scroll
    const exitTl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "90% top", // Start lifting at 90%
        end: "bottom top",
        scrub: 1.2,
      }
    });

    if (stageRef.current) {
      exitTl.to(stageRef.current, {
        y: -150,
        opacity: 0,
        ease: "power2.in"
      });
    }

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      pin: true,
      pinSpacing: true,
      scrub: true,
      onUpdate: (self) => {
        // Animation completes slightly before the end to leave room for the smooth exit
        const animationProgress = Math.min(1, self.progress / 0.92);
        renderState.current.targetFrame = animationProgress * (frameCount - 1);
      },
    });

    const tickerUpdate = () => {
      const state = renderState.current;
      const delta = (state.targetFrame - state.currentFrame) * 0.15;

      if (Math.abs(delta) > 0.001) {
        state.currentFrame += delta;
        renderFrame(state.currentFrame);
      }
    };

    gsap.ticker.add(tickerUpdate);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      gsap.ticker.remove(tickerUpdate);
      trigger.kill();
    };
  }, [isLoading, images, frameCount]);

  return (
    <div
      ref={containerRef}
      className={cn("relative w-full h-[800vh] bg-black", className)}
    >
      <div className="sticky top-0 w-full h-screen">
        <div ref={stageRef} className="relative w-full h-full">
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover opacity-80 pointer-events-none"
            style={{
              width: "100vw",
              height: "100vh",
              filter: "contrast(1.1) brightness(1.1) saturate(1.1)",
              imageRendering: "auto",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none" />

          <div
            ref={heroTextRef}
            className="absolute inset-0 z-20 flex flex-col items-center justify-center text-center px-4"
          >
            <div className="max-w-4xl">
              <span className="inline-block px-4 py-1.5 mb-8 text-[10px] font-bold tracking-[0.3em] uppercase border border-white/10 rounded-full bg-white/5 backdrop-blur-md text-white/80">
                Future of Power
              </span>
              <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-10 pb-4 text-gradient leading-[1.1]">
                Wingfi Ultra
              </h1>
              <p className="text-xl md:text-2xl text-subtle max-w-3xl mx-auto mb-16 leading-relaxed">
                The world's most advanced portable power solution.{" "}
                <br className="hidden md:block" />
                Engineered for speed, efficiency, and ultimate reliability.
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black z-50">
            <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-300"
                style={{ width: `${loadProgress}%` }}
              />
            </div>
            <p className="mt-4 text-xs tracking-widest uppercase opacity-40">
              Initializing Sequence {loadProgress}%
            </p>
          </div>
        )}
      </div>
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
