import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Search, Filter, MoreVertical, Fuel, MapPin, CheckCircle, AlertTriangle } from 'lucide-react';

export default function FuelMonitoring() {
  const { pumps } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredPumps = pumps.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Fuel Monitoring</h1>
           <p className="text-muted text-sm">Real-time inventory mapping across all distribution nodes.</p>
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
           <button className="btn btn-secondary"><Filter size={16} /> Filters</button>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1 }}>
         <div className="table-container">
            <table style={{ width: '100%' }}>
               <thead>
                  <tr>
                     <th>Station ID & Name</th>
                     <th>Region</th>
                     <th>Current Stock (L)</th>
                     <th>Capacity Fill %</th>
                     <th>Status</th>
                     <th>Last Update</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredPumps.map((p, i) => {
                     const isCritical = p.total_fuel < 2000;
                     const fillPercentage = ((p.total_fuel / (p.allocated_by_govt || 10000)) * 100).toFixed(1);
                     return (
                        <tr key={p.id}>
                           <td>
                              <div className="flex items-center gap-3">
                                 <div style={{ background: 'var(--bg-tertiary)', padding: '0.5rem', borderRadius: '6px' }}>
                                    <Fuel size={16} color="var(--accent-primary)" />
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
                           <td style={{ fontWeight: '600', color: isCritical ? 'var(--danger)' : 'var(--text-primary)' }}>
                             {p.total_fuel.toLocaleString()} L
                           </td>
                           <td>
                              <div className="flex items-center gap-2">
                                 <div style={{ flex: 1, height: '6px', background: 'var(--panel-border)', borderRadius: '3px', overflow: 'hidden', minWidth: '60px' }}>
                                    <div style={{ width: `${Math.min(100, fillPercentage)}%`, height: '100%', background: isCritical ? 'var(--danger)' : 'var(--success)' }}></div>
                                 </div>
                                 <span className="text-xs font-medium text-muted">{fillPercentage}%</span>
                              </div>
                           </td>
                           <td>
                              <span className={`badge ${isCritical ? 'badge-danger' : 'badge-success'} flex items-center gap-1`} style={{ width: 'fit-content' }}>
                                 {isCritical ? <AlertTriangle size={12}/> : <CheckCircle size={12}/>}
                                 {isCritical ? 'Critical' : 'Online'}
                              </span>
                           </td>
                           <td className="text-muted text-sm">Just now</td>
                           <td>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem', border: 'none', background: 'transparent' }}>
                                 <MoreVertical size={16} />
                              </button>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
            {filteredPumps.length === 0 && (
               <div className="text-center p-8 text-muted mt-4 font-medium">No stations found matching your search.</div>
            )}
         </div>
      </div>
    </div>
  );
}
