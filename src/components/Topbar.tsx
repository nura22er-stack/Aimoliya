import React, { useState } from 'react';
import { Menu, Bell, Search, Sparkles } from 'lucide-react';

interface TopbarProps {
  title: string;
  projectName: string;
  userName: string;
  setMobileOpen: (open: boolean) => void;
  onSearch?: (query: string) => void;
}

export default function Topbar({ title, projectName, userName, setMobileOpen, onSearch }: TopbarProps) {
  const [query, setQuery] = useState('');
  const [noticeOpen, setNoticeOpen] = useState(false);

  // Format current Uzbek-styled local date
  const getUzbekDate = () => {
    const today = new Date();
    const months = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
      'Iyul', 'Avgust', 'Sentabr', 'Oktabr', 'Noyabr', 'Dekabr'
    ];
    return `${today.getDate()}-${months[today.getMonth()]}, ${today.getFullYear()}-yil`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    if (!trimmed) return;
    onSearch?.(trimmed);
    setQuery('');
  };

  return (
    <header className="h-16 border-b border-[#ffffff12] bg-[#0A0A0Aee] backdrop-blur flex items-center justify-between px-6 sticky top-0 z-40">
      <div className="flex items-center gap-3">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          className="lg:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#ffffff09] transition-all"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <h2 className="text-sm font-semibold text-[#F0EDE6] tracking-tight">{title}</h2>
          <div className="text-[10.5px] text-zinc-500 font-medium tracking-wide flex items-center gap-1">
            <span>{projectName}</span>
            <span>•</span>
            <span className="text-gold">Virtual CFO faol</span>
          </div>
        </div>
      </div>

      {/* Date in Center */}
      <div className="hidden md:flex items-center justify-center bg-zinc-900/60 border border-[#ffffff06] px-3.5 py-1.5 rounded-full text-xs text-zinc-300 font-medium font-syne">
        <span className="live-dot mr-2" />
        {getUzbekDate()}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Search Bar - Aesthetic */}
        <form onSubmit={handleSearch} className="hidden sm:flex items-center w-48 relative">
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tahlil qidirish..." 
            className="w-full h-[34px] pl-8 pr-3 text-xs bg-zinc-900 border border-zinc-800 focus:border-gold/55 rounded-lg text-zinc-300 outline-none placeholder-zinc-600 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-2.5" />
        </form>

        {/* Dynamic notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setNoticeOpen((open) => !open)}
            className="p-2 rounded-lg bg-[#ffffff03] border border-[#ffffff05] text-zinc-400 hover:text-gold hover:border-gold/30 transition-all cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-gold" />
          </button>
          
          <div className={`absolute right-0 top-[120%] w-72 bg-bg-card border border-[#ffffff15] rounded-xl shadow-xl p-3.5 z-50 animate-in ${noticeOpen ? 'block' : 'hidden'}`}>
            <div className="text-xs font-bold text-[#F0EDE6] border-b border-[#ffffff0f] pb-2 mb-2 flex justify-between items-center">
              <span>Bildirishnomalar</span>
              <span className="text-[10px] text-gold font-bold">Hammasi faol</span>
            </div>
            <div className="space-y-2.5">
              <div className="flex gap-2 text-[11px] text-zinc-300 leading-normal">
                <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 mt-0.5" />
                <p><strong>AI CFO Tavsiyasi:</strong> Kirim va chiqim kiriting, tavsiyalar shu ma'lumot asosida chiqadi.</p>
              </div>
              <div className="flex gap-2 text-[11px] text-zinc-400 leading-normal">
                <span className="live-dot shrink-0 mt-1" />
                <p>Prognoz foydalanuvchi kiritgan ma'lumotlardan keyin hisoblanadi.</p>
              </div>
            </div>
          </div>
        </div>

        {/* User avatar snapshot */}
        <div className="w-[34px] h-[34px] rounded-full bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-xs font-bold font-syne text-[#F0EDE6]">
          {userName.split(' ').map(n => n[0]).join('')}
        </div>
      </div>
    </header>
  );
}
