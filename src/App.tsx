import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { ToastProvider } from './components/ui/Toast';
import { OfflineIndicator } from './components/ui/OfflineIndicator';
import { PageTransition } from './components/ui/PageTransition';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { AboutPage } from './pages/AboutPage';
import { SignIn } from './pages/auth/SignIn';
import { SignUp } from './pages/auth/SignUp';
import { Dashboard } from './pages/Dashboard';
import { ProfileSettings } from './pages/ProfileSettings';
import { HistoryDashboard } from './pages/HistoryDashboard';
import { PricingPage } from './pages/PricingPage';
import { usePerformanceMonitor } from './hooks/usePerformanceMonitor';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? <>{children}</> : <Navigate to="/auth/signin" />;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return user ? <Navigate to="/dashboard" /> : <>{children}</>;
}

function AppContent() {
  const { user } = useAuth();
  usePerformanceMonitor();
  
  return (
    <Router>
      <OfflineIndicator />
      <div className="min-h-screen flex flex-col">
        <Routes>
          {/* Public routes with header/footer */}
          <Route
            path="/"
            element={
              <PageTransition>
                <Header />
                <main className="flex-1">
                  <LandingPage />
                </main>
                <Footer />
              </PageTransition>
            }
          />
          
          {/* About route */}
          <Route
            path="/about"
            element={
              <PageTransition>
                <Header />
                <main className="flex-1">
                  <AboutPage />
                </main>
                <Footer />
              </PageTransition>
            }
          />
          
          {/* Pricing route */}
          <Route
            path="/pricing"
            element={
              <PageTransition>
                <Header />
                <main className="flex-1">
                  <PricingPage />
                </main>
                <Footer />
              </PageTransition>
            }
          />
          
          {/* Auth routes without header/footer */}
          <Route
            path="/auth/signin"
            element={
              <PublicRoute>
                <PageTransition>
                  <SignIn />
                </PageTransition>
              </PublicRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <PublicRoute>
                <PageTransition>
                  <SignUp />
                </PageTransition>
              </PublicRoute>
            }
          />
          
          {/* Protected routes without header/footer (dashboard has its own layout) */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <Dashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          {/* Profile Settings route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <ProfileSettings />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          {/* History Dashboard route */}
          <Route
            path="/history"
            element={
              <ProtectedRoute>
                <PageTransition>
                  <HistoryDashboard />
                </PageTransition>
              </ProtectedRoute>
            }
          />
          
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <ToastProvider />
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;