import React, { useState, useEffect, useRef } from 'react';
import { Compass } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
  fallbackSrc?: string;
}

// Normalizes asset URLs to ensure production compatibility with Vite & Vercel
function normalizeAssetUrl(url?: string): string {
  if (!url) return '';
  let cleanUrl = url.trim();
  // Rewrite legacy development or /src/ relative paths
  if (cleanUrl.startsWith('/src/assets/images/')) {
    cleanUrl = cleanUrl.replace('/src/assets/images/', '/assets/images/');
  } else if (cleanUrl.startsWith('src/assets/images/')) {
    cleanUrl = cleanUrl.replace('src/assets/images/', '/assets/images/');
  }
  // Strip accidental leading /public/
  if (cleanUrl.startsWith('/public/')) {
    cleanUrl = cleanUrl.substring(7);
  }
  return cleanUrl;
}

const DEFAULT_FALLBACK_IMAGE = '/assets/images/hero_luxury_villa_exterior_1792478313210.jpg';

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt = 'PrimeNest Property',
  fallbackTitle = 'PrimeNest Architectural Property',
  className = '',
  containerClassName = '',
  fallbackSrc = DEFAULT_FALLBACK_IMAGE,
  ...props
}) => {
  const normalizedSrc = normalizeAssetUrl(src);
  const normalizedFallback = normalizeAssetUrl(fallbackSrc);

  const [currentSrc, setCurrentSrc] = useState<string>(normalizedSrc);
  const [triedFallback, setTriedFallback] = useState(false);
  const [hasFailedCompletely, setHasFailedCompletely] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Synchronize when the src prop changes
  useEffect(() => {
    const updated = normalizeAssetUrl(src);
    setCurrentSrc(updated);
    setTriedFallback(false);
    setHasFailedCompletely(false);
    setIsLoaded(false);
  }, [src]);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [currentSrc]);

  const handleError = () => {
    if (!triedFallback && normalizedFallback && currentSrc !== normalizedFallback) {
      // Gracefully switch to verified fallback image
      setTriedFallback(true);
      setCurrentSrc(normalizedFallback);
    } else {
      setHasFailedCompletely(true);
    }
  };

  const handleLoad = () => {
    setIsLoaded(true);
  };

  return (
    <div className={`relative overflow-hidden bg-[#202B25] ${containerClassName}`}>
      {!hasFailedCompletely && currentSrc ? (
        <>
          <img
            ref={imgRef}
            src={currentSrc}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={handleLoad}
            onError={handleError}
            className={`w-full h-full object-cover transition-opacity duration-700 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />

          {/* Elegant shimmer background while loading */}
          {!isLoaded && (
            <div className="absolute inset-0 bg-gradient-to-tr from-[#172720] to-[#202B25] animate-pulse flex items-center justify-center">
              <div className="w-8 h-8 rounded-full border border-[#B69A70]/30 flex items-center justify-center">
                <Compass className="w-4 h-4 text-[#B69A70]/60 animate-spin" style={{ animationDuration: '4s' }} />
              </div>
            </div>
          )}
        </>
      ) : (
        /* Architectural Luxury Fallback Canvas */
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#172720] via-[#202B25] to-[#172720] text-[#E7DCC7]/80">
          <div className="w-12 h-12 rounded-full bg-[#B69A70]/10 border border-[#B69A70]/40 flex items-center justify-center mb-3">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-6 h-6 text-[#B69A70]">
              <path d="M3 10L12 3L21 10V20C21 20.5523 20.5523 21 20 21H4C3.44772 21 3 20.5523 3 20V10Z" />
              <path d="M9 21V13H15V21" />
            </svg>
          </div>
          <p className="text-sm font-serif tracking-wide text-[#F7F5EF] max-w-[260px] line-clamp-1">{fallbackTitle}</p>
          <span className="text-[11px] text-[#B69A70] mt-1 font-mono tracking-widest uppercase">PrimeNest Architectural Archive</span>
        </div>
      )}
    </div>
  );
};
