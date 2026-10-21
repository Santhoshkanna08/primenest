import React from 'react';
import { Compass, CheckCircle2, ShieldCheck, HeartHandshake, Map } from 'lucide-react';
import { ResilientImage } from '../ui/ResilientImage';

export const WhyPrimeNest: React.FC = () => {
  const principles = [
    {
      number: '01',
      title: 'Thoughtful Property Selection',
      description: 'We do not flood our catalog with thousands of indiscriminate listings. Every plot, villa, and land parcel is evaluated for architectural merit, topographical integrity, and legal clarity before presentation.'
    },
    {
      number: '02',
      title: 'Transparent Information',
      description: 'Dimensional boundary surveys, zoning classifications, road widths, and utility infrastructure are documented accurately. You receive straightforward facts without inflated projections.'
    },
    {
      number: '03',
      title: 'Personalised Guidance',
      description: 'Our advisors take time to understand whether you are designing a custom architectural legacy, acquiring land for generational holding, or seeking a turn-key retreat.'
    },
    {
      number: '04',
      title: 'Support from Enquiry to Site Visit',
      description: 'We arrange private, unhurried property visits, coordinate topographical surveys, and connect you with vetted architects and legal professionals.'
    }
  ];

  return (
    <section id="why-primenest" className="py-16 sm:py-24 bg-[#F7F5EF] text-[#202B25] border-t border-[#E7DCC7]/40 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Architectural Photo Framing */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="aspect-[4/5] rounded-xl overflow-hidden border border-[#E7DCC7] shadow-xl relative group">
              <ResilientImage
                src="/assets/images/luxury_modern_penthouse_1792478315544.jpg"
                alt="Architectural Interior Gallery"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                containerClassName="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                <span className="text-[11px] font-mono tracking-widest text-[#B69A70] uppercase block">
                  OUR PHILOSOPHY
                </span>
                <p className="text-lg sm:text-xl font-serif mt-1 leading-snug">
                  Spaces curated for permanence and peace of mind.
                </p>
              </div>
            </div>

            {/* Refined architectural trust badge docked cleanly below photo */}
            <div className="mt-5 bg-[#172720] text-white p-5 sm:p-6 rounded-xl border border-[#B69A70]/40 shadow-xl flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-[#B69A70]/15 border border-[#B69A70]/40 flex items-center justify-center shrink-0 text-[#B69A70]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-mono text-[#B69A70] uppercase tracking-wider mb-1 font-semibold">
                  PRIMENEST STANDARD
                </p>
                <p className="text-xs sm:text-sm text-[#E7DCC7]/90 leading-relaxed">
                  Zero speculative hype. Only verified plots, land titles, and architectural estates.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 4 Service Principles */}
          <div className="lg:col-span-7 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 mb-3 text-[#B69A70]">
                <Compass className="w-3.5 h-3.5" />
                <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
                  THE PRIMENEST DIFFERENCE
                </span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight leading-tight [text-wrap:balance]">
                Property Decisions Deserve a Better Experience.
              </h2>
              <p className="text-sm sm:text-base text-[#777B75] mt-4 leading-relaxed">
                Navigating high-value real estate should be an inspiring, transparent endeavor, not an obstacle course of uncertain data and hurried sales pressure.
              </p>
            </div>

            {/* Principles list with human editorial numbering */}
            <div className="space-y-6 pt-2">
              {principles.map((pr) => (
                <div key={pr.number} className="flex items-start gap-4 pb-6 border-b border-[#E7DCC7]/60 last:border-0 last:pb-0">
                  <span className="text-lg font-serif font-bold text-[#B69A70] font-mono shrink-0 mt-0.5">
                    {pr.number}
                  </span>
                  <div>
                    <h3 className="text-base font-semibold text-[#172720] mb-1">
                      {pr.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#777B75] leading-relaxed">
                      {pr.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
