import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { Toaster } from './components/ui/sonner';
import Layout from './components/Layout';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProductsManagement from './admin/pages/ProductsManagement';
import NewsManagement from './admin/pages/NewsManagement';
import CompanyInfoManagement from './admin/pages/CompanyInfoManagement';
import ContactsManagement from './admin/pages/ContactsManagement';
import '@/App.css';
import { FaChevronUp } from "react-icons/fa";

// Lazy-loaded pages (foydalanuvchi qismi)
const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetail = lazy(() => import('./pages/ProductDetail'));
const News = lazy(() => import('./pages/News'));
const NewsDetail = lazy(() => import('./pages/NewsDetail'));
const Contact = lazy(() => import('./pages/Contact'));

// Loading spinner
const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50">
    <div className="relative">
      <div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        style={{ animationDuration: '5s' }}
      ></div>
    </div>
  </div>
);

// Scroll to top komponenti
const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Scroll pozitsiyasini kuzatish
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const handleHome = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <div className={`fixed bottom-5 right-5 z-50 transition-all duration-500 ease-in-out ${
      isVisible
        ? 'opacity-100 transform translate-y-0'
        : 'opacity-0 transform translate-y-10 pointer-events-none'
    }`}>
      <span
        onClick={handleHome}
        className="cursor-pointer flex bg-blue-600 text-white rounded-full p-3 hover:bg-blue-700 transition-colors duration-300 shadow-lg hover:shadow-xl"
      >
        <FaChevronUp />
      </span>
    </div>
  );
};

function App() {
  return (
    <LanguageProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* ---------- PUBLIC ROUTES ---------- */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:id" element={<ProductDetail />} />
                <Route path="news" element={<News />} />
                <Route path="news/:id" element={<NewsDetail />} />
                <Route path="contact" element={<Contact />} />
              </Route>

              {/* ---------- ADMIN ROUTES ---------- */}
              <Route path="/login" element={<AdminLogin />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/products"
                element={
                  <ProtectedRoute>
                    <ProductsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/news"
                element={
                  <ProtectedRoute>
                    <NewsManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/company-info"
                element={
                  <ProtectedRoute>
                    <CompanyInfoManagement />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/contacts"
                element={
                  <ProtectedRoute>
                    <ContactsManagement />
                  </ProtectedRoute>
                }
              />

              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/" replace />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>

          {/* Scroll to top tugmasi - endi faqat scroll qilinganda ko'rinadi */}
          <ScrollToTopButton />

          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;
