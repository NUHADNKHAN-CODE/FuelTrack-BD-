import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Truck, CheckCircle, Navigation, ShieldCheck, FileKey, XCircle, Search, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LogisticsTerminal() {
  const { pumps, addIncomingFuel, addAlert } = useSimulation();
  const navigate = useNavigate();
  
  const [manifestCode, setManifestCode] = useState('');
  const [tankerId, setTankerId] = useState('');
  const [dropVolume, setDropVolume] = useState('');
  const [selectedPumpId, setSelectedPumpId] = useState(pumps[0]?.id);
  const [statusMsg, setStatusMsg] = useState(null);

  const activePump = pumps.find(p => p.id === selectedPumpId);

  const handleRestock = (e) => {
    e.preventDefault();

    // Simulating Manifest Validation Logic
    if (manifestCode.length < 5 || tankerId.length < 4) {
       setStatusMsg({ type: 'error', text: 'Invalid Manifest or Tanker Registration.' });
       addAlert('Logistics Verification Failed', `Unauthorized drop attempt at ${activePump.name}`, 'warning');
       return;
    }

    if (activePump.status === 'LOCKED') {
       setStatusMsg({ type: 'error', text: 'Drop rejected. Station hardware is secured by HQ.' });
       return;
    }

    const volume = Number(dropVolume);
    if(volume <= 0) return;

    // Execute the delivery
    addIncomingFuel(selectedPumpId, volume);
    setStatusMsg({ type: 'success', text: `Verified. ${volume}L securely transferred to Station Storage.` });
    
    setManifestCode('');
    setTankerId('');
    setDropVolume('');

    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
       
       <nav style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <h2 className="gradient-text flex items-center gap-2" style={{ margin: 0, fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Truck size={24} /> National Logistics & Transport Terminal
        </h2>
        <div className="flex items-center gap-4">
           <span className="badge badge-info flex items-center gap-1 bg-bg-primary text-text-primary border-panel-border"><ShieldCheck size={14} className="text-success" /> BPC Authorized Gateway</span>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '850px', padding: 0, background: 'var(--bg-secondary)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)', overflow: 'hidden' }}>
        
        <div style={{ padding: '2rem 2.5rem', borderBottom: '1px solid var(--panel-border)' }}>
            <h2 className="text-text-primary text-xl font-bold flex items-center gap-2 mb-1">
                <FileKey size={20} className="text-accent-secondary" /> Tanker Manifest Verification
            </h2>
            <p className="text-sm text-muted">Authenticate heavy transport deliveries before dropping fuel into local infrastructure nodes.</p>
        </div>

        <div className="grid grid-cols-5 bg-bg-primary" style={{ minHeight: '400px' }}>
          
          {/* Hardware Selection Side */}
          <div className="col-span-2 p-6 border-r border-panel-border bg-bg-secondary flex flex-col justify-between">
            <div>
                <h3 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">Target Drop Location</h3>
                
                <label className="text-sm font-semibold text-text-primary block mb-2">Destination Node</label>
                <select 
                    value={selectedPumpId}
                    onChange={(e) => setSelectedPumpId(e.target.value)}
                    className="w-full p-2 mb-6"
                    style={{ background: 'var(--bg-primary)', border: '1px solid var(--panel-border)', borderRadius: '6px', outline: 'none' }}
                >
                    {pumps.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                </select>

                {activePump && (
                    <div className="bg-bg-primary p-4 rounded-lg border border-panel-border">
                        <div className="flex items-center gap-2 text-sm text-text-secondary mb-3">
                            <Navigation size={14} /> {activePump.location}
                        </div>
                        <div className="mb-2">
                           <p className="text-xs text-muted mb-1">Current Stock Capacity</p>
                           <p className="font-bold text-lg" style={{ color: activePump.total_fuel < 2000 ? 'var(--warning)' : 'var(--success)' }}>
                              {activePump.total_fuel.toLocaleString()} L
                           </p>
                        </div>
                        <div>
                           <p className="text-xs text-muted mb-1">Node Status</p>
                           <span className={`badge ${activePump.status === 'LOCKED' ? 'badge-danger' : 'badge-success'}`}>{activePump.status}</span>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="mt-8 text-xs text-muted flex items-center gap-2">
                <Clock size={14} /> Local drops bypass normal daily limits but undergo strict depot auditing.
            </div>
          </div>

          {/* Verification Process Side */}
          <div className="col-span-3 p-8">
            <h3 className="text-sm text-text-primary uppercase tracking-wider mb-6 font-bold flex items-center gap-2">
               Deposit Authorization Parameters
            </h3>
            
            <form onSubmit={handleRestock} className="flex-col gap-5">
                <div>
                  <label className="text-sm font-semibold text-text-primary block mb-2">Digital Delivery Manifest Code</label>
                  <input 
                    type="text" 
                    value={manifestCode}
                    onChange={(e) => setManifestCode(e.target.value)}
                    placeholder="e.g. MNF-773-BD"
                    required
                    style={{ width: '100%', padding: '0.8rem', background: '#f8fafc', border: '1px solid var(--panel-border)', borderRadius: '6px', fontFamily: 'monospace', outline: 'none' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="text-sm font-semibold text-text-primary block mb-2">Tanker License Plate</label>
                      <input 
                        type="text" 
                        value={tankerId}
                        onChange={(e) => setTankerId(e.target.value)}
                        placeholder="DHK-METRO-TA-11"
                        required
                        style={{ width: '100%', padding: '0.8rem', background: '#f8fafc', border: '1px solid var(--panel-border)', borderRadius: '6px', outline: 'none' }}
                      />
                   </div>
                   <div>
                      <label className="text-sm font-semibold text-text-primary block mb-2">Transfer Volume (L)</label>
                      <input 
                        type="number" min="1000" max="20000"
                        value={dropVolume}
                        onChange={(e) => setDropVolume(e.target.value)}
                        placeholder="Min 1000L"
                        required
                        style={{ width: '100%', padding: '0.8rem', background: '#f8fafc', border: '1px solid var(--panel-border)', borderRadius: '6px', outline: 'none' }}
                      />
                   </div>
                </div>

              <button 
                type="submit" 
                className="btn w-full mt-4 btn-primary" 
                style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 600 }}
                disabled={activePump?.status === 'LOCKED'}
              >
                VERIFY INCIDENT & INITIATE TRANSFER
              </button>
            </form>

            {statusMsg && (
              <div className="animate-slide-up flex items-center gap-3 p-3 mt-4 rounded-md border" style={{
                background: statusMsg.type === 'success' ? '#dcfce7' : '#fee2e2',
                borderColor: statusMsg.type === 'success' ? '#bbf7d0' : '#fecaca',
              }}>
                {statusMsg.type === 'success' ? <CheckCircle size={20} className="text-success shrink-0" /> : <XCircle size={20} className="text-danger shrink-0" />}
                <span className="text-sm font-medium" style={{ color: statusMsg.type === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                  {statusMsg.text}
                </span>
              </div>
            )}
          </div>

        </div>

        </div>
      </main>
    </div>
  );
}
