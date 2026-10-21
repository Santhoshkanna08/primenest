import React from 'react';
import { Search, Sliders, MessageSquare, Compass, ArrowRight } from 'lucide-react';

interface HowItWorksProps {
  onStartSearch: () => void;
  onOpenEnquiry: () => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onStartSearch, onOpenEnquiry }) => {
  const steps = [
    {
      step: '01',
      title: 'Discover',
      subtitle: 'Explore available properties and projects.',
      detail: 'Browse through master-planned plots, private land holdings, and bespoke villas filtered by contour, region, and scale.',
      icon: Search
    },
    {
      step: '02',
      title: 'Compare',
      subtitle: 'Review location, price, area, and details.',
      detail: 'Examine detailed boundary dimensions, road access width, zoning allowances, and high-resolution architectural media.',
      icon: Sliders
    },
    {
      step: '03',
      title: 'Connect',
      subtitle: 'Send an enquiry to the property team.',
      detail: 'Initiate a direct consultation via WhatsApp, phone, or our digital inquiry system for immediate dossier access.',
      icon: MessageSquare
    },
    {
      step: '04',
      title: 'Visit',
      subtitle: 'Arrange a site visit or property viewing.',
      detail: 'Schedule a private guided walkthrough or ground inspection coordinated by our dedicated property concierges.',
      icon: Compass
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-[#202B25] text-white border-t border-[#E7DCC7]/10 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold text-[#B69A70]">
            THE PROCESS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mt-2 mb-4">
            How It Works
          </h2>
          <p className="text-sm sm:text-base text-[#E7DCC7]/75">
            A transparent four-stage path from initial exploration to private ground inspection.
          </p>
        </div>

        {/* 4-Step Editorial Process */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((st, idx) => {
            const Icon = st.icon;
            return (
              <div
                key={st.step}
                className="bg-[#172720]/80 border border-[#E7DCC7]/15 rounded-lg p-6 sm:p-8 flex flex-col justify-between relative group hover:border-[#B69A70]/60 transition-all duration-300"
              >
                <div>
                  {/* Step number and icon */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-3xl font-serif font-bold text-[#B69A70] font-mono">
                      {st.step}
                    </span>
                    <div className="w-10 h-10 rounded bg-[#202B25] border border-[#E7DCC7]/20 flex items-center justify-center text-[#B69A70] group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>

                  <h3 className="text-xl font-serif text-white mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#E7DCC7]/90 mb-3">
                    {st.subtitle}
                  </p>
                  <p className="text-xs text-[#777B75] leading-relaxed">
                    {st.detail}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E7DCC7]/10 flex items-center justify-between text-[11px] font-mono text-[#B69A70]">
                  <span>STAGE {st.step}</span>
                  {idx < 3 ? (
                    <span className="text-[#777B75]">Next Step →</span>
                  ) : (
                    <span className="text-[#25D366]">Site Ready ✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Action prompt */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStartSearch}
              className="px-8 py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors inline-flex items-center gap-2"
            >
              <span>Start Exploring Properties</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onOpenEnquiry}
              className="px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-[#E7DCC7]/30 text-xs uppercase tracking-widest font-medium rounded transition-colors"
            >
              Speak with a Concierge
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
