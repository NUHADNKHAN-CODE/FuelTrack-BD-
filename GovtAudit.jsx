import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { FileSearch, ShieldAlert, CheckCircle, Flame, AlertCircle, Database, BarChart3, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function GovtAudit() {
  const { pumps, logs, liveMetrics } = useSimulation();

  // 1. Audit Reconciliation Logic (Real-Time Ledger Analysis)
  const auditData = pumps.map(pump => {
    // Expected Stock = Initial/Allocated - Legally Dispensed (SUCCESS/EMERGENCY)
    // We compare this with actual pump.total_fuel (Physical Hardware Status)
    const expected_stock = pump.allocated_by_govt - pump.total_dispensed;
    const leakage = Math.max(0, expected_stock - pump.total_fuel);
    
    // Check if station is suspicious (Black Flagged logs or Locked status)
    const stationLogs = logs.filter(l => l.pump_id === pump.id);
    const hasBlackFlags = stationLogs.some(l => l.status === 'BLACK_FLAGGED');
    const isLocked = pump.status === 'LOCKED';

    return {
      name: pump.name.split(' ')[0], 
      fullName: pump.name,
      Allocation: pump.allocated_by_govt,
      Sold: pump.total_dispensed,
      Stock: pump.total_fuel,
      Missing: leakage,
      isSuspicious: hasBlackFlags || isLocked || leakage > 0,
      status: pump.status
    };
  });

  const totalMissing = auditData.reduce((acc, p) => acc + p.Missing, 0);
  const suspiciousStations = auditData.filter(p => p.isSuspicious);
  
  // 2. Fraud Event Aggregation
  const fraudLogs = logs.filter(l => l.status === 'BLACK_FLAGGED' || l.status === 'REJECTED');

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      
      {/* Header & National High-Level Stats */}
      <header className="flex justify-between items-end mb-2 border-b border-panel-border pb-6">
        <div>
          <h1 className="flex items-center gap-3" style={{ fontSize: '2.25rem', color: 'var(--accent-primary)' }}>
            <FileSearch size={32} /> National Audit & Enforcement
          </h1>
          <p className="text-muted text-lg mt-1">Immutable tracking of the national fuel supply chain reconciliation.</p>
        </div>
        <div className="flex gap-4">
          <div className="glass-panel text-center" style={{ minWidth: '180px', background: 'var(--bg-secondary)', borderBottom: '4px solid var(--accent-primary)' }}>
            <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Total Supply</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-primary)' }}>{liveMetrics.totalIncoming.toLocaleString()} L</p>
          </div>
          <div className="glass-panel text-center" style={{ minWidth: '180px', background: 'var(--bg-secondary)', borderBottom: '4px solid var(--success)' }}>
            <p className="text-xs text-muted uppercase font-bold tracking-widest mb-1">Legal Outflow</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--success)' }}>{liveMetrics.totalOutgoing.toLocaleString()} L</p>
          </div>
          {totalMissing > 0 && (
            <div className="glass-panel text-center" style={{ minWidth: '180px', background: '#fff1f2', borderBottom: '4px solid var(--danger)' }}>
              <p className="text-xs text-danger uppercase font-bold tracking-widest mb-1">Audit Leakage</p>
              <p className="text-2xl font-bold" style={{ color: 'var(--danger)' }}>{totalMissing.toLocaleString()} L</p>
            </div>
          )}
        </div>
      </header>

      {/* Main Analytics Section */}
      <div className="grid grid-cols-3 gap-6">
        
        {/* Visual Reconciler */}
        <div className="glass-panel col-span-2" style={{ display: 'flex', flexDirection: 'column', minHeight: '400px' }}>
          <div className="flex items-center justify-between mb-6">
             <h3 className="flex items-center gap-2"><BarChart3 size={20} className="text-accent-primary" /> Stock Reconciliation Visualizer</h3>
             <span className="text-xs text-muted font-mono">Calculated Logic: (Allocated - Dispensed) vs. Physical Sensor Data</span>
          </div>
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={auditData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--panel-border)" />
                <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} fontWeight={600} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: '1px solid var(--panel-border)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey="Sold" stackId="a" fill="var(--success)" name="Legally Dispensed" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Stock" stackId="a" fill="var(--accent-primary)" name="Current Verified Stock" radius={[0, 0, 0, 0]} />
                <Bar dataKey="Missing" stackId="a" fill="var(--danger)" name="Audit Failure / Black Market" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fraud Monitoring Sentinel */}
        <div className="glass-panel flex-col" style={{ background: '#f8fafc' }}>
            <h3 className="flex items-center gap-2 text-danger mb-4"><ShieldAlert size={20} /> Fraud Monitoring Sentinel</h3>
            
            <div className="flex-col gap-4 overflow-y-auto" style={{ maxHeight: '350px' }}>
                {fraudLogs.length === 0 ? (
                    <div className="text-center py-10 opacity-50">
                        <CheckCircle size={48} className="mx-auto mb-2 text-success" />
                        <p className="text-sm font-bold">No High-Risk Events</p>
                    </div>
                ) : fraudLogs.map(log => (
                    <div key={log.id} className="p-3 bg-white rounded-lg border border-danger/20 border-l-4 border-l-danger">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-danger">{log.status.replace('_', ' ')}</span>
                            <span className="text-[10px] text-muted font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <p className="text-xs font-bold text-text-primary mb-1">
                            {log.status === 'BLACK_FLAGGED' ? 'UNAUTHORIZED DISPENSE' : 'QUOTA EXCEEDED ATTEMPT'}
                        </p>
                        <p className="text-[10px] text-text-secondary">
                            Station: {auditData.find(p => p.fullName.includes(log.pump_id))?.name || log.pump_id} | Vol: {log.outgoing}L
                        </p>
                    </div>
                ))}
            </div>

            <div className="mt-auto pt-6 border-t border-panel-border">
                <div className="flex justify-between items-center text-xs mb-2">
                    <span className="text-muted">Suspicious Stations</span>
                    <span className="font-bold text-danger">{suspiciousStations.length}</span>
                </div>
                <div className="flex -space-x-2">
                    {suspiciousStations.map((s, i) => (
                        <div key={i} title={s.fullName} className="w-8 h-8 rounded-full bg-danger text-white flex items-center justify-center text-[10px] font-bold border-2 border-white">
                            {s.name[0]}
                        </div>
                    ))}
                </div>
            </div>
        </div>

      </div>

      {/* Regional Reconciliation Ledger */}
      <div className="glass-panel">
         <div className="flex items-center justify-between mb-6">
            <h3 className="flex items-center gap-2 font-bold"><Database size={20} className="text-accent-secondary" /> National Reconciliation Ledger (Audit Table)</h3>
            <button className="btn btn-secondary py-1 px-3 text-xs flex items-center gap-1">
                <TrendingUp size={14} /> Export Audit Report
            </button>
         </div>

         <div className="table-container">
            <table style={{ width: '100%' }}>
               <thead>
                  <tr>
                     <th>Station Name</th>
                     <th>BPC Allocation</th>
                     <th>Official Ledger Total</th>
                     <th>Physical Stock (Hardware)</th>
                     <th>Discrepancy</th>
                     <th>Operational Status</th>
                  </tr>
               </thead>
               <tbody>
                  {auditData.map((data, i) => (
                     <tr key={i} style={{ background: data.isSuspicious ? 'rgba(220, 38, 38, 0.02)' : 'transparent' }}>
                        <td>
                            <div className="font-bold text-text-primary">{data.fullName}</div>
                            <div className="text-[10px] text-muted uppercase tracking-tighter mt-0.5">District: Central</div>
                        </td>
                        <td className="font-mono">{data.Allocation.toLocaleString()} L</td>
                        <td className="font-mono text-success">{(data.Sold + (data.Allocation - data.Sold - data.Missing)).toLocaleString()} L</td>
                        <td className="font-mono font-bold">{data.Stock.toLocaleString()} L</td>
                        <td className="font-bold">
                           {data.Missing > 0 ? (
                               <span className="text-danger flex items-center gap-1">
                                   <Flame size={14} /> {data.Missing} L
                               </span>
                           ) : (
                               <span className="text-success flex items-center gap-1">
                                   <CheckCircle size={14} /> 0 L
                               </span>
                           )}
                        </td>
                        <td>
                           <span className={`badge ${
                               data.status === 'LOCKED' ? 'badge-danger' : 
                               data.status === 'Warning' ? 'badge-warning' : 'badge-success'
                           }`}>
                               {data.status}
                           </span>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
