import React from 'react';
import { 
  Routes, 
  Route, 
  Navigate, 
  Outlet 
} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import theme from './theme';
import { DashboardProvider } from './context/DashboardContext';

import LandingPage from './pages/LandingPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import AboutPage from './pages/AboutPage';
import OAuthCallbackHandler from './pages/OAuthCallbackHandler';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import TopUpPage from './pages/TopUpPage';
import SettingsPage from './pages/SettingsPage';
import ImpactPage from './pages/ImpactPage';
import ExpensesPage from './pages/ExpensesPage';
import NotificationsPage from './pages/NotificationsPage';
import SupportPage from './pages/SupportPage';
import ForumPage from './pages/ForumPage';
import LoadSheddingPage from './pages/LoadSheddingPage';
import ReferPage from './pages/ReferPage';
import GroupBuying from './pages/GroupBuying';
import SubscriptionPage from './pages/SubscriptionPage';

// Enable future flags globally (you can customize as needed)
const futureConfig = {
  v7_startTransition: true,
  v7_relativeSplatPath: true,
};

// Protected Route component
const ProtectedRoute = () => {
  return <Outlet />;  // Temporary simplification
};

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Router future={futureConfig}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Add OAuth callback route */}
          <Route path="/auth/callback" element={<OAuthCallbackHandler />} />

          {/* Protected Routes */}
          <Route 
            element={
              <DashboardProvider>
                <ProtectedRoute />
              </DashboardProvider>
            }
          >
            <Route path="/home" element={<HomePage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/top-up" element={<TopUpPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/impact" element={<ImpactPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/forum" element={<ForumPage />} />
            <Route path="/loadshedding" element={<LoadSheddingPage />} />
            <Route path="/refer" element={<ReferPage />} />
            <Route path="/group-buying" element={<GroupBuying />} />
            <Route path="/subscription" element={<SubscriptionPage />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </ChakraProvider>
  );
}

export default App;
