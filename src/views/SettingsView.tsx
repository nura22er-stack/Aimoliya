import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Sparkles, 
  User, 
  Building, 
  Lock, 
  HelpCircle, 
  Check, 
  Database,
  Sliders,
  Bell
} from 'lucide-react';
import { Project } from '../types';

interface SettingsViewProps {
  project: Project;
  projectName: string;
  setProjectName: (name: string) => void;
  userName: string;
  setUserName: (name: string) => void;
  userTariff: 'Starter' | 'Pro' | 'Business';
  setUserTariff: (tariff: 'Starter' | 'Pro' | 'Business') => void;
}

export default function SettingsView({
  project,
  projectName,
  setProjectName,
  userName,
  setUserName,
  userTariff,
  setUserTariff
}: SettingsViewProps) {
  const [taxRate, setTaxRate] = useState('4%');
  const [temperature, setTemperature] = useState(0.7);
  const [currency, setCurrency] = useState('UZS');
  const [savedNotif, setSavedNotif] = useState(false);

  const triggerSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedNotif(true);
    setTimeout(() => {
      setSavedNotif(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-in max-w-4xl">
      
      {savedNotif && (
        <div className="fixed top-20 right-6 bg-[#2D9F6E] text-black font-syne font-bold font-normal text-xs px-4 py-2.5 rounded-lg shadow-xl flex items-center gap-2 z-[9999] animate-in">
          <Check className="w-4 h-4 text-black" />
          <span>Sozlamalar muvaffaqiyatli saqlandi!</span>
        </div>
      )}

      <form onSubmit={triggerSave} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        
        {/* Left column - User profile and business */}
        <div className="card bg-bg-card p-6 md:col-span-7 space-y-5">
          <div className="flex items-center gap-2 border-b border-[#ffffff0a] pb-3 mb-1">
            <Building className="w-5 h-5 text-gold" />
            <h4 className="text-sm font-bold text-[#F0EDE6] font-syne">Profil va Korxona Sozlamalari</h4>
          </div>

          <div className="space-y-4 text-xs font-normal">
            
            {/* User Name input */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5">
                <User className="w-4 h-4 text-zinc-500" />
                Mas'ul Shaxs Ismi Familiyasi
              </label>
              <input 
                type="text"
                required
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-gold"
              />
            </div>

            {/* Business Logo Name */}
            <div className="space-y-1.5">
              <label className="text-zinc-400 font-semibold flex items-center gap-1.5">
                <Building className="w-4 h-4 text-zinc-500" />
                Korxona / Do'kon Savdo Nomi
              </label>
              <input 
                type="text"
                required
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-gold"
              />
            </div>

            {/* Sub settings parameters */}
            <div className="grid grid-cols-2 gap-4">
              {/* Currency */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Valyuta (Currency)</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-gold"
                >
                  <option value="UZS">UZS (So'm)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>

              {/* Tax rate */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold">Aylanmadan Olinadigan Soliq</label>
                <select
                  value={taxRate}
                  onChange={(e) => setTaxRate(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-gold"
                >
                  <option value="4%">Aylanma soliq 4% (Standard)</option>
                  <option value="12%">QQS 12% + Soliqlar</option>
                  <option value="0%">Yagona rejim (0%)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Secure password action mock */}
          <div className="pt-4 border-t border-[#ffffff09] space-y-2">
            <h5 className="text-xs font-bold text-[#F0EDE6] font-syne flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-zinc-500" />
              Tizim Xavfsizligi
            </h5>
            <button 
              type="button" 
              onClick={() => alert("Parolni o'zgartirish havolasi email manzilingizga yuborildi.")}
              className="text-[11px] text-gold hover:text-gold-light font-bold"
            >
              Kirish parolini o'zgartirish →
            </button>
          </div>

          <button 
            type="submit"
            className="btn-gold h-11 text-xs font-syne font-bold w-full cursor-pointer mt-2"
          >
            O'zgarishlarni Saqlash
          </button>
        </div>

        {/* Right column - AI parameters & Tariffs switches */}
        <div className="md:col-span-5 space-y-6 flex flex-col justify-between">
          
          {/* AI Settings sandbox */}
          <div className="card bg-[#0D0D0D] border border-gold/15 p-5 space-y-4">
            <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-gold animate-pulse" />
              AI CFO Robot parametrlari
            </h4>

            <div className="space-y-3.5 text-xs font-normal">
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between text-[11px] text-zinc-400">
                  <span>AI Javob aniqligi (Temperature):</span>
                  <span className="text-gold font-bold font-syne">{temperature}</span>
                </div>
                <input 
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-gold bg-[#161616] h-1 rounded appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[8px] text-zinc-600 uppercase">
                  <span>Konservativ (Mantiqiy)</span>
                  <span>Ijodiy (Kengroq)</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-zinc-400 text-[11px] font-semibold block">AI CFO System Prompt Rolini moslash</label>
                <div className="p-3 bg-[#161616] border border-[#ffffff04] rounded-lg text-[10.5px] text-zinc-400 leading-normal">
                  "Men sizning professional virtual moliyaviy CFO direktoringizman. O'zbekistondagi bozor qoidalari bo'yicha maslahatlar beraman."
                </div>
              </div>
            </div>
          </div>

          {/* Upgrade tariff selection */}
          <div className="card bg-bg-card p-5 space-y-4 flex-1">
            <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne flex items-center gap-1.5">
              <Database className="w-4 h-4 text-zinc-400" />
              Siz tanlagan tarif rejasi
            </h4>

            <div className="space-y-3">
              <div className="p-3 bg-black/40 rounded-lg flex items-center justify-between text-xs border border-dashed border-[#C9A84C40]">
                <div>
                  <span className="text-gold font-bold font-syne block">{userTariff} Plani</span>
                  <p className="text-[10px] text-zinc-500">Barcha CFO modullari to'liq yoqilgan</p>
                </div>
                <span className="badge-gold font-bold text-[9px]">FAOL</span>
              </div>

              <div className="grid grid-cols-3 gap-1.5 p-0.5 bg-[#0A0A0A] border border-[#ffffff04] rounded-lg">
                {(['Starter', 'Pro', 'Business'] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => {
                      setUserTariff(t);
                      alert(`Tarif rejangiz ${t} ga muvaffaqiyatli o'zgartirildi.`);
                    }}
                    className={`py-1.5 text-[9.5px] font-extrabold rounded-md uppercase tracking-wider cursor-pointer ${
                      userTariff === t 
                        ? 'bg-gold text-black' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>

      </form>

    </div>
  );
}
