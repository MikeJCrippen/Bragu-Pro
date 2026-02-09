
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Coffee, 
  Plus, 
  ChevronLeft, 
  Star, 
  Clock, 
  Scale, 
  ArrowUpDown,
  Trash2,
  Calendar,
  ChevronRight,
  Settings2,
  Trophy,
  History,
  TrendingUp,
  LayoutGrid,
  Sparkles,
  Zap,
  Target,
  Download,
  Upload,
  Database,
  X
} from 'lucide-react';
import { Bean, Shot, ViewState, SortOption, OriginType, RoastType } from './types';

const STORAGE_KEY = 'bean_log_data_v1';
const APP_VERSION = 'v0.1';

const App: React.FC = () => {
  const [beans, setBeans] = useState<Bean[]>([]);
  const [shots, setShots] = useState<Shot[]>([]);
  const [view, setView] = useState<ViewState>({ type: 'bean-list' });
  const [sortOption, setSortOption] = useState<SortOption>('rating');
  const [showSettings, setShowSettings] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setBeans(parsed.beans || []);
        setShots(parsed.shots || []);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ beans, shots }));
  }, [beans, shots]);

  const addBean = (bean: Omit<Bean, 'id' | 'createdAt'>) => {
    const newBean: Bean = { ...bean, id: crypto.randomUUID(), createdAt: Date.now() };
    setBeans(prev => [newBean, ...prev]);
    setView({ type: 'bean-list' });
  };

  const deleteBean = (id: string) => {
    if (window.confirm("Archive these beans? All shot logs will be lost.")) {
      setBeans(prev => prev.filter(b => b.id !== id));
      setShots(prev => prev.filter(s => s.beanId !== id));
      setView({ type: 'bean-list' });
    }
  };

  const addShot = (shot: Omit<Shot, 'id' | 'timestamp'>) => {
    const newShot: Shot = { ...shot, id: crypto.randomUUID(), timestamp: Date.now() };
    setShots(prev => [newShot, ...prev]);
    setView({ type: 'bean-details', beanId: shot.beanId });
  };

  const deleteShot = (id: string) => {
    if (window.confirm("Remove this log entry?")) {
      setShots(prev => prev.filter(s => s.id !== id));
    }
  };

  // Data Persistence Helpers
  const exportData = () => {
    const data = JSON.stringify({ beans, shots }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `beanlog-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        const parsed = JSON.parse(result);
        if (parsed.beans && parsed.shots) {
          if (window.confirm("This will overwrite your current logs with the backup data. Proceed?")) {
            setBeans(parsed.beans);
            setShots(parsed.shots);
            setShowSettings(false);
          }
        } else {
          alert("Invalid backup file format.");
        }
      } catch (err) {
        alert("Failed to parse backup file.");
      }
    };
    reader.readAsText(file);
  };

  const BeanList = () => {
    return (
      <div className="max-w-xl mx-auto px-6 py-8 pb-32 fade-in min-h-screen">
        <header className="flex justify-between items-end mb-12">
          <div>
            <span className="text-[10px] font-black tracking-[0.4em] text-amber-500/60 uppercase">Laboratory</span>
            <h1 className="text-5xl font-display text-white mt-1">Collections</h1>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowSettings(true)}
              className="btn-secondary w-14 h-14 rounded-full flex items-center justify-center text-stone-500 active:scale-90 transition-all"
            >
              <Database size={24} />
            </button>
            <button 
              onClick={() => setView({ type: 'add-bean' })}
              className="btn-primary w-14 h-14 rounded-full flex items-center justify-center text-black active:scale-90 transition-all"
            >
              <Plus size={28} strokeWidth={3} />
            </button>
          </div>
        </header>

        {beans.length > 0 && (
          <div className="glass-card rounded-[40px] p-8 mb-12 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
               <Sparkles size={120} className="text-amber-500" />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-2">
                <Zap size={14} className="text-amber-400 fill-amber-400" />
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Active Stock</span>
              </div>
              <h2 className="text-3xl font-display text-white mb-6">Master Portfolio</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                  <p className="text-[9px] font-black text-stone-500 uppercase mb-1">Total Collections</p>
                  <p className="text-2xl font-display text-white">{beans.length}</p>
                </div>
                <div className="bg-white/5 rounded-3xl p-5 border border-white/5">
                  <p className="text-[9px] font-black text-stone-500 uppercase mb-1">Total Extractions</p>
                  <p className="text-2xl font-display text-white">{shots.length}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {beans.length === 0 ? (
          <div className="mt-12 text-center py-20">
            <div className="w-24 h-24 bg-white/5 rounded-[40px] flex items-center justify-center mx-auto mb-8 border border-white/5 shadow-2xl">
              <Coffee className="text-amber-500 w-12 h-12 opacity-50" />
            </div>
            <h3 className="text-2xl font-display text-white mb-3">No Beans Logged</h3>
            <p className="text-stone-500 text-sm max-w-xs mx-auto mb-10 leading-relaxed font-medium">Add your first specialty coffee to begin your extraction journey.</p>
            <button 
              onClick={() => setView({ type: 'add-bean' })}
              className="btn-primary px-10 py-5 rounded-[2rem] font-bold text-black tracking-widest text-[11px] active:scale-95 transition-all"
            >
              INITIALIZE ARCHIVE
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[10px] font-black text-stone-600 uppercase tracking-[0.3em]">Vault Holdings</h2>
              <LayoutGrid size={16} className="text-stone-800" />
            </div>
            <div className="grid gap-5">
              {beans.map(bean => {
                const bShots = shots.filter(s => s.beanId === bean.id);
                const avgRating = bShots.length > 0 ? (bShots.reduce((a, s) => a + s.rating, 0) / bShots.length).toFixed(1) : null;
                const bestShot = bShots.sort((a, b) => b.rating - a.rating)[0];

                return (
                  <button
                    key={bean.id}
                    onClick={() => setView({ type: 'bean-details', beanId: bean.id })}
                    className="glass-card p-6 rounded-[38px] flex items-center text-left hover:border-amber-500/30 transition-all group active:scale-[0.98] shadow-2xl"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md">
                          {bean.roastType}
                        </span>
                        {avgRating && (
                          <div className="flex items-center gap-1 text-[10px] font-bold text-amber-200">
                            <Star size={10} className="fill-amber-500 text-amber-500" />
                            {avgRating}
                          </div>
                        )}
                      </div>
                      <h3 className="text-2xl font-display text-white mb-0.5 leading-tight">{bean.name}</h3>
                      <p className="text-stone-500 text-sm font-semibold">{bean.roaster}</p>
                      
                      <div className="flex gap-4 mt-6">
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-stone-600 uppercase mb-1">Best Ratio</span>
                           <span className="text-xs font-bold text-stone-300">{bestShot ? `${bestShot.dose}g → ${bestShot.yield}g` : '--'}</span>
                        </div>
                        <div className="w-px h-8 bg-white/5" />
                        <div className="flex flex-col">
                           <span className="text-[8px] font-black text-stone-600 uppercase mb-1">Time</span>
                           <span className="text-xs font-bold text-stone-300">{bestShot ? `${bestShot.time}s` : '--'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-white/[0.03] border border-white/5 flex items-center justify-center text-stone-600 group-hover:text-amber-500 group-hover:scale-110 transition-all">
                      <ChevronRight size={24} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Backup/Vault Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-10 bg-black/80 backdrop-blur-sm fade-in">
             <div className="glass-card w-full max-w-md rounded-[48px] p-10 space-y-8 relative shadow-[0_-20px_60px_rgba(0,0,0,0.5)]">
                <button 
                  onClick={() => setShowSettings(false)}
                  className="absolute top-6 right-6 w-10 h-10 bg-white/5 rounded-full flex items-center justify-center text-stone-500"
                >
                  <X size={20} />
                </button>
                
                <div className="text-center">
                  <Database size={40} className="text-amber-500 mx-auto mb-4" />
                  <h3 className="text-2xl font-display text-white">Data Vault</h3>
                  <p className="text-stone-500 text-sm mt-2 font-medium leading-relaxed">Ensure your extraction logs never fade away. Sync or restore from external cold storage.</p>
                </div>

                <div className="space-y-4">
                  <button 
                    onClick={exportData}
                    className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">Create Backup</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Export JSON Archive</p>
                    </div>
                    <Download className="text-stone-500 group-hover:text-amber-500" />
                  </button>

                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full flex items-center justify-between p-6 bg-white/5 border border-white/5 rounded-3xl hover:bg-white/10 transition-all group"
                  >
                    <div className="text-left">
                      <p className="text-white font-bold text-sm">Restore Data</p>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Upload Archive File</p>
                    </div>
                    <Upload className="text-stone-500 group-hover:text-amber-500" />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />
                </div>
                
                <div className="pt-4 flex flex-col items-center">
                  <p className="text-[9px] text-stone-700 text-center font-black uppercase tracking-[0.3em] mb-2">Hardware Persistence: Active</p>
                  <span className="text-[8px] font-black text-amber-500/40 tracking-widest uppercase">{APP_VERSION}</span>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  const AddBeanForm = () => {
    const [formData, setFormData] = useState({
      roaster: '', name: '', originType: 'Single Origin' as OriginType, roastType: 'Medium' as RoastType, tastingNotes: ''
    });

    return (
      <div className="max-w-xl mx-auto px-6 py-8 pb-32 fade-in min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-16">
          <button onClick={() => setView({ type: 'bean-list' })} className="btn-secondary w-14 h-14 rounded-[24px] flex items-center justify-center text-stone-500 active:scale-90 transition-transform">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Initialize Bag</h2>
          <div className="w-14 h-14" />
        </header>

        <form onSubmit={e => { e.preventDefault(); addBean(formData); }} className="space-y-10 flex-1">
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-stone-600 uppercase tracking-[0.2em] ml-2">Collection Identity</label>
              <div className="glass-card p-6 rounded-[40px] space-y-6 shadow-2xl">
                <input 
                  required type="text" placeholder="Roaster (e.g. Origin Coffee)"
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-3xl p-5 font-bold text-white placeholder:text-stone-700 outline-none focus:border-amber-500/30 transition-all"
                  value={formData.roaster} onChange={e => setFormData({ ...formData, roaster: e.target.value })}
                />
                <input 
                  required type="text" placeholder="Bean Name / Variety"
                  className="w-full bg-white/[0.03] border border-white/[0.05] rounded-3xl p-5 font-bold text-white placeholder:text-stone-700 outline-none focus:border-amber-500/30 transition-all"
                  value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
               <div className="glass-card p-6 rounded-[40px] shadow-2xl">
                  <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 block">Classification</label>
                  <div className="space-y-3">
                    {['Single Origin', 'Blend'].map(t => (
                      <button 
                        key={t} type="button"
                        onClick={() => setFormData({...formData, originType: t as OriginType})}
                        className={`w-full text-center py-4 rounded-2xl text-[10px] font-black tracking-widest transition-all ${formData.originType === t ? 'bg-amber-600 text-black shadow-lg shadow-amber-600/20' : 'text-stone-500 bg-white/5 hover:bg-white/10'}`}
                      >
                        {t.toUpperCase()}
                      </button>
                    ))}
                  </div>
               </div>
               <div className="glass-card p-6 rounded-[40px] shadow-2xl">
                  <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 block">Roast State</label>
                  <div className="space-y-2 max-h-[140px] overflow-y-auto pr-2">
                    {['Light', 'Light-Medium', 'Medium', 'Medium-Dark', 'Dark'].map(r => (
                      <button 
                        key={r} type="button"
                        onClick={() => setFormData({...formData, roastType: r as RoastType})}
                        className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-bold transition-all ${formData.roastType === r ? 'bg-white/10 text-amber-500' : 'text-stone-600 hover:text-stone-400'}`}
                      >
                        {r}
                      </button>
                    ))}
                  </div>
               </div>
            </div>

            <div className="glass-card p-8 rounded-[44px] shadow-2xl">
              <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-4 block">Sensory Profile</label>
              <textarea 
                rows={3} placeholder="Describe the roaster notes..."
                className="w-full bg-white/[0.02] border-none rounded-3xl p-5 text-sm font-medium placeholder:text-stone-800 outline-none text-white italic"
                value={formData.tastingNotes} onChange={e => setFormData({ ...formData, tastingNotes: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn-primary w-full py-6 rounded-[2.5rem] font-black text-[12px] tracking-[0.2em] active:scale-95 transition-all text-black uppercase mb-12">
            Register Collection
          </button>
        </form>
      </div>
    );
  };

  const BeanDetails = ({ beanId }: { beanId: string }) => {
    const bean = beans.find(b => b.id === beanId);
    if (!bean) return null;

    const bShots = shots.filter(s => s.beanId === beanId);
    const sortedShots = useMemo(() => {
      const copy = [...bShots];
      return sortOption === 'rating' ? copy.sort((a, b) => b.rating - a.rating) : copy.sort((a, b) => b.timestamp - a.timestamp);
    }, [bShots, sortOption]);

    const bestShot = bShots.length > 0 ? [...bShots].sort((a, b) => b.rating - a.rating)[0] : null;

    return (
      <div className="min-h-screen bg-[#050505] fade-in pb-32">
        <div className="relative h-[45vh] overflow-hidden rounded-b-[64px] border-b border-white/5">
           <div className="absolute inset-0 bg-gradient-to-b from-amber-950/20 to-[#050505] z-0" />
           <div className="absolute top-20 right-[-10%] opacity-5 rotate-12">
              <Coffee size={400} strokeWidth={0.5} color="white" />
           </div>
           
           <div className="relative z-10 p-8 h-full flex flex-col justify-between">
              <div className="flex justify-between items-center">
                <button onClick={() => setView({ type: 'bean-list' })} className="btn-secondary w-12 h-12 rounded-2xl flex items-center justify-center text-white active:scale-90 transition-all">
                  <ChevronLeft size={24} />
                </button>
                <button onClick={() => deleteBean(bean.id)} className="w-12 h-12 bg-red-500/10 rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all">
                  <Trash2 size={20} />
                </button>
              </div>

              <div className="pb-8">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.5em] mb-4 block">{bean.roaster}</span>
                <h1 className="text-6xl font-display text-white mb-6 leading-tight drop-shadow-2xl">{bean.name}</h1>
                <div className="flex gap-3">
                  <span className="bg-white/5 border border-white/10 text-stone-300 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-wider">{bean.originType}</span>
                  <span className="bg-white/5 border border-white/10 text-stone-300 text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-wider">{bean.roastType}</span>
                </div>
              </div>
           </div>
        </div>

        <div className="max-w-xl mx-auto px-6 -mt-20 relative z-20 space-y-12">
           <div className="glass-card p-10 rounded-[56px] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] border-white/10">
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-2xl flex items-center justify-center text-black shadow-lg shadow-amber-500/20">
                    <Trophy size={20} strokeWidth={3} />
                  </div>
                  <h3 className="text-[11px] font-black text-white uppercase tracking-[0.3em]">Golden Extraction</h3>
                </div>
                {bestShot && (
                  <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-2xl font-display text-amber-500">{bestShot.rating}</span>
                    <span className="text-[10px] text-stone-600 font-bold ml-1">/10</span>
                  </div>
                )}
              </div>
              
              {bestShot ? (
                <div className="grid grid-cols-3 gap-8">
                  <div className="space-y-2">
                    <p className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Dose</p>
                    <p className="text-4xl font-display text-white">{bestShot.dose}<span className="text-xs text-stone-700 ml-1">g</span></p>
                  </div>
                  <div className="space-y-2 border-l border-white/5 pl-8">
                    <p className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Yield</p>
                    <p className="text-4xl font-display text-white">{bestShot.yield}<span className="text-xs text-stone-700 ml-1">g</span></p>
                  </div>
                  <div className="space-y-2 border-l border-white/5 pl-8">
                    <p className="text-[9px] font-black text-stone-600 uppercase tracking-widest">Time</p>
                    <p className="text-4xl font-display text-white">{bestShot.time}<span className="text-xs text-stone-700 ml-1">s</span></p>
                  </div>
                </div>
              ) : (
                <div className="py-10 text-center text-stone-600 text-sm font-medium italic">No extractions logged in the vault yet.</div>
              )}

              {bean.tastingNotes && (
                 <div className="mt-10 pt-8 border-t border-white/5 flex gap-4">
                    <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center flex-shrink-0">
                       <Sparkles size={18} className="text-amber-500/40" />
                    </div>
                    <p className="text-sm font-medium text-stone-400 italic leading-relaxed">"{bean.tastingNotes}"</p>
                 </div>
              )}
           </div>

           <div className="space-y-8">
              <div className="flex items-center justify-between px-2">
                <div className="flex items-center gap-3">
                  <History size={18} className="text-stone-800" />
                  <h3 className="text-[11px] font-black text-stone-700 uppercase tracking-[0.4em]">Activity Log</h3>
                </div>
                <button 
                  onClick={() => setSortOption(prev => prev === 'rating' ? 'recent' : 'rating')}
                  className="w-12 h-12 bg-white/5 rounded-[20px] border border-white/5 flex items-center justify-center text-stone-500 active:bg-amber-500/10 active:text-amber-500 transition-all"
                >
                  <ArrowUpDown size={18} />
                </button>
              </div>

              <div className="space-y-6">
                {sortedShots.map(shot => (
                  <div key={shot.id} className="glass-card p-8 rounded-[48px] border-white/5 group">
                    <div className="flex justify-between items-start mb-10">
                      <div>
                        <div className="flex gap-1 mb-3">
                          {[...Array(10)].map((_, i) => (
                            <div key={i} className={`w-4 h-1.5 rounded-full ${i < shot.rating ? 'bg-amber-500' : 'bg-white/5'}`} />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-stone-700 uppercase tracking-widest">
                          {new Date(shot.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <button onClick={() => deleteShot(shot.id)} className="w-10 h-10 rounded-2xl flex items-center justify-center text-stone-800 hover:text-red-900 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-4 gap-4 p-5 bg-white/[0.02] border border-white/5 rounded-[32px] mb-6">
                      <div className="text-center">
                        <span className="text-[8px] font-black text-stone-700 uppercase block mb-1">In</span>
                        <span className="text-xs font-bold text-stone-200">{shot.dose}g</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[8px] font-black text-stone-700 uppercase block mb-1">Out</span>
                        <span className="text-xs font-bold text-stone-200">{shot.yield}g</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[8px] font-black text-stone-700 uppercase block mb-1">Time</span>
                        <span className="text-xs font-bold text-stone-200">{shot.time}s</span>
                      </div>
                      <div className="text-center">
                        <span className="text-[8px] font-black text-amber-500/50 uppercase block mb-1">Grind</span>
                        <span className="text-xs font-black text-amber-500">{shot.grindSetting || '--'}</span>
                      </div>
                    </div>

                    {shot.notes && (
                      <div className="bg-white/[0.01] p-5 rounded-3xl border border-white/5">
                        <p className="text-xs text-stone-500 leading-relaxed font-medium italic">"{shot.notes}"</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
           </div>
        </div>

        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-40">
          <button 
            onClick={() => setView({ type: 'add-shot', beanId })}
            className="btn-primary h-20 px-12 rounded-[2.5rem] shadow-2xl flex items-center gap-4 active:scale-95 transition-all text-black"
          >
            <Zap size={24} strokeWidth={3} />
            <span className="font-black tracking-[0.2em] text-[12px] uppercase">Initialize Pull</span>
          </button>
        </div>
      </div>
    );
  };

  const AddShotForm = ({ beanId }: { beanId: string }) => {
    const lastShot = shots.filter(s => s.beanId === beanId)[0];
    const [formData, setFormData] = useState({
      beanId, dose: lastShot?.dose || 18, yield: lastShot?.yield || 36, time: lastShot?.time || 30, grindSetting: lastShot?.grindSetting || '', rating: 7, notes: ''
    });

    const updateVal = (key: 'dose' | 'yield' | 'time', delta: number) => {
      setFormData(prev => ({ ...prev, [key]: Math.max(0, parseFloat((prev[key] + delta).toFixed(1))) }));
    };

    return (
      <div className="max-w-xl mx-auto px-6 py-8 pb-32 fade-in min-h-screen flex flex-col">
        <header className="flex items-center justify-between mb-16">
          <button onClick={() => setView({ type: 'bean-details', beanId })} className="btn-secondary w-14 h-14 rounded-[24px] flex items-center justify-center text-stone-500">
            <ChevronLeft size={28} />
          </button>
          <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Log Protocol</h2>
          <div className="w-14 h-14" />
        </header>

        <form onSubmit={e => { e.preventDefault(); addShot(formData); }} className="space-y-8 flex-1">
          <div className="glass-card p-10 rounded-[56px] border-white/10 space-y-16 shadow-2xl">
            <div className="grid grid-cols-2 gap-12">
              <div className="text-center space-y-8">
                <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest block">Dose (G)</label>
                <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-[32px] border border-white/5">
                  <button type="button" onClick={() => updateVal('dose', -0.1)} className="w-12 h-12 bg-black rounded-2xl text-2xl font-bold text-stone-500">-</button>
                  <span className="text-4xl font-display text-white">{formData.dose}</span>
                  <button type="button" onClick={() => updateVal('dose', 0.1)} className="w-12 h-12 bg-black rounded-2xl text-2xl font-bold text-stone-500">+</button>
                </div>
              </div>
              <div className="text-center space-y-8">
                <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest block">Yield (G)</label>
                <div className="flex items-center justify-between bg-white/[0.03] p-3 rounded-[32px] border border-white/5">
                  <button type="button" onClick={() => updateVal('yield', -0.5)} className="w-12 h-12 bg-black rounded-2xl text-2xl font-bold text-stone-500">-</button>
                  <span className="text-4xl font-display text-white">{formData.yield}</span>
                  <button type="button" onClick={() => updateVal('yield', 0.5)} className="w-12 h-12 bg-black rounded-2xl text-2xl font-bold text-stone-500">+</button>
                </div>
              </div>
            </div>

            <div className="text-center space-y-10">
              <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest block">Extraction Duration</label>
              <div className="flex items-center justify-center gap-16">
                <button type="button" onClick={() => updateVal('time', -1)} className="w-20 h-20 bg-white/[0.03] rounded-[32px] border border-white/5 text-4xl font-bold text-stone-600">-</button>
                <div className="text-center">
                  <span className="text-8xl font-display text-white leading-none block">{formData.time}</span>
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Seconds</span>
                </div>
                <button type="button" onClick={() => updateVal('time', 1)} className="w-20 h-20 bg-white/[0.03] rounded-[32px] border border-white/5 text-4xl font-bold text-stone-600">+</button>
              </div>
            </div>
          </div>

          <div className="glass-card p-10 rounded-[56px] border-white/10 space-y-8 shadow-2xl">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500">
                <Settings2 size={20} />
              </div>
              <label className="text-[10px] font-black text-stone-500 uppercase tracking-widest">Grind Geometry</label>
            </div>
            <input 
              type="text" placeholder="e.g. 1.2.4 or Medium-Fine"
              className="w-full bg-white/[0.02] border border-white/10 rounded-[32px] p-6 font-display text-3xl placeholder:text-stone-900 outline-none text-amber-500 focus:ring-1 ring-amber-500/30"
              value={formData.grindSetting} onChange={e => setFormData({ ...formData, grindSetting: e.target.value })}
            />
          </div>

          <div className="bg-[#1F1512]/50 p-10 rounded-[56px] border border-amber-900/20 space-y-10 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
            <div className="flex justify-between items-end">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.4em] mb-2 block">Quality Result</span>
                <h3 className="text-5xl font-display text-white">Score</h3>
              </div>
              <span className="text-6xl font-display text-amber-500">{formData.rating}<span className="text-sm text-amber-900 ml-2 font-bold uppercase">/10</span></span>
            </div>
            <div className="flex justify-between gap-1">
              {[...Array(10)].map((_, i) => (
                <button
                  key={i} type="button"
                  onClick={() => setFormData({ ...formData, rating: i + 1 })}
                  className={`flex-1 h-16 rounded-[20px] transition-all flex items-center justify-center border ${formData.rating >= i + 1 ? 'bg-amber-600 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.4)] scale-105' : 'bg-white/5 border-white/5 opacity-50'}`}
                >
                  <Target size={18} className={`${formData.rating >= i + 1 ? 'text-black fill-black' : 'text-stone-700'}`} />
                </button>
              ))}
            </div>
          </div>

          <div className="glass-card p-10 rounded-[56px] border-white/10 shadow-2xl">
            <label className="text-[10px] font-black text-stone-600 uppercase tracking-widest mb-6 block">Subjective Notes</label>
            <textarea 
              rows={4} placeholder="Describe the mouthfeel, acidity, sweetness..."
              className="w-full bg-white/[0.01] border-none rounded-[32px] p-6 text-base font-medium outline-none text-white italic"
              value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <button type="submit" className="btn-primary w-full py-8 rounded-[3rem] font-black text-[13px] tracking-[0.3em] shadow-2xl active:scale-95 transition-all text-black uppercase mb-20">
            Commit Extraction
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#050505] select-none text-stone-100 overflow-x-hidden">
      {view.type === 'bean-list' && <BeanList />}
      {view.type === 'add-bean' && <AddBeanForm />}
      {view.type === 'bean-details' && <BeanDetails beanId={view.beanId} />}
      {view.type === 'add-shot' && <AddShotForm beanId={view.beanId} />}
    </div>
  );
};

export default App;
