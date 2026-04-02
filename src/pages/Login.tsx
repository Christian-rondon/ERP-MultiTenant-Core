import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useState } from 'react';

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (!error) { navigate('/dashboard'); } else { alert('Error: ' + error.message); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950" style={{backgroundImage: 'url("https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070")', backgroundSize: 'cover', backgroundPosition: 'center'}}>
      <div className="bg-slate-900/80 backdrop-blur-xl p-10 rounded-[40px] w-full max-w-md border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
        <div className="mb-10">
          <div className="w-24 h-24 bg-black/50 rounded-full flex items-center justify-center mb-6 mx-auto border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
             <svg className="w-12 h-12 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <h1 className="text-6xl font-black text-white tracking-tighter mb-1">NEXO</h1>
          <p className="text-cyan-500 text-xs font-bold uppercase tracking-[0.3em]">Venezuela</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5">
          <input type="email" placeholder="Usuario" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-center" required />
          <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 outline-none focus:ring-2 focus:ring-cyan-500/50 transition-all text-center" required />
          <button type="submit" disabled={loading} className="w-full py-5 bg-cyan-600 hover:bg-cyan-500 text-black font-black rounded-2xl transition-all shadow-[0_10px_20px_rgba(8,145,178,0.3)] active:scale-[0.98] uppercase tracking-widest text-sm">
            {loading ? 'Validando...' : 'Acceder al Sistema Core'}
          </button>
        </form>
        <div className="mt-12 text-slate-500 text-[10px] uppercase tracking-[0.2em] font-medium opacity-50">
          Santa Teresa del Tuy | Multi-Tenant v1.0
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
