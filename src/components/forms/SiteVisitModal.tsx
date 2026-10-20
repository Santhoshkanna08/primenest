import React, { useState } from 'react';
import { X, Calendar, Clock, CheckCircle2, MessageCircle, MapPin, Car } from 'lucide-react';
import { Property } from '../../types/property';
import { siteConfig } from '../../data/config';

interface SiteVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  property: Property | null;
}

export const SiteVisitModal: React.FC<SiteVisitModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [visitDate, setVisitDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toISOString().split('T')[0];
  });
  const [timeSlot, setTimeSlot] = useState('10:00 AM — Morning Golden Light');
  const [needChauffeuredPickup, setNeedChauffeuredPickup] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);

  if (!isOpen || !property) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !phone.trim()) return;
    setIsConfirmed(true);
  };

  const whatsappVisitUrl = siteConfig.buildSiteVisitWhatsAppUrl(
    property.title,
    property.refCode,
    visitDate,
    timeSlot
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="site-visit-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-[#F7F5EF] text-[#202B25] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden border border-[#E7DCC7]">
        {/* Header */}
        <div className="bg-[#172720] text-white p-6 flex items-center justify-between border-b border-[#E7DCC7]/20">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#B69A70] block">
              SCHEDULE PRIVATE SITE VISIT
            </span>
            <h2 id="site-visit-title" className="text-xl font-serif text-white">
              {property.title}
            </h2>
            <div className="flex items-center gap-1.5 text-xs text-[#E7DCC7]/70 mt-1">
              <MapPin className="w-3.5 h-3.5 text-[#B69A70]" />
              <span>{property.location.neighborhood}, {property.location.city}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8">
          {isConfirmed ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#172720] text-[#B69A70] rounded-full mx-auto flex items-center justify-center border border-[#B69A70]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#172720]">
                Site Visit Requested
              </h3>
              <p className="text-xs sm:text-sm text-[#777B75] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#172720]">{fullName}</span>. We have noted your requested visit for <span className="font-semibold text-[#172720]">{property.title}</span> on <span className="font-semibold text-[#172720]">{visitDate}</span> ({timeSlot}). Our concierge desk (<a href={`tel:${siteConfig.contact.phoneTel}`} className="text-[#172720] font-mono font-semibold underline">{siteConfig.contact.phoneDisplay}</a>) will contact you to confirm gated access protocols.
              </p>

              {/* Instant WhatsApp Dispatch */}
              <div className="pt-4 border-t border-[#E7DCC7] space-y-3">
                <p className="text-xs text-[#777B75]">
                  Confirm and synchronize instantly with our private desk on WhatsApp:
                </p>
                <a
                  href={whatsappVisitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#172720] hover:bg-[#202B25] text-white text-xs uppercase tracking-widest font-semibold rounded transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Send Confirmation to Concierge</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsConfirmed(false);
                    onClose();
                  }}
                  className="text-xs text-[#777B75] hover:text-[#172720] underline font-mono"
                >
                  Close Window
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jonathan Mercer"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                  Telephone Contact <span className="text-red-600">*</span>
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+1 (555) 000-0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                />
              </div>

              {/* Date & Time Slot */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-[#B69A70]" />
                    <span>Preferred Date</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={visitDate}
                    onChange={(e) => setVisitDate(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#B69A70]" />
                    <span>Preferred Slot</span>
                  </label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                  >
                    <option value="10:00 AM — Morning Golden Light">10:00 AM — Morning Light</option>
                    <option value="02:00 PM — Midday Topography">02:00 PM — Midday</option>
                    <option value="05:00 PM — Sunset Atmosphere">05:00 PM — Sunset Horizon</option>
                  </select>
                </div>
              </div>

              {/* Private transportation toggle */}
              <div className="pt-2">
                <label className="flex items-center gap-3 p-3 bg-white rounded border border-[#E7DCC7] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needChauffeuredPickup}
                    onChange={(e) => setNeedChauffeuredPickup(e.target.checked)}
                    className="w-4 h-4 text-[#B69A70] rounded border-gray-300 focus:ring-[#B69A70]"
                  />
                  <div className="flex items-center gap-2 text-xs text-[#202B25]">
                    <Car className="w-4 h-4 text-[#B69A70]" />
                    <span>Request private chauffeured transfer from airport or local hotel</span>
                  </div>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors"
                >
                  Confirm Site Visit Request
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
