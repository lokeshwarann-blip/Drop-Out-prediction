import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import HeaderNav from './components/HeaderNav';
import AtRiskQueue from './components/AtRiskQueue';
import StudentDossier from './components/StudentDossier';
import CommunicationLogsView from './components/CommunicationLogsView';
import LogInterventionModal from './components/LogInterventionModal';
import LogDetailModal from './components/LogDetailModal';
import NotificationToast from './components/NotificationToast';
import Analytics from './components/Analytics';
import FairnessAudit from './components/FairnessAudit';
import Login from './components/Login';
import ShaderBackground from './components/ShaderBackground';

function DashboardView() {
  return (
    <div className="flex h-screen pt-20 overflow-hidden">
      <AtRiskQueue />
      <main className="flex-1 overflow-y-auto p-container-padding relative z-10">
        <StudentDossier />
      </main>
    </div>
  );
}

function MainLayout() {
  return (
    <div className="bg-transparent text-on-background min-h-screen relative font-sans antialiased">
      <ShaderBackground />
      <HeaderNav />
      <Routes>
        <Route path="/" element={<DashboardView />} />
        <Route path="/logs" element={<div className="pt-20 h-screen"><CommunicationLogsView /></div>} />
        <Route path="/analytics" element={<div className="pt-20 h-[calc(100vh-80px)]"><Analytics /></div>} />
        <Route path="/fairness" element={<div className="pt-20 h-[calc(100vh-80px)] overflow-y-auto"><FairnessAudit /></div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <LogInterventionModal />
      <LogDetailModal />
      <NotificationToast />
    </div>
  );
}

function AppRouter() {
  const { isLoggedIn, setIsLoggedIn } = useApp();

  return (
    <BrowserRouter>
      {isLoggedIn ? (
        <MainLayout />
      ) : (
        <Routes>
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppRouter />
    </AppProvider>
  );
}
