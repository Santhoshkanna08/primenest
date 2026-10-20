import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, Compass, Shield, Trees, Car, Zap, Calendar, Play, Pause, Maximize2 } from 'lucide-react';
import { Property } from '../../types/property';

interface PlottedDevelopmentsProps {
  onSelectProperty: (property: Property) => void;
  onExploreLand: () => void;
  onScheduleSiteVisit: (property: Property) => void;
  plotsProperty: Property;
}

export const PlottedDevelopments: React.FC<PlottedDevelopmentsProps> = ({
  onSelectProperty,
  onExploreLand,
  onScheduleSiteVisit,
  plotsProperty
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Lazy-load/play video when scrolled into view
  useEffect(() => {
    if (typeof window === 'undefined' || !sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && videoRef.current) {
            videoRef.current.play().catch(() => {});
            setIsPlaying(true);
          } else if (!entry.isIntersecting && videoRef.current) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.25 }
    );

    observer.observe(sectionRef.current);
    return () => observer.disconnect();
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
    <section
      ref={sectionRef}
      className="py-24 bg-[#172720] text-[#F7F5EF] relative overflow-hidden"
    >
      {/* Background radial glow */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#B69A70]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-14">
          <div className="inline-flex items-center gap-2 mb-3 text-[#B69A70]">
            <Compass className="w-3.5 h-3.5" />
            <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold">
              RESIDENTIAL PLOTS & LAND RESERVES
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-white tracking-tight mb-4 [text-wrap:balance]">
            Find the Ground for Your Next Chapter.
          </h2>
          <p className="text-base sm:text-lg text-[#E7DCC7]/80 leading-relaxed max-w-2xl">
            Explore residential plots and discover opportunities to build your future.
          </p>
        </div>

        {/* Master Showcase Layout: Vertical Video Container + Architectural Specifications */}
        <div className="bg-[#202B25] rounded-2xl border border-[#E7DCC7]/15 overflow-hidden p-6 sm:p-10 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column: Natural 9:16 Aspect-Ratio Video Container */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-[340px] sm:max-w-[360px] aspect-[9/16] rounded-xl overflow-hidden border border-[#B69A70]/40 shadow-2xl bg-[#172720] group">
                {/* Poster fallback */}
                <img
                  src="/assets/videos/residential-plots-poster.jpg"
                  alt="Developing Residential Plotted Area"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                    videoLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
                  }`}
                />

                {/* Video Asset 1: Residential Plotted Development */}
                <video
                  ref={videoRef}
                  src="/assets/videos/residential-plots-development.mp4"
                  poster="/assets/videos/residential-plots-poster.jpg"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  onLoadedData={() => setVideoLoaded(true)}
                  className={`w-full h-full object-cover transition-opacity duration-500 ${
                    videoLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Subtle vignette scrims */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

                {/* Top Badge */}
                <div className="absolute top-4 left-4 right-4 z-10 flex items-center justify-between">
                  <span className="text-[10px] font-mono tracking-widest text-[#E7DCC7] uppercase bg-[#172720]/80 backdrop-blur-md px-2.5 py-1 rounded border border-[#B69A70]/30">
                    FIELD FOOTAGE · PLOTTED SECTOR
                  </span>
                  <button
                    type="button"
                    onClick={togglePlayback}
                    aria-label={isPlaying ? 'Pause video' : 'Play video'}
                    className="p-2 rounded-full bg-black/60 hover:bg-[#B69A70] text-white hover:text-[#172720] backdrop-blur-md transition-colors"
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Bottom Overlay Label */}
                <div className="absolute bottom-4 left-4 right-4 z-10 text-white">
                  <span className="text-[11px] font-mono text-[#B69A70] uppercase tracking-wider block">
                    PLOT DEVELOPMENT & TRANSFORMATION
                  </span>
                  <p className="text-sm font-serif font-medium text-white">
                    From Demarcated Land to Finished Home
                  </p>
                  <p className="text-[11px] text-[#E7DCC7]/70 font-mono mt-0.5">
                    Clear boundary demarcation & residential construction readiness
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Land Details, Infrastructure Specs & CTAs */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="text-xs font-mono uppercase tracking-widest text-[#B69A70]">
                  INFRASTRUCTURE & ZONING HIGHLIGHTS
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif text-white mt-1">
                  Master-Planned Plotted Enclaves
                </h3>
                <p className="text-sm sm:text-base text-[#E7DCC7]/80 mt-3 leading-relaxed">
                  Our featured residential plots offer fully completed arterial access roads, underground municipal hookups, and cleared title deeds, ensuring a transparent pathway from purchase to groundbreaking.
                </p>
              </div>

              {/* 4-Item Verified Land Infrastructure Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[#172720]/80 rounded-lg border border-[#E7DCC7]/10 space-y-1">
                  <div className="flex items-center gap-2 text-[#B69A70]">
                    <Trees className="w-4 h-4" />
                    <span className="text-xs font-mono tracking-wider uppercase font-semibold">Plot Sizes</span>
                  </div>
                  <p className="text-base font-semibold text-white">10,000 – 43,560 sq.ft</p>
                  <p className="text-xs text-[#777B75]">Quarter-acre to full-acre parcels with boundary stones</p>
                </div>

                <div className="p-4 bg-[#172720]/80 rounded-lg border border-[#E7DCC7]/10 space-y-1">
                  <div className="flex items-center gap-2 text-[#B69A70]">
                    <Car className="w-4 h-4" />
                    <span className="text-xs font-mono tracking-wider uppercase font-semibold">Arterial Roads</span>
                  </div>
                  <p className="text-base font-semibold text-white">60-Foot Wide Avenues</p>
                  <p className="text-xs text-[#777B75]">Wide asphalt curbs, pedestrian medians, street trees</p>
                </div>

                <div className="p-4 bg-[#172720]/80 rounded-lg border border-[#E7DCC7]/10 space-y-1">
                  <div className="flex items-center gap-2 text-[#B69A70]">
                    <Zap className="w-4 h-4" />
                    <span className="text-xs font-mono tracking-wider uppercase font-semibold">Utilities</span>
                  </div>
                  <p className="text-base font-semibold text-white">100% Underground</p>
                  <p className="text-xs text-[#777B75]">Potable water stubs, 3-phase power, high-speed fiber</p>
                </div>

                <div className="p-4 bg-[#172720]/80 rounded-lg border border-[#E7DCC7]/10 space-y-1">
                  <div className="flex items-center gap-2 text-[#B69A70]">
                    <Shield className="w-4 h-4" />
                    <span className="text-xs font-mono tracking-wider uppercase font-semibold">Legal Clearance</span>
                  </div>
                  <p className="text-base font-semibold text-white">Unencumbered Freehold</p>
                  <p className="text-xs text-[#777B75]">Title documentation & boundary surveys verified</p>
                </div>
              </div>

              {/* Action Buttons: Primary 'Explore Land Projects' CTA navigating with filter */}
              <div className="pt-2 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={onExploreLand}
                  className="px-7 py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center gap-2 shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
                >
                  <span>Explore Land Projects</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onScheduleSiteVisit(plotsProperty)}
                  className="px-6 py-3.5 bg-transparent hover:bg-white/10 text-[#E7DCC7] border border-[#E7DCC7]/30 text-xs uppercase tracking-widest font-semibold rounded transition-colors flex items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
                >
                  <Calendar className="w-4 h-4 text-[#B69A70]" />
                  <span>Arrange Site Visit</span>
                </button>

                <button
                  type="button"
                  onClick={() => onSelectProperty(plotsProperty)}
                  className="text-xs text-[#E7DCC7]/70 hover:text-white underline font-mono tracking-wider ml-auto py-2"
                >
                  View Sample Plot Specification ↗
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
