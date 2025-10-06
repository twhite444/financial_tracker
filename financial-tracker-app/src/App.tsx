import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AnimatePresence } from 'framer-motion';
import { useAuthStore } from './stores/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { LoadingScreen } from './components/common/LoadingScreen';
import { HealthService } from './services/HealthService';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountsPage from './pages/AccountsPage';
import PaymentsPage from './pages/PaymentsPage';
import TransactionsPage from './pages/TransactionsPage';
import HistoryPage from './pages/HistoryPage';
import LoansPage from './pages/LoansPage';
import QuickActions from './components/common/QuickActions';

function App() {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();
  const [connectionStatus, setConnectionStatus] = useState<'loading' | 'error' | 'success'>('loading');
  const [statusMessage, setStatusMessage] = useState('Initializing application...');
  const [errorMessage, setErrorMessage] = useState<string>();

  // Check backend connection on mount
  useEffect(() => {
    checkConnection();
  }, []);

  const checkConnection = async () => {
    setConnectionStatus('loading');
    setStatusMessage('Connecting to database...');
    setErrorMessage(undefined);

    try {
      await HealthService.waitForConnection((status, attempt) => {
        setStatusMessage(status);
      });
      
      setConnectionStatus('success');
      setStatusMessage('Connected successfully!');
      
      // Keep success screen visible briefly before showing app
      setTimeout(() => {
        setConnectionStatus('success');
      }, 500);
    } catch (error) {
      console.error('Connection failed:', error);
      setConnectionStatus('error');
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the database. Please check your connection and try again.'
      );
    }
  };

  // Show loading screen until connection is established
  if (connectionStatus === 'loading' || connectionStatus === 'error') {
    return (
      <ThemeProvider>
        <LoadingScreen
          status={connectionStatus}
          message={statusMessage}
          error={errorMessage}
          onRetry={connectionStatus === 'error' ? checkConnection : undefined}
        />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {/* Public Routes */}
          <Route
            path="/login"
            element={!isAuthenticated ? <LoginPage /> : <Navigate to="/dashboard" replace />}
          />
          <Route
            path="/register"
            element={!isAuthenticated ? <RegisterPage /> : <Navigate to="/dashboard" replace />}
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={isAuthenticated ? <Layout /> : <Navigate to="/login" replace />}
          >
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="accounts" element={<AccountsPage />} />
            <Route path="loans" element={<LoansPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="transactions" element={<TransactionsPage />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AnimatePresence>

    {/* Quick Actions FAB - Only show when authenticated */}
    {isAuthenticated && <QuickActions />}
    </ThemeProvider>
  );
}

export default App;
