import { useCallback, useEffect, useRef, useState } from 'react';
import Lenis from 'lenis';
import { PAINT_FINISHES, PaintFinish, SCROLL_SCENES } from './data/huracanData';
import { SmoothScroll } from './components/SmoothScroll';
import { Navbar } from './components/Navbar';
import { ScrollShowcase } from './components/ScrollShowcase';
import { EngineeringSection } from './components/EngineeringSection';
import { SpecsSection } from './components/SpecsSection';
import { InteriorSection } from './components/InteriorSection';
import { FooterSection } from './components/FooterSection';

export default function App() {
  const [finish, setFinish] = useState<PaintFinish>(PAINT_FINISHES[0]);
  const [navVisible, setNavVisible] = useState(false);
  const [booted, setBooted] = useState(false);
  const [loadPct, setLoadPct] = useState(0);

  const scrollProgressRef = useRef(0);
  const lenisInstanceRef = useRef<Lenis | null>(null);

  // Safety fallback timer in case of catastrophic network failure
  useEffect(() => {
    const timer = window.setTimeout(() => setBooted(true), 45000);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavVisible(window.scrollY > 120);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToY = useCallback((y: number) => {
    if (lenisInstanceRef.current) {
      lenisInstanceRef.current.scrollTo(y, { duration: 1.35 });
    } else {
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  }, []);

  const handleNavigate = useCallback(
    (sectionId: string) => {
      if (sectionId === 'overview') {
        scrollToY(0);
        return;
      }
      const el = document.getElementById(sectionId);
      if (el) {
        if (lenisInstanceRef.current) {
          lenisInstanceRef.current.scrollTo(el, { duration: 1.25 });
        } else {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }
    },
    [scrollToY]
  );

  const handleJumpToScene = useCallback(
    (sceneIndex: number) => {
      const targetScene =
        SCROLL_SCENES.find((s) => s.index === sceneIndex) || SCROLL_SCENES[0];
      const overviewEl = document.getElementById('overview');
      if (!overviewEl) return;

      const maxTrackScroll = overviewEl.offsetHeight - window.innerHeight;
      const targetProgress = Math.max(0, Math.min(1, targetScene.progressPeak));
      const targetY = Math.round(maxTrackScroll * targetProgress);
      scrollToY(targetY);
    },
    [scrollToY]
  );

  const handleViewCockpitFilm = useCallback(() => {
    handleJumpToScene(SCROLL_SCENES.length - 1);
  }, [handleJumpToScene]);

  const handleBackToTop = useCallback(() => {
    scrollToY(0);
  }, [scrollToY]);

  const handleStageReady = useCallback(() => {
    setBooted(true);
  }, []);

  return (
    <SmoothScroll
      onLenisReady={(lenis) => {
        lenisInstanceRef.current = lenis;
      }}
    >
      {/* Initial Brand Curtain */}
      <div
        aria-hidden={booted}
        className={`fixed inset-0 z-[100] bg-[#050506] flex flex-col items-center justify-center gap-5 transition-opacity duration-700 ${
          booted ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <span className="font-display text-sm tracking-[0.42em] uppercase text-[#c9a25e]">
          Huracán Tecnica
        </span>
        <div className="w-44 h-px bg-white/15 overflow-hidden relative">
          <div
            className="absolute inset-y-0 left-0 bg-[#c9a25e] transition-all duration-200"
            style={{ width: `${Math.max(6, loadPct)}%` }}
          />
        </div>
      </div>

      <Navbar visible={navVisible} onNavigate={handleNavigate} />

      <main>
        <ScrollShowcase
          scrollProgressRef={scrollProgressRef}
          onJumpToScene={handleJumpToScene}
          onStageReady={handleStageReady}
          onLoadProgress={setLoadPct}
        />

        <EngineeringSection onInspectScene={handleJumpToScene} />

        <SpecsSection />

        <InteriorSection onViewCockpitFilm={handleViewCockpitFilm} />
      </main>

      <FooterSection
        finish={finish}
        onChangeFinish={setFinish}
        onBackToTop={handleBackToTop}
        onNavigate={handleNavigate}
      />
    </SmoothScroll>
  );
}
