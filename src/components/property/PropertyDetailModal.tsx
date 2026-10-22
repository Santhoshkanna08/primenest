import React, { useState } from 'react';
import {
  X,
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Calendar,
  MessageCircle,
  Share2,
  Bookmark,
  CheckCircle2,
  Compass,
  ArrowRight,
  Shield,
  Layers,
  Sparkles
} from 'lucide-react';
import { Property } from '../../types/property';
import { ResilientImage } from '../ui/ResilientImage';
import { Lightbox } from './Lightbox';
import { siteConfig } from '../../data/config';

interface PropertyDetailModalProps {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenEnquiry: (property: Property) => void;
  onScheduleSiteVisit: (property: Property) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  relatedProperties: Property[];
  onSelectProperty: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  onOpenEnquiry,
  onScheduleSiteVisit,
  isFavorite,
  onToggleFavorite,
  relatedProperties,
  onSelectProperty
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!isOpen || !property) return null;

  const currentImage = property.images[selectedImageIndex] || property.images[0];

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard?.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    }
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="property-detail-title"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-start justify-center p-2 sm:p-4 md:p-6"
      >
        <div className="bg-[#F7F5EF] text-[#202B25] w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden my-6 border border-[#E7DCC7]">
          {/* Header Bar */}
          <div className="bg-[#172720] text-white px-6 py-4 flex items-center justify-between border-b border-[#E7DCC7]/20 sticky top-0 z-30">
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-[#B69A70] tracking-wider uppercase">
                {property.refCode}
              </span>
              <span className="text-white/40">·</span>
              <span className="text-xs uppercase tracking-widest text-[#E7DCC7]/80">
                {property.categoryLabel}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={(e) => onToggleFavorite(property.id, e)}
                aria-label={isFavorite ? 'Remove from saved' : 'Save property'}
                className={`p-2 rounded-full transition-colors ${
                  isFavorite ? 'bg-[#B69A70] text-[#172720]' : 'hover:bg-white/10 text-white'
                }`}
                title="Save Property"
              >
                <Bookmark className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                aria-label="Share property link"
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
                title="Copy link"
              >
                <Share2 className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {copiedLink && (
            <div className="bg-[#B69A70] text-[#172720] text-xs py-1.5 px-4 text-center font-mono font-medium">
              Property link copied to clipboard
            </div>
          )}

          {/* Main Stage: Image Gallery */}
          <div className="bg-[#202B25] relative">
            <div
              className="relative aspect-[16/9] max-h-[520px] w-full cursor-zoom-in overflow-hidden"
              onClick={() => setIsLightboxOpen(true)}
            >
              <ResilientImage
                src={currentImage.url}
                alt={currentImage.caption || property.title}
                className="w-full h-full object-cover"
                containerClassName="h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              <div className="absolute bottom-4 left-4 right-4 z-10 flex items-end justify-between text-white">
                <span className="text-xs font-mono text-[#E7DCC7]/90 bg-black/60 backdrop-blur-md px-3 py-1 rounded">
                  {currentImage.caption || `Image ${selectedImageIndex + 1} of ${property.images.length}`}
                </span>
                <span className="text-xs font-mono text-[#B69A70] bg-black/60 backdrop-blur-md px-3 py-1 rounded">
                  Click to Expand Lightbox ↗
                </span>
              </div>
            </div>

            {/* Thumbnail Navigation Strip */}
            {property.images.length > 1 && (
              <div className="flex items-center gap-3 p-4 overflow-x-auto bg-[#172720] border-t border-[#E7DCC7]/10">
                {property.images.map((img, idx) => (
                  <button
                    key={img.url + idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-14 rounded overflow-hidden shrink-0 transition-all ${
                      selectedImageIndex === idx
                        ? 'ring-2 ring-[#B69A70] scale-105'
                        : 'opacity-60 hover:opacity-100'
                    }`}
                  >
                    <ResilientImage
                      src={img.url}
                      alt={img.caption || `Thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                      containerClassName="h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Detail Content */}
          <div className="p-6 sm:p-8 md:p-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Column: Story, Specs, Amenities */}
              <div className="lg:col-span-8 space-y-8">
                {/* Title & Location Header */}
                <div>
                  <div className="flex items-center gap-2 text-xs text-[#777B75] mb-2 font-mono">
                    <MapPin className="w-4 h-4 text-[#B69A70]" />
                    <span>{property.location.neighborhood}, {property.location.city}, {property.location.state}</span>
                  </div>
                  <h1 id="property-detail-title" className="text-3xl sm:text-4xl font-serif text-[#172720] leading-tight">
                    {property.title}
                  </h1>
                  <p className="text-sm sm:text-base text-[#777B75] mt-2">
                    {property.subtitle}
                  </p>
                </div>

                {/* Editorial Highlight Banner */}
                {property.editorialHighlight && (
                  <div className="bg-[#202B25] text-[#E7DCC7] p-5 rounded-lg border-l-2 border-[#B69A70] flex items-start gap-3">
                    <Sparkles className="w-4 h-4 text-[#B69A70] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#B69A70] block">
                        Editorial Assessment
                      </span>
                      <p className="text-xs sm:text-sm text-white mt-0.5">
                        {property.editorialHighlight}
                      </p>
                    </div>
                  </div>
                )}

                {/* Key Specifications Grid */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-mono text-[#172720] font-semibold mb-3">
                    Property Specifications
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 p-3.5 sm:p-5 bg-white rounded-lg border border-[#E7DCC7]/60 min-w-0 max-w-full">
                    {property.specs.bedrooms && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Bedrooms</span>
                        <span className="text-base sm:text-lg font-serif font-semibold text-[#172720] flex items-center gap-1.5 mt-0.5 truncate">
                          <Bed className="w-4 h-4 text-[#B69A70] shrink-0" />
                          <span className="truncate">{property.specs.bedrooms} Suites</span>
                        </span>
                      </div>
                    )}
                    {property.specs.bathrooms && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Bathrooms</span>
                        <span className="text-base sm:text-lg font-serif font-semibold text-[#172720] flex items-center gap-1.5 mt-0.5 truncate">
                          <Bath className="w-4 h-4 text-[#B69A70] shrink-0" />
                          <span className="truncate">{property.specs.bathrooms} Baths</span>
                        </span>
                      </div>
                    )}
                    {property.specs.plotSizeSqFt && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Plot Extent</span>
                        <span className="text-base sm:text-lg font-serif font-semibold text-[#172720] flex items-center gap-1.5 mt-0.5 truncate">
                          <Maximize2 className="w-4 h-4 text-[#B69A70] shrink-0" />
                          <span className="truncate">{property.specs.plotSizeSqFt.toLocaleString()} sq.ft</span>
                        </span>
                      </div>
                    )}
                    {property.specs.builtUpAreaSqFt && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Built Area</span>
                        <span className="text-base sm:text-lg font-serif font-semibold text-[#172720] flex items-center gap-1.5 mt-0.5 truncate">
                          <Maximize2 className="w-4 h-4 text-[#B69A70] shrink-0" />
                          <span className="truncate">{property.specs.builtUpAreaSqFt.toLocaleString()} sq.ft</span>
                        </span>
                      </div>
                    )}
                    {property.specs.roadWidthFt && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Road Width</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#172720] mt-0.5 block truncate">
                          {property.specs.roadWidthFt} Feet Wide
                        </span>
                      </div>
                    )}
                    {property.specs.facing && (
                      <div className="min-w-0">
                        <span className="text-[11px] text-[#777B75] block font-mono">Orientation</span>
                        <span className="text-xs sm:text-sm font-semibold text-[#172720] mt-0.5 block truncate">
                          {property.specs.facing}
                        </span>
                      </div>
                    )}
                    {property.specs.readyStatus && (
                      <div>
                        <span className="text-[11px] text-[#777B75] block font-mono">Possession</span>
                        <span className="text-sm font-semibold text-[#172720] mt-0.5 block">
                          {property.specs.readyStatus}
                        </span>
                      </div>
                    )}
                    {property.legalStatus && (
                      <div>
                        <span className="text-[11px] text-[#777B75] block font-mono">Title Verification</span>
                        <span className="text-sm font-semibold text-[#25D366] mt-0.5 block truncate">
                          Clear Freehold
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Narrative Description */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-mono text-[#172720] font-semibold mb-3">
                    Architectural Overview
                  </h3>
                  <div className="prose prose-sm text-[#777B75] leading-relaxed max-w-none space-y-4">
                    <p>{property.description}</p>
                  </div>
                </div>

                {/* Amenities & Infrastructure */}
                <div>
                  <h3 className="text-xs uppercase tracking-widest font-mono text-[#172720] font-semibold mb-3">
                    Amenities & Verified Infrastructure
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {property.amenities.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs text-[#202B25] bg-white p-3 rounded border border-[#E7DCC7]/40">
                        <CheckCircle2 className="w-4 h-4 text-[#B69A70] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strategic Investment Highlight */}
                {property.investmentHighlight && (
                  <div className="p-4 bg-[#E7DCC7]/30 rounded-lg border border-[#E7DCC7] text-xs text-[#172720]">
                    <span className="font-mono text-[#B69A70] uppercase font-bold tracking-wider block mb-1">
                      Capital Valuation Context
                    </span>
                    <p>{property.investmentHighlight}</p>
                  </div>
                )}
              </div>

              {/* Right Column: Sticky Action & Enquiry Panel */}
              <div className="lg:col-span-4">
                <div className="sticky top-24 bg-white p-6 rounded-xl border border-[#E7DCC7] shadow-xl space-y-6">
                  {/* Price */}
                  <div>
                    <span className="text-[10px] uppercase font-mono tracking-widest text-[#777B75] block">
                      Valuation & Offering
                    </span>
                    <p className="text-3xl font-serif font-bold text-[#172720]">
                      {property.priceDisplay}
                    </p>
                    {property.pricePerSqFt && (
                      <span className="text-xs font-mono text-[#777B75]">
                        {property.pricePerSqFt}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 pt-2">
                    <button
                      onClick={() => onOpenEnquiry(property)}
                      className="w-full py-3.5 px-4 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors shadow-sm"
                    >
                      Enquire for Detailed Dossier
                    </button>

                    <button
                      onClick={() => onScheduleSiteVisit(property)}
                      className="w-full py-3.5 px-4 bg-[#172720] hover:bg-[#202B25] text-white text-xs uppercase tracking-widest font-semibold rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4 text-[#B69A70]" />
                      <span>Arrange Private Site Visit</span>
                    </button>

                    <a
                      href={siteConfig.buildPropertyWhatsAppUrl(property.title, property.refCode)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 px-4 bg-transparent hover:bg-neutral-50 text-[#172720] border border-[#E7DCC7] text-xs uppercase tracking-widest font-semibold rounded transition-colors flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>WhatsApp Concierge</span>
                    </a>
                  </div>

                  {/* Direct Contact Info */}
                  <div className="pt-4 border-t border-[#E7DCC7]/40 text-xs text-[#777B75] space-y-2">
                    <div className="flex items-center justify-between">
                      <span>Listing Reference:</span>
                      <span className="font-mono text-[#172720] font-semibold">{property.refCode}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Private Desk:</span>
                      <a href={`tel:${siteConfig.contact.phoneTel}`} className="text-[#172720] hover:underline font-mono">
                        {siteConfig.contact.phoneDisplay}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Properties Section */}
            {relatedProperties.length > 0 && (
              <div className="mt-16 pt-12 border-t border-[#E7DCC7]">
                <h3 className="text-xl font-serif text-[#172720] mb-6">
                  Similar Curated Offerings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {relatedProperties.slice(0, 2).map((rel) => (
                    <div
                      key={rel.id}
                      onClick={() => {
                        onSelectProperty(rel);
                        setSelectedImageIndex(0);
                      }}
                      className="cursor-pointer bg-white p-4 rounded-lg border border-[#E7DCC7]/60 hover:border-[#B69A70] transition-colors flex items-center gap-4"
                    >
                      <div className="w-24 h-20 rounded overflow-hidden shrink-0">
                        <ResilientImage
                          src={rel.images[0]?.url}
                          alt={rel.title}
                          className="w-full h-full object-cover"
                          containerClassName="h-full"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono text-[#B69A70] uppercase">
                          {rel.categoryLabel}
                        </span>
                        <h4 className="text-sm font-serif font-semibold text-[#172720] truncate">
                          {rel.title}
                        </h4>
                        <p className="text-xs font-serif text-[#777B75] font-semibold mt-0.5">
                          {rel.priceDisplay}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox for full-screen zoom */}
      <Lightbox
        images={property.images}
        currentIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        onPrev={() => setSelectedImageIndex((prev) => (prev > 0 ? prev - 1 : property.images.length - 1))}
        onNext={() => setSelectedImageIndex((prev) => (prev < property.images.length - 1 ? prev + 1 : 0))}
      />
    </>
  );
};
