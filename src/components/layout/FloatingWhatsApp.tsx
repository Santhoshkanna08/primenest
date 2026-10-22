import React from 'react';
import { MessageCircle } from 'lucide-react';
import { siteConfig } from '../../data/config';

interface FloatingWhatsAppProps {
  currentPropertyTitle?: string;
  currentPropertyRef?: string;
  isChatOpen?: boolean;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  currentPropertyTitle,
  currentPropertyRef,
  isChatOpen = false,
}) => {
  const whatsappUrl = currentPropertyTitle
    ? siteConfig.buildPropertyWhatsAppUrl(currentPropertyTitle, currentPropertyRef)
    : siteConfig.buildGeneralEnquiryWhatsAppUrl();

  return (
    <aside
      aria-label="Direct messaging contact"
      className={`fixed bottom-[calc(5.25rem+env(safe-area-inset-bottom,0px))] sm:bottom-24 right-3 sm:right-6 z-40 transition-opacity duration-300 ${
        isChatOpen ? 'hidden sm:block' : 'block'
      }`}
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp with PrimeNest concierge"
        className="group flex items-center gap-3 bg-[#202B25] hover:bg-[#172720] text-white px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full border border-[#B69A70]/40 shadow-xl shadow-black/30 transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
      >
        <div className="w-8 h-8 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366] group-hover:scale-110 transition-transform">
          <MessageCircle className="w-4 h-4 fill-current" />
        </div>
        <div className="hidden sm:block text-left pr-1">
          <p className="text-[10px] uppercase font-mono tracking-wider text-[#B69A70] leading-tight">
            Direct Concierge
          </p>
          <p className="text-xs font-semibold text-[#F7F5EF] leading-tight">
            WhatsApp Advisory
          </p>
        </div>
      </a>
    </aside>
  );
};
