import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Droplet, AlertCircle, CheckCircle, Plus, Minus, Cpu } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InnovationLab() {
  const { pumps, setPumps } = useSimulation();
  
  // Find specifically the Lab pump
  const labPump = pumps.find(p => p.id === 'p9');

  const updateLabFuel = (amount) => {
    // This replicates the hardware sensor logic
    const pumpIndex = pumps.findIndex(p => p.id === 'p9');
    const updatedPumps = [...pumps];
    
    // Ensure we don't go below 0
    const newTotal = Math.max(0, updatedPumps[pumpIndex].total_fuel + amount);
    updatedPumps[pumpIndex].total_fuel = newTotal;
    
    // Auto status update
    updatedPumps[pumpIndex].status = newTotal > 0 ? 'Active' : 'Warning';
    
    // Force context update (if setPumps was exported, but we need to use existing dispense logic or add a hardware hook)
    // Actually, let's just use the triggerSimulation to handle custom hardware logic
    toast.success(`${amount > 0 ? 'Fuel Added' : 'Fuel Withdrawn'}: ${Math.abs(amount)}L`, {
      icon: amount > 0 ? <Plus size={16} color="var(--success)" /> : <Minus size={16} color="var(--danger)" />
    });
  };

  // Note: Since setPumps isn't exported in the previous context version, 
  // I need to use the triggerSimulation or I should have added a dedicated hook.
  // Re-reading SimulationContext.jsx... I should use the triggerSimulation functionality or add a direct manual update.
  // For the demo, I'll update the Context to support this.
  
  if (!labPump) return <div>Error: Demo Pump not found.</div>;

  const isAvailable = labPump.total_fuel > 0;

  return (
    <div className="flex-col gap-8 animate-slide-up h-full w-full items-center justify-center">
      <div className="text-center">
        <h1 className="gradient-text mb-2" style={{ fontSize: '2.5rem' }}>Innovation Lab</h1>
        <p className="text-muted">Live Hardware-Software Integration Demo</p>
      </div>

      <div className="flex gap-8 items-stretch justify-center w-full max-w-4xl">
        {/* Tank Visualizer */}
        <div className="glass-panel flex-col items-center justify-between" style={{ flex: 1, padding: '2rem' }}>
          <h3 className="flex items-center gap-2 mb-6"><Cpu size={20} /> IoT Sensor View</h3>
          
          <div style={{ 
            width: '120px', 
            height: '250px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '20px', 
            border: '4px solid var(--glass-border)',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: isAvailable ? '0 0 30px rgba(0, 230, 118, 0.2)' : '0 0 30px rgba(255, 23, 68, 0.2)'
          }}>
            {/* Liquid */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: `${(labPump.total_fuel / 5) * 100}%`,
              background: isAvailable ? 'var(--success)' : 'var(--danger)',
              transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
              opacity: 0.7,
            }} />
            
            {/* Display on tank */}
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              zIndex: 2,
              textShadow: '0 2px 4px rgba(0,0,0,0.5)'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{labPump.total_fuel}L</p>
            </div>
          </div>

          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <div className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1.2rem', padding: '0.75rem 1.5rem' }}>
              {isAvailable ? 'OIL AVAILABLE' : 'OIL NOT AVAILABLE'}
            </div>
          </div>
        </div>

        {/* Hardware Control Simulator */}
        <div className="glass-panel flex-col gap-6" style={{ width: '350px', padding: '2rem' }}>
          <h3 className="mb-4">Manual Hardware Override</h3>
          <p className="text-sm text-muted mb-4">Click below to simulate real-time sensor data from the physical tank.</p>
          
          <div className="flex-col gap-4">
            <button 
              className="btn btn-primary w-full py-4 text-lg" 
              onClick={() => {
                // Since I need a way to communicate back to context, I'll wrap this in a triggerSimulation call in the context
                window.dispatchEvent(new CustomEvent('updateHardware', { detail: 2 }));
              }}
            >
              <Plus /> Add 2 Liters
            </button>
            <button 
              className="btn btn-danger w-full py-4 text-lg" 
              onClick={() => {
                window.dispatchEvent(new CustomEvent('updateHardware', { detail: -2 }));
              }}
            >
              <Minus /> Withdraw 2 Liters
            </button>
          </div>

          <div style={{ marginTop: 'auto', padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '10px', fontSize: '0.8rem' }}>
            <p className="flex items-center gap-2"><div style={{width:8,height:8,borderRadius:'50%',background:'var(--success)'}}/> Sensor Connected</p>
            <p className="mt-1 flex items-center gap-2 text-muted">IoT Research Node #1</p>
          </div>
        </div>
      </div>
    </div>
  );
}
