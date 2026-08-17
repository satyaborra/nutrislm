import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import FoodLogger from './pages/FoodLogger';
import DietPlan from './pages/DietPlan';
import HealthTracker from './pages/HealthTracker';
import Chatbot from './pages/Chatbot';
import Profile from './pages/Profile';
import HealthProfile from './pages/HealthProfile';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';

import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { HealthProvider } from './contexts/HealthContext';

import { AIProvider } from './contexts/AIContext';
import { EvidenceProvider } from './contexts/EvidenceContext';

const App: React.FC = () => {
  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID';

  return (
    <ThemeProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <AuthProvider>
          <AIProvider>
            <HealthProvider>
              <EvidenceProvider>
                <BrowserRouter>
                  <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route element={<ProtectedRoute />}>
                      <Route path="/" element={<MainLayout />}>
                        <Route index element={<Dashboard />} />
                        <Route path="logger" element={<FoodLogger />} />
                        <Route path="diet" element={<DietPlan />} />
                        <Route path="health" element={<HealthTracker />} />
                        <Route path="chat" element={<Chatbot />} />
                        <Route path="profile" element={<Profile />} />
                        <Route path="health-profile" element={<HealthProfile />} />
                      </Route>
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </BrowserRouter>
              </EvidenceProvider>
            </HealthProvider>
          </AIProvider>
        </AuthProvider>
      </GoogleOAuthProvider>
    </ThemeProvider>
  );
};

export default App;
