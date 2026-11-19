import React, { useState } from 'react';
import { ArrowUp, Check } from 'lucide-react';
import { PAINT_FINISHES, PaintFinish } from '../data/huracanData';

interface FooterSectionProps {
  finish: PaintFinish;
  onChangeFinish: (finish: PaintFinish) => void;
  onBackToTop: () => void;
  onNavigate: (id: string) => void;
}

export const FooterSection: React.FC<FooterSectionProps> = ({
  finish,
  onChangeFinish,
  onBackToTop,
  onNavigate,
}) => {
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Sant’Agata / Milan');
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }
    setErrorMsg('');
    setSubmitted(true);
  };

  return (
    <footer
      id="atelier"
      className="relative bg-[#050506] border-t border-white/[0.08] pt-24 pb-16 px-6 md:px-12"
    >
      <div className="max-w-7xl mx-auto">
        {/* Closing Manifesto + Atelier Config Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20 border-b border-white/[0.08] items-start">
          <div className="lg:col-span-7">
            <p className="font-mono-tabular text-xs tracking-[0.28em] uppercase text-[#c9a25e]">
              Custom Studio
            </p>
            <h2 className="mt-4 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-white [text-wrap:balance]">
              Pure ten-cylinder emotion. Commissioned to your specification.
            </h2>
            <p className="mt-5 text-base text-white/60 max-w-xl leading-relaxed">
              Your selected custom specification is{' '}
              <span className="text-white font-medium">{finish.name}</span>. Choose your
              preferred exterior finish below to prepare a private specification dossier.
            </p>

            {/* Custom Exterior Finish Selector for Dossier */}
            <div className="mt-8">
              <div className="text-xs font-mono-tabular uppercase tracking-[0.16em] text-white/45 mb-3">
                Custom Exterior Finish · {finish.name}
              </div>
              <div className="flex flex-wrap items-center gap-3">
                {PAINT_FINISHES.map((p) => {
                  const active = p.id === finish.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => onChangeFinish(p)}
                      className={`flex items-center gap-2.5 px-3.5 py-2 rounded-full border text-xs transition-colors cursor-pointer ${
                        active
                          ? 'border-[#c9a25e] bg-[#14151a] text-white'
                          : 'border-white/10 bg-[#0a0b0e] text-white/60 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/25"
                        style={{ backgroundColor: p.hex }}
                      />
                      <span>{p.italianName}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Private Atelier Specification Request Card */}
          <div className="lg:col-span-5 rounded-2xl border border-white/[0.08] bg-[#0a0b0e] p-7 md:p-8">
            <h3 className="font-display text-xl font-semibold text-white">
              Request Private Showroom Dossier
            </h3>
            <p className="mt-1.5 text-xs text-white/55 leading-relaxed">
              Receive the full Huracán Tecnica technical dossier with your selected{' '}
              {finish.italianName} trim.
            </p>

            {submitted ? (
              <div className="mt-6 p-5 rounded-xl border border-[#c9a25e]/40 bg-[#121318]">
                <div className="flex items-center gap-2.5 text-sm font-medium text-[#e5c485]">
                  <Check className="w-4 h-4" />
                  <span>Specification Dossier Prepared</span>
                </div>
                <p className="mt-2 text-xs text-white/65 leading-relaxed">
                  Configuration recorded for <span className="text-white">{email}</span>{' '}
                  in <span className="text-white">{finish.name}</span> ({city}).
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setEmail('');
                  }}
                  className="mt-4 text-xs text-white/60 hover:text-white underline underline-offset-4 cursor-pointer"
                >
                  Configure another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4" noValidate>
                <div>
                  <label
                    htmlFor="atelier-email"
                    className="block text-xs font-medium text-white/70 mb-1.5"
                  >
                    Email Address
                  </label>
                  <input
                    id="atelier-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="driver@studio.com"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-[#050506] text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#c9a25e]"
                  />
                </div>
                <div>
                  <label
                    htmlFor="atelier-city"
                    className="block text-xs font-medium text-white/70 mb-1.5"
                  >
                    Preferred Flagship Lounge
                  </label>
                  <select
                    id="atelier-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-white/15 bg-[#050506] text-sm text-white focus:outline-none focus:border-[#c9a25e]"
                  >
                    <option value="New York Manhattan">New York Manhattan</option>
                    <option value="Beverly Hills">Beverly Hills</option>
                    <option value="Miami South Beach">Miami South Beach</option>
                    <option value="London Mayfair">London Mayfair</option>
                    <option value="Tokyo Aoyama">Tokyo Aoyama</option>
                  </select>
                </div>

                {errorMsg && (
                  <p className="text-xs text-[#f87171]" role="alert">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-full bg-[#c9a25e] text-[#050506] text-xs font-semibold tracking-[0.14em] uppercase hover:bg-[#e5c485] transition-colors cursor-pointer"
                >
                  Request Specification Dossier
                </button>
              </form>
            )}
          </div>
        </div>

        {/* 4-Column Editorial Footer + Back to Top */}
        <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-8 items-start">
          <div className="col-span-2 md:col-span-1">
            <span className="font-display text-sm font-semibold tracking-[0.26em] uppercase text-[#c9a25e]">
              Huracán Tecnica
            </span>
            <p className="mt-3 text-xs text-white/45 leading-relaxed max-w-xs">
              Digital flagship showcase celebrating naturally aspirated V10 performance
              and precision engineering.
            </p>
          </div>

          <div>
            <h4 className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-white/45 mb-3">
              Showcase
            </h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Studio Film
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('engineering')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Engineering
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('specs')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  V10 Specifications
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-mono-tabular text-[11px] uppercase tracking-[0.2em] text-white/45 mb-3">
              Craft
            </h4>
            <ul className="space-y-2 text-sm text-white/65">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('interior')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Interior Cockpit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('atelier')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Custom Finishes
                </button>
              </li>
            </ul>
          </div>

          <div className="flex flex-col items-start md:items-end justify-between">
            <button
              type="button"
              onClick={onBackToTop}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 text-xs font-medium tracking-[0.14em] uppercase text-white hover:border-[#c9a25e] hover:text-[#e5c485] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
              <span>Back to Top</span>
            </button>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono-tabular uppercase tracking-[0.16em] text-white/35">
          <span>Automobili Lamborghini · Huracán Tecnica</span>
          <span>640 hp · 5.2L V10</span>
        </div>
      </div>
    </footer>
  );
};
