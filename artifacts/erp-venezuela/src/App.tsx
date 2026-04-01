import React, { useState } from 'react';

export default function App() {
  const [view, setView] = useState('test');

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#0f172a', 
      color: 'white',
      fontFamily: 'sans-serif',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1 style={{ fontSize: '28px', marginBottom: '10px' }}>🏗️ Construcciones Express</h1>
      <div style={{ 
        background: 'rgba(255,255,255,0.1)', 
        padding: '30px', 
        borderRadius: '20px', 
        border: '1px solid rgba(255,255,255,0.2)' 
      }}>
        <h2 style={{ color: '#60a5fa' }}>¡CONEXIÓN ESTABLECIDA!</h2>
        <p style={{ color: '#94a3b8', maxWidth: '300px' }}>
          Si ves esto, el motor de renderizado está vivo. El siguiente paso es conectar la base de datos.
        </p>
        <button 
          onClick={() => alert("El sistema de alertas funciona ✅")}
          style={{ 
            marginTop: '20px', 
            padding: '12px 24px', 
            backgroundColor: '#2563eb', 
            color: 'white', 
            border: 'none', 
            borderRadius: '10px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Probar Interacción
        </button>
      </div>
    </div>
  );
}
