import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  HURACAN_VARIANT,
  SPEC_COUNTERS,
  VERIFIED_SPECS_TABLE,
} from '../data/huracanData';

gsap.registerPlugin(ScrollTrigger);

export const SpecsSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      SPEC_COUNTERS.forEach((item, idx) => {
        const el = numberRefs.current[idx];
        if (!el) return;
        const counter = { val: 0 };
        gsap.to(counter, {
          val: item.value,
          duration: 1.5,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            once: true,
          },
          onUpdate: () => {
            if (!el) return;
            el.textContent = item.decimals
              ? counter.val.toFixed(item.decimals)
              : Math.round(counter.val).toLocaleString('en-US');
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="specs"
      ref={sectionRef}
      className="relative bg-[#07080a] py-24 md:py-36 px-6 md:px-12 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Variant Identification Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-12 border-b border-white/[0.08]">
          <div>
            <p className="font-mono-tabular text-xs tracking-[0.28em] uppercase text-[#c9a25e]">
              Verified Factory Specifications · {HURACAN_VARIANT.chassisCode}
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white [text-wrap:balance]">
              {HURACAN_VARIANT.fullName}
            </h2>
          </div>
          <p className="text-sm md:text-base text-white/60 max-w-md leading-relaxed">
            {HURACAN_VARIANT.tagline}
          </p>
        </div>

        {/* 6 Animated Headline Performance Counters */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 py-16 border-b border-white/[0.08]">
          {SPEC_COUNTERS.map((stat, idx) => (
            <div key={stat.id} className="group">
              <div className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white">
                <span
                  ref={(el) => {
                    numberRefs.current[idx] = el;
                  }}
                  className="font-mono-tabular"
                >
                  {stat.decimals
                    ? stat.value.toFixed(stat.decimals)
                    : stat.value.toLocaleString('en-US')}
                </span>
                <span className="text-[#c9a25e] text-2xl sm:text-3xl md:text-4xl font-medium">
                  {stat.suffix}
                </span>
              </div>
              <div className="mt-2.5 text-xs font-medium tracking-[0.18em] uppercase text-white/80">
                {stat.label}
              </div>
              <div className="mt-1 text-xs text-white/45">{stat.detail}</div>
            </div>
          ))}
        </div>

        {/* Complete Technical Specification Ledger */}
        <div className="mt-16 max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-2xl font-medium text-white">
              Technical Homologation Data
            </h3>
            <span className="font-mono-tabular text-xs text-white/45">
              US / Global Spec · Dry Weight
            </span>
          </div>

          <div className="divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {VERIFIED_SPECS_TABLE.map((row) => (
              <div
                key={row.label}
                className="py-4 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono-tabular text-[11px] uppercase tracking-[0.14em] text-[#c9a25e] w-24 shrink-0">
                    {row.category}
                  </span>
                  <span className="text-sm text-white/65">{row.label}</span>
                </div>
                <span className="font-mono-tabular text-sm font-medium text-white sm:text-right">
                  {row.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
