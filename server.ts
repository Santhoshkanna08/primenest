import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json({ limit: '1mb' }));

// Initialise Gemini SDK with telemetry header
const geminiApiKey = process.env.GEMINI_API_KEY;
let ai: GoogleGenAI | null = null;

if (geminiApiKey) {
  ai = new GoogleGenAI({
    apiKey: geminiApiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
      timeout: 12000,
    },
  });
}

// Configurable AI model with low-latency default
const AI_MODEL = process.env.CHAT_AI_MODEL || 'gemini-2.5-flash';

// Structured property database for high-speed dynamic context matching
interface CatalogItem {
  id: string;
  name: string;
  ref: string;
  category: string;
  location: string;
  price: string;
  specs: string;
  highlights: string;
  keywords: string[];
}

const PROPERTY_CATALOG: CatalogItem[] = [
  {
    id: 'pn-104-obsidian-horizon',
    name: 'The Obsidian Horizon Villa',
    ref: 'PN-EST-104',
    category: 'Luxury Villa',
    location: 'Point Dume Enclave, Malibu Coast, CA',
    price: '$6,850,000',
    specs: '5 Beds, 6 Baths, 8,000 sq.ft built, 32,670 sq.ft lot',
    highlights: '60-ft zero-edge pool, Sub-Zero kitchen, ocean views, clear coastal commission title',
    keywords: ['malibu', 'obsidian', 'villa', 'horizon', 'ocean', 'beach', 'coastal'],
  },
  {
    id: 'pn-201-grand-orchard-estates',
    name: 'The Grand Orchard Plots',
    ref: 'PN-PLT-201',
    category: 'Residential Plot / Land',
    location: 'Oak Ridge Reserve, Sonoma Foothills, CA',
    price: '$1,250,000',
    specs: '10,000 sq.ft (0.23 Acre), 60-ft wide paved arterial avenues',
    highlights: '100% underground utilities (water, 3-phase power, fiber), clear unencumbered freehold title',
    keywords: ['plot', 'plots', 'orchard', 'sonoma', 'land', 'ground', 'acre', 'acres'],
  },
  {
    id: 'pn-308-cypress-travertine',
    name: 'The Cypress Travertine Residence',
    ref: 'PN-VLA-308',
    category: 'Luxury Villa',
    location: 'Santa Lucia Foothills, Carmel Valley, CA',
    price: '$4,950,000',
    specs: '4 Beds, 5 Baths, 6,800 sq.ft built, 24,000 sq.ft lot',
    highlights: '75-ft lap canal, Portuguese limestone, sommelier tasting cellar, guest casita',
    keywords: ['carmel', 'cypress', 'travertine', 'villa', 'pool', 'valley'],
  },
  {
    id: 'pn-412-calacatta-sky-penthouse',
    name: 'The Calacatta Sky Penthouse',
    ref: 'PN-PNT-412',
    category: 'Duplex Penthouse',
    location: 'Marina District, Bellevue Waterfront, WA',
    price: '$8,200,000',
    specs: '4 Beds, 5 Baths, 6,000 sq.ft built, 1,400 sq.ft sky terrace',
    highlights: '22-ft salon, Calacatta marble hearth, helical steel staircase, 360° marina views',
    keywords: ['bellevue', 'penthouse', 'calacatta', 'marina', 'sky', 'waterfront', 'seattle'],
  },
  {
    id: 'pn-505-azure-point-land',
    name: 'The Azure Point Coastal Acreage',
    ref: 'PN-LND-505',
    category: 'Land Investment / Acreage',
    location: 'Pacific Headland Corridor, Big Sur North, CA',
    price: '$3,400,000',
    specs: '4.2 Contiguous Acres (182,952 sq.ft), 40-ft road access',
    highlights: 'Cleared 12,000 sq.ft building pad, drilled deep water well, private stone pathway to cove',
    keywords: ['big sur', 'azure', 'acreage', 'coastal land', 'oceanfront', 'large plot'],
  },
  {
    id: 'pn-209-meadow-grove-plots',
    name: 'The Meadow Grove Sanctuary Plots',
    ref: 'PN-PLT-209',
    category: 'Residential Plot',
    location: 'Silverado Foothills, Napa Valley Border, CA',
    price: '$890,000',
    specs: '0.5 Acre (21,780 sq.ft), 50-ft wide avenues',
    highlights: 'Heritage olive stands, underground utilities, stone perimeter walls, lowest entry price',
    keywords: ['meadow', 'grove', 'napa', 'plot', 'plots', 'affordable', 'under 1m', 'cheapest'],
  },
  {
    id: 'pn-614-solarium-courtyard',
    name: 'The Solarium Courtyard House',
    ref: 'PN-HSE-614',
    category: 'Independent House',
    location: 'Oak Knoll Terraces, Pasadena Hills, CA',
    price: '$3,750,000',
    specs: '4 Beds, 4 Baths, 4,600 sq.ft built, 18,000 sq.ft plot',
    highlights: 'Central Japanese maple glass atrium, saltwater river stone pool, terrazzo floors',
    keywords: ['pasadena', 'solarium', 'courtyard', 'house', 'modernist'],
  },
];

// In-memory cache for repeated fast queries (15-min TTL)
interface CacheEntry {
  reply: string;
  matchedPropertyIds: string[];
  expiresAt: number;
}
const responseCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 15 * 60 * 1000;

function getCachedResponse(normalizedQuery: string): CacheEntry | null {
  const entry = responseCache.get(normalizedQuery);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    responseCache.delete(normalizedQuery);
    return null;
  }
  return entry;
}

function setCachedResponse(normalizedQuery: string, reply: string, matchedPropertyIds: string[]) {
  if (responseCache.size > 200) {
    const firstKey = responseCache.keys().next().value;
    if (firstKey) responseCache.delete(firstKey);
  }
  responseCache.set(normalizedQuery, {
    reply,
    matchedPropertyIds,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
}

// Build concise dynamic prompt context based on query keywords
function buildOptimizedSystemPrompt(queryText: string): { prompt: string; matchedIds: string[] } {
  const q = queryText.toLowerCase();

  // Find relevant listings
  let relevant = PROPERTY_CATALOG.filter((item) =>
    item.keywords.some((kw) => q.includes(kw))
  );

  // If no specific match, include top 3 featured
  if (relevant.length === 0) {
    relevant = [PROPERTY_CATALOG[0], PROPERTY_CATALOG[1], PROPERTY_CATALOG[3]];
  }

  const catalogSummary = relevant
    .map(
      (p) =>
        `• ${p.name} (${p.ref}): ${p.category} in ${p.location} · ${p.price} · ${p.specs} · ${p.highlights}`
    )
    .join('\n');

  const matchedIds = relevant.map((p) => p.id);

  const prompt = `You are the PrimeNest Properties AI Concierge for luxury real estate and land investments.
Brand: PrimeNest Properties (#172720 Forest Green, Warm Ivory, Champagne Gold).
Contact: Tel: 8925190462 · WhatsApp: 918925190462 (https://wa.me/918925190462) · Email: concierge@primenestproperties.com.

Catalog Context:
${catalogSummary}

Guidelines:
- Tone: Refined, warm, concise (2-4 sentences max). Never pushy.
- Mention property reference codes (e.g., PN-PLT-201) when discussing specific listings.
- Offer private site visits, advisory consultations, or WhatsApp connection when helpful.
- For WhatsApp or human agent enquiries, direct users to call 8925190462 or WhatsApp at https://wa.me/918925190462.
- For INR currency requests: $1M USD ≈ ₹8.3 Crore ($890k ≈ ₹7.4 Crore).
- Do not invent properties not listed in catalog. Keep response compact and high value.`;

  return { prompt, matchedIds };
}

// Match property IDs from reply text and user query
function extractMatchedPropertyIds(replyText: string, userText: string): string[] {
  const combined = (replyText + ' ' + userText).toLowerCase();
  const matched: string[] = [];

  for (const item of PROPERTY_CATALOG) {
    if (
      combined.includes(item.ref.toLowerCase()) ||
      combined.includes(item.name.toLowerCase()) ||
      item.keywords.some((kw) => kw.length > 3 && combined.includes(kw))
    ) {
      if (!matched.includes(item.id)) {
        matched.push(item.id);
      }
    }
  }

  return matched.slice(0, 3);
}

// Fast handler for routine greetings & basic FAQ to avoid unnecessary API calls
function fastLocalCheck(userMessage: string): { reply: string; matchedPropertyIds: string[] } | null {
  const q = userMessage.toLowerCase().trim();

  // Pure greetings
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'greetings'];
  if (greetings.includes(q) || /^hello[!.]?$/i.test(q) || /^hi[!.]?$/i.test(q)) {
    return {
      reply: "Hello! Welcome to PrimeNest Properties. I'm your virtual property concierge. Are you exploring residential plots, architectural villas, or looking to schedule a private site inspection today?",
      matchedPropertyIds: ['pn-201-grand-orchard-estates', 'pn-104-obsidian-horizon'],
    };
  }

  // Quick reply exact chips
  if (q === 'explore properties' || q === 'what properties are available') {
    return {
      reply: "Our current catalog presents prime residential plots from $890,000 in Napa and Sonoma, alongside trophy architectural villas and oceanfront penthouses up to $8.2M. Which style or location interests you?",
      matchedPropertyIds: ['pn-104-obsidian-horizon', 'pn-201-grand-orchard-estates', 'pn-412-calacatta-sky-penthouse'],
    };
  }

  if (q === 'find residential plots' || q === 'plots') {
    return {
      reply: "We represent two premier plotted developments: **The Grand Orchard Plots** in Sonoma Foothills (10,000 sq.ft from $1,250,000) and **The Meadow Grove Sanctuary Plots** in Napa Valley (0.5 Acre parcels from $890,000). Both feature 100% underground utilities and verified freehold deeds.",
      matchedPropertyIds: ['pn-201-grand-orchard-estates', 'pn-209-meadow-grove-plots'],
    };
  }

  if (q === 'explore villas & houses' || q === 'villas') {
    return {
      reply: "Our private residential portfolio features **The Obsidian Horizon Villa** in Malibu ($6.85M), **The Cypress Travertine Residence** in Carmel Valley ($4.95M), and **The Solarium Courtyard House** in Pasadena ($3.75M). Each residence is engineered for privacy and architectural distinction.",
      matchedPropertyIds: ['pn-104-obsidian-horizon', 'pn-308-cypress-travertine', 'pn-614-solarium-courtyard'],
    };
  }

  if (q === 'talk to an agent' || q === 'speak to agent' || q === 'contact human' || q === 'call concierge') {
    return {
      reply: "Our Senior Advisory Desk is at your service. You can call directly at **8925190462**, connect immediately via our **WhatsApp concierge** (https://wa.me/918925190462), or we can arrange a confidential callback at your convenience.",
      matchedPropertyIds: [],
    };
  }

  if (q === 'arrange a site visit' || q === 'schedule visit' || q === 'book a tour') {
    return {
      reply: "We coordinate private, unhurried on-site inspections for all active parcels and residences. Recommended windows include Morning Light (10:00 AM) or Sunset Horizon (05:00 PM). Would you like to select a preferred date for our concierge team?",
      matchedPropertyIds: ['pn-201-grand-orchard-estates', 'pn-104-obsidian-horizon'],
    };
  }

  return null;
}

// POST /api/chat (Standard optimized endpoint with latency timing header)
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Valid userMessage is required' });
    }

    if (userMessage.length > 800) {
      return res.status(400).json({ error: 'Message exceeds maximum allowable length of 800 characters' });
    }

    const trimmedQuery = userMessage.trim();
    const normalizedKey = trimmedQuery.toLowerCase();

    // 1. Fast local handler check (< 5ms)
    const fastMatch = fastLocalCheck(trimmedQuery);
    if (fastMatch) {
      const latencyMs = Date.now() - startTime;
      res.setHeader('X-Response-Time-Ms', latencyMs.toString());
      return res.json({
        reply: fastMatch.reply,
        matchedPropertyIds: fastMatch.matchedPropertyIds,
        source: 'fast-local',
        latencyMs,
      });
    }

    // 2. Cache check (< 5ms)
    const cached = getCachedResponse(normalizedKey);
    if (cached) {
      const latencyMs = Date.now() - startTime;
      res.setHeader('X-Response-Time-Ms', latencyMs.toString());
      return res.json({
        reply: cached.reply,
        matchedPropertyIds: cached.matchedPropertyIds,
        source: 'cache',
        latencyMs,
      });
    }

    // 3. AI Service check
    if (!ai) {
      return res.status(503).json({
        fallback: true,
        message: 'AI model service not configured. Falling back to local concierge.',
      });
    }

    // 4. Compact context & recent messages
    const { prompt: systemInstruction, matchedIds: defaultMatchedIds } = buildOptimizedSystemPrompt(trimmedQuery);

    const contents: any[] = [];
    if (Array.isArray(messages)) {
      // Limit to last 4 messages to minimize token overhead and latency
      const recent = messages.slice(-4);
      for (const m of recent) {
        if (m.role === 'user' || m.role === 'assistant') {
          contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          });
        }
      }
    }

    contents.push({
      role: 'user',
      parts: [{ text: trimmedQuery }],
    });

    const aiStartTime = Date.now();
    const response = await ai.models.generateContent({
      model: AI_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 300,
      },
    });
    const aiLatencyMs = Date.now() - aiStartTime;

    const replyText = response.text || 'I am here to assist with our curated plots and luxury residences. How may I guide your property search?';
    const finalMatchedIds = extractMatchedPropertyIds(replyText, trimmedQuery);
    const resolvedIds = finalMatchedIds.length > 0 ? finalMatchedIds : defaultMatchedIds.slice(0, 2);

    // Save to cache
    setCachedResponse(normalizedKey, replyText, resolvedIds);

    const totalLatencyMs = Date.now() - startTime;
    res.setHeader('X-Response-Time-Ms', totalLatencyMs.toString());
    res.setHeader('X-AI-Latency-Ms', aiLatencyMs.toString());

    return res.json({
      reply: replyText,
      matchedPropertyIds: resolvedIds,
      source: AI_MODEL,
      latencyMs: totalLatencyMs,
      aiLatencyMs,
    });
  } catch (error: any) {
    console.error('Gemini API Error in /api/chat:', error?.message || error);
    return res.status(500).json({
      fallback: true,
      error: 'AI service temporarily unavailable',
    });
  }
});

// GET or POST /api/chat/stream for progressive token streaming
app.post('/api/chat/stream', async (req, res) => {
  const startTime = Date.now();
  try {
    const { messages, userMessage } = req.body;

    if (!userMessage || typeof userMessage !== 'string' || userMessage.trim().length === 0) {
      return res.status(400).json({ error: 'Valid userMessage is required' });
    }

    const trimmedQuery = userMessage.trim();
    const normalizedKey = trimmedQuery.toLowerCase();

    // Check fast local or cache first
    const fastMatch = fastLocalCheck(trimmedQuery);
    if (fastMatch) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ chunk: fastMatch.reply })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, matchedPropertyIds: fastMatch.matchedPropertyIds, source: 'fast-local', latencyMs: Date.now() - startTime })}\n\n`);
      return res.end();
    }

    const cached = getCachedResponse(normalizedKey);
    if (cached) {
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.write(`data: ${JSON.stringify({ chunk: cached.reply })}\n\n`);
      res.write(`data: ${JSON.stringify({ done: true, matchedPropertyIds: cached.matchedPropertyIds, source: 'cache', latencyMs: Date.now() - startTime })}\n\n`);
      return res.end();
    }

    if (!ai) {
      return res.status(503).json({ fallback: true });
    }

    const { prompt: systemInstruction, matchedIds: defaultMatchedIds } = buildOptimizedSystemPrompt(trimmedQuery);

    const contents: any[] = [];
    if (Array.isArray(messages)) {
      const recent = messages.slice(-4);
      for (const m of recent) {
        if (m.role === 'user' || m.role === 'assistant') {
          contents.push({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.content }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: trimmedQuery }],
    });

    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    const stream = await ai.models.generateContentStream({
      model: AI_MODEL,
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 300,
      },
    });

    let fullText = '';
    let firstTokenTime: number | null = null;

    for await (const chunk of stream) {
      const text = chunk.text || '';
      if (text) {
        if (!firstTokenTime) firstTokenTime = Date.now() - startTime;
        fullText += text;
        res.write(`data: ${JSON.stringify({ chunk: text })}\n\n`);
      }
    }

    const matchedIds = extractMatchedPropertyIds(fullText, trimmedQuery);
    const resolvedIds = matchedIds.length > 0 ? matchedIds : defaultMatchedIds.slice(0, 2);

    setCachedResponse(normalizedKey, fullText, resolvedIds);

    const totalLatency = Date.now() - startTime;
    res.write(
      `data: ${JSON.stringify({
        done: true,
        matchedPropertyIds: resolvedIds,
        source: AI_MODEL,
        ttftMs: firstTokenTime || totalLatency,
        latencyMs: totalLatency,
      })}\n\n`
    );
    res.end();
  } catch (error: any) {
    console.error('Streaming error in /api/chat/stream:', error?.message || error);
    if (!res.headersSent) {
      return res.status(500).json({ error: 'Streaming failed' });
    }
    res.write(`data: ${JSON.stringify({ error: true, fallback: true })}\n\n`);
    res.end();
  }
});

// Configure Vite middleware in development or serve dist in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`PrimeNest Server active on port ${PORT} [Model: ${AI_MODEL}]`);
  });
}

startServer();
