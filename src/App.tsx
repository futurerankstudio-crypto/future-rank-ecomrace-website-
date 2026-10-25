import React, { useState } from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { AnnouncementBar } from './components/AnnouncementBar.tsx';
import { Header } from './components/Header.tsx';
import { StorefrontHome } from './components/StorefrontHome.tsx';
import { ShopPage } from './components/ShopPage.tsx';
import { ProductDetailPage } from './components/ProductDetailPage.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { Footer } from './components/Footer.tsx';
import { ProductQuickView } from './components/ProductQuickView.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderSuccessModal } from './components/OrderSuccessModal.tsx';
import { AiShoppingAssistant } from './components/AiShoppingAssistant.tsx';
import { AdminLayout } from './components/admin/AdminLayout.tsx';
import { Order } from './types/index.ts';

const AppContent: React.FC = () => {
  const { activeView } = useStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // If in admin mode, display Admin Console
  if (activeView === 'admin') {
    return <AdminLayout />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1C1C1F]">
      {/* Top Banner */}
      <AnnouncementBar />

      {/* Primary Navigation Top Bar */}
      <Header />

      {/* Main View Router */}
      <main className="flex-1">
        {activeView === 'storefront' && <StorefrontHome />}
        {activeView === 'shop' && <ShopPage />}
        {activeView === 'product_detail' && <ProductDetailPage />}
        {activeView === 'about' && <AboutPage />}
        {activeView === 'contact' && <ContactPage />}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Interactive Modals & Drawers */}
      <ProductQuickView />
      <CartDrawer onProceedToCheckout={() => setIsCheckoutOpen(true)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        onOrderSuccess={(order) => setConfirmedOrder(order)}
      />
      <OrderSuccessModal
        order={confirmedOrder}
        onClose={() => setConfirmedOrder(null)}
      />
      <AiShoppingAssistant />
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
