import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function App() {
  const [view, setView] = useState('login'); // 'login' o 'dashboard'
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  // Verificación de sesión al cargar
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setView('dashboard');
    });
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) alert("Error: " + error.message);
    else setView('dashboard');
  };

  if (view === 'dashboard') {
    return (
      <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#0f172a' }}>Construcciones Express ✅</h1>
        <div style={{ background: 'white', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
          <p>¡Bienvenido al Panel de Control de Venezuela!</p>
          <button onClick={() => supabase.auth.signOut().then(() => setView('login'))} 
                  style={{ backgroundColor: '#ef4444', color: 'white', padding: '10px', border: 'none', borderRadius: '8px' }}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#0f172a' }}>
      <form onSubmit={handleLogin} style={{ background: 'white', padding: '40px', borderRadius: '24px', width: '300px' }}>
        <h2 style={{ textAlign: 'center' }}>ERP Login</h2>
        <input type="email" placeholder="Email" onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
        <input type="password" placeholder="Clave" onChange={e => setPass(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '20px' }} />
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '10px' }}>Entrar</button>
      </form>
    </div>
  );
}
