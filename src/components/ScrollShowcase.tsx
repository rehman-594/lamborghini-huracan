import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCROLL_SCENES, SceneSideSlot } from '../data/huracanData';
import { VideoScrollStage } from './VideoScrollStage';

gsap.registerPlugin(ScrollTrigger);

interface ScrollShowcaseProps {
  scrollProgressRef: React.MutableRefObject<number>;
  onJumpToScene: (sceneIndex: number) => void;
  onStageReady?: () => void;
  onLoadProgress?: (pct: number) => void;
}

const SLOT_CLASSES: Record<SceneSideSlot, string> = {
  'top-left':
    'left-5 sm:left-8 md:left-12 top-20 md:top-24 text-left max-w-[270px] sm:max-w-xs',
  'mid-left':
    'left-5 sm:left-8 md:left-10 top-1/2 -translate-y-1/2 text-left max-w-[230px] sm:max-w-[260px]',
  'bottom-left':
    'left-5 sm:left-8 md:left-12 bottom-12 md:bottom-14 text-left max-w-[270px] sm:max-w-xs',
  'top-right':
    'right-5 sm:right-8 md:right-12 top-20 md:top-24 text-right max-w-[270px] sm:max-w-sm',
  'mid-right':
    'right-5 sm:right-8 md:right-10 top-1/2 -translate-y-1/2 text-right max-w-[230px] sm:max-w-[260px]',
  'bottom-right':
    'right-5 sm:right-8 md:right-12 bottom-12 md:bottom-14 text-right max-w-[270px] sm:max-w-sm',
};

export const ScrollShowcase: React.FC<ScrollShowcaseProps> = ({
  scrollProgressRef,
  onJumpToScene,
  onStageReady,
  onLoadProgress,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        const p = self.progress;
        scrollProgressRef.current = p;
        setScrollProgress(p);
      },
    });

    return () => {
      trigger.kill();
    };
  }, [scrollProgressRef]);

  const activeScene =
    SCROLL_SCENES.find(
      (s) => scrollProgress >= s.progressStart && scrollProgress <= s.progressEnd
    ) || SCROLL_SCENES[0];

  const computeSceneOpacity = (
    index: number,
    start: number,
    peak: number,
    end: number,
    p: number
  ) => {
    if (index === 0 && p <= peak) return 1;
    if (index === SCROLL_SCENES.length - 1 && p >= peak) return 1;
    if (p < start || p > end) return 0;
    const rise = Math.max(peak - start, 0.015);
    const fall = Math.max(end - peak, 0.015);
    const inVal = Math.min((p - start) / rise, 1);
    const outVal = Math.min((end - p) / fall, 1);
    return Math.max(0, Math.min(1, Math.min(inVal, outVal) * 1.45));
  };

  return (
    <section
      id="overview"
      ref={trackRef}
      className="relative w-full h-[760vh] bg-[#050506]"
      aria-label="Lamborghini Huracán Tecnica Scroll Showcase"
    >
      {/* Full-Viewport Landscape Background Stage */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050506]">
        {/* Full-Bleed Landscape Video Scrub Canvas */}
        <VideoScrollStage
          scrollProgressRef={scrollProgressRef}
          onReady={onStageReady}
          onLoadProgress={onLoadProgress}
        />

        {/* Subtle Side & Bottom Edge Vignettes for Crisp Legibility Without Dimming the Car */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'linear-gradient(to right, rgba(5,5,6,0.72) 0%, rgba(5,5,6,0.22) 22%, transparent 40%, transparent 60%, rgba(5,5,6,0.22) 78%, rgba(5,5,6,0.72) 100%), linear-gradient(to top, rgba(5,5,6,0.86) 0%, rgba(5,5,6,0.32) 18%, transparent 36%)',
          }}
        />

        {/* Dual-Side Adaptive Editorial Narrative + Technical Specs (Adjusted Per Car Camera Angle) */}
        <div className="pointer-events-none absolute inset-0 z-10">
          {SCROLL_SCENES.map((scene) => {
            const opacity = computeSceneOpacity(
              scene.index,
              scene.progressStart,
              scene.progressPeak,
              scene.progressEnd,
              scrollProgress
            );
            if (opacity <= 0.01) return null;

            const delta = scrollProgress - scene.progressPeak;
            const driftY = delta * -36;
            const titleDriftX = scene.titleSlot.includes('right')
              ? delta * -28
              : delta * 28;
            const specsDriftX = scene.specsSlot.includes('right')
              ? delta * -22
              : delta * 22;

            const isRightTitle = scene.titleSlot.includes('right');
            const isRightSpecs = scene.specsSlot.includes('right');

            return (
              <React.Fragment key={scene.id}>
                {/* Side 1: Chapter Story / Headline (In open dark margin opposite car) */}
                <div
                  style={{
                    opacity,
                    transform: `translate3d(${titleDriftX.toFixed(1)}px, ${driftY.toFixed(1)}px, 0)`,
                  }}
                  className={`absolute ${SLOT_CLASSES[scene.titleSlot]}`}
                >
                  <p className="font-mono-tabular text-[10px] sm:text-[11px] tracking-[0.26em] uppercase text-[#c9a25e] mb-1.5">
                    {scene.label}
                  </p>
                  {scene.index === 0 ? (
                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-white leading-[1.05] [text-wrap:balance] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
                      {scene.title}
                    </h1>
                  ) : (
                    <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-[1.08] [text-wrap:balance] drop-shadow-[0_2px_18px_rgba(0,0,0,0.85)]">
                      {scene.title}
                    </h2>
                  )}
                  <p
                    className={`mt-2 text-xs sm:text-sm text-white/80 leading-relaxed drop-shadow-[0_1px_12px_rgba(0,0,0,0.9)] ${
                      isRightTitle ? 'ml-auto' : ''
                    } max-w-[30ch]`}
                  >
                    {scene.subtitle}
                  </p>

                  {scene.index === SCROLL_SCENES.length - 1 && (
                    <div
                      className={`mt-4 flex ${
                        isRightTitle ? 'justify-end' : 'justify-start'
                      } pointer-events-auto`}
                    >
                      <a
                        href="#engineering"
                        onClick={(e) => {
                          e.preventDefault();
                          document
                            .getElementById('engineering')
                            ?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-5 py-2 rounded-full bg-[#c9a25e] text-[#050506] text-[11px] font-semibold tracking-[0.14em] uppercase hover:bg-[#e5c485] transition-colors shadow-lg"
                      >
                        Explore Engineering ↓
                      </a>
                    </div>
                  )}
                </div>

                {/* Side 2: Paired Technical Telemetry Specs (Opposite margin / floor reflection) */}
                <div
                  style={{
                    opacity,
                    transform: `translate3d(${specsDriftX.toFixed(1)}px, ${(driftY * 0.7).toFixed(1)}px, 0)`,
                  }}
                  className={`hidden sm:block absolute ${SLOT_CLASSES[scene.specsSlot]}`}
                >
                  <div
                    className={`space-y-2.5 border-[#c9a25e]/45 ${
                      isRightSpecs
                        ? 'border-r pr-4 text-right'
                        : 'border-l pl-4 text-left'
                    }`}
                  >
                    {scene.specs.map((spec) => (
                      <div key={spec.label}>
                        <div className="font-mono-tabular text-[10px] tracking-[0.2em] uppercase text-white/50">
                          {spec.label}
                        </div>
                        <div className="font-display text-sm md:text-base font-medium text-white drop-shadow-[0_1px_10px_rgba(0,0,0,0.9)]">
                          {spec.value}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Minimal Bottom-Center Chapter Progress Rail */}
        <div className="absolute bottom-3.5 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5">
          {scrollProgress < 0.03 && (
            <span className="pointer-events-none font-mono-tabular text-[10px] tracking-[0.26em] uppercase text-[#e5c485]/90">
              Scroll to Explore ↓
            </span>
          )}
          <nav
            aria-label="Showcase Chapters"
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#050506]/65 border border-white/[0.08]"
          >
            {SCROLL_SCENES.map((scene) => {
              const isCurrent = activeScene.index === scene.index;
              return (
                <button
                  key={scene.id}
                  type="button"
                  onClick={() => onJumpToScene(scene.index)}
                  title={scene.label}
                  aria-label={`Jump to ${scene.label}`}
                  className="py-1.5 px-0.5 cursor-pointer group focus-visible:outline-2 focus-visible:outline-[#c9a25e]"
                >
                  <span
                    className={`block h-[2px] rounded-full transition-all duration-200 ${
                      isCurrent
                        ? 'w-7 bg-[#c9a25e]'
                        : 'w-3.5 bg-white/30 group-hover:bg-white/70 group-hover:w-5'
                    }`}
                  />
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </section>
  );
};
