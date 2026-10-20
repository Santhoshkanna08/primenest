import React from 'react';
import { Check, Shield, FileCheck2, Eye, Compass, PhoneCall } from 'lucide-react';
import { siteConfig } from '../../data/config';

interface OurApproachProps {
  onOpenConsultation: () => void;
}

export const OurApproach: React.FC<OurApproachProps> = ({ onOpenConsultation }) => {
  const standards = [
    {
      title: 'Physical Ground Verification',
      description: 'Every plot is walked by our team to inspect access roads, slope grades, drainage, and boundary markers before listing.'
    },
    {
      title: 'Direct Document Availability',
      description: 'Zoning clearances, survey sketches, utility status, and freehold deeds are organized and presented during your initial inquiry.'
    },
    {
      title: 'Unvarnished Representation',
      description: 'No misleading wide-angle distortion or airbrushed surroundings. We photograph properties in natural daylight and dusk.'
    },
    {
      title: 'Discreet Client Consultation',
      description: 'Your privacy is paramount. Inquiries, site tours, and negotiations are conducted with total fiduciary confidentiality.'
    }
  ];

  return (
    <section className="py-24 bg-[#F7F5EF] text-[#202B25] border-t border-[#E7DCC7]/40">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="max-w-3xl mb-16">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold text-[#B69A70]">
            OUR COMMITMENT
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight mt-2 mb-4 [text-wrap:balance]">
            The PrimeNest Advisory Standard
          </h2>
          <p className="text-base text-[#777B75] leading-relaxed">
            In an industry often crowded with inflated promises, our philosophy is anchored in verification, transparency, and architectural respect.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {standards.map((std, i) => (
            <div
              key={std.title}
              className="bg-white p-7 rounded-lg border border-[#E7DCC7]/60 shadow-sm hover:border-[#B69A70]/60 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="w-8 h-8 rounded-full bg-[#172720] text-[#B69A70] flex items-center justify-center font-mono text-xs font-bold mb-4">
                  0{i + 1}
                </div>
                <h3 className="text-base font-semibold text-[#172720] mb-2">
                  {std.title}
                </h3>
                <p className="text-xs text-[#777B75] leading-relaxed">
                  {std.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-[#E7DCC7]/30 flex items-center gap-1.5 text-[11px] font-mono text-[#172720]/80">
                <Check className="w-3.5 h-3.5 text-[#B69A70]" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Direct Concierge Banner */}
        <div className="mt-16 bg-[#172720] text-white p-8 sm:p-10 rounded-xl border border-[#B69A70]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-serif text-white">
              Have a Specific Location or Land Requirement?
            </h3>
            <p className="text-xs sm:text-sm text-[#E7DCC7]/80 max-w-xl">
              Our advisory handles bespoke acquisitions and off-market residential plots. Discuss your requirements directly with our senior property director.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 shrink-0">
            <a
              href={`tel:${siteConfig.contact.phoneTel}`}
              className="px-5 py-3 bg-transparent hover:bg-white/10 text-white border border-[#E7DCC7]/40 text-xs uppercase tracking-widest font-semibold rounded transition-colors inline-flex items-center gap-2"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#B69A70]" />
              <span>{siteConfig.contact.phoneDisplay}</span>
            </a>
            <button
              onClick={onOpenConsultation}
              className="px-6 py-3 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors shadow-md"
            >
              Book Advisory Call
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
