import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { AlertTriangle, Droplet, Database, MapPin, Activity, CheckCircle, Clock } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function CentralAdmin() {
  const { pumps, alerts, liveMetrics, logs } = useSimulation();

  // Summary Metrics
  const totalCapacity = pumps.reduce((sum, p) => sum + (p.allocated_by_govt || 10000), 0);
  const totalAvailable = pumps.reduce((sum, p) => sum + p.total_fuel, 0);
  const totalDispensed = pumps.reduce((sum, p) => sum + p.total_dispensed, 0);
  const criticalStations = pumps.filter(p => p.total_fuel < 2000).length;

  const chartData = pumps.map(pump => ({
    name: pump.location,
    Available: pump.total_fuel,
    Dispensed: pump.total_dispensed,
  }));

  const lineData = [
    { time: '08:00', usage: 1200 },
    { time: '10:00', usage: 3500 },
    { time: '12:00', usage: 4100 },
    { time: '14:00', usage: 5200 },
    { time: '16:00', usage: Math.max(5200, liveMetrics.totalOutgoing) },
  ];

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>System Dashboard</h1>
           <p className="text-muted text-sm">Real-time holistic view of the national fuel supply chain.</p>
        </div>
      </div>

      {/* Top Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
           <div className="flex justify-between items-center mb-3">
               <span className="text-muted text-sm font-semibold uppercase tracking-wider">Total Available</span>
               <div style={{ background: '#e0e7ff', padding: '0.5rem', borderRadius: '8px' }}><Database size={18} color="var(--accent-primary)" /></div>
           </div>
           <strong style={{ fontSize: '1.75rem', lineHeight: '1' }}>{totalAvailable.toLocaleString()} L</strong>
           <p className="text-xs text-success mt-2 font-medium">~{((totalAvailable/totalCapacity)*100).toFixed(1)}% of national capacity</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
           <div className="flex justify-between items-center mb-3">
               <span className="text-muted text-sm font-semibold uppercase tracking-wider">Dispensed Today</span>
               <div style={{ background: '#e0e7ff', padding: '0.5rem', borderRadius: '8px' }}><Droplet size={18} color="var(--accent-secondary)" /></div>
           </div>
           <strong style={{ fontSize: '1.75rem', lineHeight: '1', color: 'var(--accent-primary)' }}>{totalDispensed.toLocaleString()} L</strong>
           <p className="text-xs text-muted mt-2 font-medium">Across {pumps.length} active monitoring nodes</p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
           <div className="flex justify-between items-center mb-3">
               <span className="text-muted text-sm font-semibold uppercase tracking-wider">Station Status</span>
               <div style={{ background: criticalStations > 0 ? '#fef3c7' : '#dcfce7', padding: '0.5rem', borderRadius: '8px' }}>
                   <MapPin size={18} color={criticalStations > 0 ? "var(--warning)" : "var(--success)"} />
               </div>
           </div>
           <strong style={{ fontSize: '1.75rem', lineHeight: '1', color: criticalStations > 0 ? 'var(--warning)' : 'var(--text-primary)' }}>
              {pumps.length - criticalStations} <span style={{ fontSize: '1rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ {pumps.length}</span>
           </strong>
           <p className="text-xs mt-2 font-medium" style={{ color: criticalStations > 0 ? 'var(--danger)' : 'var(--success)' }}>
               {criticalStations > 0 ? `${criticalStations} stations require refill` : 'All stations operational'}
           </p>
        </div>
        
        <div className="glass-panel" style={{ padding: '1.25rem 1.5rem', display: 'flex', flexDirection: 'column' }}>
           <div className="flex justify-between items-center mb-3">
               <span className="text-muted text-sm font-semibold uppercase tracking-wider">Active Alerts</span>
               <div style={{ background: alerts.length > 0 ? '#fee2e2' : '#f1f5f9', padding: '0.5rem', borderRadius: '8px' }}>
                   <AlertTriangle size={18} color={alerts.length > 0 ? "var(--danger)" : "var(--text-muted)"} />
               </div>
           </div>
           <strong style={{ fontSize: '1.75rem', lineHeight: '1', color: alerts.length > 0 ? 'var(--danger)' : 'var(--text-primary)' }}>
              {alerts.length}
           </strong>
           <p className="text-xs text-muted mt-2 font-medium">Awaiting manual resolution</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6 mt-2">
        {/* Left Column: Real-time List & Charts */}
        <div className="flex-col gap-6" style={{ gridColumn: 'span 2' }}>
           <div className="glass-panel">
               <div className="flex justify-between items-center mb-4">
                   <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Station Monitoring List</h3>
                   <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View Map</button>
               </div>
               <div className="table-container">
                 <table style={{ width: '100%' }}>
                   <thead>
                     <tr>
                       <th>Station Name</th>
                       <th>Region</th>
                       <th>Current Inventory</th>
                       <th>Status</th>
                     </tr>
                   </thead>
                   <tbody>
                     {pumps.slice(0, 5).map(p => {
                       const isCritical = p.total_fuel < 2000;
                       return (
                         <tr key={p.id}>
                           <td><div className="font-medium">{p.name}</div></td>
                           <td className="text-muted">{p.location}</td>
                           <td style={{ fontWeight: '600', color: isCritical ? 'var(--danger)' : 'inherit' }}>{p.total_fuel.toLocaleString()} L</td>
                           <td>
                             <span className={`badge ${isCritical ? 'badge-danger' : 'badge-success'}`}>
                                 {isCritical ? 'Critical' : 'Available'}
                             </span>
                           </td>
                         </tr>
                       );
                     })}
                   </tbody>
                 </table>
               </div>
           </div>
           
           {/* Charts */}
           <div className="grid grid-cols-2 gap-4">
             <div className="glass-panel" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
               <h3 className="mb-6 text-sm font-bold text-text-primary uppercase tracking-wider">Daily Usage Trend</h3>
               <div style={{ flex: 1, marginLeft: '-15px' }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <LineChart data={lineData} margin={{ top: 5, right: 10, bottom: 5, left: 10 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                     <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                     <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                     <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid var(--panel-border)', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }} />
                     <Line type="monotone" dataKey="usage" stroke="var(--accent-secondary)" strokeWidth={3} dot={{r: 4, strokeWidth: 2}} activeDot={{r: 6}} />
                   </LineChart>
                 </ResponsiveContainer>
               </div>
             </div>
             <div className="glass-panel" style={{ minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
               <h3 className="mb-6 text-sm font-bold text-text-primary uppercase tracking-wider">Region Distribution</h3>
               <div style={{ flex: 1, marginLeft: '-15px' }}>
                 <ResponsiveContainer width="100%" height="100%">
                   <BarChart data={chartData} margin={{ top: 5, right: 10, left: 10, bottom: 0 }}>
                     <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" vertical={false} />
                     <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                     <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(val) => `${val/1000}k`} />
                     <Tooltip cursor={{ fill: 'var(--bg-tertiary)' }} contentStyle={{ borderRadius: '8px', border: '1px solid var(--panel-border)' }} />
                     <Bar dataKey="Dispensed" fill="var(--accent-primary)" radius={[4, 4, 0, 0]} />
                   </BarChart>
                 </ResponsiveContainer>
               </div>
             </div>
           </div>
        </div>

        {/* Right Column: Alerts & Activity Feed */}
        <div className="flex-col gap-6">
           <div className="glass-panel flex-col" style={{ flex: 1, maxHeight: '380px' }}>
              <div className="flex justify-between items-center mb-4">
                 <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider">Security Alerts</h3>
                 {alerts.length > 0 && <span className="badge badge-danger">Live</span>}
              </div>
              <div className="flex-col gap-3" style={{ overflowY: 'auto', paddingRight: '0.25rem' }}>
                 {alerts.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-8 text-center bg-bg-tertiary rounded-md">
                        <CheckCircle size={32} color="var(--success)" className="mb-2" />
                        <p className="text-sm font-medium text-text-primary">All Systems Nominal</p>
                        <p className="text-xs text-muted mt-1">No anomalies detected by AI logic.</p>
                    </div>
                 ) : alerts.map(alert => (
                    <div key={alert.id} style={{ padding: '0.8rem 1rem', borderLeft: `3px solid ${alert.type === 'danger' ? 'var(--danger)' : 'var(--warning)'}`, background: 'var(--bg-primary)', borderRadius: '6px', border: '1px solid var(--panel-border)' }}>
                       <div className="flex justify-between items-start mb-1">
                          <strong style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{alert.title}</strong>
                       </div>
                       <p className="text-xs text-text-secondary mb-2 leading-relaxed">{alert.message}</p>
                       <div className="text-xs text-muted flex items-center gap-1 font-medium"><Clock size={12}/> {new Date(alert.timestamp).toLocaleTimeString()}</div>
                    </div>
                 ))}
               </div>
            </div>

           <div className="glass-panel flex-col" style={{ flex: 1, maxHeight: '420px' }}>
              <h3 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">Live Activity Log</h3>
              <div className="flex-col gap-0" style={{ overflowY: 'auto' }}>
                 {logs.slice(0, 10).map((log, i) => {
                    const pump = pumps.find(p => p.id === log.pump_id);
                    const isLast = i === Math.min(10, logs.length) - 1;
                    return (
                        <div key={log.id} className="flex gap-4" style={{ padding: '0.75rem 0', borderBottom: isLast ? 'none' : '1px solid var(--panel-border)' }}>
                           <div style={{ background: 'var(--bg-primary)', padding: '0.5rem', borderRadius: '50%', height: '32px', width: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--panel-border)' }}>
                              {log.type === 'dispense' ? <CheckCircle size={14} color="var(--success)"/> : <Database size={14} color="var(--accent-secondary)"/>}
                           </div>
                           <div style={{ flex: 1 }}>
                              <p style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '0.15rem' }}>
                                {log.type === 'dispense' ? `Authorized ${log.outgoing}L` : `Refilled ${log.incoming}L`}
                              </p>
                              <p className="text-xs text-text-secondary">
                                {log.type === 'dispense' ? `NID: ${log.user_id} @ ${pump?.location}` : `Station: ${pump?.name}`}
                              </p>
                           </div>
                           <div className="text-xs text-muted pt-1">Just now</div>
                        </div>
                    )
                 })}
                 {logs.length === 0 && <p className="text-sm text-muted text-center mt-4">No recent transactional events.</p>}
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
