import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { siteConfig } from '../data/config';

export const ContactPage: React.FC = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [categoryInterest, setCategoryInterest] = useState('Residential Plots & Land');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!fullName.trim()) {
      setErrorMsg('Please specify your name.');
      return;
    }
    const cleanPhone = phone.replace(/[^\d+]/g, '');
    if (cleanPhone.length < 8) {
      setErrorMsg('Please enter a valid telephone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
    }, 600);
  };

  const whatsappDirectUrl = siteConfig.buildGeneralEnquiryWhatsAppUrl();

  const submittedWhatsAppUrl = siteConfig.buildWhatsAppUrl(
    `Hello PrimeNest Properties, my name is ${fullName || 'Client'}. I am interested in ${categoryInterest}.${message ? ` Requirements: ${message}.` : ''} Please share more details.`
  );

  return (
    <div className="pt-24 sm:pt-28 pb-24 bg-[#F7F5EF] min-h-screen text-[#202B25]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-14">
          <span className="text-xs uppercase tracking-[0.25em] font-mono font-semibold text-[#B69A70]">
            PRIVATE CONCIERGE & ADVISORY
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif text-[#172720] tracking-tight mt-2">
            Connect with PrimeNest
          </h1>
          <p className="text-sm sm:text-base text-[#777B75] mt-3 leading-relaxed">
            Whether inquiring about an active residential plot, requesting an off-market estate dossier, or scheduling a site tour, our directors are at your service.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Direct Contact Info & Office Details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white p-8 rounded-xl border border-[#E7DCC7] shadow-sm space-y-6">
              <h3 className="text-xl font-serif text-[#172720]">
                Private Office Coordinates
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-[#777B75]">
                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#172720] text-[#B69A70] flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#172720] block font-semibold">Office Address</strong>
                    <span>{siteConfig.contact.officeAddress}</span>
                    <span className="block text-[#777B75] text-xs">{siteConfig.contact.cityRegion}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#172720] text-[#B69A70] flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#172720] block font-semibold">Telephone Concierge</strong>
                    <a href={`tel:${siteConfig.contact.phoneTel}`} className="text-[#172720] font-mono hover:underline">
                      {siteConfig.contact.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#172720] text-[#B69A70] flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#172720] block font-semibold">Direct Email</strong>
                    <a href={`mailto:${siteConfig.contact.email}`} className="text-[#172720] font-mono hover:underline truncate block">
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-9 h-9 rounded bg-[#172720] text-[#B69A70] flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="text-[#172720] block font-semibold">Advisory Hours</strong>
                    <span>{siteConfig.contact.hours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Card */}
            <div className="bg-[#172720] text-white p-8 rounded-xl border border-[#B69A70]/30 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366]/20 border border-[#25D366]/50 flex items-center justify-center text-[#25D366]">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-base font-serif text-white">Instant WhatsApp Advisory</h4>
                  <span className="text-xs text-[#B69A70] font-mono">DIRECT DISPATCH</span>
                </div>
              </div>
              <p className="text-xs text-[#E7DCC7]/80 leading-relaxed">
                Connect directly with our advisory team on WhatsApp for real-time document sharing, instant survey maps, and site scheduling.
              </p>
              <a
                href={whatsappDirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 bg-[#B69A70] hover:bg-[#E7DCC7] text-[#172720] text-xs uppercase tracking-widest font-bold rounded transition-colors flex items-center justify-center gap-2"
              >
                <span>Launch WhatsApp Dialogue</span>
              </a>
            </div>
          </div>

          {/* Right Column: Contact & Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-8 sm:p-10 rounded-xl border border-[#E7DCC7] shadow-sm">
              <h3 className="text-2xl font-serif text-[#172720] mb-2">
                Send an Inquiry
              </h3>
              <p className="text-xs sm:text-sm text-[#777B75] mb-6">
                All communications are handled with strict fiduciary discretion.
              </p>

              {isSuccess ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 bg-[#172720] text-[#B69A70] rounded-full mx-auto flex items-center justify-center border border-[#B69A70]/40">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-2xl font-serif text-[#172720]">
                    Enquiry Details Prepared
                  </h4>
                  <p className="text-xs sm:text-sm text-[#777B75] max-w-md mx-auto leading-relaxed">
                    Thank you, <span className="font-semibold text-[#172720]">{fullName}</span>. Your enquiry regarding <span className="font-semibold text-[#172720]">{categoryInterest}</span> has been prepared. For immediate real-time response and document dispatch, click below to continue on WhatsApp with our concierge desk:
                  </p>

                  <div className="pt-2">
                    <a
                      href={submittedWhatsAppUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#172720] hover:bg-[#202B25] text-white text-xs uppercase tracking-widest font-semibold rounded transition-colors shadow-md"
                    >
                      <MessageCircle className="w-4 h-4 text-[#25D366]" />
                      <span>Continue to WhatsApp with Submitted Details</span>
                    </a>
                  </div>

                  <div className="pt-3">
                    <button
                      onClick={() => {
                        setIsSuccess(false);
                        setFullName('');
                        setPhone('');
                        setEmail('');
                        setMessage('');
                      }}
                      className="text-xs text-[#172720] underline font-mono"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {/* Name */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                      Your Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Eleanor Vance"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                    />
                  </div>

                  {/* Phone & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                        Telephone <span className="text-red-600">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+1 (555) 000-0000"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                        Email Address <span className="text-[#777B75] text-[10px]">(Optional)</span>
                      </label>
                      <input
                        type="email"
                        placeholder="eleanor@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 text-sm bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
                      />
                    </div>
                  </div>

                  {/* Interest Area */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                      Area of Interest
                    </label>
                    <select
                      value={categoryInterest}
                      onChange={(e) => setCategoryInterest(e.target.value)}
                      className="w-full px-3 py-2.5 text-sm bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720] cursor-pointer"
                    >
                      <option value="Residential Plots & Land">Residential Plots & Master-Planned Land</option>
                      <option value="Luxury Villas & Estates">Luxury Architectural Villas & Estates</option>
                      <option value="Duplex Penthouses">Duplex Penthouses & Urban Sky Residences</option>
                      <option value="Coastal Land Holdings">Coastal Acreage & Land Investments</option>
                      <option value="Bespoke Property Search">Bespoke Off-Market Property Search</option>
                    </select>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-xs font-semibold text-[#172720] mb-1 font-mono uppercase tracking-wider">
                      Message / Special Criteria
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Please indicate your preferred timeline, site visit window, or specific architectural parameters..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full p-3 text-sm bg-[#F7F5EF]/60 border border-[#E7DCC7] rounded focus:outline-none focus:border-[#B69A70] text-[#172720]"
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
                        <span>Sending Message...</span>
                      ) : (
                        <>
                          <span>Send Message to Concierge</span>
                          <Send className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
