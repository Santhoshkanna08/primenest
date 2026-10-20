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

  useEffect(() => {
    const unsubscribe = audioManager.subscribe(() => {
      setState(audioManager.getState());
    });
    return () => unsubscribe();
  }, []);

  const handleToggle = () => {
    audioManager.togglePlay();
  };

  const isPlaying = state.isPlaying && !state.isMuted;

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={isPlaying ? 'Silence music' : 'Play music'}
      title={isPlaying ? 'Silence music' : 'Play music'}
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70] ${
        isPlaying
          ? 'bg-[#172720] border border-[#B69A70] text-[#B69A70] shadow-md shadow-black/25'
          : 'bg-[#202B25]/60 hover:bg-[#172720] border border-[#E7DCC7]/20 hover:border-[#B69A70]/60 text-[#E7DCC7]/70 hover:text-white'
      } ${className}`}
    >
      {isPlaying ? (
        <div className="relative flex items-center justify-center">
          <Music className="w-4 h-4 text-[#B69A70]" />
          {/* Subtle ambient active pulse dot */}
          <span className="absolute -top-1 -right-1 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B69A70] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B69A70]" />
          </span>
        </div>
      ) : (
        <div className="relative flex items-center justify-center">
          <Music className="w-4 h-4 transition-transform group-hover:scale-105" />
          {/* Subtle diagonal slash line to clearly indicate music is silent / off */}
          <span className="absolute w-5 h-[1.5px] bg-[#E7DCC7]/75 rotate-45 pointer-events-none rounded-full" />
        </div>
      )}
    </button>
  );
};
