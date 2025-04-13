import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ScanFiles from './components/dashboard/ScanFiles';
import History from './components/dashboard/History';
import Settings from './components/dashboard/Settings';
import ChatBot from './components/dashboard/ChatBot';
import LogAnalysis from './components/dashboard/LogAnalysis';

function App() {
  const { isSignedIn, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={isSignedIn ? <Navigate to="/dashboard" /> : <LandingPage />} />
      <Route path="/login" element={isSignedIn ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={isSignedIn ? <Dashboard /> : <Navigate to="/login" />}>
        <Route path="" element={<Navigate to="scan" replace />} />
        <Route path="scan" element={<ScanFiles />} />
        <Route path="history" element={<History />} />
        <Route path="settings" element={<Settings />} />
        <Route path="chat" element={<ChatBot />} />
        <Route path="logs" element={<LogAnalysis />} />
      </Route>
    </Routes>
  );
}

export default App;
