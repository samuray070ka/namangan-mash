import React, { Suspense, lazy } from 'react';
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
      {/* Katta spinner */}
      <div
        className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"
        style={{ animationDuration: '5s' }} // 5 soniyaga cho‘zildi
      ></div>

      {/* Kichkina spinner — hozircha komentga olingan */}

      {/* <div
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
        style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}
      ></div> */}

    </div>
  </div>
);

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
          <Toaster position="top-right" richColors />
        </BrowserRouter>
      </AdminAuthProvider>
    </LanguageProvider>
  );
}

export default App;