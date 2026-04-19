import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { SimulationProvider } from './context/SimulationContext';
import LandingPage from './components/LandingPage';
import LoginScreens from './components/LoginScreens';
import DashboardLayout from './components/DashboardLayout';
import CitizenPortal from './components/CitizenPortal';
import PumpDispenser from './components/PumpDispenser';
import LogisticsTerminal from './components/LogisticsTerminal';

function App() {
  return (
    <BrowserRouter>
      {/* SimulationProvider must wrap everything so routing and context mix well */}
      <SimulationProvider>
        {/* Global Toaster for pop-up alerts */}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'var(--bg-tertiary)',
              color: '#fff',
              border: '1px solid var(--glass-border)',
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginScreens />} />
          <Route path="/dashboard" element={<DashboardLayout />} />
          <Route path="/citizen" element={<CitizenPortal />} />
          <Route path="/pump" element={<PumpDispenser />} />
          <Route path="/logistics" element={<LogisticsTerminal />} />
        </Routes>
      </SimulationProvider>
    </BrowserRouter>
  );
}

export default App;
