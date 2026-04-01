import React, { useState, useEffect } from 'react';

export default function App() {
  const [view, setView] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('Configuración');
  
  // Estado de la Tasa Centralizada
  const [globalRate, setGlobalRate] = useState(471.70);
  const [lastUpdate, setLastUpdate] = useState('01/04/2026, 05:45 p. m.');
  const [isSyncing, setIsSyncing] = useState(false);

  // Lista de comercios para demostrar la sincronización
  const [merchants, setMerchants] = useState([
    { id: '001', name: 'Panadería El Pan', rate: 471.70 },
    { id: '002', name: 'Ferretería Central', rate: 471.70 },
    { id: '003', name: 'Farmacia Nexo', rate: 471.70 }
  ]);

  // FUNCIÓN MAESTRA: Actualización en Cascada
  const syncAllMerchants = (newRate) => {
    setIsSyncing(true);
    
    // Simulamos el delay de red de Supabase actualizando todos los tenants
    setTimeout(() => {
      setGlobalRate(newRate);
      setLastUpdate(new Date().toLocaleString());
      
      // Actualizamos la tasa en el estado local de cada comercio registrado
      const updatedMerchants = merchants.map(m => ({ ...m, rate: newRate }));
      setMerchants(updatedMerchants);
      
      setIsSyncing(false);
      alert("✅ Sincronización Exitosa: Todos los comercios operan ahora a Bs. " + newRate);
    }, 1500);
  };

  const handleUpdateBCV = () => {
    // Aquí iría la llamada a tu Edge Function o API de Nexo
    const bcvRate = 475.20; // Supongamos que la API devuelve esto
    syncAllMerchants(bcvRate);
  };

  return (
    <div style={dashLayout}>
      <aside style={sidebarS}>
        <div style={sideHeader}><div style={sideLogoContainer}>NX</div><p style={brandName}>NEXO ADMIN</p></div>
        <nav style={navS}>
          {['Dashboard', 'Punto de Venta', 'Comercios', 'Configuración'].map(item => (
            <button key={item} onClick={() => setActiveTab(item)} style={activeTab === item ? tActive : tInactive}>{item}</button>
          ))}
        </nav>
      </aside>

      <main style={mainS}>
        {activeTab === 'Configuración' && (
          <div style={configBox}>
            <h1 style={titleS}>Ajustes de Red</h1>
            <div style={tasaMainCard}>
              <h3 style={cardHeaderS}>Sincronización Central de Tasa (Multi-Tenant)</h3>
              <p style={cardInfoS}>Al actualizar aquí, se notificará a todos los terminales de venta activos.</p>
              
              <div style={displayTasaRow}>
                <div style={tasaDisplay}>
                  <p style={tLabel}>TASA GLOBAL</p>
                  <h2 style={tValue}>Bs. {globalRate.toFixed(2)}</h2>
                  <p style={tMeta}>Estado: {isSyncing ? '🔄 Sincronizando red...' : '🟢 En línea'}</p>
                </div>
                <button 
                  onClick={handleUpdateBCV} 
                  style={{...btnUpdate, opacity: isSyncing ? 0.5 : 1}}
                  disabled={isSyncing}
                >
                  {isSyncing ? 'Procesando...' : '🔄 Actualizar toda la red'}
                </button>
              </div>
              <p style={footerNote}>Última actualización: {lastUpdate}</p>
            </div>
          </div>
        )}

        {activeTab === 'Comercios' && (
          <div>
            <h1 style={titleS}>Estado de Comercios</h1>
            <div style={merchantGrid}>
              {merchants.map(m => (
                <div key={m.id} style={mCard}>
                  <p style={mName}>{m.name}</p>
                  <p style={mRate}>Tasa Activa: <b>Bs. {m.rate.toFixed(2)}</b></p>
                  <span style={mStatus}>● Sincronizado</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// ESTILOS ADICIONALES PARA LA RED
const configBox = { maxWidth: '850px' };
const tasaMainCard = { background: '#0f172a', padding: '35px', borderRadius: '25px', border: '1px solid #2563eb' };
const displayTasaRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(37,99,235,0.1)', padding: '30px', borderRadius: '20px' };
const tValue = { fontSize: '45px', color: '#3b82f6', fontWeight: '900', margin: '5px 0' };
const btnUpdate = { padding: '15px 25px', background: '#2563eb', border: 'none', color: 'white', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' };
const footerNote = { marginTop: '20px', color: '#475569', fontSize: '12px', textAlign: 'center' };
const merchantGrid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '20px', marginTop: '30px' };
const mCard = { background: '#0f172a', padding: '20px', borderRadius: '15px', border: '1px solid #1e293b' };
const mName = { margin: 0, fontWeight: 'bold', fontSize: '14px' };
const mRate = { fontSize: '13px', color: '#94a3b8', margin: '10px 0' };
const mStatus = { fontSize: '10px', color: '#10b981', textTransform: 'uppercase', letterSpacing: '1px' };

// ESTILOS BASE (SIDEBAR Y LAYOUT)
const dashLayout = { display: 'flex', height: '100vh', background: '#010206', color: 'white', fontFamily: 'sans-serif' };
const sidebarS = { width: '260px', background: '#0a0f1e', padding: '20px', borderRight: '1px solid #1e293b' };
const sideHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px' };
const sideLogoContainer = { width: '40px', height: '40px', background: '#2563eb', borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold' };
const brandName = { margin: 0, fontWeight: 'bold' };
const navS = { display: 'flex', flexDirection: 'column', gap: '5px' };
const tActive = { padding: '12px 15px', background: '#1e293b', color: 'white', borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' };
const tInactive = { padding: '12px 15px', background: 'transparent', color: '#94a3b8', borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer' };
const mainS = { flex: 1, padding: '40px', overflowY: 'auto' };
const titleS = { margin: 0, fontSize: '32px' };
const cardHeaderS = { margin: 0 };
const cardInfoS = { color: '#64748b', marginBottom: '20px' };
const tLabel = { margin: 0, fontSize: '12px', color: '#94a3b8' };
const tMeta = { margin: 0, fontSize: '12px', color: '#64748b' };
