import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Si ya hay sesión, mándalo al dashboard de una vez
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) window.location.href = '/dashboard';
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('Error: ' + error.message);
      setLoading(false);
    } else if (data.user) {
      // Forzamos el salto al dashboard
      window.location.replace('/dashboard');
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '24px', width: '100%', maxWidth: '400px', textAlign: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '8px', fontSize: '24px' }}>Construcciones Express</h2>
        <p style={{ color: '#64748b', marginBottom: '32px' }}>Gestión Inteligente</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input 
            type="email" 
            placeholder="admin@erp.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '16px' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '16px', borderRadius: '12px', border: '2px solid #f1f5f9', outline: 'none', fontSize: '16px' }} 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '16px', borderRadius: '12px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', transition: 'background 0.2s' }}
          >
            {loading ? 'Entrando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
