import React, { useState } from 'react';
import { supabase } from '../lib/supabase'; // Verifica que esta ruta sea correcta en tu proyecto

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      alert('Error: ' + error.message);
    } else {
      window.location.href = '/dashboard';
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '20px', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>Construcciones Express</h2>
        <p style={{ color: '#64748b', marginBottom: '30px' }}>ERP Venezuela</p>
        
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <input 
            type="email" 
            placeholder="admin@erp.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: '15px', borderRadius: '10px', border: '2px solid #f1f5f9', outline: 'none' }} 
            required 
          />
          <input 
            type="password" 
            placeholder="Contraseña" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: '15px', borderRadius: '10px', border: '2px solid #f1f5f9', outline: 'none' }} 
            required 
          />
          <button 
            type="submit" 
            disabled={loading}
            style={{ padding: '15px', borderRadius: '10px', border: 'none', backgroundColor: '#2563eb', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}
          >
            {loading ? 'Cargando...' : 'Ingresar al Sistema'}
          </button>
        </form>
      </div>
    </div>
  );
}
