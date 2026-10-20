import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface ResilientImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  className?: string;
  containerClassName?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt = 'PrimeNest Property',
  fallbackTitle = 'PrimeNest Architectural Property',
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#202B25] ${containerClassName}`}>
      {!hasError && src ? (
        <>
          <img
            src={src}
            alt={alt}
            referrerPolicy="no-referrer"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
            onError={() => setHasError(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            } ${className}`}
            {...props}
          />
          {!isLoaded && (
            <div className="absolute inset-0 bg-[#202B25] animate-pulse flex items-center justify-center">
              <span className="text-xs text-[#E7DCC7]/40 tracking-widest font-mono">LOADING</span>
            </div>
          )}
        </>
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-[#172720] to-[#202B25] text-[#E7DCC7]/80">
          <div className="w-12 h-12 rounded-full bg-[#B69A70]/10 border border-[#B69A70]/30 flex items-center justify-center mb-3">
            <ImageOff className="w-5 h-5 text-[#B69A70]" />
          </div>
          <p className="text-sm font-serif tracking-wide text-white">{fallbackTitle}</p>
          <span className="text-xs text-[#777B75] mt-1 font-mono tracking-wider">PrimeNest Architectural Archive</span>
        </div>
      )}
    </div>
  );
};
