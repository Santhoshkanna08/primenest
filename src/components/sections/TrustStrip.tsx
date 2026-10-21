import React from 'react';
import { ShieldCheck, FileText, UserCheck, Search } from 'lucide-react';

export const TrustStrip: React.FC = () => {
  const values = [
    {
      icon: ShieldCheck,
      title: 'Curated Opportunities',
      description: 'Hand-vetted residential plots, bespoke estates, and architecturally verified homes.'
    },
    {
      icon: FileText,
      title: 'Clear Property Data',
      description: 'Transparent zoning, documented boundary dimensions, and verified road access.'
    },
    {
      icon: UserCheck,
      title: 'Personalised Assistance',
      description: 'One-on-one consultation from site evaluation to contract preparation.'
    },
    {
      icon: Search,
      title: 'A Simpler Discovery',
      description: 'Search by land contour, square footage, and genuine architectural style.'
    }
  ];

  return (
    <section className="bg-[#202B25] text-[#E7DCC7] border-y border-[#E7DCC7]/10 py-8 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={val.title}
                className="flex items-start gap-4 group"
              >
                <div className="w-10 h-10 rounded bg-[#172720] border border-[#B69A70]/30 flex items-center justify-center text-[#B69A70] shrink-0 group-hover:border-[#B69A70] transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold tracking-wide text-white mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs text-[#E7DCC7]/70 leading-relaxed">
                    {val.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
