
import React, { useState, useEffect, useMemo } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { 
  Settings2, 
  Download, 
  Globe, 
  Shield,
  FileCode,
  Zap,
  Lock,
  Link as LinkIcon,
  AlertCircle,
  ExternalLink,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { QRConfig } from './types';

const App: React.FC = () => {
  const [isDynamic, setIsDynamic] = useState(true);
  const [vCardData, setVCardData] = useState({
    firstName: 'DAVID',
    lastName: 'ARAUJO MONSORIU',
    org: 'Argilers Trial Club',
    title: 'SOCI N° 1 • ARGILERS',
    tel: '687 932 335',
    email: 'd.araujots@hotmail.com',
    baseUrl: 'https://argilerstrialclub.github.io/socio/index.html'
  });

  const [config, setConfig] = useState<QRConfig>({
    value: '',
    size: 1024, 
    fgColor: '#2d2926',
    bgColor: '#e9decb',
    level: 'M', 
    includeMargin: true
  });

  const safeBtoa = (str: string) => {
    try {
      return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
        return String.fromCharCode(parseInt(p1, 16));
      }));
    } catch (e) {
      console.error("Error encoding base64:", e);
      return "";
    }
  };

  const finalUrl = useMemo(() => {
    let base = vCardData.baseUrl.trim();
    if (!base) return "";

    if (isDynamic) {
      const dataToEncode = {
        n: vCardData.firstName,
        a: vCardData.lastName,
        t: vCardData.title,
        p: vCardData.tel,
        e: vCardData.email
      };
      const encodedData = safeBtoa(JSON.stringify(dataToEncode));
      
      if (!base.includes('.') && !base.endsWith('/')) {
        base += '/';
      }

      const separator = base.includes('?') ? '&' : '?';
      return `${base}${separator}v=${encodedData}`;
    }
    
    return base;
  }, [vCardData, isDynamic]);

  useEffect(() => {
    setConfig(prev => ({ ...prev, value: finalUrl }));
  }, [finalUrl]);

  const downloadQR = () => {
    const canvas = document.querySelector('canvas') as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `QR-Argilers-${vCardData.firstName}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const exportSmartTemplate = () => {
    const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Socio Digital - Argilers</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;900&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f2e9dc; color: #2d2926; margin: 0; }
        .diamond-logo { transform: rotate(45deg); }
        .diamond-inner { transform: rotate(-45deg); }
        .placeholder-text { opacity: 0.1; }
    </style>
</head>
<body class="flex items-center justify-center min-h-screen p-4">
    <div id="app" class="max-w-sm w-full bg-[#e9decb] rounded-[60px] border-[12px] border-[#2d2926] shadow-2xl overflow-hidden flex flex-col min-h-[720px]">
        <div class="flex-1 px-8 py-12 flex flex-col items-center text-center">
            <div class="mb-10 relative">
                <div class="w-32 h-32 bg-[#2d2926] diamond-logo flex items-center justify-center shadow-xl border-4 border-[#e9decb]">
                    <div class="diamond-inner">
                        <p class="font-black text-[13px] text-[#e9decb] tracking-tight leading-none">ARGILERS</p>
                        <p class="text-[6px] text-[#e9decb] uppercase tracking-[0.2em] mt-1">Trial Club</p>
                    </div>
                </div>
            </div>
            
            <p id="ui-title" class="text-[10px] text-blue-700 font-black uppercase tracking-[0.3em] mb-2">ESPERANDO QR</p>
            <h1 id="ui-name" class="text-4xl font-black uppercase tracking-tighter leading-none mb-10 placeholder-text">SIN DATOS</h1>
            
            <div class="w-full space-y-4 mb-8">
                <a id="ui-call" href="#" class="block w-full bg-[#2d2926] text-[#e9decb] py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-lg opacity-20 pointer-events-none">Llamar Ahora</a>
                <a id="ui-mail" href="#" class="block w-full bg-white text-[#2d2926] py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] border border-[#2d2926]/10 shadow-sm opacity-20 pointer-events-none">Enviar Email</a>
            </div>

            <div class="w-full bg-white/40 backdrop-blur-sm rounded-3xl p-6 mt-auto border border-white/60">
                <p class="text-[9px] font-black uppercase tracking-widest opacity-40 mb-4">Datos de Socio</p>
                <div class="text-left space-y-4">
                    <div>
                        <p class="text-[8px] font-black uppercase opacity-30">Móvil</p>
                        <p id="ui-tel" class="text-sm font-bold opacity-20">---</p>
                    </div>
                    <div>
                        <p class="text-[8px] font-black uppercase opacity-30">Email</p>
                        <p id="ui-email" class="text-sm font-bold truncate opacity-20">---</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        function safeAtob(str) {
            try {
                return decodeURIComponent(Array.prototype.map.call(atob(str), function(c) {
                    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                }).join(''));
            } catch (e) { return null; }
        }

        function initCard() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                let base64 = urlParams.get('v');
                
                if (!base64 && window.location.hash.includes('v=')) {
                    base64 = window.location.hash.split('v=')[1].split('&')[0];
                }

                if (base64) {
                    const decoded = safeAtob(base64);
                    if (decoded) {
                        const data = JSON.parse(decoded);
                        document.getElementById('ui-title').innerText = data.t || 'SOCIO';
                        document.getElementById('ui-name').innerHTML = (data.n || '') + '<br>' + (data.a || '');
                        document.getElementById('ui-name').classList.remove('placeholder-text');
                        document.getElementById('ui-tel').innerText = data.p || '-';
                        document.getElementById('ui-tel').classList.remove('opacity-20');
                        document.getElementById('ui-email').innerText = data.e || '-';
                        document.getElementById('ui-email').classList.remove('opacity-20');
                        
                        const callBtn = document.getElementById('ui-call');
                        callBtn.href = 'tel:' + (data.p ? data.p.replace(/\\s/g, '') : '');
                        callBtn.classList.remove('opacity-20', 'pointer-events-none');
                        
                        const mailBtn = document.getElementById('ui-mail');
                        mailBtn.href = 'mailto:' + (data.e || '');
                        mailBtn.classList.remove('opacity-20', 'pointer-events-none');
                    }
                }
            } catch (e) { console.error(e); }
        }
        window.onload = initCard;
    </script>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `index.html`;
    link.click();
  };

  return (
    <div className="min-h-screen bg-[#f2e9dc] text-[#2d2926] pb-20 font-sans">
      <nav className="sticky top-0 z-50 bg-[#e9decb]/95 backdrop-blur-md border-b border-[#d8cdba] shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-[#2d2926] p-2.5 rounded-xl shadow-lg rotate-3">
              <Shield className="text-[#e9decb] w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-2xl tracking-tighter uppercase block leading-none">Argilers <span className="text-blue-700">Studio</span></span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">Infrastructure v2.4</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black flex items-center gap-3 mb-10">
              <Settings2 className="w-6 h-6 text-blue-600" />
              1. Datos del Socio
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Nombre</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={vCardData.firstName} onChange={(e) => setVCardData({...vCardData, firstName: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Apellidos</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={vCardData.lastName} onChange={(e) => setVCardData({...vCardData, lastName: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Cargo</label>
                <input type="text" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={vCardData.title} onChange={(e) => setVCardData({...vCardData, title: e.target.value.toUpperCase()})} />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Móvil</label>
                <input type="tel" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={vCardData.tel} onChange={(e) => setVCardData({...vCardData, tel: e.target.value})} />
              </div>
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                <input type="email" className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500" value={vCardData.email} onChange={(e) => setVCardData({...vCardData, email: e.target.value})} />
              </div>
            </div>
          </section>

          <section className="bg-white p-8 rounded-[40px] shadow-xl border border-slate-100">
            <h2 className="text-xl font-black flex items-center gap-3 mb-6">
              <Globe className="w-6 h-6 text-blue-600" />
              2. Ubicación de la Plantilla
            </h2>
            
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="url" 
                  className="w-full p-5 pr-32 bg-slate-900 text-blue-400 rounded-2xl text-sm font-mono border-2 border-slate-800" 
                  value={vCardData.baseUrl} 
                  onChange={(e) => setVCardData({...vCardData, baseUrl: e.target.value})}
                  placeholder="https://usuario.github.io/socio/index.html"
                />
                <div className="absolute right-2 top-2 bottom-2 flex gap-1">
                   <button 
                    onClick={() => window.open(vCardData.baseUrl, '_blank')}
                    className="bg-blue-600 text-white px-4 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 hover:bg-blue-500 transition-all"
                   >
                     Verificar <ExternalLink className="w-3 h-3" />
                   </button>
                </div>
              </div>

              <button onClick={exportSmartTemplate} className="w-full bg-slate-900 text-[#e9decb] py-6 rounded-3xl font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 hover:bg-black transition-all">
                <FileCode className="w-5 h-5 text-blue-400" />
                Descargar Plantilla Genérica (index.html)
              </button>
            </div>
          </section>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <section className="bg-white p-10 rounded-[48px] shadow-2xl border border-slate-100 sticky top-24 text-center">
            <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] mb-4">QR Autogenerado</h2>
            
            <div className="bg-[#e9decb] p-8 rounded-[56px] flex flex-col items-center justify-center mb-10 shadow-inner">
              <div className="bg-white p-6 rounded-[40px] shadow-2xl">
                <QRCodeCanvas 
                  value={config.value}
                  size={300}
                  fgColor="#2d2926"
                  bgColor="#ffffff"
                  level="M" 
                  includeMargin={true}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            </div>

            <button onClick={downloadQR} className="w-full bg-[#2d2926] text-[#e9decb] py-6 rounded-[32px] font-black uppercase tracking-widest text-[11px] flex items-center justify-center gap-4 shadow-xl active:scale-95 disabled:opacity-30" disabled={!vCardData.baseUrl}>
              <Download className="w-6 h-6" />
              Descargar Imagen QR
            </button>
          </section>
        </div>
      </main>
    </div>
  );
};

export default App;
