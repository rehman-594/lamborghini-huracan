/**
 * Procedural Web Audio API V10 acoustic engine synthesizer.
 * Disabled by default; starts only on explicit user interaction.
 * Zero external audio files — 100% Web Audio oscillators + waveshaping.
 */

class V10AudioEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private oscPrimary: OscillatorNode | null = null;
  private oscFifth: OscillatorNode | null = null;
  private oscSub: OscillatorNode | null = null;
  private enabled = false;
  private currentRpm = 1050;
  private targetRpm = 1050;
  private rafId = 0;

  public isEnabled(): boolean {
    return this.enabled;
  }

  public toggle(): boolean {
    if (this.enabled) {
      this.disable();
    } else {
      this.enable();
    }
    return this.enabled;
  }

  public enable(): void {
    if (this.enabled) return;
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      this.filter = this.ctx.createBiquadFilter();
      this.filter.type = 'lowpass';
      this.filter.frequency.value = 340;
      this.filter.Q.value = 2.4;

      // Subtle warm saturation curve for exhaust character
      const shaper = this.ctx.createWaveShaper();
      const samples = 256;
      const curve = new Float32Array(samples);
      for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + 6) * x * 20 * (Math.PI / 180)) / (Math.PI + 6 * Math.abs(x));
      }
      shaper.curve = curve;

      // 10-cylinder firing frequency: (RPM / 60) * 5
      this.oscPrimary = this.ctx.createOscillator();
      this.oscPrimary.type = 'sawtooth';
      this.oscPrimary.frequency.value = 87.5;

      // 5th harmonic V10 signature howl
      this.oscFifth = this.ctx.createOscillator();
      this.oscFifth.type = 'triangle';
      this.oscFifth.frequency.value = 175;

      // Deep exhaust sub-octave
      this.oscSub = this.ctx.createOscillator();
      this.oscSub.type = 'sine';
      this.oscSub.frequency.value = 43.75;

      const fifthGain = this.ctx.createGain();
      fifthGain.gain.value = 0.35;

      const subGain = this.ctx.createGain();
      subGain.gain.value = 0.6;

      this.oscPrimary.connect(shaper);
      this.oscFifth.connect(fifthGain);
      fifthGain.connect(shaper);
      this.oscSub.connect(subGain);
      subGain.connect(this.filter);

      shaper.connect(this.filter);
      this.filter.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);

      this.oscPrimary.start();
      this.oscFifth.start();
      this.oscSub.start();
    }

    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }

    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.085, this.ctx.currentTime, 0.15);
    }

    this.enabled = true;
    this.startLoop();
  }

  public disable(): void {
    this.enabled = false;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.cancelScheduledValues(this.ctx.currentTime);
      this.masterGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.08);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = 0;
    }
  }

  public setScrollImpulse(velocity: number): void {
    if (!this.enabled) return;
    const clamped = Math.min(Math.abs(velocity) * 2800, 4800);
    this.targetRpm = Math.max(this.targetRpm, 1050 + clamped);
  }

  public triggerRev(): void {
    if (!this.enabled) {
      this.enable();
    }
    this.targetRpm = 7800;
    window.setTimeout(() => {
      this.targetRpm = 1150;
    }, 520);
  }

  private startLoop(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    const step = () => {
      if (!this.enabled || !this.ctx || !this.oscPrimary || !this.oscFifth || !this.oscSub || !this.filter) {
        return;
      }
      // Decay target back to warm idle
      this.targetRpm += (1050 - this.targetRpm) * 0.04;
      this.currentRpm += (this.targetRpm - this.currentRpm) * 0.12;

      const firingHz = (this.currentRpm / 60) * 5;
      const now = this.ctx.currentTime;
      this.oscPrimary.frequency.setTargetAtTime(firingHz, now, 0.03);
      this.oscFifth.frequency.setTargetAtTime(firingHz * 1.5, now, 0.03);
      this.oscSub.frequency.setTargetAtTime(firingHz * 0.5, now, 0.03);
      this.filter.frequency.setTargetAtTime(280 + (this.currentRpm - 1000) * 0.32, now, 0.04);

      this.rafId = requestAnimationFrame(step);
    };
    this.rafId = requestAnimationFrame(step);
  }

  public dispose(): void {
    this.disable();
    if (this.ctx) {
      void this.ctx.close();
      this.ctx = null;
    }
  }
}

export const v10Audio = new V10AudioEngine();
