import React, { useState } from 'react';
import { X, CheckCircle2, MessageCircle, Send, AlertCircle, Phone, Mail, User } from 'lucide-react';
import { Property, EnquiryData } from '../../types/property';
import { siteConfig } from '../../data/config';

interface EnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  property?: Property | null;
}

export const EnquiryModal: React.FC<EnquiryModalProps> = ({
  isOpen,
  onClose,
  property
}) => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contactMethod, setContactMethod] = useState<'whatsapp' | 'phone' | 'email'>('whatsapp');
  const [purpose, setPurpose] = useState<'Buy' | 'Investment' | 'Site Visit'>('Buy');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Validation
    if (!fullName.trim()) {
      setErrorMessage('Please provide your full name.');
      return;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8) {
      setErrorMessage('Please enter a valid telephone number with area code.');
      return;
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    // Simulate reliable enquiry dispatch
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFullName('');
    setPhone('');
    setEmail('');
    setMessage('');
    onClose();
  };

  const directWhatsAppUrl = property
    ? siteConfig.buildPropertyWhatsAppUrl(property.title, property.refCode)
    : siteConfig.buildGeneralEnquiryWhatsAppUrl();

  const submittedWhatsAppUrl = siteConfig.buildEnquiryFormWhatsAppUrl(
    fullName,
    property?.title,
    property?.refCode,
    message
  );

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <div className="bg-[#F7F5EF] text-[#202B25] w-full max-w-xl rounded-xl shadow-2xl overflow-hidden border border-[#E7DCC7]">
        {/* Header */}
        <div className="bg-[#172720] text-white p-6 flex items-center justify-between border-b border-[#E7DCC7]/20">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#B69A70] block">
              DIRECT PROPERTY ENQUIRY
            </span>
            <h2 id="enquiry-modal-title" className="text-xl sm:text-2xl font-serif text-white">
              {property ? property.title : 'PrimeNest Concierge Desk'}
            </h2>
            {property && (
              <span className="text-xs text-[#E7DCC7]/70 font-mono">
                Ref: {property.refCode} · {property.categoryLabel} · {property.priceDisplay}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close form"
            className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {submitted ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-14 h-14 bg-[#172720] text-[#B69A70] rounded-full mx-auto flex items-center justify-center border border-[#B69A70]/40">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-serif text-[#172720]">
                Enquiry Details Prepared
              </h3>
              <p className="text-xs sm:text-sm text-[#777B75] max-w-md mx-auto leading-relaxed">
                Thank you, <span className="font-semibold text-[#172720]">{fullName}</span>. Your enquiry for {property ? `"${property.title}"` : 'our properties'} has been prepared. For immediate response and direct document dispatch, continue to our verified WhatsApp desk (918925190462).
              </p>

              {/* Instant WhatsApp Dispatch */}
              <div className="pt-4 border-t border-[#E7DCC7] space-y-3">
                <a
                  href={submittedWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#172720] hover:bg-[#202B25] text-white text-xs uppercase tracking-widest font-semibold rounded transition-colors shadow-md"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>Continue to WhatsApp with Enquiry Details</span>
                </a>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleReset}
                  className="text-xs text-[#777B75] hover:text-[#172720] underline font-mono"
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                  Full Name <span className="text-red-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#777B75] absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Katherine Vance"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                  />
                </div>
              </div>

              {/* Phone & Email Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                    Phone / Mobile <span className="text-red-600">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-[#777B75] absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+1 (555) 000-0000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                    Email Address <span className="text-[#777B75] text-[10px]">(Optional)</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-[#777B75] absolute left-3 top-3" />
                    <input
                      type="email"
                      placeholder="katherine@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                    />
                  </div>
                </div>
              </div>

              {/* Preferred Contact Method */}
              <div>
                <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                  Preferred Contact Channel
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['whatsapp', 'phone', 'email'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setContactMethod(method)}
                      className={`py-2 text-xs font-medium rounded border capitalize transition-colors ${
                        contactMethod === method
                          ? 'bg-[#172720] text-white border-[#172720]'
                          : 'bg-white text-[#777B75] border-[#E7DCC7] hover:border-[#B69A70]'
                      }`}
                    >
                      {method}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                  Your Requirements / Note
                </label>
                <textarea
                  rows={3}
                  placeholder="I would like to receive the survey drawings and schedule a private conversation regarding this property..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 text-sm bg-white border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Transmitting Enquiry...</span>
                  ) : (
                    <>
                      <span>Submit Property Enquiry</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>

              <div className="text-center text-[11px] text-[#777B75]">
                Or chat right now via{' '}
                <a
                  href={directWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#172720] font-semibold underline"
                >
                  PrimeNest WhatsApp
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
