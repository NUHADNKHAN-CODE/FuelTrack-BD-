import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSimulation } from '../context/SimulationContext';
import { QrCode, UserCircle, Car, AlertCircle, History, Clock, Activity, LogOut, ShieldCheck, MapPin, Fuel, FileText, Database, BrainCircuit, Zap } from 'lucide-react';

export default function CitizenPortal() {
  const { users, logs, pumps } = useSimulation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Hardcoding mock logged in user for demo purposes as auth state isn't globally persisting yet
  const loggedInUser = users.find(u => u.nid === '1234567890') || users[0];
  const userLogs = logs.filter(log => log.user_id === loggedInUser.nid || log.user_id === loggedInUser.id);

  if (!loggedInUser) return <div>Auth Error.</div>;

  const remainingQuota = loggedInUser.quota - loggedInUser.used_quota;
  const quotaPercentage = (loggedInUser.used_quota / loggedInUser.quota) * 100;
  const isMaxed = remainingQuota <= 0;

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: '#f0fdf4' /* Soft Green Citizen Base */ }}>
      
      {/* Citizen App Topbar */}
      <nav style={{ padding: '1rem 3rem', display: 'flex', justifySelf: 'stretch', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bbf7d0', background: '#ffffff', position: 'sticky', top: 0, zIndex: 50, boxShadow: '0 4px 10px rgba(0,0,0,0.02)' }}>
        <h2 className="text-success flex items-center gap-2" style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700, cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Car size={24} /> Citizen Tax Token Sector
        </h2>
        
        {/* Navigation Wrapper */}
        <div className="flex bg-bg-primary rounded-full p-1 border border-panel-border">
           <button className={`btn ${activeTab === 'overview' ? 'btn-primary bg-success border-success' : 'btn-secondary border-none bg-transparent text-muted'}`} style={{ borderRadius: '99px', padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('overview')}>My Fuel Quota</button>
           <button className={`btn ${activeTab === 'map' ? 'btn-primary bg-success border-success' : 'btn-secondary border-none bg-transparent text-muted'}`} style={{ borderRadius: '99px', padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('map')}>Station Map</button>
           <button className={`btn ${activeTab === 'history' ? 'btn-primary bg-success border-success' : 'btn-secondary border-none bg-transparent text-muted'}`} style={{ borderRadius: '99px', padding: '0.5rem 1.5rem', fontSize: '0.85rem' }} onClick={() => setActiveTab('history')}>Transaction Ledger</button>
        </div>

        <div className="flex gap-4">
          <button className="flex items-center gap-2 hover:text-danger transition" style={{ border: 'none', background: 'transparent', cursor: 'pointer', fontWeight: 600, color: 'var(--text-secondary)' }} onClick={() => navigate('/')}>
             Sign Out <LogOut size={16} />
          </button>
        </div>
      </nav>

      {/* Main Profile Sector */}
      <main style={{ flex: 1, padding: '2rem 3rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
          
          <div className="flex justify-between items-center mb-6 bg-white p-6 rounded-2xl shadow-sm border border-success/20">
            <div>
               <p className="text-muted font-bold tracking-widest text-xs uppercase mb-1 flex items-center gap-1"><ShieldCheck size={14} className="text-success"/> Government Verified Profile</p>
               <h1 style={{ fontSize: '2rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{loggedInUser.name}</h1>
               <p className="text-text-secondary text-sm">Tax Token Tracking ID: <span className="font-mono font-bold bg-bg-tertiary p-1 rounded">{loggedInUser.nid}</span></p>
            </div>
            {isMaxed ? (
                <div className="text-center px-6 py-3 bg-danger/10 border border-fecaca rounded-xl text-danger">
                    <AlertCircle size={28} className="mx-auto mb-1" />
                    <p className="text-xs font-bold uppercase tracking-wider">Quota Suspended</p>
                </div>
            ) : (
                <div className="text-center px-6 py-3 bg-dcfce7 border-bbf7d0 border rounded-xl text-success">
                    <CheckCircle size={28} className="mx-auto mb-1" />
                    <p className="text-xs font-bold uppercase tracking-wider">Active & Cleared</p>
                </div>
            )}
          </div>

          {activeTab === 'overview' && (
              <div className="grid grid-cols-3 gap-6 mt-2">
                {/* Visual Quota Master Panel */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-panel-border" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column' }}>
                  <div className="flex justify-between items-start mb-8">
                     <h3 className="flex items-center gap-2 text-text-primary text-lg font-bold"><Database size={20} className="text-accent-primary" /> Lifetime Quota Allocation Engine</h3>
                     {/* AI Sentinel Alert */}
                     {pumps.some(p => p.ai_demand_prediction === 'Critical') && (
                        <div className="badge badge-danger py-2 px-3 gap-2 flex items-center animate-pulse">
                            <BrainCircuit size={14} /> AI Alert: Shortage Predicted
                        </div>
                     )}
                  </div>
                  
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Weekly Authorization</span>
                    <span className="text-sm font-medium">
                      <strong style={{ fontSize: '2.5rem', color: isMaxed ? 'var(--danger)' : 'var(--success)', marginRight: '0.25rem' }}>{remainingQuota} L</strong> 
                      <span className="text-muted font-bold text-lg">/ {loggedInUser.quota} L Left</span>
                    </span>
                  </div>

                  <div style={{ width: '100%', height: '24px', background: 'var(--bg-tertiary)', borderRadius: '12px', overflow: 'hidden', border: '1px inset var(--panel-border)', marginBottom: '1.5rem', position: 'relative' }}>
                    <div style={{ 
                        height: '100%', 
                        width: `${Math.min(quotaPercentage, 100)}%`,
                        background: isMaxed ? 'var(--danger)' : remainingQuota <= 2 ? 'var(--warning)' : '#22c55e',
                        transition: 'width 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
                      }} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color: quotaPercentage > 50 ? 'white' : 'var(--text-muted)', zIndex: 10 }}>
                        {quotaPercentage.toFixed(1)}% Consumed
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                      <div className="bg-f8fafc p-4 rounded-xl border border-panel-border">
                          <p className="text-xs text-muted mb-1 font-bold uppercase">You Generated</p>
                          <strong className="text-xl text-text-primary">{loggedInUser.used_quota} L</strong>
                          <p className="text-xs text-muted mt-1">in {userLogs.length} verified transactions.</p>
                      </div>
                      <div className="bg-f8fafc p-4 rounded-xl border border-panel-border">
                          <p className="text-xs text-muted mb-1 font-bold uppercase">Government Provided</p>
                          <strong className="text-xl text-accent-primary">{loggedInUser.quota} L</strong>
                          <p className="text-xs text-muted mt-1">Maximum national vehicle threshold.</p>
                      </div>
                  </div>
                </div>

                {/* QR Generation Sub-Panel */}
                <div className="bg-white rounded-2xl p-8 shadow-sm border border-panel-border flex-col items-center justify-center text-center">
                  <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-6">Authorize Dispenser Token</h3>
                  <div className="p-4 bg-white rounded-xl shadow-md border-2 border-panel-border mb-4 inline-block relative">
                     <QrCode size={160} color={isMaxed ? "#cbd5e1" : "#16a34a"} style={{ filter: isMaxed ? 'blur(3px)' : 'none' }} />
                     {isMaxed && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'var(--danger)', color: 'white', padding: '0.4rem 1rem', borderRadius: '6px', fontSize: '1rem', fontWeight: 'bold', boxShadow: '0 4px 10px rgba(220,38,38,0.3)' }}>RESTRICTED</div>}
                  </div>
                  {isMaxed ? (
                     <p className="text-sm text-danger font-medium mt-2 leading-relaxed">Tax block. Your QR identity scanner has been structurally disabled until weekly cycle reset.</p>
                  ) : (
                     <>
                        <p className="font-bold text-text-primary text-lg">Present to station scanner</p>
                        <p className="text-xs text-muted mt-2 font-medium">This code securely authorizes physical fluid transfer matching your Tax Token NID.</p>
                     </>
                  )}
                </div>

                {/* AI Suggested Station */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-accent-primary/20 col-span-3 flex items-center justify-between" style={{ background: 'linear-gradient(90deg, #ffffff, #eff6ff)' }}>
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-accent-primary rounded-xl text-white">
                           <BrainCircuit size={24} />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-accent-primary uppercase tracking-widest mb-1">AI Sentinel Suggestion</p>
                           <h4 className="text-lg font-bold text-text-primary">
                              Recommended Station: {pumps.sort((a,b) => b.total_fuel - a.total_fuel)[0]?.name}
                           </h4>
                           <p className="text-sm text-muted">AI Analysis: Highest availability and lowest risk factor detected for your region.</p>
                        </div>
                    </div>
                    <button className="btn btn-primary flex items-center gap-2" onClick={() => setActiveTab('map')}>
                        Navigate Now <Zap size={14} />
                    </button>
                </div>
              </div>
          )}

          {activeTab === 'history' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-panel-border mt-2">
                 <div className="flex items-center justify-between mb-8 pb-4 border-b border-panel-border">
                    <div>
                       <h3 className="flex items-center gap-2 text-text-primary text-lg font-bold"><History size={20} className="text-accent-secondary" /> Immutable Personal Transaction Ledger</h3>
                       <p className="text-sm text-muted mt-1">Tracking exactly how much you obtained and exactly where you obtained it.</p>
                    </div>
                 </div>
                 
                 <div className="table-container">
                    <table style={{ width: '100%' }}>
                       <thead>
                          <tr>
                             <th>Official Date & Time</th>
                             <th>Hardware Location</th>
                             <th>Volume Processed</th>
                             <th>Government Status</th>
                          </tr>
                       </thead>
                       <tbody>
                          {userLogs.map((log) => {
                             const pump = pumps.find(p => p.id === log.pump_id);
                             return (
                                <tr key={log.id} className="hover:bg-f8fafc transition">
                                   <td>
                                      <div className="flex items-center gap-2 text-sm font-medium">
                                         <Clock size={16} className="text-muted" /> {new Date(log.timestamp).toLocaleString()}
                                      </div>
                                   </td>
                                   <td>
                                        <div className="font-bold text-text-primary">{pump?.name || log.pump_id}</div>
                                        <div className="text-xs text-muted flex items-center gap-1 mt-1"><MapPin size={10}/> {pump?.location}</div>
                                   </td>
                                   <td className="font-bold text-lg text-accent-primary">+{log.outgoing} L</td>
                                   <td><span className="badge badge-success bg-dcfce7 border-bbf7d0 text-success" style={{ padding: '0.4rem 0.8rem' }}><ShieldCheck size={12} className="mr-1"/> Tracked</span></td>
                                </tr>
                             )
                          })}
                       </tbody>
                    </table>
                    {userLogs.length === 0 && (
                        <div className="text-center p-12 bg-f8fafc rounded-xl mt-4 border border-dashed border-panel-border">
                            <FileText size={32} className="mx-auto mb-3 text-muted" />
                            <p className="text-muted font-semibold text-lg">No dispenses recorded.</p>
                            <p className="text-sm text-muted mt-1">Your national quota has not been utilized.</p>
                        </div>
                    )}
                 </div>
              </div>
          )}

          {activeTab === 'map' && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-panel-border mt-2 flex flex-col items-center justify-center text-center" style={{ minHeight: '400px' }}>
                  <MapPin size={48} className="text-panel-border mb-4" />
                  <h3 className="text-xl font-bold text-text-primary mb-2">Citizen Station Tracker</h3>
                  <p className="text-muted max-w-sm mb-6">View live distances, current local availability, and directions to your nearest BPC distributed station.</p>
                  
                  <div className="grid grid-cols-2 gap-4 w-full max-w-3xl text-left">
                     {pumps.slice(0, 4).map(p => {
                         const isCritical = p.total_fuel < 2000;
                         return (
                            <div key={p.id} className="p-4 border border-panel-border rounded-xl bg-bg-primary flex justify-between items-center">
                                <div>
                                    <strong className="block text-sm mb-1">{p.name}</strong>
                                    <span className="text-xs text-muted flex items-center gap-1"><MapPin size={10}/> {p.location}</span>
                                </div>
                                <div className="text-right">
                                    <strong className={`block text-lg ${isCritical ? 'text-danger' : 'text-success'}`}>{p.total_fuel} L</strong>
                                    <span style={{ fontSize: '0.65rem' }} className="text-muted uppercase font-bold tracking-wider">{isCritical ? 'Low Restock' : 'Available'}</span>
                                </div>
                            </div>
                         )
                     })}
                  </div>
              </div>
          )}

        </div>
      </main>

      {/* Footer Minimal */}
      <footer style={{ padding: '2rem 3rem', background: '#ffffff', borderTop: '1px solid #bbf7d0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <div className="text-muted text-xs flex items-center gap-2">
            <ShieldCheck size={14} className="text-success" /> <strong>Secure Identity Link Verified.</strong> Private Citizen Portal generated through Bangladesh Telecommunication rules.
         </div>
         <div className="text-xs text-muted font-bold text-success/70">
            SFSB Citizen Profile v2
         </div>
      </footer>
    </div>
  );
}

const CheckCircle = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
);
