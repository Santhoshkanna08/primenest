import { Property } from '../types/property';
import { propertiesData } from '../data/properties';
import { siteConfig } from '../data/config';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  properties?: Property[];
  quickReplies?: string[];
  timestamp: string;
  action?: {
    label: string;
    type: 'view_property' | 'site_visit' | 'enquiry' | 'whatsapp';
    propertyId?: string;
  };
}

export const INITIAL_QUICK_REPLIES = [
  'Explore Properties',
  'Find Residential Plots',
  'Explore Villas & Houses',
  'Check My Budget',
  'Arrange a Site Visit',
  'Talk to an Agent'
];

export const INITIAL_MESSAGE: ChatMessage = {
  id: 'welcome-1',
  role: 'assistant',
  content: `Hello! Welcome to PrimeNest Properties.

I'm your virtual property assistant. I can help you explore residential plots, villas, houses, and other available properties.

What are you looking for today?`,
  quickReplies: INITIAL_QUICK_REPLIES,
  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};

// Grounded Rule-Based Property Advisor Fallback
export function generateLocalAssistantResponse(userText: string): {
  reply: string;
  matchedProperties?: Property[];
  quickReplies?: string[];
} {
  const query = userText.toLowerCase().trim();

  // 1. Residential Plots / Land queries
  if (query.includes('plot') || query.includes('land') || query.includes('acre') || query.includes('ground') || query.includes('find residential plots')) {
    const plots = propertiesData.filter(p => p.category === 'residential_plot' || p.category === 'land_investment');
    return {
      reply: `We currently offer ${plots.length} master-planned residential plot enclaves and land reserves:\n\n• **The Grand Orchard Plots** (Ref: PN-PLT-201) — 10,000 sq.ft (0.23 Acre) with 60-ft wide avenues and 100% underground utilities in Sonoma Foothills ($1,250,000).\n• **The Meadow Grove Plots** (Ref: PN-PLT-209) — 0.5 Acre wooded parcels in Napa Valley ($890,000).\n• **The Azure Point Coastal Acreage** (Ref: PN-LND-505) — 4.2 Contiguous coastal acres in Big Sur ($3,400,000).\n\nAll land holdings feature verified freehold titles and clear access easements. Would you like to inspect a site or receive survey sketches?`,
      matchedProperties: plots,
      quickReplies: ['Arrange a Site Visit', 'Compare Plot Sizes', 'Talk to an Agent']
    };
  }

  // 2. Villas & Houses queries
  if (query.includes('villa') || query.includes('house') || query.includes('penthouse') || query.includes('explore villas')) {
    const villas = propertiesData.filter(p => p.category === 'luxury_villa' || p.category === 'penthouse' || p.category === 'house');
    return {
      reply: `Our active residential architectural collection includes:\n\n• **The Obsidian Horizon Villa** (Malibu Coast) — 5 Beds, 6 Baths, 60-ft reflection pool ($6,850,000).\n• **The Cypress Travertine Residence** (Carmel Valley) — 4 Beds, 5 Baths, 75-ft lap canal ($4,950,000).\n• **The Calacatta Sky Penthouse** (Bellevue Waterfront) — 4 Beds, 22-ft double-height salon ($8,200,000).\n• **The Solarium Courtyard House** (Pasadena Hills) — 4 Beds single-level modernist sanctuary ($3,750,000).\n\nWould you like a private tour or full floor plans?`,
      matchedProperties: villas.slice(0, 3),
      quickReplies: ['Check My Budget', 'Arrange a Site Visit', 'Explore Properties']
    };
  }

  // 3. Budget queries (including INR / USD recognition)
  if (query.includes('budget') || query.includes('price') || query.includes('cost') || query.includes('lakh') || query.includes('crore') || query.includes('$') || query.includes('million')) {
    if (query.includes('lakh') || query.includes('crore')) {
      const plots = propertiesData.filter(p => p.category === 'residential_plot');
      return {
        reply: `Our primary luxury properties and master-planned land holdings are priced in USD, beginning at **$890,000 (approx. ₹7.4 Crore)** for our 0.5-acre Meadow Grove parcels up to **$8.2M (approx. ₹68 Crore)** for trophy penthouses.\n\nFor investment portfolios under ₹1 Crore / ₹50 Lakh, our private advisory desk can connect you with curated emerging plotted opportunities. Would you like our senior desk to contact you with bespoke options?`,
        matchedProperties: plots.slice(0, 2),
        quickReplies: ['Talk to an Agent', 'Arrange a Site Visit', 'Explore Properties']
      };
    }

    if (query.includes('under') || query.includes('less than') || query.includes('below')) {
      const affordable = [...propertiesData].sort((a, b) => a.price - b.price).slice(0, 3);
      return {
        reply: `Here are our most accessible premium opportunities starting from **$890,000**:\n\n• **The Meadow Grove Sanctuary Plots** ($890,000 · Ref: PN-PLT-209)\n• **The Grand Orchard Plots** ($1,250,000 · Ref: PN-PLT-201)\n• **The Azure Point Coastal Acreage** ($3,400,000 · Ref: PN-LND-505)\n\nWe provide unencumbered deeds and full topography reports for each parcel.`,
        matchedProperties: affordable,
        quickReplies: ['View Plot Details', 'Talk to an Agent', 'Arrange a Site Visit']
      };
    }

    return {
      reply: `Our listings range from **$890,000** for half-acre residential plots to **$8,200,000** for crown penthouses. What target range or investment purpose best matches your requirements?`,
      quickReplies: ['Under $1.5M', '$1.5M – $5M', '$5M+ Luxury Estates']
    };
  }

  // 4. Site visit inquiries
  if (query.includes('site visit') || query.includes('arrange a site visit') || query.includes('visit') || query.includes('tour') || query.includes('viewing')) {
    const siteVisitWhatsApp = siteConfig.buildSiteVisitWhatsAppUrl();
    return {
      reply: `We arrange private, unhurried on-site inspections for all active parcels and residences:\n\n• **Morning Light (10:00 AM)** — Optimal for solar orientation\n• **Midday Topography (02:00 PM)** — Clear boundary and elevation inspection\n• **Sunset Horizon (05:00 PM)** — Experience evening ambiance\n\nChauffeured transportation from regional airports or private residences can be coordinated upon request.\n\n• **Direct Telephone**: [${siteConfig.contact.phoneDisplay}](tel:${siteConfig.contact.phoneTel})\n• **WhatsApp Booking**: [Message Concierge on WhatsApp](${siteVisitWhatsApp})`,
      matchedProperties: [propertiesData[1], propertiesData[0]],
      quickReplies: ['Enquire on WhatsApp', 'Arrange a Site Visit', 'Talk to an Agent']
    };
  }

  // 5. How can I enquire about this property
  if (query.includes('enquire about this property') || query.includes('how can i enquire') || query.includes('enquiry process') || query.includes('how to enquire')) {
    const generalWhatsApp = siteConfig.buildGeneralEnquiryWhatsAppUrl();
    return {
      reply: `Enquiring about any PrimeNest property or residential plot is straightforward:\n\n1. **Direct WhatsApp**: Connect with our advisory at [918925190462](${generalWhatsApp}) for instant survey plans, title deeds, and pricing dossiers.\n2. **Telephone Concierge**: Call directly at [${siteConfig.contact.phoneDisplay}](tel:${siteConfig.contact.phoneTel}) (Mon–Sat, 9:00 AM – 7:00 PM PT).\n3. **Property Dossier Form**: Click 'Enquire' on any listing card to submit your specific requirements.\n\nWhich listing can our advisory assist you with?`,
      matchedProperties: [propertiesData[0], propertiesData[1]],
      quickReplies: ['Enquire on WhatsApp', 'Find Residential Plots', 'Talk to an Agent']
    };
  }

  // 6. Agent handoff, contact, & WhatsApp
  if (query.includes('agent') || query.includes('human') || query.includes('call') || query.includes('phone') || query.includes('contact') || query.includes('whatsapp') || query.includes('talk to an agent') || query.includes('how can i contact you')) {
    const handoffWhatsApp = siteConfig.buildChatbotHandoffWhatsAppUrl();
    return {
      reply: `Our Senior Property Advisory Desk is available Monday through Saturday, 9:00 AM – 7:00 PM PT:\n\n• **Direct Telephone**: [${siteConfig.contact.phoneDisplay}](tel:${siteConfig.contact.phoneTel})\n• **WhatsApp Desk**: [Connect on WhatsApp (918925190462)](${handoffWhatsApp})\n• **Private Office**: ${siteConfig.contact.officeAddress}\n\nYou can click the WhatsApp link above to open a real conversation with our concierge, or call directly.`,
      quickReplies: ['Enquire on WhatsApp', 'Arrange a Site Visit', 'Explore Properties']
    };
  }

  // 6. Educational / Due Diligence queries
  if (query.includes('document') || query.includes('verify') || query.includes('legal') || query.includes('checklist') || query.includes('difference between a plot')) {
    return {
      reply: `**PrimeNest Due Diligence Guide for Land & Property Buyers**:\n\n1. **Freehold Title**: Verify 100% unencumbered deed ownership without pending litigation.\n2. **Zoning & Setbacks**: Confirm the Floor Area Ratio (FAR), maximum building height, and road setback lines.\n3. **Utility Verification**: Ensure water rights, 3-phase electric conduits, and sewer/percolation are documented.\n4. **Topographical Survey**: A licensed contour survey confirms foundation feasibility and avoids unexpected slope excavation expenses.\n\n*(Note: This is general educational guidance from our advisory. We recommend having your independent counsel review conveyance deeds before closing.)*`,
      quickReplies: ['Find Residential Plots', 'Talk to an Agent', 'Arrange a Site Visit']
    };
  }

  // 7. General Discovery / Default fallback
  const featured = propertiesData.filter(p => p.featured).slice(0, 3);
  return {
    reply: `PrimeNest Properties represents curated residential plots, architectural villas, and strategic coastal land holdings. Every property is hand-vetted for design integrity, verified road access, and clear freehold deeds.\n\nHow can I best assist your search today?`,
    matchedProperties: featured,
    quickReplies: INITIAL_QUICK_REPLIES.slice(0, 4)
  };
}

export interface SendMessageOptions {
  onProgress?: (text: string) => void;
  signal?: AbortSignal;
}

// Main conversation dispatcher with progressive token streaming and fast response
export async function sendChatMessage(
  history: ChatMessage[],
  userText: string,
  options?: SendMessageOptions
): Promise<{
  reply: string;
  matchedProperties?: Property[];
  quickReplies?: string[];
  source: string;
  latencyMs?: number;
}> {
  const startTime = Date.now();
  const trimmed = userText.trim();

  // Try progressive streaming first for maximum perceived speed
  if (typeof fetch !== 'undefined') {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 9000); // 9-second fail-safe timeout

      const res = await fetch('/api/chat/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-4).map(h => ({ role: h.role, content: h.content })),
          userMessage: trimmed
        }),
        signal: options?.signal || controller.signal,
      });

      clearTimeout(timeoutId);

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedText = '';
        let matchedPropertyIds: string[] = [];
        let finalSource = 'streaming';
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          if (readerDone) break;

          const chunkStr = decoder.decode(value, { stream: true });
          const lines = chunkStr.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const parsed = JSON.parse(line.slice(6));
                if (parsed.chunk) {
                  accumulatedText += parsed.chunk;
                  options?.onProgress?.(accumulatedText);
                }
                if (parsed.matchedPropertyIds) {
                  matchedPropertyIds = parsed.matchedPropertyIds;
                }
                if (parsed.source) {
                  finalSource = parsed.source;
                }
                if (parsed.done) {
                  done = true;
                }
              } catch {
                // Ignore parse errors on split packets
              }
            }
          }
        }

        if (accumulatedText.trim().length > 0) {
          let matched: Property[] = [];
          if (matchedPropertyIds.length > 0) {
            matched = propertiesData.filter(p => matchedPropertyIds.includes(p.id));
          }
          if (matched.length === 0) {
            // Contextually match property based on reply
            const lower = accumulatedText.toLowerCase();
            matched = propertiesData.filter(p =>
              lower.includes(p.title.toLowerCase()) ||
              lower.includes(p.refCode.toLowerCase())
            );
          }

          return {
            reply: accumulatedText,
            matchedProperties: matched.length > 0 ? matched : undefined,
            quickReplies: ['Explore Properties', 'Arrange a Site Visit', 'Talk to an Agent'],
            source: finalSource,
            latencyMs: Date.now() - startTime,
          };
        }
      }
    } catch (streamErr: any) {
      // If streaming fails or times out, smoothly proceed to standard endpoint
      console.warn('Streaming fetch attempt ended, trying standard endpoint:', streamErr?.message || streamErr);
    }

    // Secondary fallback: Standard /api/chat
    try {
      const fallbackController = new AbortController();
      const fallbackTimeout = setTimeout(() => fallbackController.abort(), 5000);

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: history.slice(-4).map(h => ({ role: h.role, content: h.content })),
          userMessage: trimmed
        }),
        signal: fallbackController.signal,
      });

      clearTimeout(fallbackTimeout);

      if (res.ok) {
        const data = await res.json();
        if (!data.fallback && data.reply) {
          let matched: Property[] = [];
          if (Array.isArray(data.matchedPropertyIds)) {
            matched = propertiesData.filter(p => data.matchedPropertyIds.includes(p.id));
          }

          return {
            reply: data.reply,
            matchedProperties: matched.length > 0 ? matched : undefined,
            quickReplies: ['Explore Properties', 'Arrange a Site Visit', 'Talk to an Agent'],
            source: data.source || 'gemini',
            latencyMs: data.latencyMs || Date.now() - startTime,
          };
        }
      }
    } catch (err) {
      console.warn('Standard /api/chat endpoint unavailable or timed out, falling back to local concierge.');
    }
  }

  // Final deterministic fallback: local property expert
  const local = generateLocalAssistantResponse(trimmed);
  return {
    ...local,
    source: 'local-concierge',
    latencyMs: Date.now() - startTime,
  };
}
