import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PropertyImage } from '../../types/property';
import { ResilientImage } from '../ui/ResilientImage';

interface LightboxProps {
  images: PropertyImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onPrev,
  onNext
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') onPrev();
      if (e.key === 'ArrowRight') onNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, onPrev, onNext]);

  if (!isOpen || images.length === 0) return null;

  const current = images[currentIndex] || images[0];

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-4 sm:p-6 backdrop-blur-md"
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between text-white z-10">
        <span className="text-xs font-mono text-[#E7DCC7]/80">
          {currentIndex + 1} / {images.length}
        </span>
        <button
          onClick={onClose}
          aria-label="Close Lightbox"
          className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Image Stage */}
      <div className="relative flex-grow flex items-center justify-center my-auto max-h-[80vh]">
        <ResilientImage
          src={current.url}
          alt={current.caption || 'Property image'}
          className="max-h-[80vh] w-auto max-w-full object-contain mx-auto"
          containerClassName="max-h-[80vh] flex items-center justify-center bg-transparent"
        />

        {/* Prev / Next buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={onPrev}
              aria-label="Previous Image"
              className="absolute left-2 sm:left-6 p-3 rounded-full bg-black/60 hover:bg-[#B69A70] text-white hover:text-[#172720] transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={onNext}
              aria-label="Next Image"
              className="absolute right-2 sm:right-6 p-3 rounded-full bg-black/60 hover:bg-[#B69A70] text-white hover:text-[#172720] transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>

      {/* Caption bar */}
      <div className="text-center text-xs text-[#E7DCC7]/80 font-mono py-2">
        {current.caption || 'PrimeNest Properties Architectural Archive'}
      </div>
    </div>
  );
};
