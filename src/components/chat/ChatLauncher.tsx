import React, { useState, useEffect } from 'react';
import { MessageSquare, Sparkles, X } from 'lucide-react';

interface ChatLauncherProps {
  isOpen: boolean;
  onToggle: () => void;
  unreadCount?: number;
}

export const ChatLauncher: React.FC<ChatLauncherProps> = ({
  isOpen,
  onToggle,
  unreadCount = 0
}) => {
  const [showWelcomePill, setShowWelcomePill] = useState(false);

  useEffect(() => {
    // Only show gentle indicator on first load if not open and not previously dismissed
    const dismissed = sessionStorage.getItem('primenest_chat_pill_dismissed');
    if (!dismissed && !isOpen) {
      const timer = setTimeout(() => {
        setShowWelcomePill(true);
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleDismissPill = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowWelcomePill(false);
    sessionStorage.setItem('primenest_chat_pill_dismissed', 'true');
  };

  const handleLauncherClick = () => {
    setShowWelcomePill(false);
    sessionStorage.setItem('primenest_chat_pill_dismissed', 'true');
    onToggle();
  };

  return (
    <div
      className={`fixed bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] sm:bottom-6 right-3 sm:right-6 z-40 items-center gap-2 sm:gap-3 max-w-[calc(100vw-1.5rem)] ${
        isOpen ? 'hidden sm:flex' : 'flex'
      }`}
    >
      {/* Optional Welcome Pill Indicator */}
      {showWelcomePill && !isOpen && (
        <div
          role="status"
          onClick={handleLauncherClick}
          className="cursor-pointer bg-[#172720] text-[#E7DCC7] text-xs py-1.5 sm:py-2 px-3 sm:px-3.5 rounded-full border border-[#B69A70]/50 shadow-xl flex items-center gap-1.5 sm:gap-2 animate-in fade-in slide-in-from-right-4 duration-300 hover:border-[#B69A70] max-w-[190px] xs:max-w-none"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#B69A70] shrink-0" />
          <span className="font-sans font-medium hidden xs:inline whitespace-nowrap">Looking for your perfect property?</span>
          <span className="font-sans font-medium xs:hidden whitespace-nowrap text-[11px]">Chat with advisor</span>
          <button
            type="button"
            onClick={handleDismissPill}
            aria-label="Dismiss message"
            className="text-[#777B75] hover:text-white ml-1 p-0.5 shrink-0"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* Launcher Button */}
      <button
        type="button"
        onClick={handleLauncherClick}
        aria-label="Chat with PrimeNest AI"
        aria-expanded={isOpen}
        className="group relative w-14 h-14 rounded-full bg-[#172720] hover:bg-[#202B25] text-[#B69A70] border border-[#B69A70]/50 shadow-2xl flex items-center justify-center transition-all duration-300 hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#B69A70]"
      >
        <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform" />
        
        {/* Subtle status indicator dot */}
        <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-[#B69A70] rounded-full border-2 border-[#172720]" />

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#B69A70] text-[#172720] text-[10px] font-bold rounded-full flex items-center justify-center font-mono">
            {unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};
