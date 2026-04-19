import React, { useState } from 'react';
import { Sliders, ShieldAlert, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function DistributionControl() {
  const [globalQuota, setGlobalQuota] = useState(10);
  const [emergencyOverride, setEmergencyOverride] = useState(false);

  const handleSave = () => {
    toast.success(`Distribution policy updated. New Quota: ${globalQuota}L`);
  };

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full">
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>Distribution Control</h1>
           <p className="text-muted text-sm">Manage national quota limits and emergency routing policies.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mt-4">
         <div className="glass-panel" style={{ borderTop: '4px solid var(--accent-primary)' }}>
            <h3 className="flex items-center gap-2 mb-6 text-text-primary"><Sliders size={18} /> Global Citizen Quota</h3>
            
            <div className="flex-col gap-4">
               <div>
                  <label className="text-sm font-semibold text-text-primary mb-2 block">Weekly Limit Per NID (Liters)</label>
                  <input 
                     type="range" 
                     min="1" max="50" 
                     value={globalQuota} 
                     onChange={(e) => setGlobalQuota(e.target.value)}
                     className="w-full mb-2"
                     style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <div className="flex justify-between text-xs font-semibold text-muted">
                     <span>1L (Restricted)</span>
                     <span className="font-bold text-accent-primary" style={{ fontSize: '1.25rem' }}>{globalQuota} L</span>
                     <span>50L (Open)</span>
                  </div>
               </div>

               <p className="text-xs text-text-secondary mt-4 bg-bg-tertiary p-3 rounded-md border border-panel-border leading-relaxed">
                 Changes apply retroactively to the current week. Citizens who have already exceeded the newly lowered limit will be locked out from further dispenses until Sunday midnight.
               </p>

               <button className="btn btn-primary w-full mt-2" onClick={handleSave} style={{ padding: '0.8rem' }}>
                  <Save size={16} /> Deploy National Parameter
               </button>
            </div>
         </div>

         <div className="glass-panel" style={{ borderTop: emergencyOverride ? '4px solid var(--danger)' : '4px solid var(--panel-border)' }}>
            <h3 className="flex items-center gap-2 mb-6" style={{ color: emergencyOverride ? 'var(--danger)' : 'var(--text-primary)'}}>
                <ShieldAlert size={18} /> Emergency Protocol Override
            </h3>
            
            <div className="flex items-center justify-between p-4 rounded-md mb-6" style={{ background: emergencyOverride ? '#fee2e2' : 'var(--bg-tertiary)', transition: '0.3s' }}>
                <div>
                   <p className="font-semibold" style={{ color: emergencyOverride ? 'var(--danger)' : 'var(--text-primary)' }}>Enable Crisis Mode</p>
                   <p className="text-xs text-muted mt-1">Bypasses logic for Govt/Emergency vehicles only.</p>
                </div>
                {/* Custom Toggle Switch */}
                <div 
                   onClick={() => setEmergencyOverride(!emergencyOverride)}
                   style={{ width: '48px', height: '26px', background: emergencyOverride ? 'var(--danger)' : '#cbd5e1', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: '0.3s' }}
                >
                   <div style={{ position: 'absolute', top: '3px', left: emergencyOverride ? '25px' : '3px', width: '20px', height: '20px', background: 'white', borderRadius: '50%', transition: '0.3s', boxShadow: '0 2px 4px rgba(0,0,0,0.2)' }}></div>
                </div>
            </div>

            <div className="flex-col gap-3">
               <label className="text-sm font-semibold text-text-primary mb-1">Special Category Exceptions</label>
               <div className="flex items-center gap-3 p-3 border rounded-md border-panel-border bg-bg-primary">
                  <input type="checkbox" checked readOnly style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}/> 
                  <span className="text-sm font-medium">Ambulance / Medical</span>
               </div>
               <div className="flex items-center gap-3 p-3 border rounded-md border-panel-border bg-bg-primary">
                  <input type="checkbox" checked readOnly style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}/> 
                  <span className="text-sm font-medium">Law Enforcement (Police/RAB)</span>
               </div>
               <div className="flex items-center gap-3 p-3 border rounded-md border-panel-border bg-bg-primary">
                  <input type="checkbox" checked={emergencyOverride} readOnly style={{ accentColor: 'var(--accent-primary)', width: '16px', height: '16px' }}/> 
                  <span className="text-sm font-medium">Government Directorate</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
