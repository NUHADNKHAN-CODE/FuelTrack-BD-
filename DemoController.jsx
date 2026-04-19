import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Play, AlertTriangle, BatteryCharging, RefreshCcw, UserX, QrCode } from 'lucide-react';

export default function DemoController() {
  const { triggerSimulation } = useSimulation();

  return (
    <div style={{
      position: 'fixed',
      bottom: '1.5rem',
      left: '50%',
      transform: 'translateX(-50%)',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--panel-border)',
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
      zIndex: 1000
    }}>
      <div className="flex items-center gap-2 pr-2 border-r border-panel-border">
        <Play size={16} color="var(--accent-primary)" />
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>Demo Triggers:</span>
      </div>

      <button 
        className="btn" 
        onClick={() => triggerSimulation('mismatch_fraud')}
        style={{ background: '#fee2e2', color: 'var(--danger)', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}
        title="Simulates a physical dispensing of fuel at a pump without a scanned QR code authorization."
      >
        <QrCode size={14} /> Bypass QR Code
      </button>

      <button 
        className="btn" 
        onClick={() => triggerSimulation('leak')}
        style={{ background: '#fee2e2', color: 'var(--danger)', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}
        title="Simulates 2000L physically dropping from a tank without any logged transaction."
      >
        <UserX size={14} /> Simulate Tank Theft
      </button>

      <button 
        className="btn" 
        onClick={() => triggerSimulation('hoarding')}
        style={{ background: '#fef3c7', color: '#b45309', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}
      >
        <AlertTriangle size={14} /> Hoarding Attempt
      </button>

      <div style={{ width: '1px', height: '24px', background: 'var(--panel-border)' }}></div>

      <button 
        className="btn" 
        onClick={() => triggerSimulation('reset')}
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--panel-border)', color: 'var(--text-muted)', padding: '0.4rem 0.8rem', fontSize: '0.75rem', fontWeight: 600 }}
      >
        <RefreshCcw size={14} /> Clean Audit Ledger
      </button>
    </div>
  );
}
