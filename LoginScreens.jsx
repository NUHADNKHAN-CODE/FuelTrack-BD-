import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Fingerprint, Lock, ChevronRight, Loader2, ShieldCheck, Activity } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginScreens() {
  const navigate = useNavigate();
  const location = useLocation();
  const isCitizen = location.search.includes('type=citizen');

  const [nid, setNid] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setLoading(false);
      toast.success(isCitizen ? 'Biometric NID Verified' : 'Admin Credentials Accepted');
      
      // Redirect to the dashboard
      navigate(isCitizen ? '/citizen' : '/dashboard');
    }, 1200);
  };

  return (
    <div style={{ minHeight: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Bar Minimal */}
      <nav style={{ padding: '1.5rem', display: 'flex', justifyContent: 'center', borderBottom: '1px solid var(--panel-border)', background: 'var(--bg-secondary)' }}>
        <h2 className="gradient-text flex items-center gap-2" style={{ margin: 0, fontSize: '1.25rem' }}>
          <Activity size={24} /> SFSB National Gateway
        </h2>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      
        <div className="glass-panel animate-slide-up" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', background: 'var(--bg-secondary)', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)' }}>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
            {isCitizen ? (
              <div style={{ padding: '1rem', background: 'rgba(37, 99, 235, 0.1)', borderRadius: '12px', color: 'var(--accent-secondary)' }}>
                <Fingerprint size={48} />
              </div>
            ) : (
              <div style={{ padding: '1rem', background: 'rgba(30, 58, 138, 0.1)', borderRadius: '12px', color: 'var(--accent-primary)' }}>
                <Lock size={48} />
              </div>
            )}
          </div>

          <h2 className="text-center" style={{ marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
            {isCitizen ? 'Citizen Gateway' : 'HQ Administration'}
          </h2>
          <p className="text-center text-muted text-sm mb-8">
            {isCitizen ? 'Verify national identity to access personal fuel allocation.' : 'Authorized personnel login required.'}
          </p>

          <form onSubmit={handleLogin} className="flex-col gap-4">
            
            {isCitizen ? (
              <div>
                <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>National ID Number</label>
                <input 
                  type="text" 
                  value={nid}
                  onChange={(e) => setNid(e.target.value)}
                  placeholder="e.g. 1234567890"
                  required
                  style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                />
              </div>
            ) : (
              <>
                <div>
                  <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Govt Employee ID</label>
                  <input 
                    type="text" 
                    defaultValue="ADMIN-HQ-01"
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontWeight: 500 }}>Clearance Password</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={{ width: '100%', padding: '0.8rem 1rem', background: 'var(--bg-primary)', border: '1px solid var(--panel-border)', color: 'var(--text-primary)', borderRadius: '8px', fontSize: '0.95rem', outline: 'none' }}
                  />
                </div>
              </>
            )}

            <button 
              type="submit" 
              className="btn w-full mt-4" 
              style={{ 
                background: isCitizen ? 'var(--accent-secondary)' : 'var(--accent-primary)', 
                color: 'white',
                padding: '0.85rem',
                fontSize: '1rem',
                fontWeight: 600,
                boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
              }}
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin" /> : (isCitizen ? 'Verify Identity' : 'Secure Login')}
            </button>
          </form>
          
          <div style={{ marginTop: '2rem', textAlign: 'center' }}>
            <button 
                onClick={() => navigate('/')}
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', cursor: 'pointer', fontWeight: 500 }}
            >
              <ChevronLeft size={16} /> Returns to Home
            </button>
          </div>

        </div>
      </div>
      
      {/* Footer Minimal */}
      <footer style={{ padding: '1.5rem', textAlign: 'center', borderTop: '1px solid var(--panel-border)', background: 'var(--bg-secondary)' }}>
         <p className="text-muted text-xs flex items-center justify-center gap-2">
            <ShieldCheck size={14} /> Ensure connection is secure. {new Date().getFullYear()} SFSB Government Platform.
         </p>
      </footer>
    </div>
  );
}

const ChevronLeft = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
);
