import React, { useState, useEffect } from 'react';
import { Bookmark, Menu, X, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '../../data/config';
import { AmbientMusicPlayer } from '../audio/AmbientMusicPlayer';

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  favoritesCount: number;
  onOpenEnquiry: () => void;
  onOpenFavorites: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoute,
  onNavigate,
  favoritesCount,
  onOpenEnquiry,
  onOpenFavorites
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (route: string) => {
    onNavigate(route);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navItems = [
    { label: 'Home', route: '/' },
    { label: 'Properties', route: '/properties' },
    { label: 'Residential Plots', route: '/residential-plots' },
    { label: 'About Us', route: '/about' },
    { label: 'Contact', route: '/contact' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#172720]/95 backdrop-blur-md border-b border-[#E7DCC7]/10 py-3 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-[#172720]/80 via-[#172720]/40 to-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4 lg:gap-8">
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleLinkClick('/')}
            className="flex items-center gap-2 sm:gap-3 text-left focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69A70]"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded border border-[#B69A70]/60 flex items-center justify-center bg-[#172720]/60 text-[#B69A70] shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-4 h-4 sm:w-5 sm:h-5">
                <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" />
                <path d="M9 21V13H15V21" />
              </svg>
            </div>
            <span className="text-lg sm:text-2xl font-serif tracking-tight text-[#F7F5EF] whitespace-nowrap shrink-0">
              PrimeNest<span className="text-[#B69A70] font-sans font-light text-[10px] sm:text-xs md:text-base ml-1 sm:ml-1.5 uppercase tracking-wider sm:tracking-widest hidden xs:inline">Properties</span>
            </span>
          </button>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium tracking-wide text-[#E7DCC7]/80">
            {navItems.map((item) => {
              const isActive = currentRoute === item.route;
              return (
                <button
                  key={item.route}
                  onClick={() => handleLinkClick(item.route)}
                  className={`relative py-1 whitespace-nowrap shrink-0 transition-colors duration-150 hover:text-white ${
                    isActive ? 'text-[#B69A70] font-semibold' : ''
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#B69A70] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action + bookmark quick trigger + ambient music */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-4 shrink-0">
            {/* Ambient Music Control */}
            <AmbientMusicPlayer />

            {/* Saved properties trigger */}
            <button
              onClick={onOpenFavorites}
              aria-label={`Saved properties: ${favoritesCount}`}
              className="relative p-2 text-[#E7DCC7]/80 hover:text-[#B69A70] transition-colors rounded-md focus:outline-none focus-visible:ring-1 focus-visible:ring-[#B69A70]"
              title="Saved Properties"
            >
              <Bookmark className="w-5 h-5" />
              {favoritesCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#B69A70] text-[#172720] text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Primary Action Button */}
            <button
              onClick={onOpenEnquiry}
              className="hidden sm:inline-flex items-center gap-2 px-4 lg:px-5 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#172720] bg-[#B69A70] hover:bg-[#E7DCC7] rounded transition-all duration-200 shadow-sm whitespace-nowrap shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
            >
              <span>Enquire Now</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className="lg:hidden p-2 text-[#F7F5EF] hover:text-[#B69A70] focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden bg-[#172720]/98 backdrop-blur-xl pt-24 px-6 flex flex-col justify-between pb-10 overflow-y-auto">
          <div className="space-y-6">
            <span className="text-xs uppercase tracking-widest text-[#B69A70] font-mono">
              PrimeNest Navigation
            </span>
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.route}
                  onClick={() => handleLinkClick(item.route)}
                  className={`text-left text-2xl font-serif transition-colors py-1 ${
                    currentRoute === item.route ? 'text-[#B69A70]' : 'text-[#F7F5EF]'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4 pt-8 border-t border-[#E7DCC7]/10 mt-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs uppercase tracking-wider font-mono text-[#B69A70]">Ambient Music</span>
              <AmbientMusicPlayer showInvitationBanner={false} />
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenEnquiry();
              }}
              className="w-full py-3.5 text-center text-xs uppercase tracking-widest font-semibold text-[#172720] bg-[#B69A70] rounded shadow-md"
            >
              Enquire Now
            </button>
            <div className="text-center text-xs text-[#777B75]">
              Direct Concierge: <a href={`tel:${siteConfig.contact.phoneTel}`} className="text-[#E7DCC7] underline">{siteConfig.contact.phoneDisplay}</a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
