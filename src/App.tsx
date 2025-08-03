import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from '@/components/theme-provider';
import { AppProvider } from '@/contexts/AppContext';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import { AuthPage } from '@/components/auth/AuthPage';
import AppLayout from '@/components/AppLayout';
import Index from '@/pages/Index';
import NotFound from '@/pages/NotFound';
import Dashboard from '@/components/Dashboard';
import ResetPassword from '@/pages/ResetPassword';
import './App.css';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Allow reset-password routes even if user is not logged in
  const publicResetPaths = [
    '/reset-password',
    '/auth/reset-password',
    '/auth_reset-password'
  ];
  if (!user && !publicResetPaths.includes(location.pathname)) {
    return <AuthPage />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/app" element={<AppLayout />} />
        <Route path="/welcome" element={<Index />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth_reset-password" element={<ResetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider  defaultTheme="light" storageKey="vite-ui-theme">
      <AuthProvider>
        <AppProvider>
          <Router>
            <AppContent />
          </Router>
        </AppProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
