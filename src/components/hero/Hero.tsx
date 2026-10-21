import React, { useState, useRef, useEffect } from 'react';
import { ArrowDown, Compass, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { SearchFilterBar } from './SearchFilterBar';
import { SearchFilters } from '../../types/property';

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
  onExploreClick: () => void;
  onProjectsClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onSearch,
  onExploreClick,
  onProjectsClick
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [hasReducedMotion, setHasReducedMotion] = useState(false);

  useEffect(() => {
    // Check for prefers-reduced-motion preference
    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setHasReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setHasReducedMotion(e.matches);
        if (e.matches && videoRef.current) {
          videoRef.current.pause();
          setIsPlaying(false);
        }
      };
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  const togglePlayback = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative min-h-[100svh] w-full flex flex-col justify-between pt-24 sm:pt-28 lg:pt-32 pb-8 sm:pb-10 overflow-hidden bg-[#172720]">
      {/* Background Media Container */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {/* Static poster fallback always loaded first */}
        <img
          src="/assets/videos/luxury-villa-hero-poster.jpg"
          alt="PrimeNest Luxury Architectural Villa at Twilight"
          className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
            videoLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Cinematic Background Video: Asset 2 - Luxury Property Video */}
        {!hasReducedMotion && (
          <video
            ref={videoRef}
            src="/assets/videos/luxury-villa-hero.mp4"
            poster="/assets/videos/luxury-villa-hero-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoLoaded(false)}
            className={`absolute inset-0 w-full h-full object-cover object-center transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Cinematic Scrims: Multi-layer gradient for 100% WCAG AA contrast & luxury ambiance */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#172720]/95 via-[#172720]/80 to-[#172720]/50" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#172720] via-transparent to-[#172720]/60" />
        <div className="absolute inset-0 bg-[#172720]/30 mix-blend-multiply" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full my-auto py-4 sm:py-8">
        <div className="max-w-3xl">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 mb-3 sm:mb-4 text-[#B69A70]">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-[11px] sm:text-xs uppercase tracking-[0.25em] font-mono font-semibold">
              YOUR NEXT CHAPTER STARTS HERE
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-normal text-[#F7F5EF] leading-[1.12] tracking-tight mb-4 sm:mb-6 [text-wrap:balance]">
            Find Your Place in the <span className="italic font-light text-[#E7DCC7]">Extraordinary.</span>
          </h1>

          {/* Supporting Text */}
          <p className="text-sm sm:text-lg lg:text-xl text-[#E7DCC7]/90 font-light leading-relaxed max-w-xl mb-6 sm:mb-8">
            Thoughtfully selected properties. Exceptional places to call your own.
          </p>

          {/* CTAs & Ambient Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-6">
            <button
              onClick={onExploreClick}
              className="w-full sm:w-auto px-8 py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-semibold rounded shadow-lg transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
            >
              Explore Properties
            </button>
            <button
              onClick={onProjectsClick}
              className="w-full sm:w-auto px-7 py-3.5 bg-transparent hover:bg-white/10 text-white border border-[#E7DCC7]/30 text-xs uppercase tracking-widest font-semibold rounded backdrop-blur-sm transition-all duration-200 text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
            >
              Discover Our Projects
            </button>

            {/* Subtle Video Play/Pause Control */}
            {!hasReducedMotion && (
              <button
                type="button"
                onClick={togglePlayback}
                aria-label={isPlaying ? 'Pause background video' : 'Play background video'}
                className="hidden sm:inline-flex items-center gap-2 px-3 py-2 text-xs text-[#E7DCC7]/70 hover:text-white bg-black/30 hover:bg-black/50 border border-[#E7DCC7]/20 rounded backdrop-blur-sm transition-colors"
                title={isPlaying ? 'Pause motion' : 'Play motion'}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5 text-[#B69A70]" /> : <Play className="w-3.5 h-3.5 text-[#B69A70]" />}
                <span className="font-mono text-[10px] tracking-wider uppercase">
                  {isPlaying ? 'Pause Motion' : 'Play Motion'}
                </span>
              </button>
            )}
          </div>

          {/* Property Context Citation */}
          <div className="inline-flex items-center gap-3 text-xs text-[#E7DCC7]/60">
            <span className="font-mono text-[#B69A70]">CINEMATIC SHOWCASE</span>
            <span>·</span>
            <span>Point Dume Architectural Estate</span>
            <span>·</span>
            <span className="font-mono text-[#E7DCC7]/80">4K DUSK FOOTAGE</span>
          </div>
        </div>
      </div>

      {/* Bottom Search Bar & Subtle Scroll Indicator */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-2 sm:mt-4">
        <SearchFilterBar onSearch={onSearch} />

        <div className="flex items-center justify-between pt-5 text-[11px] font-mono uppercase tracking-widest text-[#E7DCC7]/50">
          <span>Curated Real Estate Advisory</span>
          <div className="flex items-center gap-2 animate-bounce">
            <span>SCROLL TO DISCOVER</span>
            <ArrowDown className="w-3.5 h-3.5 text-[#B69A70]" />
          </div>
          <span>PrimeNest Standards</span>
        </div>
      </div>
    </section>
  );
};
