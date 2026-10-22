import React, { useState, useEffect } from 'react';
import { Music } from 'lucide-react';
import { audioManager } from '../../lib/audioManager';

interface AmbientMusicPlayerProps {
  className?: string;
}

export const AmbientMusicPlayer: React.FC<AmbientMusicPlayerProps> = ({
  className = ''
}) => {
  const [state, setState] = useState(() => audioManager.getState());
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const unsubscribe = audioManager.subscribe(() => {
      setState(audioManager.getState());
    });

    if (typeof window !== 'undefined') {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      setReducedMotion(mediaQuery.matches);
      const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => {
        unsubscribe();
        mediaQuery.removeEventListener('change', listener);
      };
    }

    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    audioManager.togglePlay();
  };

  const isPlaying = state.isPlaying && !state.isMuted;

  return (
    <div className="relative inline-flex items-center">

      {/* Primary Top Music Toggle Button */}
      <button
        type="button"
        onClick={handleToggle}
        aria-label={isPlaying ? 'Silence ambient music' : 'Play ambient music'}
        title={isPlaying ? 'Silence ambient music' : 'Play ambient music'}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70] ${
          isPlaying
            ? 'bg-[#172720] border border-[#B69A70] text-[#B69A70] shadow-md shadow-black/25'
            : 'bg-[#202B25]/80 hover:bg-[#172720] border border-[#E7DCC7]/25 hover:border-[#B69A70]/60 text-[#E7DCC7]/75 hover:text-white'
        } ${className}`}
      >
        {isPlaying ? (
          <div className="relative flex items-center justify-center">
            <Music className="w-4 h-4 text-[#B69A70]" />
            {/* Subtle active pulse dot - respecting reduced motion */}
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              {!reducedMotion && (
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B69A70] opacity-75" />
              )}
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B69A70]" />
            </span>
          </div>
        ) : (
          <div className="relative flex items-center justify-center">
            <Music className="w-4 h-4 transition-transform group-hover:scale-105" />
            {/* Subtle diagonal slash line indicating music is currently off */}
            <span className="absolute w-5 h-[1.5px] bg-[#E7DCC7]/75 rotate-45 pointer-events-none rounded-full" />
          </div>
        )}
      </button>
    </div>
  );
};
