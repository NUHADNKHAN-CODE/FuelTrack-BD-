import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BrainCircuit, ShieldAlert, TrendingDown, Zap, Activity, AlertTriangle, ShieldCheck, Map } from 'lucide-react';
import { ComposedChart, Line, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis } from 'recharts';

export default function AISentinel() {
  const { pumps, logs, alerts } = useSimulation();

  // 1. Prediction Data: Mocking a 24h demand forecast based on current stock levels
  const predictionData = pumps.map(p => ({
    name: p.name.split(' ')[0],
    Stock: p.total_fuel,
    PredictedDemand: p.ai_demand_prediction === 'Critical' ? 4500 : p.ai_demand_prediction === 'High' ? 3000 : 1500,
    Risk: p.ai_risk_score
  }));

  // 2. Anomaly Heatmap Data (Risk vs Stock)
  const heatmapData = pumps.map(p => ({
    x: p.total_fuel, // Stock
    y: p.ai_risk_score, // Risk
    z: 100, // Size
    name: p.name
  }));

  const criticalShortages = pumps.filter(p => p.ai_demand_prediction === 'Critical');
  const highRiskNodes = pumps.filter(p => p.ai_risk_score > 30);

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      
      {/* AI Intelligence Header */}
      <header className="flex justify-between items-center mb-2">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-accent-primary rounded-xl text-white shadow-lg">
              <BrainCircuit size={32} />
           </div>
           <div>
              <h1 style={{ fontSize: '1.75rem', marginBottom: '0rem' }}>Anti-Gravity AI: Sentinel Layer</h1>
              <p className="text-muted text-sm">Self-stabilizing decision engine & predictive distribution analytics.</p>
           </div>
        </div>
        <div className="flex gap-3">
           <div className="badge badge-info py-2 px-4 gap-2 border border-accent-primary/20">
              <Zap size={14} className="text-accent-primary" /> System: Stable
           </div>
           <div className="badge badge-success py-2 px-4 gap-2 border border-success/20">
              <ShieldCheck size={14} /> Security: Active
           </div>
        </div>
      </header>

      {/* Top Prediction Metrics */}
      <div className="grid grid-cols-3 gap-6">
         <div className="glass-panel border-l-4 border-l-danger">
            <h4 className="text-xs text-muted uppercase font-bold mb-4 flex items-center gap-2">
                <TrendingDown size={14} className="text-danger" /> 24h Shortage Prediction
            </h4>
            <div className="flex items-end justify-between">
                <div>
                   <p className="text-2xl font-bold">{criticalShortages.length}</p>
                   <p className="text-xs text-muted">Nodes at high risk</p>
                </div>
                <div className="text-right">
                   {criticalShortages.map(p => (
                       <p key={p.id} className="text-[10px] font-bold text-danger">{p.name}</p>
                   ))}
                </div>
            </div>
         </div>

         <div className="glass-panel border-l-4 border-l-warning">
            <h4 className="text-xs text-muted uppercase font-bold mb-4 flex items-center gap-2">
                <ShieldAlert size={14} className="text-warning" /> Fraud Risk Score (Avg)
            </h4>
            <div className="flex items-end justify-between">
                <div>
                   <p className="text-2xl font-bold">{(pumps.reduce((a,b)=>a+(b.ai_risk_score||0),0)/pumps.length).toFixed(1)}%</p>
                   <p className="text-xs text-muted">Network-wide risk</p>
                </div>
                <Activity size={32} className="text-warning opacity-50" />
            </div>
         </div>

         <div className="glass-panel border-l-4 border-l-accent-primary">
            <h4 className="text-xs text-muted uppercase font-bold mb-4 flex items-center gap-2">
                <Zap size={14} className="text-accent-primary" /> Stabilizer Corrections
            </h4>
            <div className="flex items-end justify-between">
                <div>
                   <p className="text-2xl font-bold">{logs.filter(l => l.status === 'REJECTED').length}</p>
                   <p className="text-xs text-muted">Auto-blocked attempts</p>
                </div>
                <BrainCircuit size={32} className="text-accent-primary opacity-50" />
            </div>
         </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
          {/* Prediction Graph */}
          <div className="glass-panel">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                  <Activity size={18} className="text-accent-primary" /> Supply vs. Predicted Demand (24h)
              </h3>
              <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                      <ComposedChart data={predictionData}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--panel-border)" />
                          <XAxis dataKey="name" stroke="var(--text-muted)" fontSize={10} />
                          <YAxis stroke="var(--text-muted)" fontSize={10} />
                          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                          <Legend />
                          <Area type="monotone" dataKey="Stock" fill="var(--bg-tertiary)" stroke="var(--accent-primary)" name="Current Inventory" />
                          <Bar dataKey="PredictedDemand" barSize={20} fill="var(--danger)" opacity={0.6} name="AI Predicted Demand" />
                          <Line type="monotone" dataKey="Risk" stroke="var(--warning)" strokeWidth={2} name="Risk Factor (%)" />
                      </ComposedChart>
                  </ResponsiveContainer>
              </div>
          </div>

          {/* Anomaly Heatmap */}
          <div className="glass-panel">
              <h3 className="text-sm font-bold mb-6 flex items-center gap-2">
                  <Map size={18} className="text-accent-primary" /> AI Risk Heatmap (Stock vs. Anomaly Risk)
              </h3>
              <div style={{ height: '300px' }}>
                  <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="var(--panel-border)" />
                          <XAxis type="number" dataKey="x" name="Inventory" unit="L" stroke="var(--text-muted)" fontSize={10} />
                          <YAxis type="number" dataKey="y" name="Risk Score" unit="%" stroke="var(--text-muted)" fontSize={10} />
                          <ZAxis type="number" dataKey="z" range={[60, 400]} />
                          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                          <Legend />
                          <Scatter name="Fuel Stations" data={heatmapData} fill="var(--accent-primary)" radius={[4, 4, 4, 4]}>
                              {heatmapData.map((entry, index) => (
                                  <circle 
                                    key={`cell-${index}`} 
                                    cx={0} cy={0} r={0} // recharts handles this
                                    fill={entry.y > 40 ? 'var(--danger)' : entry.y > 15 ? 'var(--warning)' : 'var(--success)'} 
                                  />
                              ))}
                          </Scatter>
                      </ScatterChart>
                  </ResponsiveContainer>
              </div>
              <p className="text-[10px] text-muted text-center mt-2 italic">Stations in the top-left (Low Stock + High Risk) are prioritized for HQ audit intervention.</p>
          </div>
      </div>

      {/* Real-time AI Decisions */}
      <div className="glass-panel">
         <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
             <ShieldAlert size={18} className="text-danger" /> Live AI Security Decisions
         </h3>
         <div className="flex-col gap-2">
            {logs.filter(l => l.status === 'BLACK_FLAGGED' || l.status === 'REJECTED').slice(0, 5).map(log => (
                <div key={log.id} className="p-3 bg-bg-primary rounded-lg border border-panel-border flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-danger/10 rounded-full">
                           <AlertTriangle size={14} className="text-danger" />
                        </div>
                        <div>
                           <p className="text-xs font-bold text-text-primary">Decision: Automated Block</p>
                           <p className="text-[10px] text-muted">ID: {log.id} | Reason: {log.status === 'BLACK_FLAGGED' ? 'Hardware Bypass Detected' : 'Quota Policy Enforcement'}</p>
                        </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted">{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
            ))}
            {logs.filter(l => l.status === 'BLACK_FLAGGED' || l.status === 'REJECTED').length === 0 && (
                <p className="text-sm text-muted text-center py-4">Sentinel is scanning... No immediate threats detected.</p>
            )}
         </div>
      </div>

    </div>
  );
}
