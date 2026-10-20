export const siteConfig = {
  brandName: "PrimeNest Properties",
  tagline: "Find Your Place in the Extraordinary.",
  subTagline: "Thoughtfully selected properties. Exceptional places to call your own.",
  
  // Communication channels
  contact: {
    displayNumber: "8925190462",
    phoneDisplay: "8925190462",
    phoneTel: "8925190462",
    whatsappNumber: "918925190462",
    whatsappBaseUrl: "https://wa.me/918925190462",
    email: "concierge@primenestproperties.com",
    officeAddress: "PrimeNest Sanctuary, 440 Crescent Avenue, Suite 1200",
    cityRegion: "West Coast & Horizon Corridor",
    hours: "Monday – Saturday: 09:00 AM – 07:00 PM (PT)",
  },

  // Safe WhatsApp URL builders using URLSearchParams
  buildWhatsAppUrl: (message?: string): string => {
    if (!message) {
      return siteConfig.contact.whatsappBaseUrl;
    }
    const params = new URLSearchParams({ text: message });
    return `${siteConfig.contact.whatsappBaseUrl}?${params.toString()}`;
  },

  buildGeneralEnquiryWhatsAppUrl: (): string => {
    return siteConfig.buildWhatsAppUrl("Hello PrimeNest Properties, I would like to know more about your properties.");
  },

  buildPropertyWhatsAppUrl: (propertyTitle: string, refCode?: string): string => {
    const propertyLabel = refCode ? `${propertyTitle} (Ref: ${refCode})` : propertyTitle;
    const text = `Hello PrimeNest Properties, I am interested in ${propertyLabel}. Please share more details.`;
    return siteConfig.buildWhatsAppUrl(text);
  },

  buildSiteVisitWhatsAppUrl: (propertyTitle?: string, refCode?: string, date?: string, time?: string): string => {
    if (propertyTitle) {
      const propertyLabel = refCode ? `${propertyTitle} (Ref: ${refCode})` : propertyTitle;
      const timing = date && time ? ` on ${date} at ${time}` : '';
      const text = `Hello PrimeNest Properties, I would like to arrange a site visit for ${propertyLabel}${timing}. Please contact me with the available options.`;
      return siteConfig.buildWhatsAppUrl(text);
    }
    return siteConfig.buildWhatsAppUrl("Hello PrimeNest Properties, I would like to arrange a site visit. Please contact me with the available options.");
  },

  buildChatbotHandoffWhatsAppUrl: (contextInfo?: string): string => {
    if (contextInfo) {
      return siteConfig.buildWhatsAppUrl(`Hello PrimeNest Properties, I would like to speak with a property consultant about my enquiry regarding ${contextInfo}.`);
    }
    return siteConfig.buildWhatsAppUrl("Hello PrimeNest Properties, I would like to speak with a property consultant about my enquiry.");
  },

  buildEnquiryFormWhatsAppUrl: (name?: string, propertyName?: string, refCode?: string, message?: string): string => {
    const parts: string[] = [];
    if (propertyName) {
      const refPart = refCode ? ` (Ref: ${refCode})` : '';
      parts.push(`Hello PrimeNest Properties, I am interested in ${propertyName}${refPart}.`);
    } else {
      parts.push("Hello PrimeNest Properties, I would like to know more about your properties.");
    }
    if (name) {
      parts.push(`My name is ${name}.`);
    }
    if (message) {
      parts.push(`Enquiry details: ${message}`);
    }
    parts.push("Please share more details.");
    return siteConfig.buildWhatsAppUrl(parts.join(' '));
  },

  currency: {
    code: "USD",
    symbol: "$",
    format: (value: number) => {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(value);
    }
  },

  navLinks: [
    { label: "Home", href: "/" },
    { label: "Properties", href: "/properties" },
    { label: "Residential Plots", href: "/residential-plots" },
    { label: "About Us", href: "/about" },
    { label: "Contact", href: "/contact" }
  ]
};
