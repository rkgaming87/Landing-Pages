"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  LucideBatteryCharging,
  LucideCpu,
  LucideShieldCheck,
  LucideSmartphone,
  LucideZap,
} from "lucide-react";
import MagneticButton from "./MagneticButton";

gsap.registerPlugin(ScrollTrigger);

const features = [
  {
    title: "GaN Fast Charging",
    description:
      "Next-gen Gallium Nitride technology delivers 140W of pure power in a compact form factor.",
    icon: LucideZap,
  },
  {
    title: "Massive Capacity",
    description:
      "25,000mAh allows you to charge your MacBook Pro once and your iPhone 15 up to five times.",
    icon: LucideBatteryCharging,
  },
  {
    title: "AI Power Management",
    description:
      "Intelligent chips distribute power across ports to ensure the safest and fastest charge for every device.",
    icon: LucideCpu,
  },
  {
    title: "OLED Status Display",
    description:
      "Real-time monitoring of input/output wattage and remaining battery percentage.",
    icon: LucideSmartphone,
  },
  {
    title: "Advanced Safety",
    description:
      "Multi-layered protection against over-voltage, short-circuits, and extreme temperatures.",
    icon: LucideShieldCheck,
  },
];

export default function FeatureSections() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Reveal cards
      const cards = gsap.utils.toArray<HTMLElement>(".reveal-card");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 100,
          opacity: 0,
          scale: 0.9,
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            end: "top 50%",
            scrub: 1,
          },
        });
      });

      // Reveal Showcase Image
      const showcase = document.querySelector(".showcase-frame");
      if (showcase) {
        gsap.from(showcase, {
          y: 150,
          opacity: 0,
          scale: 0.95,
          duration: 2,
          ease: "power4.out",
          scrollTrigger: {
            trigger: showcase,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
        });
      }

      // Final CTA reveal
      const cta = document.querySelector(".cta-reveal");
      if (cta) {
        gsap.from(cta, {
          scale: 0.8,
          opacity: 0,
          duration: 1.5,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: cta,
            start: "top 90%",
            end: "top 60%",
            scrub: 1,
          },
        });
      }
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      {features.map((feature, index) => (
        <section
          key={index}
          className="h-screen relative flex items-center px-10 md:px-20"
        >
          <div
            className={`reveal-card glass p-8 md:p-12 rounded-[2rem] max-w-lg ${
              index % 2 === 0 ? "mr-auto" : "ml-auto"
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-6">
              <feature.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-3xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-white/60 leading-relaxed mb-8">
              {feature.description}
            </p>
            <MagneticButton>
              <button className="px-8 py-4 bg-white text-black font-medium rounded-full hover:scale-105 transition-transform cursor-pointer">
                Technical Specs
              </button>
            </MagneticButton>
          </div>
        </section>
      ))}

      {/* Image Frame Showcase Section (Restored with GSAP) */}
      <section className="h-screen flex items-center justify-center px-10">
        <div className="showcase-frame relative w-full max-w-6xl aspect-video rounded-[3rem] overflow-hidden border border-white/10 shadow-2xl">
          <img
            src="/frames/ezgif-frame-240.jpg"
            alt="Wingfi Ultra Showcase"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-12 left-12">
            <h2 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
              Masterfully Crafted.
            </h2>
            <p className="text-white/60 text-lg md:text-xl max-w-xl">
              Every curve, every port, every pixel of the OLED display has been
              engineered for perfection.
            </p>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="h-screen flex items-center justify-center">
        <div className="cta-reveal text-center">
          <h2 className="text-5xl md:text-7xl font-bold mb-8 text-gradient">
            Power on demand.
          </h2>
          <MagneticButton className="inline-block">
            <button className="px-12 py-6 bg-white text-black text-xl font-semibold rounded-full hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all">
              Order Yours
            </button>
          </MagneticButton>
        </div>
      </section>

      {/* Spacer for smooth exit */}
      <div className="h-[50vh]" />
    </div>
  );
}
