import React, { useState, useEffect } from 'react';
import { Music, Volume2, X } from 'lucide-react';
import { audioManager } from '../../lib/audioManager';

export const MusicPrompt: React.FC = () => {
  const [state, setState] = useState(() => audioManager.getState());

  useEffect(() => {
    return audioManager.subscribe(() => {
      setState(audioManager.getState());
    });
  }, []);

  // Only show if autoplay was blocked by the browser, user hasn't explicitly disabled music, and music is not already playing
  const shouldShow = state.autoplayBlocked && state.preference !== 'disabled' && !state.isPlaying;

  if (!shouldShow) return null;

  const handleEnableMusic = () => {
    audioManager.play();
  };

  const handleDismiss = (e: React.MouseEvent) => {
    e.stopPropagation();
    audioManager.dismissAutoplayInvitation();
  };

  return (
    <aside
      aria-label="Ambient sound invitation"
      className="fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 left-3 sm:left-6 z-40 max-w-[calc(100vw-6rem)] sm:max-w-xs animate-in fade-in slide-in-from-bottom-4 duration-500"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={handleEnableMusic}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleEnableMusic();
          }
        }}
        className="group cursor-pointer flex items-center gap-2.5 sm:gap-3 bg-[#172720]/95 hover:bg-[#202B25] text-white py-2 px-3 sm:py-2.5 sm:px-4 rounded-full border border-[#B69A70]/60 shadow-xl shadow-black/40 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
      >
        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#B69A70]/20 border border-[#B69A70]/50 flex items-center justify-center text-[#B69A70] shrink-0">
          <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </div>

        <div className="flex flex-col text-left min-w-0 pr-1">
          <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-wider text-[#B69A70] leading-tight truncate">
            Ambient Experience
          </span>
          <span className="text-[11px] sm:text-xs font-medium text-[#F7F5EF] leading-tight truncate">
            Tap to enable music
          </span>
        </div>

        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss music prompt"
          title="Dismiss"
          className="text-[#777B75] hover:text-[#F7F5EF] p-1 rounded-full hover:bg-white/10 transition-colors ml-auto shrink-0 focus:outline-none"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
