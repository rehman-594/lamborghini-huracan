import React, { useState } from 'react';
import { Eye } from 'lucide-react';
import { COCKPIT_HIGHLIGHTS } from '../data/huracanData';

interface InteriorSectionProps {
  onViewCockpitFilm: () => void;
}

export const InteriorSection: React.FC<InteriorSectionProps> = ({
  onViewCockpitFilm,
}) => {
  const [selectedId, setSelectedId] = useState(COCKPIT_HIGHLIGHTS[0].id);
  const [imgError, setImgError] = useState(false);

  const activeItem =
    COCKPIT_HIGHLIGHTS.find((c) => c.id === selectedId) || COCKPIT_HIGHLIGHTS[0];

  return (
    <section
      id="interior"
      className="relative bg-[#050506] py-24 md:py-36 px-6 md:px-12 border-t border-white/[0.06]"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="font-mono-tabular text-xs tracking-[0.28em] uppercase text-[#c9a25e]">
              Interior Experience
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white [text-wrap:balance]">
              Built around the hands, eyes, and apex.
            </h2>
          </div>

          <button
            type="button"
            onClick={onViewCockpitFilm}
            className="self-start lg:self-auto flex items-center gap-2.5 px-6 py-3 rounded-full bg-[#c9a25e] text-[#050506] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#e5c485] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            <span>View Cockpit Sequence</span>
          </button>
        </div>

        {/* Full-Bleed Interior Studio Visual */}
        <div className="mt-12 relative rounded-2xl border border-white/[0.08] overflow-hidden bg-[#0a0b0e]">
          <div className="aspect-[16/9] w-full">
            {!imgError ? (
              <img
                src="/src/assets/images/huracan_interior_cockpit_1794998145062.jpg"
                alt="Lamborghini Huracán Tecnica Driver Cockpit in Alcantara and Carbon Fiber"
                referrerPolicy="no-referrer"
                onError={() => setImgError(true)}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-[#12141a] to-[#060709] p-12 text-center">
                <p className="font-display text-2xl text-white">
                  Huracán Tecnica Driver Cockpit · Nero Ade Alcantara &amp; Carbon
                </p>
              </div>
            )}
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#050506] via-transparent to-transparent"
          />

          {/* Overlay Caption Bar */}
          <div className="relative md:absolute md:bottom-0 md:left-0 md:right-0 p-6 md:p-10 flex flex-col md:flex-row md:items-end justify-between gap-4 bg-[#050506]/90 md:bg-transparent">
            <div>
              <span className="font-mono-tabular text-xs uppercase tracking-[0.18em] text-[#c9a25e]">
                {activeItem.material} · {activeItem.detailMetric}
              </span>
              <h3 className="mt-1.5 font-display text-2xl md:text-3xl font-semibold text-white">
                {activeItem.title}
              </h3>
              <p className="mt-2 text-sm md:text-base text-white/75 max-w-xl leading-relaxed">
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>

        {/* 6 Cockpit Element Tabs */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {COCKPIT_HIGHLIGHTS.map((item, idx) => {
            const selected = item.id === selectedId;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className={`text-left p-5 rounded-xl border transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a25e] ${
                  selected
                    ? 'border-[#c9a25e]/80 bg-[#111318]'
                    : 'border-white/[0.08] bg-[#090a0d] hover:border-white/25'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] font-mono-tabular uppercase tracking-[0.18em]">
                  <span className={selected ? 'text-[#c9a25e]' : 'text-white/40'}>
                    0{idx + 1} · Cockpit
                  </span>
                  <span className="text-white/45">{item.detailMetric}</span>
                </div>
                <h4 className="mt-2 font-display text-lg font-medium text-white">
                  {item.title}
                </h4>
                <p className="mt-1.5 text-xs text-white/55 leading-relaxed">
                  {item.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
