import React from 'react';
import { Copyright, Heart, ShieldCheck, Code, Globe } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{
      padding: '4rem 2rem 3rem',
      background: 'var(--bg-primary)',
      borderTop: '1px solid var(--glass-border)',
      marginTop: 'auto',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Glow */}
      <div style={{
        position: 'absolute',
        bottom: '-10%',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '60%',
        height: '40%',
        background: 'radial-gradient(circle, rgba(0, 229, 255, 0.05) 0%, transparent 70%)',
        zIndex: 0,
        pointerEvents: 'none'
      }} />

      <div className="flex flex-col items-center justify-center gap-8" style={{ position: 'relative', zIndex: 1 }}>

        {/* Branding / Tagline */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <div style={{ padding: '0.4rem', background: 'rgba(0, 229, 255, 0.1)', borderRadius: '8px' }}>
              <ShieldCheck size={20} color="var(--accent-primary)" />
            </div>
            <span className="gradient-text" style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.02em' }}>Nuhad N Khan</span>
          </div>
          <p className="text-muted" style={{ fontSize: '0.85rem', maxWidth: '400px', textAlign: 'center' }}>
            Innovating the future of energy management through advanced IoT and AI research.
          </p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          {[
            { icon: <Code size={16} />, label: 'Open Source', href: '#' },
            { icon: <Globe size={16} />, label: 'Portfolio', href: '#' },
          ].map((link, i) => (
            <a key={i} href={link.href} className="flex items-center gap-2 text-muted hover-text-primary transition-all" style={{ textDecoration: 'none', fontSize: '0.9rem' }}>
              {link.icon} {link.label}
            </a>
          ))}
        </div>

        {/* Bottom Line */}
        <div className="w-full max-w-2xl" style={{ height: '1px', background: 'linear-gradient(90deg, transparent, var(--glass-border), transparent)' }} />

        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.9rem', fontWeight: 500 }}>
            <Copyright size={16} />
            <span>{currentYear} <span style={{ color: 'var(--text-primary)' }}>Nuhad An Khan</span>. All Rights Reserved.</span>
          </div>

          <div className="flex items-center gap-2 text-muted" style={{ fontSize: '0.8rem' }}>
            <span>Project developed with</span>
            <div className="animate-pulse" style={{ display: 'flex' }}>
              <Heart size={14} color="var(--danger)" fill="var(--danger)" />
            </div>
            <span>by Nuhad N Khan</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
