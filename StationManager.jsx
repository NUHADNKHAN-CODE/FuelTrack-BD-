import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Search, MapPin, CheckCircle, AlertTriangle, Lock, Unlock, Settings2, ShieldX } from 'lucide-react';

export default function StationManager() {
  const { pumps, lockStation, unlockStation } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPumps = pumps.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: pumps.length,
    active: pumps.filter(p => p.status === 'Active').length,
    warning: pumps.filter(p => p.status === 'Warning').length,
    locked: pumps.filter(p => p.status === 'LOCKED').length,
  };

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Station Management</h1>
           <p className="text-muted text-sm">Control and monitor physical fuel hardware nodes across the network.</p>
        </div>
        <div className="flex gap-4">
           <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search stations..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid var(--panel-border)', outline: 'none', width: '250px', fontSize: '0.9rem' }}
              />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
          <div className="glass-panel text-center">
              <p className="text-xs text-muted font-bold uppercase mb-1">Total Nodes</p>
              <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="glass-panel text-center" style={{ borderBottom: '4px solid var(--success)' }}>
              <p className="text-xs text-muted font-bold uppercase mb-1">Operational</p>
              <p className="text-2xl font-bold text-success">{stats.active}</p>
          </div>
          <div className="glass-panel text-center" style={{ borderBottom: '4px solid var(--warning)' }}>
              <p className="text-xs text-muted font-bold uppercase mb-1">Warning</p>
              <p className="text-2xl font-bold text-warning">{stats.warning}</p>
          </div>
          <div className="glass-panel text-center" style={{ borderBottom: '4px solid var(--danger)' }}>
              <p className="text-xs text-muted font-bold uppercase mb-1">Secure Locked</p>
              <p className="text-2xl font-bold text-danger">{stats.locked}</p>
          </div>
      </div>

      <div className="glass-panel" style={{ flex: 1 }}>
         <div className="table-container">
            <table style={{ width: '100%' }}>
               <thead>
                  <tr>
                     <th>Station ID & Name</th>
                     <th>Region</th>
                     <th>Fuel Status</th>
                     <th>Safety Status</th>
                     <th>Remote Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredPumps.map((p) => {
                     const isLocked = p.status === 'LOCKED';
                     const isWarning = p.status === 'Warning';
                     
                     return (
                        <tr key={p.id}>
                           <td>
                              <div className="flex items-center gap-3">
                                 <div style={{ background: isLocked ? '#fee2e2' : 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '6px' }}>
                                    {isLocked ? <ShieldX size={16} className="text-danger" /> : <Settings2 size={16} className="text-accent-primary" />}
                                 </div>
                                 <div>
                                    <div className="font-semibold text-text-primary">{p.name}</div>
                                    <div className="text-xs text-muted mt-1">ID: {p.id.toUpperCase()}</div>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <div className="flex items-center gap-1 text-muted">
                                 <MapPin size={14} /> {p.location}
                              </div>
                           </td>
                           <td>
                              <div className="flex-col">
                                 <span className="text-sm font-bold">{p.total_fuel.toLocaleString()} L</span>
                                 <div style={{ width: '100px', height: '4px', background: 'var(--panel-border)', borderRadius: '2px', overflow: 'hidden', marginTop: '4px' }}>
                                    <div style={{ width: `${(p.total_fuel / (p.allocated_by_govt || 10000)) * 100}%`, height: '100%', background: isLocked ? 'var(--danger)' : isWarning ? 'var(--warning)' : 'var(--success)' }}></div>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <span className={`badge ${
                                 isLocked ? 'badge-danger' : 
                                 isWarning ? 'badge-warning' : 'badge-success'
                              } flex items-center gap-1`} style={{ width: 'fit-content' }}>
                                 {isLocked ? <Lock size={12}/> : isWarning ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                                 {p.status}
                              </span>
                           </td>
                           <td>
                              <div className="flex gap-2">
                                 {isLocked ? (
                                    <button 
                                      className="btn btn-secondary py-1 px-3 text-xs flex items-center gap-1"
                                      onClick={() => unlockStation(p.id)}
                                    >
                                      <Unlock size={14} /> Unlock Node
                                    </button>
                                 ) : (
                                    <button 
                                      className="btn btn-danger py-1 px-3 text-xs flex items-center gap-1"
                                      onClick={() => lockStation(p.id, 'Manual administrative lock.')}
                                    >
                                      <Lock size={14} /> Force Lock
                                    </button>
                                 )}
                              </div>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
