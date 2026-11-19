import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ENGINEERING_FEATURES } from '../data/huracanData';

interface EngineeringSectionProps {
  onInspectScene: (sceneIndex: number) => void;
}

export const EngineeringSection: React.FC<EngineeringSectionProps> = ({
  onInspectScene,
}) => {
  const [activeId, setActiveId] = useState(ENGINEERING_FEATURES[0].id);
  const [imgErrorMap, setImgErrorMap] = useState<Record<string, boolean>>({});

  const activeFeature =
    ENGINEERING_FEATURES.find((f) => f.id === activeId) || ENGINEERING_FEATURES[0];

  // Pick the closest editorial studio visual for subsystems without dedicated solo photos
  const visualSrc =
    activeFeature.image ||
    (activeFeature.id === 'headlights' || activeFeature.id === 'side-profile'
      ? '/src/assets/images/huracan_aero_windtunnel_1794998143712.jpg'
      : activeFeature.id === 'exhaust'
        ? '/src/assets/images/huracan_engine_v10_1794998143845.jpg'
        : '/src/assets/images/huracan_interior_cockpit_1794998145062.jpg');

  const visualAlt =
    activeFeature.imageAlt || `${activeFeature.title} — Lamborghini Huracán Tecnica`;

  return (
    <section
      id="engineering"
      className="relative bg-[#050506] py-24 md:py-36 px-6 md:px-12 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="max-w-3xl">
          <p className="font-mono-tabular text-xs tracking-[0.28em] uppercase text-[#c9a25e]">
            Design &amp; Engineering
          </p>
          <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white [text-wrap:balance]">
            Form dictated by airflow, inertia, and ten cylinders.
          </h2>
          <p className="mt-5 text-base md:text-lg text-white/65 leading-relaxed max-w-2xl">
            Every surface on the Huracán Tecnica serves a mechanical function—balancing
            35% higher rear downforce with a 20% reduction in aerodynamic drag.
          </p>
        </div>

        {/* Interactive 7-Subsystem Explorer */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">
          {/* Left: 7 Clean Editorial Selectors */}
          <div className="lg:col-span-5 flex flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
            {ENGINEERING_FEATURES.map((feat) => {
              const selected = feat.id === activeId;
              return (
                <button
                  key={feat.id}
                  type="button"
                  onClick={() => setActiveId(feat.id)}
                  onMouseEnter={() => setActiveId(feat.id)}
                  className={`group text-left py-4 px-3 transition-colors duration-200 flex items-center justify-between gap-4 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a25e] ${
                    selected ? 'bg-white/[0.04]' : 'hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-baseline gap-4 min-w-0">
                    <span
                      className={`font-mono-tabular text-xs shrink-0 transition-colors ${
                        selected ? 'text-[#c9a25e]' : 'text-white/35 group-hover:text-white/60'
                      }`}
                    >
                      {feat.number}.
                    </span>
                    <div className="min-w-0">
                      <div
                        className={`font-display text-base md:text-lg font-medium truncate transition-colors ${
                          selected ? 'text-white' : 'text-white/65 group-hover:text-white'
                        }`}
                      >
                        {feat.title}
                      </div>
                      <div className="text-xs text-white/40 mt-0.5 truncate">
                        {feat.kicker} · {feat.metric}
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight
                    className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                      selected
                        ? 'text-[#c9a25e] translate-x-0.5 -translate-y-0.5'
                        : 'text-white/25 group-hover:text-white/60'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Right: Spotlight Detail + High-Res Editorial Studio Visual */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-white/[0.08] bg-[#0a0b0e] overflow-hidden">
            <div className="relative aspect-[16/10] w-full bg-[#07080a] overflow-hidden">
              {!imgErrorMap[visualSrc] ? (
                <img
                  key={visualSrc}
                  src={visualSrc}
                  alt={visualAlt}
                  referrerPolicy="no-referrer"
                  onError={() =>
                    setImgErrorMap((prev) => ({ ...prev, [visualSrc]: true }))
                  }
                  className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                />
              ) : (
                <div className="h-full w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#12141a] to-[#07080a] p-8 text-center">
                  <span className="font-mono-tabular text-xs tracking-[0.22em] uppercase text-[#c9a25e]">
                    {activeFeature.kicker}
                  </span>
                  <span className="mt-2 font-display text-2xl text-white">
                    {activeFeature.title}
                  </span>
                </div>
              )}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#0a0b0e] via-transparent to-transparent"
              />
            </div>

            <div className="p-7 md:p-9 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs font-mono-tabular uppercase tracking-[0.18em] text-[#c9a25e]">
                  <span>{activeFeature.number}. {activeFeature.kicker}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-white/70">{activeFeature.metric}</span>
                </div>
                <h3 className="mt-3 font-display text-2xl md:text-3xl font-semibold text-white">
                  {activeFeature.title}
                </h3>
                <p className="mt-3 text-sm md:text-base text-white/65 leading-relaxed">
                  {activeFeature.summary}
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-white/[0.07] pt-5">
                  {activeFeature.details.map((item, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 text-sm text-white/75"
                    >
                      <span className="font-mono-tabular text-xs text-[#c9a25e] mt-0.5">
                        —
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-5 border-t border-white/[0.07] flex items-center justify-between gap-4">
                <span className="text-xs text-white/45">
                  Jump directly to this chapter in the studio showcase
                </span>
                <button
                  type="button"
                  onClick={() => onInspectScene(activeFeature.cameraSceneIndex)}
                  className="px-5 py-2.5 rounded-full border border-[#c9a25e]/70 text-[#e5c485] text-xs font-medium tracking-[0.12em] uppercase hover:bg-[#c9a25e] hover:text-[#050506] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                >
                  View Angle
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3-Visual Engineering Gallery Row */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: 'Wind-Tunnel Silhouette',
              caption: 'Flat underbody and integrated front bumper air curtains.',
              img: '/src/assets/images/huracan_aero_windtunnel_1794998143712.jpg',
              scene: 2,
            },
            {
              title: '5.2L Naturally Aspirated V10',
              caption: 'Bronze valve covers under forged carbon structural bracing.',
              img: '/src/assets/images/huracan_engine_v10_1794998143845.jpg',
              scene: 7,
            },
            {
              title: '20" Forged Damiso & CCB',
              caption: '380 mm cross-drilled carbon-ceramic rotors with monobloc calipers.',
              img: '/src/assets/images/huracan_wheel_ccb_1794998145072.jpg',
              scene: 4,
            },
          ].map((card) => (
            <button
              key={card.title}
              type="button"
              onClick={() => onInspectScene(card.scene)}
              className="group text-left rounded-xl border border-white/[0.08] bg-[#0a0b0e] overflow-hidden hover:border-[#c9a25e]/50 transition-colors cursor-pointer"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-[#07080a]">
                <img
                  src={card.img}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5">
                <h4 className="font-display text-lg font-medium text-white group-hover:text-[#e5c485] transition-colors">
                  {card.title}
                </h4>
                <p className="mt-1 text-xs text-white/55 leading-relaxed">
                  {card.caption}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
