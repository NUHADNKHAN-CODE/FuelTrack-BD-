import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { Activity, MapPin, Fuel, AlertTriangle, Search, Lock, UserCircle, Car, Droplet, Navigation, ShieldCheck, QrCode } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();
  const { pumps, alerts, liveMetrics } = useSimulation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activePump, setActivePump] = useState(null);

  const totalAvailable = pumps.reduce((sum, p) => sum + p.total_fuel, 0);
  const criticalStations = pumps.filter(p => p.total_fuel < 2000).length;

  const filteredPumps = pumps.filter(p => p.location.toLowerCase().includes(searchQuery.toLowerCase()) || p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      
      {/* Top Navbar */}
      <nav style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <h2 className="gradient-text flex items-center gap-2" style={{ margin: 0, fontSize: '1.5rem', cursor: 'pointer' }}>
          <Activity size={28} /> SFSB Public Portal
        </h2>
        
        <div style={{ position: 'relative', width: '350px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Find Nearest Fuel Station..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '99px', border: '1px solid var(--panel-border)', background: 'var(--bg-primary)', outline: 'none' }}
            />
        </div>

        <div className="flex gap-4">
          <button className="btn btn-secondary flex items-center gap-2" onClick={() => navigate('/login?type=citizen')}>
             <UserCircle size={16} /> Tax Token Login
          </button>
          <button className="btn btn-primary flex items-center gap-2" onClick={() => navigate('/login?type=admin')}>
             <Lock size={16} /> HQ Admin
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex gap-6" style={{ flex: 1, padding: '2rem 3rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
        
        {/* Left Side: Information & Listing */}
        <div className="flex-col gap-6" style={{ width: '380px', flexShrink: 0 }}>
            {/* National Status Card */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <h3 className="text-sm text-text-primary uppercase font-bold tracking-wider mb-4">National Fuel Status</h3>
                
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <p className="text-xs text-muted mb-1">Total Available</p>
                        <strong className="text-accent-primary" style={{ fontSize: '1.8rem', lineHeight: 1 }}>{totalAvailable.toLocaleString()} L</strong>
                    </div>
                    <div className="text-right">
                        <p className="text-xs text-muted mb-1">Network Status</p>
                        {criticalStations > 2 ? (
                            <span className="badge badge-warning flex items-center gap-1"><AlertTriangle size={12}/> High Demand</span>
                        ) : (
                            <span className="badge badge-success flex items-center gap-1"><Droplet size={12}/> Stable</span>
                        )}
                    </div>
                </div>

                <div className="flex justify-between text-xs font-semibold text-text-secondary border-t border-panel-border pt-3">
                    <span>{pumps.length} Total Nodes</span>
                    <span className={criticalStations > 0 ? "text-danger" : "text-success"}>{criticalStations} Interrupted</span>
                </div>
            </div>

            {/* Nearby Stations List */}
            <div className="glass-panel flex-col" style={{ flex: 1, maxHeight: '60vh', padding: '1.25rem 0' }}>
               <h3 className="text-sm text-text-primary uppercase font-bold tracking-wider px-6 mb-4">Nearby Stations</h3>
               <div className="flex-col gap-0" style={{ overflowY: 'auto' }}>
                  {filteredPumps.slice(0, 5).map((p, i) => {
                     const isCritical = p.total_fuel < 2000;
                     return (
                          <div 
                             key={p.id} 
                             onMouseEnter={() => setActivePump(p.id)}
                             onMouseLeave={() => setActivePump(null)}
                             style={{ 
                                 padding: '1rem 1.5rem', 
                                 borderBottom: i !== 4 ? '1px solid var(--panel-border)' : 'none',
                                 background: activePump === p.id ? 'var(--bg-tertiary)' : 'transparent',
                                 cursor: 'pointer',
                                 transition: '0.2s'
                             }}
                          >
                             <div className="flex justify-between items-start mb-1">
                                <strong className="text-sm text-text-primary">{p.name}</strong>
                                <span className={`badge ${isCritical ? 'badge-danger' : 'badge-success'}`} style={{ padding: '0.15rem 0.4rem', fontSize: '0.65rem' }}>
                                  {isCritical ? 'Low Stock' : 'Enough Fuel'}
                                </span>
                             </div>
                             <div className="flex justify-between items-end mt-2">
                                <div className="flex items-center gap-1 text-xs text-muted">
                                    <Navigation size={12} /> {Math.floor(Math.random() * 5) + 1}.2 km away
                                </div>
                                <strong className="text-sm" style={{ color: isCritical ? 'var(--danger)' : 'var(--text-primary)' }}>{p.total_fuel} L</strong>
                             </div>
                          </div>
                     );
                  })}
                  {filteredPumps.length === 0 && <p className="text-center text-sm text-muted mt-4">No stations found in region.</p>}
               </div>
            </div>
        </div>

        {/* Center: Interactive Map Simulator */}
        <div className="glass-panel" style={{ flex: 1, position: 'relative', overflow: 'hidden', padding: 0, border: '1px solid var(--panel-border)' }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: '#f8fafc', backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5 }}></div>
            
            <div style={{ position: 'absolute', top: '1rem', left: '1rem', zIndex: 10 }}>
                <span className="badge badge-info bg-bg-secondary" style={{ border: '1px solid var(--panel-border)', padding: '0.5rem 1rem', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                    <MapPin size={14} className="mr-2" style={{ marginRight: '6px' }}/> Live Infrastructure Map
                </span>
            </div>

            {pumps.map(pump => {
                const isCritical = pump.total_fuel < 2000;
                const isWarning = pump.total_fuel < 3500 && !isCritical;
                const color = isCritical ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)';
                const isActive = activePump === pump.id;
                
                return (
                <div 
                    key={pump.id} 
                    onMouseEnter={() => setActivePump(pump.id)}
                    onMouseLeave={() => setActivePump(null)}
                    style={{
                        position: 'absolute',
                        left: `${pump.coords.x}%`,
                        top: `${pump.coords.y}%`,
                        transform: 'translate(-50%, -50%)',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        zIndex: isActive || isCritical ? 20 : 1,
                        cursor: 'pointer'
                    }}
                >
                    <div className={isCritical ? 'pulse-glow' : ''} style={{
                        width: isActive ? '20px' : '16px', 
                        height: isActive ? '20px' : '16px', 
                        borderRadius: '50%',
                        background: color,
                        border: '3px solid white',
                        boxShadow: `0 4px 8px rgba(0,0,0,0.2)`,
                        transition: 'all 0.2s'
                    }}></div>
                    
                    {(isActive || isCritical) && (
                        <div className="animate-slide-up" style={{ 
                            position: 'absolute', 
                            top: '24px', 
                            background: 'white', 
                            padding: '0.75rem', 
                            borderRadius: '8px', 
                            minWidth: '160px', 
                            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                            border: '1px solid var(--panel-border)'
                        }}>
                            <h4 style={{ fontSize: '0.8rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{pump.name}</h4>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{pump.location}</p>
                            <div className="flex justify-between items-center bg-bg-tertiary p-1.5 rounded">
                                <span className="text-xs font-semibold" style={{ color }}>{pump.total_fuel} L</span>
                                <span className="text-xs text-muted">Stock</span>
                            </div>
                        </div>
                    )}
                </div>
                );
            })}
        </div>
      </main>

      {/* Citizen Quota Policy Overview */}
      <section style={{ padding: '0 3rem 4rem', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
          <div className="glass-panel" style={{ background: 'var(--bg-secondary)', border: '1px solid #bbf7d0', borderTop: '4px solid var(--success)' }}>
              <div className="flex justify-between items-start mb-6">
                  <div>
                      <h2 className="text-success flex items-center gap-2 mb-1" style={{ fontSize: '1.5rem' }}>
                          <ShieldCheck size={24} /> National Citizen Fuel Quota Policy
                      </h2>
                      <p className="text-muted text-sm font-medium">Verified weekly allowance for tax token holders across Bangladesh.</p>
                  </div>
                  <button className="btn btn-primary bg-success border-success" onClick={() => navigate('/login?type=citizen')}>
                      Check My Quota Status
                  </button>
              </div>

              <div className="grid grid-cols-3 gap-8">
                  <div className="flex gap-4 p-4 rounded-lg bg-f0fdf4">
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-bbf7d0 text-success">
                          <Car size={24} />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold mb-1">Weekly Allowance</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">Each verified citizen is authorized for up to <strong>15 Litres</strong> of fuel per week (Reset every Sunday 00:00).</p>
                      </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-lg bg-f0fdf4">
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-bbf7d0 text-success">
                          <Lock size={24} />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold mb-1">Identity Requirement</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">Access requires a <strong>Tax Token Verified NID</strong> and a one-time Biometric OTP verification at the gateway.</p>
                      </div>
                  </div>

                  <div className="flex gap-4 p-4 rounded-lg bg-f0fdf4">
                      <div className="p-3 bg-white rounded-lg shadow-sm border border-bbf7d0 text-success">
                          <QrCode size={24} />
                      </div>
                      <div>
                          <h4 className="text-sm font-bold mb-1">Zero-Bypass Policy</h4>
                          <p className="text-xs text-text-secondary leading-relaxed">No fuel is dispensed without a <strong>Valid QR Scan</strong>. Hardware bypass triggers an instant station lockdown.</p>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      {/* Alerts Ribbon (Bottom) */}
      {alerts.length > 0 && (
          <div style={{ background: '#fee2e2', borderTop: '1px solid #fecaca', padding: '0.75rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
              <AlertTriangle size={16} className="text-danger" />
              <span className="text-sm font-semibold text-danger">Network Alert: {alerts[0].title}</span>
              <span className="text-sm text-danger opacity-80">- {alerts[0].message}</span>
          </div>
      )}

      {/* Minimal Info Footer */}
      <footer style={{ padding: '2rem 3rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--panel-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div className="text-muted text-xs max-w-2xl">
            <strong>Secure Fuel Supply Chain Bangladesh.</strong> A transparent national fuel visibility platform where citizens can instantly view real-time fuel availability and nearest station information, with restricted identity-based access for controlled services.
         </div>
         <div className="text-xs text-muted font-medium">
            Project initialized by Nuhad N Khan. © {new Date().getFullYear()}
         </div>
      </footer>
    </div>
  );
}
