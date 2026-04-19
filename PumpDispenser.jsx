import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Fuel, Scan, CheckCircle, XCircle, ShieldAlert, Lock, AlertTriangle, QrCode } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PumpDispenser() {
  const { pumps, dispenseFuel, emergencyDispense } = useSimulation();
  const navigate = useNavigate();
  
  // Keep the active pump logic simple for demo purposes
  const [selectedPumpId, setSelectedPumpId] = useState('p1');
  const [scanInput, setScanInput] = useState('');
  const [amountInput, setAmountInput] = useState(5);
  const [statusMsg, setStatusMsg] = useState(null);
  
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [emergencyCode, setEmergencyCode] = useState('');

  const activePump = pumps.find(p => p.id === selectedPumpId);

  const handleScan = (e, forceFraud = false) => {
    e.preventDefault();
    
    let result;
    if (emergencyMode) {
      if (!emergencyCode) {
        setStatusMsg({ type: 'error', text: 'Emergency Authority Code is required!' });
        return;
      }
      result = emergencyDispense(selectedPumpId, Number(amountInput), emergencyCode);
    } else {
      // The `forceFraud` bool lets us test the Anti-Black Market logic directly from the terminal
      result = dispenseFuel(scanInput || 'UNKNOWN_OR_MISSING', selectedPumpId, Number(amountInput), !forceFraud, false);
    }
    
    setStatusMsg({
      type: result.success ? 'success' : 'error',
      text: result.message
    });

    if (result.success) {
      setScanInput(''); 
      setEmergencyCode('');
    }

    setTimeout(() => {
      setStatusMsg(null);
    }, 4000);
  };

  if (!activePump) return <div>Pump not found.</div>;
  const isLocked = activePump.status === 'LOCKED';
  const fillPercentage = activePump.allocated_by_govt ? (activePump.total_fuel / activePump.allocated_by_govt) * 100 : 0;

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
       
       <nav style={{ padding: '1rem 3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--panel-border)', background: 'var(--bg-secondary)', position: 'sticky', top: 0, zIndex: 50 }}>
        <h2 className="gradient-text flex items-center gap-2" style={{ margin: 0, fontSize: '1.25rem', cursor: 'pointer' }} onClick={() => navigate('/')}>
          <Fuel size={24} /> Node Dispenser Terminal
        </h2>
        <div className="flex items-center gap-4">
           {isLocked && <span className="badge badge-danger flex items-center gap-1"><Lock size={12}/> HARDWARE SECURE-LOCKED</span>}
           <select 
              value={selectedPumpId}
              onChange={(e) => setSelectedPumpId(e.target.value)}
              style={{
                padding: '0.4rem 1rem',
                borderRadius: '6px',
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
                border: '1px solid var(--panel-border)',
                outline: 'none',
                fontFamily: 'Inter',
                fontSize: '0.85rem',
                fontWeight: 600
              }}
            >
              {pumps.map(p => (
                <option key={p.id} value={p.id}>{p.name} ({p.id.toUpperCase()})</option>
              ))}
            </select>
        </div>
      </nav>

      <main style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
        <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '800px', padding: '2rem 2.5rem', background: 'var(--bg-secondary)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
        
        <div className="flex items-center justify-between mb-6 p-4 rounded-md border" style={{ background: emergencyMode ? '#fee2e2' : 'var(--bg-tertiary)', borderColor: emergencyMode ? '#fecaca' : 'var(--panel-border)', transition: '0.3s' }}>
          <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: emergencyMode ? 'var(--danger)' : 'var(--text-primary)' }}>
            <ShieldAlert size={16} /> 
            {emergencyMode ? "Govt Emergency Protocol Engaged" : "Standard QR Distribution Protocol"}
          </div>
          <button 
            type="button"
            onClick={() => setEmergencyMode(!emergencyMode)}
            className={`btn ${emergencyMode ? 'btn-danger' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', border: '1px solid currentColor', background: 'transparent' }}
            disabled={isLocked}
          >
            {emergencyMode ? 'Disable EMS Mode' : 'Enable EMS Mode'}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-8">
          
          {/* Pump Hardware Status Side */}
          <div style={{ background: 'var(--bg-tertiary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--panel-border)', display: 'flex', flexDirection: 'column' }}>
            <h3 className="text-sm text-text-primary uppercase tracking-wider mb-4 font-bold flex justify-between items-center">
               Hardware Storage 
               {isLocked ? <Lock size={16} className="text-danger" /> : <CheckCircle size={16} className="text-success" />}
            </h3>
            
            <div className="flex items-end gap-2 mb-6">
              <span style={{ fontSize: '2.5rem', lineHeight: 1, fontWeight: 'bold', color: isLocked ? 'var(--danger)' : activePump.total_fuel < 2000 ? 'var(--warning)' : 'var(--text-primary)' }}>
                {activePump.total_fuel} L
              </span>
              <span className={`badge ${isLocked ? 'badge-danger' : 'badge-success'} mb-1`}>{isLocked ? 'OFFLINE' : 'ONLINE'}</span>
            </div>

            <div style={{ width: '100%', flex: 1, minHeight: '150px', background: 'var(--panel-bg)', borderRadius: '8px', border: '1px solid var(--panel-border)', position: 'relative', overflow: 'hidden' }}>
              {isLocked && <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'repeating-linear-gradient(45deg, rgba(220, 38, 38, 0.1), rgba(220, 38, 38, 0.1) 10px, transparent 10px, transparent 20px)', zIndex: 10 }}></div>}
              <div style={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: `${Math.min(100, fillPercentage)}%`,
                background: isLocked ? 'var(--danger)' : activePump.total_fuel < 2000 ? 'var(--warning)' : 'var(--success)',
                transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                opacity: 0.8
              }} />
            </div>
            {isLocked && <p className="text-xs text-danger text-center font-bold mt-3">VALVE SECURED BY HQ</p>}
          </div>

          {/* Scanner Process Side */}
          <div className="flex-col gap-4">
            <h3 className="text-sm text-text-primary uppercase tracking-wider mb-2 font-bold flex items-center gap-2">
              {emergencyMode ? <ShieldAlert size={16} className="text-danger" /> : <Scan size={16} className="text-accent-primary" />} 
              {emergencyMode ? "Priority Verification" : "Scan User Code"}
            </h3>
            
            <form onSubmit={(e) => handleScan(e, false)} className="flex-col gap-4">
              {!emergencyMode ? (
                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>QR Code Input (Token Number)</label>
                  <input 
                    type="text" 
                    value={scanInput}
                    onChange={(e) => setScanInput(e.target.value)}
                    placeholder="Scan User QR or Enter Token"
                    style={{
                      width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '2px solid var(--accent-primary)', color: 'var(--text-primary)', borderRadius: '6px', fontFamily: 'monospace', outline: 'none'
                    }}
                    disabled={isLocked}
                  />
                </div>
              ) : (
                <div>
                  <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem', color: 'var(--danger)' }}>Agency Override Reference</label>
                  <input 
                    type="text" 
                    value={emergencyCode}
                    onChange={(e) => setEmergencyCode(e.target.value)}
                    placeholder="e.g. BD-MED-102"
                    style={{
                      width: '100%', padding: '0.8rem', background: '#fef2f2', border: '2px dashed var(--danger)', color: 'var(--danger)', borderRadius: '6px', outline: 'none'
                    }}
                    disabled={isLocked}
                  />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.8rem', display: 'block', marginBottom: '0.4rem', color: 'var(--text-secondary)' }}>Valve Operation (Liters)</label>
                <div className="flex gap-2">
                   <button type="button" className="btn btn-secondary flex-1 border-panel-border" onClick={() => setAmountInput(5)} disabled={isLocked}>5 L</button>
                   <button type="button" className="btn btn-secondary flex-1 border-panel-border" onClick={() => setAmountInput(10)} disabled={isLocked}>10 L</button>
                   <button type="button" className="btn btn-secondary flex-1 border-panel-border" onClick={() => setAmountInput(15)} disabled={isLocked}>15 L</button>
                </div>
                <input 
                  type="number" min="1" max="50"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  style={{ width: '100%', padding: '0.8rem', background: 'var(--bg-primary)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '6px', outline: 'none', marginTop: '0.5rem' }}
                  disabled={isLocked}
                />
              </div>

              <button 
                type="submit" 
                className={`btn w-full mt-2 ${emergencyMode ? 'btn-danger' : 'btn-primary'}`} 
                style={{ padding: '0.8rem', fontSize: '0.9rem', fontWeight: 600 }}
                disabled={(!scanInput && !emergencyMode) || activePump.total_fuel <= 0 || isLocked}
              >
                {emergencyMode ? 'EXECUTE PRIORITY DISPENSE' : 'VALIDATE & DISPENSE'}
              </button>

              {!emergencyMode && !isLocked && (
                 <button 
                    type="button" 
                    className="btn w-full mt-1" 
                    style={{ padding: '0.6rem', fontSize: '0.75rem', background: 'transparent', color: 'var(--danger)', border: '1px dashed var(--danger)' }}
                    onClick={(e) => handleScan(e, true)}
                 >
                   <AlertTriangle size={14} className="mr-1" /> Force Drop (No QR / Hardware Bypass)
                 </button>
              )}
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
