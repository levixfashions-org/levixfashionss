import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { PwaProvider } from './context/PwaContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { SearchDrawer } from './components/SearchDrawer';
import { MobileNavDrawer } from './components/MobileNavDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { GlassyPwaNotification } from './components/GlassyPwaNotification';

// Pages
import { HomePage } from './pages/HomePage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CollectionDetailPage } from './pages/CollectionDetailPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { AccountPage } from './pages/AccountPage';
import { OrderHistoryPage } from './pages/OrderHistoryPage';
import { AboutPage } from './pages/AboutPage';
import { StoreLocatorPage } from './pages/StoreLocatorPage';
import { PolicyPage } from './pages/PolicyPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminProductsPage } from './pages/admin/AdminProductsPage';
import { AdminOrdersPage } from './pages/admin/AdminOrdersPage';
import { AdminDiscountsPage } from './pages/admin/AdminDiscountsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <PwaProvider>
        <BrowserRouter>
          <ScrollToTop />
          <div className="flex flex-col min-h-screen bg-[#EFEFEF] text-black">
            <AnnouncementBar />
            <Header />
            
            {/* Global Overlays and Modals */}
            <CartDrawer />
            <SearchDrawer />
            <MobileNavDrawer />
            <SizeGuideModal />
            <GlassyPwaNotification />

            {/* Main Content Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/collections/:handle" element={<CollectionDetailPage />} />
              <Route path="/products/:handle" element={<ProductDetailPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/order-success/:orderNumber" element={<OrderSuccessPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/account" element={<AccountPage />} />
              <Route path="/account/orders" element={<OrderHistoryPage />} />
              <Route path="/pages/about" element={<AboutPage />} />
              <Route path="/pages/store" element={<StoreLocatorPage />} />
              <Route path="/policies/*" element={<PolicyPage />} />

              {/* Admin Management Routes */}
              <Route path="/admin" element={<AdminDashboardPage />} />
              <Route path="/admin/products" element={<AdminProductsPage />} />
              <Route path="/admin/orders" element={<AdminOrdersPage />} />
              <Route path="/admin/discounts" element={<AdminDiscountsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />

              {/* 404 Fallback */}
              <Route
                path="*"
                element={
                  <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
                    <h2 className="font-display font-black text-3xl uppercase text-black">Page Not Found</h2>
                    <p className="text-xs text-neutral-600">The streetwear drop or page you requested does not exist.</p>
                    <a href="/" className="inline-block px-8 py-3 bg-black text-white text-xs font-bold uppercase tracking-widest">
                      Return Home
                    </a>
                  </div>
                }
              />
            </Routes>
          </main>

          <Footer />
          <MobileBottomNav />
        </div>
      </BrowserRouter>
    </PwaProvider>
  </AuthProvider>
  );
};
