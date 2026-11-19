import React, { useEffect, useRef } from 'react';

interface VideoScrollStageProps {
  scrollProgressRef: React.MutableRefObject<number>;
  onReady?: () => void;
  onLoadProgress?: (pct: number) => void;
}

interface FramesManifest {
  count: number;
  pattern: string;
  width?: number;
  height?: number;
  fps?: number;
}

const KEEP_WINDOW = 90;
const DECODE_AHEAD = 36;
const CONCURRENCY = 8;

const STATIC_IMAGES = [
  '/src/assets/images/huracan_aero_windtunnel_1794998143712.jpg',
  '/src/assets/images/huracan_engine_v10_1794998143845.jpg',
  '/src/assets/images/huracan_interior_cockpit_1794998145062.jpg',
  '/src/assets/images/huracan_wheel_ccb_1794998145072.jpg',
];

export const VideoScrollStage: React.FC<VideoScrollStageProps> = ({
  scrollProgressRef,
  onReady,
  onLoadProgress,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    let cancelled = false;
    let rafId = 0;

    const state = {
      blobs: [] as (Blob | null)[],
      bitmaps: new Map<number, ImageBitmap>(),
      decoding: new Set<number>(),
      count: 0,
      pattern: '',
      current: -1,
      target: 0,
      smooth: 0,
      dir: 1,
      ready: false,
    };

    const frameURL = (i: number) =>
      state.pattern.replace('%04d', String(i + 1).padStart(4, '0'));

    const fetchBlob = async (i: number, retries = 2) => {
      if (state.blobs[i] || cancelled) return state.blobs[i];
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const res = await fetch(frameURL(i));
          if (!res.ok) throw new Error(`Failed frame ${i}`);
          const blob = await res.blob();
          if (!cancelled) state.blobs[i] = blob;
          return blob;
        } catch (err) {
          if (attempt === retries || cancelled) return null;
          await new Promise((r) => setTimeout(r, 120 * (attempt + 1)));
        }
      }
      return null;
    };

    const decode = async (i: number) => {
      if (
        cancelled ||
        state.bitmaps.has(i) ||
        state.decoding.has(i) ||
        !state.blobs[i]
      ) {
        return;
      }
      state.decoding.add(i);
      try {
        const bmp = await createImageBitmap(state.blobs[i]!);
        if (cancelled) {
          bmp.close();
        } else {
          state.bitmaps.set(i, bmp);
        }
      } catch {
        // retry cleanly on future tick if decode stalls
      } finally {
        state.decoding.delete(i);
      }
    };

    const manageWindow = (center: number) => {
      for (let d = 0; d <= DECODE_AHEAD; d++) {
        const fwd = center + d * state.dir;
        const back = center - Math.min(d, 8) * state.dir;
        if (fwd >= 0 && fwd < state.count) void decode(fwd);
        if (back >= 0 && back < state.count) void decode(back);
      }
      if (state.bitmaps.size > KEEP_WINDOW * 2) {
        for (const [idx, bmp] of state.bitmaps) {
          if (Math.abs(idx - center) > KEEP_WINDOW) {
            bmp.close();
            state.bitmaps.delete(idx);
          }
        }
      }
    };

    const nearestDecoded = (i: number) => {
      if (state.bitmaps.has(i)) return i;
      for (let d = 1; d < state.count; d++) {
        if (state.bitmaps.has(i - d)) return i - d;
        if (state.bitmaps.has(i + d)) return i + d;
      }
      return -1;
    };

    const drawFrame = (i: number) => {
      const j = nearestDecoded(i);
      if (j < 0) return;
      const bmp = state.bitmaps.get(j);
      if (!bmp) return;

      const cw = canvas.width;
      const ch = canvas.height;
      if (cw === 0 || ch === 0) return;

      ctx.fillStyle = '#050506';
      ctx.fillRect(0, 0, cw, ch);

      // Full-bleed landscape cover scaling on desktop/tablet; preserve full car width on narrow portrait screens
      const aspect = cw / ch;
      const scale =
        aspect >= 1.1
          ? Math.max(cw / bmp.width, ch / bmp.height)
          : Math.min(cw / bmp.width, ch / bmp.height);

      const w = bmp.width * scale;
      const h = bmp.height * scale;
      ctx.drawImage(bmp, (cw - w) / 2, (ch - h) / 2, w, h);
      state.current = j;
    };

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = parent.getBoundingClientRect();
      const targetW = Math.max(1, Math.round(rect.width * dpr));
      const targetH = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== targetW || canvas.height !== targetH) {
        canvas.width = targetW;
        canvas.height = targetH;
        state.current = -1;
        if (state.ready) {
          drawFrame(Math.round(state.smooth));
        }
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }
    window.addEventListener('resize', resize);
    resize();

    let lastT = performance.now();
    const tick = (now: number) => {
      if (cancelled) return;
      const dt = Math.min((now - lastT) / 1000, 0.5) || 0.016;
      lastT = now;

      if (state.ready && state.count > 0) {
        const p = Math.max(0, Math.min(1, scrollProgressRef.current));
        const prevTarget = state.target;
        state.target = p * (state.count - 1);
        if (state.target !== prevTarget) {
          state.dir = state.target >= prevTarget ? 1 : -1;
        }
        const k = 1 - Math.exp(-dt * 15);
        state.smooth += (state.target - state.smooth) * k;
        if (Math.abs(state.target - state.smooth) < 0.35) {
          state.smooth = state.target;
        }
        const idx = Math.max(
          0,
          Math.min(state.count - 1, Math.round(state.smooth))
        );
        manageWindow(idx);
        if (idx !== state.current) {
          drawFrame(idx);
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    const init = async () => {
      try {
        const res = await fetch('/frames/frames.json');
        if (!res.ok) throw new Error('Manifest unavailable');
        const manifest = (await res.json()) as FramesManifest;
        if (cancelled) return;

        state.count = manifest.count;
        state.pattern = manifest.pattern;
        state.blobs = new Array(manifest.count).fill(null);

        const totalItems = manifest.count + STATIC_IMAGES.length;
        let loaded = 0;

        const reportProgress = () => {
          loaded++;
          const pct = Math.min(100, Math.round((loaded / totalItems) * 100));
          onLoadProgress?.(pct);
        };

        let cursor = 0;
        const frameWorker = async () => {
          while (cursor < manifest.count && !cancelled) {
            const idx = cursor++;
            await fetchBlob(idx);
            reportProgress();
          }
        };

        const staticWorker = async (url: string) => {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.onload = () => resolve();
            img.onerror = () => resolve();
            img.src = url;
          });
          reportProgress();
        };

        // Download all frames and static images completely before lifting the curtain
        await Promise.all([
          ...Array.from(
            { length: Math.min(CONCURRENCY, manifest.count) },
            () => frameWorker()
          ),
          ...STATIC_IMAGES.map((url) => staticWorker(url)),
        ]);

        if (cancelled) return;

        // Pre-decode initial frame and immediate upcoming frames for instant responsiveness
        await decode(0);
        for (let i = 1; i < Math.min(24, manifest.count); i++) {
          void decode(i);
        }

        state.ready = true;
        drawFrame(0);
        onLoadProgress?.(100);
        onReady?.();

        rafId = requestAnimationFrame(tick);
      } catch {
        onReady?.();
      }
    };

    void init();

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      window.removeEventListener('resize', resize);
      for (const bmp of state.bitmaps.values()) {
        bmp.close();
      }
      state.bitmaps.clear();
    };
  }, [scrollProgressRef, onReady, onLoadProgress]);

  return (
    <canvas
      ref={canvasRef}
      aria-label="Lamborghini Huracán Tecnica Studio Showcase"
      className="absolute inset-0 w-full h-full block select-none"
    />
  );
};
