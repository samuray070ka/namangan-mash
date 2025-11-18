import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AdminAuthProvider } from './admin/context/AdminAuthContext';
import { ProtectedRoute } from './admin/components/ProtectedRoute';
import AdminLogin from './admin/pages/AdminLogin';
import AdminDashboard from './admin/pages/AdminDashboard';
import ProductsManagement from './admin/pages/ProductsManagement';
import NewsManagement from './admin/pages/NewsManagement';
import CompanyInfoManagement from './admin/pages/CompanyInfoManagement';
import ContactsManagement from './admin/pages/ContactsManagement';
import { Toaster } from './components/ui/toaster';

function AdminApp() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
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
            path="/products"
            element={
              <ProtectedRoute>
                <ProductsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/news"
            element={
              <ProtectedRoute>
                <NewsManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company-info"
            element={
              <ProtectedRoute>
                <CompanyInfoManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacts"
            element={
              <ProtectedRoute>
                <ContactsManagement />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
      <Toaster />
    </AdminAuthProvider>
  );
}

export default AdminApp;