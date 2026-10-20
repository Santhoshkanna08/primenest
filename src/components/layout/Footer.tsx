import React from 'react';
import { MessageSquare, Phone, Mail, MapPin, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/config';
import { propertyCategories } from '../../data/properties';

interface FooterProps {
  onNavigate: (route: string) => void;
  onOpenEnquiry: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenEnquiry }) => {
  return (
    <footer className="bg-[#172720] text-[#E7DCC7] pt-20 pb-12 border-t border-[#E7DCC7]/10">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 pb-16 border-b border-[#E7DCC7]/10">
          {/* Brand & Editorial Column */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded border border-[#B69A70]/60 flex items-center justify-center bg-[#202B25] text-[#B69A70] shrink-0">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-5 h-5">
                  <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" />
                  <path d="M9 21V13H15V21" />
                </svg>
              </div>
              <span className="text-2xl font-serif tracking-tight text-white">
                PrimeNest<span className="text-[#B69A70] font-sans font-light text-base ml-1.5 uppercase tracking-widest">Properties</span>
              </span>
            </div>
            <p className="text-sm text-[#E7DCC7]/70 leading-relaxed max-w-sm">
              An architectural property advisory curating exceptional residential land parcels, bespoke villas, and generational estates for discerning clients.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenEnquiry}
                className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-semibold text-[#172720] bg-[#B69A70] hover:bg-[#E7DCC7] px-4 py-2.5 rounded transition-colors"
              >
                <span>Request Consultation</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B69A70] font-mono font-semibold">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E7DCC7]/80">
              <li>
                <button
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Home Showcase
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/properties')}
                  className="hover:text-white transition-colors"
                >
                  Property Discovery
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/residential-plots')}
                  className="hover:text-white transition-colors"
                >
                  Residential Plots
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Our Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Concierge
                </button>
              </li>
            </ul>
          </div>

          {/* Property Categories */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B69A70] font-mono font-semibold">
              Portfolio
            </h4>
            <ul className="space-y-2.5 text-sm text-[#E7DCC7]/80">
              {propertyCategories.slice(1).map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => onNavigate(`/properties?category=${cat.id}`)}
                    className="hover:text-white transition-colors flex items-center justify-between w-full pr-4 text-left"
                  >
                    <span>{cat.label}</span>
                    <span className="text-xs text-[#777B75] font-mono">{cat.count}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-[#B69A70] font-mono font-semibold">
              Private Office
            </h4>
            <ul className="space-y-3 text-sm text-[#E7DCC7]/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
                <span className="leading-snug">{siteConfig.contact.officeAddress}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#B69A70] shrink-0" />
                <a href={`tel:${siteConfig.contact.phoneTel}`} className="hover:text-white transition-colors">
                  {siteConfig.contact.phoneDisplay}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#B69A70] shrink-0" />
                <a href={`mailto:${siteConfig.contact.email}`} className="hover:text-white transition-colors truncate">
                  {siteConfig.contact.email}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <MessageSquare className="w-4 h-4 text-[#B69A70] shrink-0" />
                <a
                  href={siteConfig.buildWhatsAppUrl("Hello PrimeNest, I would like to enquire about your available properties.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B69A70] hover:text-[#E7DCC7] transition-colors underline text-xs"
                >
                  Direct WhatsApp Advisory
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777B75]">
          <p>© {new Date().getFullYear()} PrimeNest Properties. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('/privacy')}
              className="hover:text-[#E7DCC7] transition-colors"
            >
              Privacy Policy
            </button>
            <span>·</span>
            <button
              onClick={() => onNavigate('/terms')}
              className="hover:text-[#E7DCC7] transition-colors"
            >
              Terms of Service
            </button>
            <span>·</span>
            <span className="font-mono text-[#E7DCC7]/50">Demonstration Model</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
