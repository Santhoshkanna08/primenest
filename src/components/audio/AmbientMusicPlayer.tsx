import React, { useState, useEffect } from 'react';
import { Music, Volume2, X } from 'lucide-react';
import { audioManager } from '../../lib/audioManager';

interface AmbientMusicPlayerProps {
  className?: string;
  showInvitationBanner?: boolean;
}

export const AmbientMusicPlayer: React.FC<AmbientMusicPlayerProps> = ({
  className = '',
  showInvitationBanner = true
}) => {
  const [state, setState] = useState(() => audioManager.getState());
  const [dismissedPrompt, setDismissedPrompt] = useState(false);
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

  const handleEnableFromInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.play();
  };

  const handleDismissInvitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDismissedPrompt(true);
    audioManager.dismissAutoplayInvitation();
  };

  const isPlaying = state.isPlaying && !state.isMuted;
  const showPrompt =
    showInvitationBanner &&
    state.autoplayBlocked &&
    !isPlaying &&
    !state.userManuallyPaused &&
    !dismissedPrompt;

  return (
    <div className="relative inline-flex items-center">
      {/* Subtle Autoplay Invitation Tooltip / Chip */}
      {showPrompt && (
        <div
          role="status"
          aria-live="polite"
          onClick={handleEnableFromInvitation}
          className="absolute right-full mr-2.5 whitespace-nowrap cursor-pointer z-50 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#172720]/95 border border-[#B69A70] text-[#E7DCC7] shadow-xl shadow-black/40 text-xs backdrop-blur-md transition-all duration-300 animate-in fade-in slide-in-from-right-2 hover:border-[#E7DCC7]"
        >
          <Volume2 className="w-3.5 h-3.5 text-[#B69A70] shrink-0" />
          <span className="font-sans font-medium tracking-wide text-[11px] sm:text-xs">
            Enable ambient music
          </span>
          <button
            type="button"
            onClick={handleDismissInvitation}
            aria-label="Dismiss ambient music invitation"
            className="ml-1 p-0.5 rounded-full hover:bg-white/10 text-[#777B75] hover:text-white transition-colors"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

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
