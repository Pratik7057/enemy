import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoadingSpinner from './components/common/LoadingSpinner';

// Layout
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';

// Protected User Pages
import Dashboard from './pages/Dashboard';
import AddBalance from './pages/AddBalance';
import Orders from './pages/Orders';
import PlaceOrder from './pages/PlaceOrder';
import ApiGenerator from './pages/ApiGenerator';
import Transactions from './pages/Transactions';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminOrders from './pages/admin/Orders';
import AdminServices from './pages/admin/Services';
import AdminApiKeys from './pages/admin/ApiKeys';
import AdminLogs from './pages/admin/ApiLogs';

// Protected Route Components
const ProtectedRoute = ({ children, admin = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (admin && user?.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <Routes>
        {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/add-balance"
        element={
          <ProtectedRoute>
            <Layout>
              <AddBalance />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Layout>
              <Orders />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/place-order"
        element={
          <ProtectedRoute>
            <Layout>
              <PlaceOrder />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/api-generator"
        element={
          <ProtectedRoute>
            <Layout>
              <ApiGenerator />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/transactions"
        element={
          <ProtectedRoute>
            <Layout>
              <Transactions />
            </Layout>
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute admin={true}>
            <Navigate to="/admin/dashboard" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminDashboard />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminUsers />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/orders"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminOrders />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/services"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminServices />
            </AdminLayout>
          </ProtectedRoute>
        }
      />      <Route
        path="/admin/api-logs"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminLogs />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/api-keys"
        element={
          <ProtectedRoute admin={true}>
            <AdminLayout>
              <AdminApiKeys />
            </AdminLayout>
          </ProtectedRoute>
        }
      />
      {/* 404 Route */}
      <Route path="*" element={<div>Page not found</div>} />
    </Routes>
    </ThemeProvider>
  );
}

export default App;
