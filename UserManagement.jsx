import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Search, UserPlus, Edit2, ShieldAlert, CheckCircle, Shield } from 'lucide-react';

export default function UserManagement() {
  const { users } = useSimulation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.nid.includes(searchTerm)
  );

  return (
    <div className="flex-col gap-6 animate-slide-up h-full w-full" style={{ paddingBottom: '3rem' }}>
      <div className="flex justify-between items-end mb-2">
        <div>
           <h1 style={{ fontSize: '1.75rem', marginBottom: '0.25rem' }}>User & Identity Management</h1>
           <p className="text-muted text-sm">Control NID allocations, role access, and historical usage tracking.</p>
        </div>
        <div className="flex gap-4">
           <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type="text" 
                placeholder="Search via NID or Name..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '8px', border: '1px solid var(--panel-border)', outline: 'none', width: '280px', fontSize: '0.9rem' }}
              />
           </div>
           <button className="btn btn-primary"><UserPlus size={16} /> Add User</button>
        </div>
      </div>

      <div className="glass-panel" style={{ flex: 1 }}>
         <div className="table-container">
            <table style={{ width: '100%' }}>
               <thead>
                  <tr>
                     <th>NID / Identity</th>
                     <th>Citizen Details</th>
                     <th>Role</th>
                     <th>Weekly Quota</th>
                     <th>Quota Usage</th>
                     <th>Status</th>
                     <th>Actions</th>
                  </tr>
               </thead>
               <tbody>
                  {filteredUsers.map(u => {
                     const isMaxed = u.used_quota >= u.quota;
                     const percentage = (u.used_quota / u.quota) * 100;
                     return (
                        <tr key={u.id}>
                           <td>
                              <div className="font-mono text-sm font-semibold" style={{ background: 'var(--bg-tertiary)', padding: '0.3rem 0.6rem', borderRadius: '4px', display: 'inline-block' }}>{u.nid}</div>
                           </td>
                           <td>
                              <div className="font-semibold text-text-primary">{u.name}</div>
                              <div className="text-xs text-muted mt-1">Ph: {u.phone || 'N/A'}</div>
                           </td>
                           <td>
                              <span className="badge badge-info flex items-center gap-1" style={{ width: 'fit-content' }}>
                                 <Shield size={10} /> Citizen
                              </span>
                           </td>
                           <td style={{ fontWeight: '600' }}>{u.quota} L</td>
                           <td>
                              <div className="flex-col gap-1">
                                 <div className="flex justify-between text-xs font-medium">
                                    <span className="text-text-primary">{u.used_quota}L Used</span>
                                    <span style={{ color: isMaxed ? 'var(--danger)' : 'var(--text-muted)' }}>{u.quota - u.used_quota}L Left</span>
                                 </div>
                                 <div style={{ width: '120px', height: '6px', background: 'var(--panel-border)', borderRadius: '3px', overflow: 'hidden' }}>
                                    <div style={{ width: `${Math.min(100, percentage)}%`, height: '100%', background: isMaxed ? 'var(--danger)' : 'var(--accent-primary)' }}></div>
                                 </div>
                              </div>
                           </td>
                           <td>
                              <span className={`badge ${isMaxed ? 'badge-warning' : 'badge-success'} flex items-center gap-1`} style={{ width: 'fit-content' }}>
                                 {isMaxed ? <ShieldAlert size={12}/> : <CheckCircle size={12}/>}
                                 {isMaxed ? 'Limit Reached' : 'Active'}
                              </span>
                           </td>
                           <td>
                              <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>
                                 <Edit2 size={14} /> Adjust Quota
                              </button>
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
