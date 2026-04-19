import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { ShieldAlert, AlertTriangle, Database, Lock, Search, Filter } from 'lucide-react';

export default function AlertsPanel() {
  const { alerts, logs, pumps } = useSimulation();
  const [filter, setFilter] = useState('ALL'); // ALL, FRAUD, WARNING
  
  // Isolate Fraud/Rejected transactions for the audit trail
  const suspiciousLogs = logs.filter(log => log.status === 'BLACK_FLAGGED' || log.status === 'REJECTED');
  
  const filteredAlerts = alerts.filter(alert => {
      if (filter === 'ALL') return true;
      if (filter === 'FRAUD') return alert.title.includes('FRAUD') || alert.title.includes('SUSPECTED') || alert.title.includes('PROTOCOL');
      return alert.type === 'warning';
  });

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem', color: 'var(--danger)' }}>Fraud Monitoring & Alerts</h1>
           <p className="text-muted text-sm">Real-time audit loop for detecting and auto-freezing unauthorized distribution events.</p>
        </div>
        <div className="flex gap-2 bg-bg-secondary p-1 rounded-md border border-panel-border">
           <button className={`btn ${filter === 'ALL' ? 'btn-secondary' : ''}`} style={{ border: 'none', background: filter === 'ALL' ? 'var(--bg-tertiary)' : 'transparent' }} onClick={() => setFilter('ALL')}>All Notifications</button>
           <button className={`btn text-danger ${filter === 'FRAUD' ? 'btn-danger' : ''}`} style={{ border: 'none', background: filter === 'FRAUD' ? '#fee2e2' : 'transparent' }} onClick={() => setFilter('FRAUD')}>Security Threats</button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
         {/* Live Alerts Queue */}
         <div className="flex-col gap-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2">Active System Triggers</h3>
            <div className="flex-col gap-3">
               {filteredAlerts.length === 0 ? (
                  <div className="glass-panel text-center py-10">
                     <ShieldAlert size={32} color="var(--success)" style={{ margin: '0 auto 1rem' }} />
                     <p className="font-semibold text-text-primary">No Active Triggers</p>
                     <p className="text-sm text-muted">Network behaving correctly.</p>
                  </div>
               ) : filteredAlerts.map(alert => (
                  <div key={alert.id} className="glass-panel border-l-4" style={{ borderLeftColor: alert.title.includes('SECURITY') || alert.title.includes('BLACK') ? 'var(--danger)' : 'var(--warning)', padding: '1.25rem' }}>
                      <div className="flex justify-between items-start mb-2">
                          <strong className="text-sm" style={{ color: alert.title.includes('SUSPECTED') ? 'var(--danger)' : 'var(--text-primary)' }}>{alert.title}</strong>
                          <span className="text-xs text-muted font-medium font-mono">{new Date(alert.timestamp).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-sm text-text-secondary leading-relaxed">{alert.message}</p>
                      
                      {alert.title.includes('PROTOCOL TRIGGERED') && (
                          <div className="mt-4 p-2 bg-danger/10 text-danger rounded flex items-center gap-2 text-xs font-semibold" style={{ background: '#fee2e2' }}>
                              <Lock size={14} /> STATION OPERATIONS LOCKED BY SMART CONTROLLER
                          </div>
                      )}
                  </div>
               ))}
            </div>
         </div>

         {/* Immutable Audit Trail */}
         <div className="flex-col gap-4">
            <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Immutable Fraud Ledger <span className="badge badge-danger ml-2">Restricted</span></span>
                <span className="text-xs text-muted font-normal lowercase flex items-center gap-1"><Database size={12}/> {suspiciousLogs.length} flagged events</span>
            </h3>
            
            <div className="glass-panel" style={{ padding: 0, overflow: 'hidden' }}>
               <div className="table-container" style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  <table style={{ width: '100%' }}>
                     <thead style={{ position: 'sticky', top: 0, background: 'var(--bg-secondary)', zIndex: 10 }}>
                        <tr>
                           <th>Time (UTC)</th>
                           <th>Location</th>
                           <th>Anomaly Details</th>
                           <th>Auto Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {suspiciousLogs.map(log => {
                           const pump = pumps.find(p => p.id === log.pump_id);
                           const isBlack = log.status === 'BLACK_FLAGGED';
                           return (
                              <tr key={log.id} style={{ background: isBlack ? '#fef2f2' : 'transparent' }}>
                                 <td className="font-mono text-xs text-muted" style={{ verticalAlign: 'top', paddingTop: '1.25rem' }}>{new Date(log.timestamp).toISOString().split('T')[1].slice(0, 8)}</td>
                                 <td style={{ verticalAlign: 'top', paddingTop: '1.25rem' }}>
                                     <div className="font-semibold text-sm">{pump?.name || log.pump_id}</div>
                                     <div className="text-xs text-muted mt-1">{pump?.location}</div>
                                 </td>
                                 <td style={{ verticalAlign: 'top', paddingTop: '1.25rem', maxWidth: '200px' }}>
                                     <div className="text-sm mb-1">{log.outgoing ? `Dispense Attempt: ${log.outgoing}L` : `Hardware Drop: ${log.incoming}L`}</div>
                                     <div className="text-xs font-mono" style={{ color: 'var(--text-muted)' }}>Target: {log.user_id || 'UNKNOWN'}</div>
                                 </td>
                                 <td style={{ verticalAlign: 'top', paddingTop: '1.25rem' }}>
                                     <span className={`badge ${isBlack ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.65rem' }}>
                                        {isBlack ? 'AUTO-LOCKED' : 'REJECTED'}
                                     </span>
                                 </td>
                              </tr>
                           )
                        })}
                        {suspiciousLogs.length === 0 && (
                           <tr><td colSpan="4" className="text-center p-8 text-muted text-sm">Ledger clean. No fraudulent events detected.</td></tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
