import React, { useState } from 'react';

// PALETA NEXO (Azul Profundo image_1.jpeg)
const COLORS = {
  bg_deep: '#010206',       // Fondo negro base
  bg_panel: '#0a0f1e',      // Fondo paneles azul oscuro
  accent: '#22d3ee',        // Cian vibrante Nexo
  accent_blue: '#2563eb',   // Azul fuerte botones
  text_main: '#f8fafc',     
  text_muted: '#64748b',    
  border: '#1e293b'         // Borde oscuro
};

export default function App() {
  const [activeTab, setActiveTab] = useState('Punto de Venta');
  const [view, setView] = useState('dashboard');
  
  // TASA BCV CENTRALIZADA (image_12.png)
  const tasaBCV = 471.70;
  
  // ESTADO DEL CARRITO (SIMULADO VACÍO)
  const [cart] = useState([]); 
  const totalUSD = 0.00;
  const totalBs = totalUSD * tasaBCV;

  const menuItems = [
    { name: 'Dashboard', icon: '📊' },
    { name: 'Punto de Venta', icon: '🛒' },
    { name: 'Inventario', icon: '📦' },
    { name: 'Ventas', icon: '💵' },
    { name: 'Reportes', icon: '📈' },
    { name: 'Comercios', icon: '🏢' },
    { name: 'Configuración', icon: '⚙️' }
  ];

  return (
    <div style={dashLayout}>
      {/* SIDEBAR */}
      <aside style={sidebarS}>
        <div style={sideHeader}>
          <div style={sideLogoContainer}>NX</div>
          <div><p style={brandName}>NEXO ADMIN</p></div>
        </div>
        <nav style={navS}>
          {menuItems.map(item => (
            <button key={item.name} onClick={() => setActiveTab(item.name)} style={activeTab === item.name ? tActive : tInactive}>
              <span style={{ marginRight: '12px' }}>{item.icon}</span>{item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* ÁREA PRINCIPAL (Layout POS Grid image_10.png) */}
      <main style={mainPOSLayout}>
        
        {/* COLUEFNA IZQUIERDA: PRODUCTOS Y BÚSQUEDA */}
        <div style={posMain}>
          <header style={headerFlex}>
            <h1 style={titleS}>Punto de Venta</h1>
            <p style={dateS}>miércoles, 1 de abril de 2026 | Tasa: Bs. {tasaBCV.toFixed(2)}</p>
          </header>

          <div style={searchBarRow}>
            <div style={searchContainer}>
              <span style={searchIcon}>🔍</span>
              <input type="text" placeholder="Buscar producto..." style={posInputSearch} />
            </div>
            <button style={btnScanner}>🔳 Código...</button>
          </div>
          
          <div style={productsArea}>
            <div style={emptyState}>
              <p style={{fontSize: '40px', margin: 0}}>📦</p>
              <p>Seleccione productos en la búsqueda para comenzar la venta</p>
            </div>
          </div>
        </div>

        {/* COLUEFNA DERECHA: CARRITO (Panel Lateral image_10.png) */}
        <aside style={cartPanel}>
          <div style={cartHeaderRow}>
            <h3 style={cartTitle}>🛒 Carrito (0)</h3>
          </div>

          <div style={cartItemsArea}>
            <p style={emptyCartText}>Agrega productos al carrito</p>
          </div>

          <div style={cartFooter}>
            <div style={totalRow}><span>Total USD</span><span style={valUSD}>USD {totalUSD.toFixed(2)}</span></div>
            <div style={totalRowBS}><span>Total Bs</span><span style={valBS}>Bs.S {totalBs.toLocaleString('es-VE', {minimumFractionDigits: 2})}</span></div>
            
            <p style={methodLabel}>Método de Pago</p>
            <div style={methodGrid}>
              {['Efectivo USD', 'Efectivo Bs', 'Pago Móvil', 'Punto', 'Mixto'].map((m, i) => (
                <button key={m} style={i === 0 ? mBtnActive : mBtn}>{m}</button>
              ))}
            </div>

            <textarea placeholder="Notas (opcional)..." style={notesArea}></textarea>
            
            <button style={btnConfirm}>Confirmar Venta · USD {totalUSD.toFixed(2)}</button>
          </div>
        </aside>

      </main>
    </div>
  );
}

// --- ESTILOS PUNTO DE VENTA (RÉPLICA image_10.png) ---
const mainPOSLayout = { flex: 1, display: 'grid', gridTemplateColumns: '1fr 380px', gap: '25px', padding: '30px', overflow: 'hidden' };
const posMain = { display: 'flex', flexDirection: 'column', gap: '20px', overflow: 'hidden' };

// Búsqueda
const searchBarRow = { display: 'flex', gap: '15px' };
const searchContainer = { flex: 1, position: 'relative', display: 'flex', alignItems: 'center' };
const searchIcon = { position: 'absolute', left: '15px', color: COLORS.text_muted, fontSize: '14px' };
const posInputSearch = { width: '100%', padding: '12px 12px 12px 45px', background: COLORS.bg_panel, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: 'white', outline: 'none', fontSize: '14px' };
const btnScanner = { padding: '0 20px', background: COLORS.bg_panel, border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: COLORS.text_muted, cursor: 'pointer', fontSize: '13px' };

// Área Productos
const productsArea = { flex: 1, background: 'rgba(10,15,30,0.3)', borderRadius: '15px', border: `1px dashed ${COLORS.border}`, overflow: 'auto' };
const emptyState = { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: COLORS.text_muted, fontSize: '14px', textAlign: 'center', gap: '15px', padding: '0 40px' };

// PANEL CARRITO (Lado derecho image_10.png)
const cartPanel = { background: COLORS.bg_panel, borderRadius: '20px', border: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column', padding: '20px', overflow: 'hidden' };
const cartHeaderRow = { marginBottom: '20px' };
const cartTitle = { margin: 0, fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' };
const cartItemsArea = { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: `1px solid ${COLORS.border}`, marginBottom: '20px' };
const emptyCartText = { color: '#475569', fontSize: '13px', textAlign: 'center' };

const cartFooter = { display: 'flex', flexDirection: 'column', gap: '12px' };
const totalRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: COLORS.text_main, fontSize: '14px' };
const valUSD = { color: COLORS.accent, fontWeight: 'bold', fontSize: '18px' };
const totalRowBS = { ...totalRow, fontSize: '12px', color: COLORS.text_muted };
const valBS = { fontWeight: 'bold', fontSize: '16px', color: COLORS.text_main };

const methodLabel = { fontSize: '11px', color: COLORS.text_muted, fontWeight: 'bold', marginTop: '10px', textTransform: 'uppercase' };
const methodGrid = { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' };
const mBtn = { padding: '10px', background: '#010206', border: `1px solid ${COLORS.border}`, borderRadius: '8px', color: COLORS.text_muted, fontSize: '11px', cursor: 'pointer', textAlign: 'center' };
const mBtnActive = { ...mBtn, background: COLORS.accent_blue, border: 'none', color: 'white', fontWeight: 'bold' };

const notesArea = { background: '#010206', border: `1px solid ${COLORS.border}`, borderRadius: '10px', color: 'white', padding: '10px', height: '60px', resize: 'none', fontSize: '12px', outline: 'none' };
const btnConfirm = { padding: '15px', background: `linear-gradient(180deg, ${COLORS.accent_blue}, #1e40af)`, color: 'white', border: 'none', borderRadius: '15px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px', fontSize: '14px' };

// --- ESTILOS BASE (SIDEBAR Y GLOBAL) ---
const dashLayout = { display: 'flex', height: '100vh', background: COLORS.bg_deep, color: COLORS.text_main, fontFamily: 'sans-serif', overflow: 'hidden' };
const sidebarS = { width: '260px', background: COLORS.bg_panel, padding: '25px', borderRight: `1px solid ${COLORS.border}`, display: 'flex', flexDirection: 'column' };
const sideHeader = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' };
const sideLogoContainer = { width: '40px', height: '40px', background: COLORS.accent, borderRadius: '10px', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', color: '#010206' };
const brandName = { margin: 0, fontWeight: 'bold', fontSize: '14px' };
const navS = { display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 };
const tActive = { padding: '12px 15px', background: 'rgba(34,211,238,0.1)', color: COLORS.accent, borderRadius: '10px', border: `1px solid ${COLORS.accent}`, textAlign: 'left', cursor: 'pointer', fontWeight: '600', fontSize: '13px' };
const tInactive = { padding: '12px 15px', background: 'transparent', color: COLORS.text_muted, borderRadius: '10px', border: 'none', textAlign: 'left', cursor: 'pointer', fontSize: '13px' };
const headerFlex = { marginBottom: '20px' };
const titleS = { margin: 0, fontSize: '24px', fontWeight: '800' };
const dateS = { margin: '5px 0', color: COLORS.text_muted, fontSize: '12px' };
