import React from 'react';

interface NavbarProps {
  visible: boolean;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ visible, onNavigate }) => {
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-14 md:h-16 px-5 md:px-10 flex items-center justify-between gap-8 border-b border-white/[0.07] bg-[#050506]/95 transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-95 translate-y-0'
      }`}
    >
      {/* Zone 1: Single clean wordmark */}
      <a
        href="#overview"
        onClick={(e) => {
          e.preventDefault();
          onNavigate('overview');
        }}
        className="font-display text-sm md:text-base font-semibold tracking-[0.26em] uppercase text-[#f5f5f7] whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-[#c9a25e]"
      >
        Huracán Tecnica
      </a>

      {/* Zone 2: 5 concise single-line text nav links */}
      <nav aria-label="Primary Navigation" className="hidden md:flex items-center gap-7">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'engineering', label: 'Engineering' },
          { id: 'specs', label: 'Specifications' },
          { id: 'interior', label: 'Cockpit' },
          { id: 'atelier', label: 'Atelier' },
        ].map((link) => (
          <a
            key={link.id}
            href={`#${link.id}`}
            onClick={(e) => {
              e.preventDefault();
              onNavigate(link.id);
            }}
            className="text-xs font-medium tracking-[0.14em] uppercase text-white/65 hover:text-white transition-colors whitespace-nowrap shrink-0 py-1 border-b border-transparent hover:border-[#c9a25e]"
          >
            {link.label}
          </a>
        ))}
      </nav>

      {/* Zone 3: 1 Primary Action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={() => onNavigate('atelier')}
          className="px-4 py-2 rounded-full text-xs font-medium tracking-[0.12em] uppercase transition-colors whitespace-nowrap shrink-0 border cursor-pointer focus-visible:outline-2 focus-visible:outline-[#c9a25e] bg-transparent border-[#c9a25e]/70 text-[#e5c485] hover:bg-[#c9a25e] hover:text-[#050506]"
        >
          Reserve
        </button>
      </div>
    </header>
  );
};
