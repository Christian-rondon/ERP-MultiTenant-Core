import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL || '',
  import.meta.env.VITE_SUPABASE_ANON_KEY || ''
);

// ESTILOS DE LOGO NEXO (Inspirados en la imagen proporcionada)
const NexoLogo = ({ size = 'medium' }) => {
  const containerSize = size === 'large' ? '120px' : '60px';
  const logoSize = size === 'large' ? '80px' : '40px';
  const fontSize = size === 'large' ? '36px' : '20px';
  const subFontSize = size === 'large' ? '14px' : '10px';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {/* Contenedor Circular Premium (Inspirado en el badge de la imagen) */}
      <div style={{
        width: containerSize,
        height: containerSize,
        borderRadius: '50%',
        background: 'linear-gradient(135deg, #020617 0%, #0a1122 100%)', // Fondo muy oscuro
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: '4px solid rgba(255, 255, 255, 0.05)',
        boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
        marginBottom: '15px',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* 'N' estilizada con flecha (SVG para alta precisión) */}
        <svg width={logoSize} height={logoSize} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="logoGradient" x1="0%" y1="100%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#1e3a8a" /> {/* Azul profundo */}
              <stop offset="100%" stopColor="#22d3ee" /> {/* Cian brillante */}
            </linearGradient>
          </defs>
          <path d="M15 85V15H35L65 70V15H85V85H65L35 30V85H15Z" fill="url(#logoGradient)"/>
          {/* Flecha hacia arriba y derecha */}
          <path d="M70 10H90V30H80V18L60 38L53 31L73 11H70Z" fill="#22d3ee"/>
        </svg>
      </div>

      {/* Texto de la Marca (NEXO) */}
      <div style={{ textAlign: 'center' }}>
        <h2 style={{
          color: 'white',
          margin: 0,
          fontSize: fontSize,
          fontWeight: '900',
          letterSpacing: '2px',
          fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
          NEXO
        </h2>
        <p style={{
          color: '#94a3b8',
          margin: '5px 0 0 0',
          fontSize: subFontSize,
          letterSpacing: '1px',
          opacity: 0.8
        }}>
          GESTOR INTELIGENTE VENEZUELA
        </p>
      </div>
    </div>
  );
};

export default function App() {
  const [view, setView] = useState('loading');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setView(session ? 'dashboard' : 'login');
    });
  }, []);

  const handleLogin = async (e: any) => {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
    if (error) alert("Error de Nexo: " + error.message);
    else setView('dashboard');
  };

  if (view === 'loading') return <div style={{ background: '#020617', height: '100vh' }} />;

  if (view === 'dashboard') {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #020617 0%, #0f172a 100%)',
        fontFamily: 'system-ui, sans-serif',
        color: '#f8fafc',
        padding: '20px'
      }}>
        {/* Header Superior con Logo NEXO */}
        <header style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'rgba(255, 255, 255, 0.03)',
          backdropFilter: 'blur(10px)',
          padding: '15px 25px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '30px',
          flexWrap: 'wrap'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <NexoLogo size="small" />
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => setView('login'))}
            style={{ background: '#ef4444', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
          >
            Cerrar Sesión
          </button>
        </header>

        {/* Grid de KPIs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {/* Tarjeta Ventas */}
          <div style={cardStyle}>
            <div style={cardTitleStyle}>Ventas Totales Nexo</div>
            <div style={cardValueStyle}>$ 0.00</div>
            <div style={{ color: '#10b981', fontSize: '14px', marginTop: '10px' }}>↑ 0% vs mes anterior</div>
          </div>

          {/* Tarjeta Tasa BCV */}
          <div style={{ ...cardStyle, background: 'rgba(34, 211, 238, 0.05)', border: '1px solid rgba(34, 211, 238, 0.1)' }}>
            <div style={{ ...cardTitleStyle, color: '#22d3ee' }}>Tasa Oficial BCV</div>
            <div style={{ ...cardValueStyle, color: '#22d3ee' }}>Bs. 36.45</div>
            <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '10px' }}>Sincronizado hoy</div>
          </div>
        </div>

        {/* Sección de Acciones Rápidas */}
        <div style={{ marginTop: '40px' }}>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Módulos Activos</h3>
          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
            <button style={btnStyle}>📦 Inventario</button>
            <button style={btnStyle}>🧾 Nueva Venta</button>
            <button style={btnStyle}>👥 Clientes</button>
            <button style={btnStyle}>📊 Reportes</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#020617' }}>
      <form onSubmit={handleLogin} style={{
        background: 'rgba(255, 255, 255, 0.02)',
        padding: '50px',
        borderRadius: '32px',
        width: '100%',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <NexoLogo size="large" />
        </div>
        <input type="email" placeholder="Email (Nexo)" onChange={e => setEmail(e.target.value)} style={inputStyle} />
        <input type="password" placeholder="Contraseña" onChange={e => setPass(e.target.value)} style={inputStyle} />
        <button type="submit" style={{
          width: '100%',
          padding: '16px',
          backgroundColor: '#22d3ee', // Color cian de Nexo
          color: '#020617', // Texto oscuro para contraste
          border: 'none',
          borderRadius: '16px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 10px 15px -3px rgba(34, 211, 238, 0.3)'
        }}>Entrar al Sistema Nexo</button>
      </form>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '16px',
  marginBottom: '15px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'white',
  outline: 'none',
  fontSize: '16px'
};

const btnStyle = {
  padding: '15px 25px',
  borderRadius: '16px',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  background: 'rgba(255, 255, 255, 0.05)',
  color: 'white',
  cursor: 'pointer',
  fontWeight: '600',
  transition: 'all 0.3s'
};

const cardStyle = {
  background: 'rgba(255, 255, 255, 0.03)',
  padding: '30px',
  borderRadius: '24px',
  border: '1px solid rgba(255, 255, 255, 0.05)',
  position: 'relative',
  overflow: 'hidden'
};

const cardTitleStyle = {
  color: '#94a3b8',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  fontWeight: 'bold'
};

const cardValueStyle = {
  fontSize: '42px',
  fontWeight: '800',
  marginTop: '10px',
  color: '#fff'
};
