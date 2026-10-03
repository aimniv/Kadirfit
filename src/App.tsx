/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { WhatsAppButton } from './components/common/WhatsAppButton';
import { CookieBanner } from './components/common/CookieBanner';
import { SearchModal } from './components/common/SearchModal';
import { CartDrawer } from './components/common/CartDrawer';
import { HeroSection } from './components/home/HeroSection';
import { AboutSection } from './components/home/AboutSection';
import { HowItWorksSection } from './components/home/HowItWorksSection';
import { CoachingPackagesSection } from './components/home/CoachingPackagesSection';
import { CategoriesSection } from './components/home/CategoriesSection';
import { FeaturedProductsSection } from './components/home/FeaturedProductsSection';
import { TransformationGallerySection } from './components/home/TransformationGallerySection';
import { TestimonialsSection } from './components/home/TestimonialsSection';
import { FaqSection } from './components/home/FaqSection';
import { CtaNewsletterSection } from './components/home/CtaNewsletterSection';
import { ProductDetailModal } from './components/shop/ProductDetailModal';
import { CheckoutPage } from './components/checkout/CheckoutPage';
import { OrderSuccessModal } from './components/checkout/OrderSuccessModal';
import { AuthModal } from './components/user/AuthModal';
import { UserDashboard } from './components/user/UserDashboard';
import { AssessmentFormModal } from './components/user/AssessmentFormModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { AboutPage } from './components/pages/AboutPage';
import { CoachingPage } from './components/pages/CoachingPage';
import { ShopPage } from './components/pages/ShopPage';
import { ResultsPage } from './components/pages/ResultsPage';
import { BlogPage } from './components/pages/BlogPage';
import { ContactPage } from './components/pages/ContactPage';
import { LegalPage } from './components/pages/LegalPage';
import { Product, Order, ProductCategory } from './types';

const MainApp: React.FC = () => {
  const {
    cmsSections,
    selectedProductDetail,
    openProductDetail,
    closeProductDetail,
    openAssessmentModal,
    openCart
  } = useApp();

  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParam, setViewParam] = useState<string | undefined>(undefined);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Navigation handler
  const handleNavigate = (view: string, param?: string) => {
    setCurrentView(view);
    setViewParam(param);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // If in Admin Panel View
  if (currentView === 'admin') {
    return (
      <>
        <AdminPanel onExitAdmin={() => handleNavigate('home')} />
        <AuthModal onOpenLegal={(doc) => handleNavigate('legal', doc)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#EDEDED] flex flex-col font-sans selection:bg-[#FF5A1F] selection:text-white">
      
      {/* Sticky Header Navbar */}
      <Navbar onNavigate={handleNavigate} currentView={currentView} />

      {/* Main Body Router */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE with dynamic CMS section ordering and toggling */}
        {currentView === 'home' && (
          <div>
            {cmsSections
              .filter(sec => sec.enabled)
              .sort((a, b) => a.order - b.order)
              .map(sec => {
                switch (sec.key) {
                  case 'hero':
                    return <HeroSection key={sec.id} onNavigate={handleNavigate} />;
                  case 'about':
                    return <AboutSection key={sec.id} onNavigate={handleNavigate} />;
                  case 'how_it_works':
                    return <HowItWorksSection key={sec.id} onNavigate={handleNavigate} />;
                  case 'coaching_packages':
                    return <CoachingPackagesSection key={sec.id} onNavigate={handleNavigate} />;
                  case 'categories':
                    return (
                      <CategoriesSection
                        key={sec.id}
                        onSelectCategory={(cat) => handleNavigate('shop', cat)}
                      />
                    );
                  case 'featured_products':
                    return (
                      <FeaturedProductsSection
                        key={sec.id}
                        onNavigateToShop={() => handleNavigate('shop')}
                        onOpenProduct={openProductDetail}
                      />
                    );
                  case 'transformations':
                    return <TransformationGallerySection key={sec.id} onNavigate={handleNavigate} />;
                  case 'testimonials':
                    return <TestimonialsSection key={sec.id} />;
                  case 'faq':
                    return <FaqSection key={sec.id} onNavigateToContact={() => handleNavigate('contact')} />;
                  case 'cta_newsletter':
                    return (
                      <CtaNewsletterSection
                        key={sec.id}
                        onStartNow={() => handleNavigate('coaching')}
                      />
                    );
                  default:
                    return null;
                }
              })}
          </div>
        )}

        {/* VIEW 2: ABOUT PAGE */}
        {currentView === 'about' && (
          <AboutPage
            onStartCoaching={() => handleNavigate('coaching')}
            onOpenAssessment={openAssessmentModal}
          />
        )}

        {/* VIEW 3: COACHING PAGE */}
        {currentView === 'coaching' && (
          <CoachingPage onOpenAssessment={openAssessmentModal} />
        )}

        {/* VIEW 4: SHOP PAGE */}
        {currentView === 'shop' && (
          <ShopPage
            initialCategory={(viewParam as ProductCategory) || 'all'}
            onOpenProduct={openProductDetail}
          />
        )}

        {/* VIEW 5: RESULTS & TRANSFORMATIONS */}
        {currentView === 'results' && <ResultsPage />}

        {/* VIEW 6: BLOG & DETAIL */}
        {currentView === 'blog' && (
          <BlogPage
            onSelectPost={(id) => handleNavigate('blog_detail', id)}
            onBackToList={() => handleNavigate('blog')}
          />
        )}
        {currentView === 'blog_detail' && (
          <BlogPage
            selectedPostId={viewParam}
            onSelectPost={(id) => handleNavigate('blog_detail', id)}
            onBackToList={() => handleNavigate('blog')}
          />
        )}

        {/* VIEW 7: FAQ PAGE */}
        {currentView === 'faq' && (
          <div className="py-12 bg-[#0A0A0A]">
            <FaqSection onNavigateToContact={() => handleNavigate('contact')} />
          </div>
        )}

        {/* VIEW 8: CONTACT PAGE */}
        {currentView === 'contact' && <ContactPage />}

        {/* VIEW 9: CHECKOUT PAGE */}
        {currentView === 'checkout' && (
          <CheckoutPage
            onBackToShop={() => handleNavigate('shop')}
            onOrderCompleted={(ord) => setCompletedOrder(ord)}
            onOpenLegal={(doc) => handleNavigate('legal', doc)}
          />
        )}

        {/* VIEW 10: USER DASHBOARD */}
        {currentView === 'account' && (
          <UserDashboard
            initialTab={viewParam || 'overview'}
            onNavigateToShop={() => handleNavigate('shop')}
            onOpenAssessment={openAssessmentModal}
          />
        )}

        {/* VIEW 11: LEGAL PAGES */}
        {currentView === 'legal' && <LegalPage initialDoc={viewParam || 'kvkk'} />}

        {/* VIEW 12: ASSESSMENT FORM DIRECT */}
        {currentView === 'assessment' && (
          <div className="py-12 bg-[#0A0A0A]">
            <AssessmentFormModal />
          </div>
        )}
      </main>

      {/* Global Modals & Drawers */}
      <CartDrawer
        onProceedToCheckout={() => handleNavigate('checkout')}
        onContinueShopping={() => handleNavigate('shop')}
      />

      <SearchModal
        onNavigate={handleNavigate}
        onSelectProduct={openProductDetail}
      />

      <AuthModal onOpenLegal={(doc) => handleNavigate('legal', doc)} />

      <ProductDetailModal
        product={selectedProductDetail}
        onClose={closeProductDetail}
        onSelectProduct={openProductDetail}
      />

      <AssessmentFormModal />

      <OrderSuccessModal
        order={completedOrder}
        onClose={() => setCompletedOrder(null)}
        onNavigateToAccount={(tab) => handleNavigate('account', tab)}
      />

      {/* Floating Action Button */}
      <WhatsAppButton />

      {/* Cookie Consent Banner */}
      <CookieBanner onOpenLegal={(doc) => handleNavigate('legal', doc)} />

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
