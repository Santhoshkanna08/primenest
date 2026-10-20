import React, { useState, useEffect, useTransition } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { FloatingWhatsApp } from './components/layout/FloatingWhatsApp';
import { HomePage } from './pages/HomePage';
import { PropertiesPage } from './pages/PropertiesPage';
import { PlotsPage } from './pages/PlotsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PropertyDetailModal } from './components/property/PropertyDetailModal';
import { EnquiryModal } from './components/forms/EnquiryModal';
import { SiteVisitModal } from './components/forms/SiteVisitModal';
import { ChatLauncher } from './components/chat/ChatLauncher';
import { ChatPanel } from './components/chat/ChatPanel';
import { propertiesData } from './data/properties';
import { Property, SearchFilters } from './types/property';
import { useFavorites, saveFavorites } from './lib/favorites';
import { audioManager } from './lib/audioManager';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>(() => {
    if (typeof window !== 'undefined' && window.location.pathname) {
      return window.location.pathname === '' ? '/' : window.location.pathname;
    }
    return '/';
  });

  const [activeFilters, setActiveFilters] = useState<Partial<SearchFilters>>({});
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [enquiryProperty, setEnquiryProperty] = useState<Property | null>(null);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [siteVisitProperty, setSiteVisitProperty] = useState<Property | null>(null);
  const [isSiteVisitOpen, setIsSiteVisitOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  const { favorites, toggleFavorite, isFavorite } = useFavorites();

  // Whenever visitor enters the website, start ambient music playback
  useEffect(() => {
    audioManager.autoStart();
  }, []);

  // Listen to popstate for browser back/forward
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname || '/';
      setCurrentRoute(path);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (route: string) => {
    if (route !== currentRoute) {
      if (typeof window !== 'undefined' && window.history) {
        window.history.pushState({}, '', route);
      }
      setCurrentRoute(route);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleHeroSearch = (filters: SearchFilters) => {
    setActiveFilters(filters);
    navigateTo('/properties');
  };

  const handleExploreLandProjects = () => {
    setActiveFilters({ category: 'residential_plot', keyword: '', location: 'all' });
    navigateTo('/properties');
  };

  const handleSelectProperty = (prop: Property) => {
    setSelectedProperty(prop);
    setIsDetailOpen(true);
  };

  const handleOpenEnquiry = (prop?: Property) => {
    setEnquiryProperty(prop || null);
    setIsEnquiryOpen(true);
  };

  const handleScheduleSiteVisit = (prop: Property) => {
    setSiteVisitProperty(prop);
    setIsSiteVisitOpen(true);
  };

  const handleClearAllFavorites = () => {
    saveFavorites([]);
    window.location.reload();
  };

  // Find related properties for detail view
  const relatedProperties = selectedProperty
    ? propertiesData.filter((p) => p.id !== selectedProperty.id && (p.category === selectedProperty.category || p.featured))
    : [];

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F5EF] text-[#202B25] selection:bg-[#B69A70]/30 selection:text-[#172720]">
      {/* 1. Header Navigation adhering to Top Bar Contract */}
      <Header
        currentRoute={currentRoute}
        onNavigate={navigateTo}
        favoritesCount={favorites.length}
        onOpenEnquiry={() => handleOpenEnquiry()}
        onOpenFavorites={() => navigateTo('/favorites')}
      />

      {/* 2. Main Page View Routing */}
      <main className="flex-grow">
        {currentRoute === '/' && (
          <HomePage
            properties={propertiesData}
            onSelectProperty={handleSelectProperty}
            onSearch={handleHeroSearch}
            onNavigate={navigateTo}
            onExploreLandProjects={handleExploreLandProjects}
            onOpenEnquiry={handleOpenEnquiry}
            onScheduleSiteVisit={handleScheduleSiteVisit}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {currentRoute === '/properties' && (
          <PropertiesPage
            properties={propertiesData}
            onSelectProperty={handleSelectProperty}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
            initialFilters={activeFilters}
          />
        )}

        {currentRoute === '/residential-plots' && (
          <PlotsPage
            properties={propertiesData}
            onSelectProperty={handleSelectProperty}
            onScheduleSiteVisit={handleScheduleSiteVisit}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />
        )}

        {currentRoute === '/about' && (
          <AboutPage
            onOpenEnquiry={() => handleOpenEnquiry()}
            onNavigate={navigateTo}
          />
        )}

        {currentRoute === '/contact' && (
          <ContactPage />
        )}

        {currentRoute === '/favorites' && (
          <FavoritesPage
            properties={propertiesData}
            favoriteIds={favorites}
            onSelectProperty={handleSelectProperty}
            onToggleFavorite={toggleFavorite}
            onClearFavorites={handleClearAllFavorites}
            onExploreProperties={() => navigateTo('/properties')}
          />
        )}

        {/* Legal pages (clean, transparent) */}
        {(currentRoute === '/privacy' || currentRoute === '/terms') && (
          <div className="pt-32 pb-24 max-w-4xl mx-auto px-6 text-[#202B25]">
            <h1 className="text-3xl font-serif text-[#172720] mb-4">
              {currentRoute === '/privacy' ? 'Client Privacy Protocol' : 'Terms & Demonstration Conditions'}
            </h1>
            <p className="text-sm text-[#777B75] leading-relaxed mb-6">
              PrimeNest Properties operates with absolute client confidentiality. All inquiries, site visit coordinates, and financial consultations are safeguarded with strict fiduciary standards.
            </p>
            <p className="text-xs text-[#777B75] leading-relaxed">
              This digital application is an architectural portfolio and demonstration platform illustrating the brand, property discovery capabilities, and enquiry workflow of PrimeNest Properties.
            </p>
            <button
              onClick={() => navigateTo('/')}
              className="mt-8 px-6 py-2.5 bg-[#172720] text-white text-xs uppercase tracking-widest font-semibold rounded hover:bg-[#B69A70] hover:text-[#172720] transition-colors"
            >
              Return to Homepage
            </button>
          </div>
        )}
      </main>

      {/* 3. Global Footer */}
      <Footer
        onNavigate={navigateTo}
        onOpenEnquiry={() => handleOpenEnquiry()}
      />

      {/* 4. Floating Actions */}
      <FloatingWhatsApp
        currentPropertyTitle={selectedProperty?.title}
        currentPropertyRef={selectedProperty?.refCode}
      />

      {/* Floating AI Chatbot Launcher */}
      <ChatLauncher
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* AI Assistant Chat Panel */}
      <ChatPanel
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onViewProperty={handleSelectProperty}
        onOpenEnquiry={handleOpenEnquiry}
        onScheduleSiteVisit={handleScheduleSiteVisit}
      />

      {/* 5. Modals & Drawers */}
      <PropertyDetailModal
        property={selectedProperty}
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        onOpenEnquiry={handleOpenEnquiry}
        onScheduleSiteVisit={handleScheduleSiteVisit}
        isFavorite={selectedProperty ? isFavorite(selectedProperty.id) : false}
        onToggleFavorite={toggleFavorite}
        relatedProperties={relatedProperties}
        onSelectProperty={handleSelectProperty}
      />

      <EnquiryModal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        property={enquiryProperty}
      />

      <SiteVisitModal
        isOpen={isSiteVisitOpen}
        onClose={() => setIsSiteVisitOpen(false)}
        property={siteVisitProperty}
      />
    </div>
  );
}
