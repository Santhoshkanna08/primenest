# PrimeNest Properties — Digital Architectural Experience

A distinctive, cinematic, editorial-grade digital real estate platform crafted for **PrimeNest Properties**. Built from scratch to showcase residential plots, master-planned land reserves, bespoke luxury villas, and generational estates.

---

## 1. Visual Identity & Art Direction

- **Color Palette**:
  - Deep Forest Green (`#172720`) — Signature hero, footer, and premium land sections
  - Dark Charcoal Green (`#202B25`) — Structural cards and contrast scrims
  - Warm Ivory (`#F7F5EF`) — Clean canvas background
  - Champagne Gold (`#B69A70`) — Focused luxury accent
  - Soft Beige (`#E7DCC7`) — Subtle hairline borders and dividers
  - Muted Slate Grey (`#777B75`) — Clean metadata and descriptive typography
- **Typography**:
  - Display & Headings: `Playfair Display` (Classic architectural serif)
  - Interface & Body: `Plus Jakarta Sans` (Geometric, high-legibility sans)
- **Anti-Slop Design Constitution**:
  - Zero-pill discipline: Clean, unboxed text metadata with typographic separators (`·`, `/`).
  - Strict Top Bar Contract: 1-line brand wordmark, 5 concise single-line nav links, 1 primary action button.
  - Authentic, unvarnished business copy with zero fabricated testimonials or fake statistics.

---

## 2. Key Features

1. **Cinematic Hero Experience**:
   - Edge-to-edge architectural visual storytelling with gentle ambient movement.
   - Dual-perspective switcher between "Villa Estate" and "Plotted Reserve".
   - Integrated search and intent filter bar at hero base.
2. **Property Discovery & Multi-Facet Filtering**:
   - Real-time search across titles, locations, and reference codes.
   - Category filtering (Residential Plots, Luxury Villas, Duplex Penthouses, Land Holdings, Houses).
   - Price range and sorting controls (Price Asc/Desc, Area, Newest).
   - LocalStorage saved shortlist / favorites management.
3. **Dedicated Residential Plots & Land Section**:
   - Master-planned aerial views with demarcation details.
   - Road width specifications (e.g., 60-ft wide avenues), underground utilities, and zoning allowances.
4. **Interactive Property Detail Experience**:
   - Multi-image gallery with thumbnail selection and full-screen Lightbox zoom.
   - Complete technical specifications, legal title status, and architectural highlights.
   - Sticky consultation panel with instant WhatsApp inquiry pre-population.
5. **Private Site Visit Coordination**:
   - Interactive modal to schedule physical ground inspections with preferred timeslots and chauffeured transport options.
6. **AI Property Enquiry Assistant**:
   - Floating circular concierge launcher with discreet welcome indicator.
   - Conversational AI grounded in the catalog (`gemini-3.8-flash` via secure `/api/chat`).
   - Rich interactive property cards displayed inside the chat with "View Details" and "Enquire" actions.
   - Real-time budget comparisons (supports USD, INR Lakhs/Crores, and EUR) and due-diligence guidance.
   - Full offline & rule-based fallback without breaking conversation flow.
7. **Elegant Ambient Music Experience**:
   - Curated acoustic and ambient pad soundscape (`/assets/audio/primenest-ambient.mp3`).
   - Compact control in navigation with animated equalizer and volume options.
   - User-consent first: zero audible autoplay, gentle invitation tooltip, persistent audio across route changes.
8. **Direct Concierge Conversion**:
   - Floating WhatsApp button with prefilled property reference codes.
   - Robust contact inquiry form with strict validation and feedback states.

---

## 3. Technology Stack

- **Framework**: React 19 + TypeScript
- **Bundler**: Vite 8
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Animations**: Motion

---

## 4. Local Development

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Run TypeScript validation
npm run lint

# Compile production build
npm run build
```

---

## 5. Cloudflare Pages Deployment

This application is fully optimized for Cloudflare Pages:
1. **Build command**: `npm run build`
2. **Build output directory**: `dist`
3. **Route Fallback**: `public/_redirects` is included with `/* /index.html 200` to support direct client-side routing on all deep links (`/properties`, `/residential-plots`, `/about`, `/contact`, `/favorites`).

---

## 6. Business Configuration Guide

All brand coordinates and contact details are centralized in `src/data/config.ts`:
- `brandName`: Company name
- `contact.phoneDisplay`: Displayed telephone number
- `contact.phoneTel`: Dialable telephone link
- `contact.whatsappNumber`: International WhatsApp number without symbols
- `contact.email`: Concierge email address
- `contact.officeAddress`: Physical office address
- `contact.hours`: Working hours

To add or update listings, edit `src/data/properties.ts`.
