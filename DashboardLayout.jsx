import React, { useState } from 'react';
import CentralAdmin from './CentralAdmin';
import FuelMonitoring from './FuelMonitoring';
import UserManagement from './UserManagement';
import DistributionControl from './DistributionControl';
import AlertsPanel from './AlertsPanel';
import GovtAudit from './GovtAudit';
import StationManager from './StationManager';
import AISentinel from './AISentinel';
import { 
  LayoutDashboard, Fuel, Activity, Users, 
  Settings, FileText, Bell, MapPin, 
  ChevronLeft, ChevronRight, LogOut, UserCircle,
  BrainCircuit
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Note: Ensure the DemoController and Simulator Context are initialized elsewhere if needed
import { useDataSimulators } from '../hooks/useDataSimulators';
import DemoController from './DemoController';

export default function DashboardLayout() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isCollapsed, setIsCollapsed] = useState(false);
  const navigate = useNavigate();
  
  // Keep the simulator running for demo purposes
  useDataSimulators(true);
  
  return (
    <div className="app-container">
      {/* Sidebar */}
      <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
        <div className="sidebar-header" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? <Activity size={24} color="var(--accent-primary)" /> : <h2 className="gradient-text flex items-center gap-2" style={{ margin: 0 }}><Activity /> SFSB</h2>}
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')} title="Dashboard">
            <LayoutDashboard size={20} /> {!isCollapsed && "Dashboard"}
          </div>
          <div className={`nav-item ${activeTab === 'monitoring' ? 'active' : ''}`} onClick={() => setActiveTab('monitoring')} title="Fuel Monitoring">
            <Activity size={20} /> {!isCollapsed && "Fuel Monitoring"}
          </div>
          <div className={`nav-item ${activeTab === 'stations' ? 'active' : ''}`} onClick={() => setActiveTab('stations')} title="Stations">
            <MapPin size={20} /> {!isCollapsed && "Stations"}
          </div>
          <div className={`nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')} title="Users">
            <Users size={20} /> {!isCollapsed && "Users"}
          </div>
          <div className={`nav-item ${activeTab === 'distribution' ? 'active' : ''}`} onClick={() => setActiveTab('distribution')} title="Distribution Control">
            <Fuel size={20} /> {!isCollapsed && "Distribution Control"}
          </div>
          <div className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`} onClick={() => setActiveTab('reports')} title="Reports">
            <FileText size={20} /> {!isCollapsed && "Reports"}
          </div>
          <div className={`nav-item ${activeTab === 'alerts' ? 'active' : ''}`} onClick={() => setActiveTab('alerts')} title="Alerts">
            <Bell size={20} /> {!isCollapsed && "Alerts"}
          </div>
          <div className={`nav-item ${activeTab === 'ai-sentinel' ? 'active' : ''}`} onClick={() => setActiveTab('ai-sentinel')} title="AI Sentinel">
            <BrainCircuit size={20} /> {!isCollapsed && "AI Sentinel"}
          </div>
          <div className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`} onClick={() => setActiveTab('settings')} title="Settings">
            <Settings size={20} /> {!isCollapsed && "Settings"}
          </div>
        </nav>

        <div style={{ padding: '1rem', borderTop: '1px solid var(--panel-border)' }}>
          <button className="btn btn-secondary w-full" onClick={() => navigate('/')} style={{ justifyContent: isCollapsed ? 'center' : 'flex-start' }}>
            <LogOut size={16} /> {!isCollapsed && "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="main-content-wrapper">
        {/* Top Navbar */}
        <header className="top-bar">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsCollapsed(!isCollapsed)} style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--panel-border)', borderRadius: '8px', cursor: 'pointer', padding: '0.4rem', display: 'flex' }}>
               {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
             </button>
             <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: 0, fontWeight: 600 }}>Secure Fuel Supply Chain Bangladesh</h3>
          </div>
          
          <div className="flex items-center gap-6">
             <div style={{ position: 'relative', cursor: 'pointer' }}>
                <Bell size={20} color="var(--text-secondary)" />
                <span style={{ position: 'absolute', top: -2, right: -2, background: 'var(--danger)', width: 8, height: 8, borderRadius: '50%', border: '2px solid white' }}></span>
             </div>
             
             <div className="flex items-center gap-3" style={{ borderLeft: '1px solid var(--panel-border)', paddingLeft: '1.5rem' }}>
                <div className="text-right hidden md:block">
                  <p style={{ fontSize: '0.85rem', fontWeight: 600, margin: 0, color: 'var(--text-primary)' }}>Nuhad N Khan</p>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: 0 }}>System Administrator</p>
                </div>
                <UserCircle size={36} color="var(--accent-primary)" />
             </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="main-content">
          {activeTab === 'dashboard' && <CentralAdmin />}
          {activeTab === 'monitoring' && <FuelMonitoring />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'distribution' && <DistributionControl />}
          {activeTab === 'alerts' && <AlertsPanel />}
          {activeTab === 'reports' && <GovtAudit />}
          {activeTab === 'stations' && <StationManager />}
          {activeTab === 'ai-sentinel' && <AISentinel />}
          
          {['settings'].includes(activeTab) && (
              <div className="glass-panel animate-slide-up" style={{ minHeight: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <Activity size={48} color="var(--panel-border)" style={{ marginBottom: '1rem' }} />
                  <h2 style={{ fontSize: '1.5rem', color: 'var(--text-secondary)' }}>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
                  <p className="text-muted mt-2 text-center" style={{ maxWidth: '400px' }}>
                    This section is part of the new corporate design system transition. Module is currently down for maintenance.
                  </p>
              </div>
          )}
        </main>
      </div>
      
      {/* Retain Demo controller for simulating data */}
      <DemoController />
    </div>
  );
}
