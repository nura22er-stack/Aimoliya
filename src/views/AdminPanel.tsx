import React, { useEffect, useState } from 'react';
import { 
  Users, 
  ShieldAlert, 
  DollarSign, 
  TrendingUp, 
  Zap, 
  Search, 
  Filter, 
  Plus, 
  Activity, 
  UserX,
  UserCheck,
  Edit3,
  Eye,
  ChevronLeft,
  ChevronRight,
  Clock,
  Sparkles,
  Bell,
  CreditCard,
  Database
} from 'lucide-react';
import { AppUser, ViewType } from '../types';

type AdminSection = 'dashboard' | 'users' | 'billing' | 'notifications' | 'database';

interface AdminPanelProps {
  section?: Extract<ViewType, 'admin-dashboard' | 'admin-users' | 'admin-billing' | 'admin-notif' | 'admin-db'>;
  currentUser?: AppUser;
}

function sectionToTab(section?: AdminPanelProps['section']): AdminSection {
  switch (section) {
    case 'admin-users':
      return 'users';
    case 'admin-billing':
      return 'billing';
    case 'admin-notif':
      return 'notifications';
    case 'admin-db':
      return 'database';
    default:
      return 'dashboard';
  }
}

export default function AdminPanel({ section = 'admin-dashboard', currentUser }: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<AdminSection>(sectionToTab(section));
  const [search, setSearch] = useState('');
  const [filterTariff, setFilterTariff] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  
  // Custom dialog targets
  const [viewingUser, setViewingUser] = useState<AppUser | null>(null);

  useEffect(() => {
    setActiveTab(sectionToTab(section));
  }, [section]);

  const adminTabs: Array<{ id: AdminSection; label: string; icon: React.ElementType }> = [
    { id: 'dashboard', label: 'Admin Dashboard', icon: Activity },
    { id: 'users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'billing', label: 'Obunalar va To\'lovlar', icon: CreditCard },
    { id: 'notifications', label: 'Bildirishnomalar', icon: Bell },
    { id: 'database', label: 'Ma\'lumotlar Bazasi', icon: Database }
  ];

  // Admin data starts empty. Real users should come from backend storage.
  const [users, setUsers] = useState<AppUser[]>(currentUser ? [currentUser] : []);

  // Activity feed
  const [logs, setLogs] = useState<Array<{ time: string; msg: string; type: string }>>([]);

  // Filtered users lists
  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchesTariff = filterTariff === 'All' || u.tariff === filterTariff;
    const matchesStatus = filterStatus === 'All' || u.status === filterStatus;
    return matchesSearch && matchesTariff && matchesStatus;
  });

  const activeUsers = users.filter(u => u.status === 'Aktiv').length;
  const proUsers = users.filter(u => u.tariff === 'Pro').length;
  const businessUsers = users.filter(u => u.tariff === 'Business').length;
  const paidUsers = proUsers + businessUsers;
  const platformRevenue = 0;
  const churnRate = users.length > 0 ? '0%' : '0%';

  const handleUpdateStatus = (userId: string, targetStatus: 'Aktiv' | 'Muzlatilgan' | 'Bloklangan') => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: targetStatus } : u));
    setLogs(prev => [
      { time: "Hozir", msg: `Foydalanuvchi #${userId} statusi ${targetStatus} ga o'zgartirildi`, type: "info" },
      ...prev
    ]);
    if (viewingUser && viewingUser.id === userId) {
      setViewingUser(prev => prev ? { ...prev, status: targetStatus } : null);
    }
  };

  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserTariff, setNewUserTariff] = useState<'Starter' | 'Pro' | 'Business'>('Starter');

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (newUserName.trim() && newUserEmail.trim()) {
      const newUser: AppUser = {
        id: (1001 + users.length).toString(),
        name: newUserName.trim(),
        email: newUserEmail.trim(),
        role: 'user',
        tariff: newUserTariff,
        registeredAt: new Date().toISOString().split('T')[0],
        status: 'Aktiv',
        lastActive: 'Hozirgina'
      };
      setUsers([newUser, ...users]);
      setLogs([{ time: "Hozir", msg: `Yangi foydalanuvchi ${newUser.name} qo'shildi`, type: "register" }, ...logs]);
      setNewUserName('');
      setNewUserEmail('');
      setShowAddUserModal(false);
    }
  };

  return (
    <div className="bg-[#080808] text-[#F0EDE6] min-h-screen selection:bg-[#C0392B]/30 animate-in">
      
      {/* Top Section Tab Selectors */}
      <div className="flex overflow-x-auto border-b border-[#ffffff0a] pb-px">
        {adminTabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-[18px] text-xs uppercase tracking-wider font-extrabold border-b-2 font-syne cursor-pointer transition-all whitespace-nowrap flex items-center gap-2 ${
                activeTab === tab.id
                  ? 'text-[#C0392B] border-[#C0392B] bg-[#C0392B]/5'
                  : 'text-zinc-500 hover:text-zinc-300 border-transparent'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
              {tab.id === 'users' ? ` (${users.length})` : ''}
            </button>
          );
        })}
      </div>
      <div className="hidden">
        <button
          onClick={() => setActiveTab('dashboard')}
          className={`px-6 py-[18px] text-xs uppercase tracking-wider font-extrabold border-b-2 font-syne cursor-pointer transition-all ${
            activeTab === 'dashboard'
              ? 'text-[#C0392B] border-[#C0392B] bg-[#C0392B]/5'
              : 'text-zinc-500 hover:text-zinc-300 border-transparent'
          }`}
        >
          ■ Admin Dashboard
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`px-6 py-[18px] text-xs uppercase tracking-wider font-extrabold border-b-2 font-syne cursor-pointer transition-all ${
            activeTab === 'users'
              ? 'text-[#C0392B] border-[#C0392B] bg-[#C0392B]/5'
              : 'text-zinc-500 hover:text-zinc-300 border-transparent'
          }`}
        >
          👥 Foydalanuvchilar ({users.length})
        </button>
      </div>

      {activeTab === 'dashboard' ? (
        <div className="p-6 space-y-6">
          {/* Top Admin KPI metrics (5 cards) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            {/* Card 1 */}
            <div className="bg-[#0d0d0d] border border-[#ffffff0a] p-[18px] rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Jami Foydalanuvchilar</span>
              <div className="text-2xl font-bold font-syne text-[#F0EDE6]">{users.length.toLocaleString('uz-UZ')} ta</div>
              <span className="text-[10px] text-[#2D9F6E] font-bold">0% o'sish</span>
            </div>

            {/* Card 2 */}
            <div className="bg-[#0d0d0d] border border-[#ffffff0a] p-[18px] rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Bugun faol binoan</span>
              <div className="text-2xl font-bold font-syne text-[#F0EDE6]">{activeUsers.toLocaleString('uz-UZ')} ta</div>
              <span className="text-[10px] text-zinc-500 font-normal">0% faollik</span>
            </div>

            {/* Card 3 */}
            <div className="bg-[#0d0d0d] border border-[#ffffff0a] p-[18px] rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Oylik platforma daromadi</span>
              <div className="text-2xl font-bold font-syne text-gold">{platformRevenue.toLocaleString('uz-UZ')} UZS</div>
              <span className="text-[10px] text-zinc-500 font-normal">Faqat Pro va Biznes</span>
            </div>

            {/* Card 4 */}
            <div className="bg-[#0d0d0d] border border-gold/15 p-[18px] rounded-xl space-y-1 relative overflow-hidden">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Pro obunachilar</span>
              <div className="text-2xl font-bold font-syne text-gold-light">{paidUsers.toLocaleString('uz-UZ')} obuna</div>
              <span className="text-[10px] text-gold font-bold">0% konversiya</span>
            </div>

            {/* Card 5 */}
            <div className="bg-[#0d0d0d] border border-[#ffffff0a] p-[18px] rounded-xl space-y-1">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Talofat / Churn Rate</span>
              <div className="text-2xl font-bold font-syne text-[#C0392B]">{churnRate}</div>
              <span className="text-[10px] text-zinc-500 font-normal">Ma'lumot yo'q</span>
            </div>
          </div>

          {/* 3 columns grid visual elements */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            
            {/* Col 1 - Activity feed stream log */}
            <div className="bg-[#0D0D0D] border border-[#ffffff10] p-5 rounded-xl lg:col-span-4 flex flex-col justify-between space-y-4">
              <div className="border-b border-[#ffffff0c] pb-3">
                <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne flex items-center gap-2">
                  <Activity className="text-[#C0392B] w-[18px] h-[18px] animate-pulse shrink-0" />
                  Real-vaqt faoliyat lenti
                </h4>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto max-h-[290px] pr-1 py-1">
                {logs.length === 0 ? (
                  <div className="h-full min-h-32 flex items-center justify-center text-xs text-zinc-600 text-center">
                    Hozircha faoliyat yozuvlari yo'q.
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="flex gap-2.5 text-xs items-start">
                      <span className="text-zinc-600 font-syne font-bold shrink-0 mt-0.5">{log.time}</span>
                      <div className="min-w-0 flex-1 leading-normal">
                        <p className={`font-normal ${
                          log.type === 'danger' 
                            ? 'text-[#C0392B]' 
                            : log.type === 'success' 
                            ? 'text-[#2D9F6E]' 
                            : 'text-zinc-350'
                        }`}>
                          {log.msg}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 border-t border-[#ffffff0c] text-center text-[10px] text-zinc-600 font-semibold uppercase">
                YUKLAMA 0% • SYSTEM ONLINE
              </div>
            </div>

            {/* Col 2 - Growth Chart SVG free vs pro */}
            <div className="bg-[#0D0D0D] border border-[#ffffff10] p-5 rounded-xl lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between border-b border-[#ffffff0c] pb-3">
                <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne">Foydalanuvchilar o'sishi</h4>
                <div className="flex gap-2.5 text-[10px] font-bold">
                  <span className="text-zinc-400">● Bepul</span>
                  <span className="text-gold">● Pro / Biznes</span>
                </div>
              </div>

              {/* Graphical simulation representation */}
              <div className="h-44 w-full pt-1">
                <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
                  {/* Grid lines */}
                  <line x1="0" y1="10" x2="100" y2="10" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />
                  <line x1="0" y1="30" x2="100" y2="30" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5" />

                  {/* Curve 1: Free Users */}
                  <path 
                    d="M 5,35 Q 25,28 45,22 T 85,12 T 95,6" 
                    fill="none" 
                    stroke="rgba(255,255,255,0.18)" 
                    strokeWidth="1.5" 
                  />

                  {/* Curve 2: Pro Users */}
                  <path 
                    d="M 5,38 Q 25,32 45,28 T 85,18 T 95,9" 
                    fill="none" 
                    stroke="#C9A84C" 
                    strokeWidth="2.2" 
                  />

                  {/* Points */}
                  <circle cx="95" cy="6" r="1.2" fill="#fff" />
                  <circle cx="95" cy="9" r="1.5" fill="#C9A84C" />
                </svg>
              </div>

              <div className="flex justify-between text-[10px] text-zinc-500 font-semibold pt-1 border-t border-[#ffffff0a]">
                <span>Yanvar</span>
                <span>Mart</span>
                <span>May</span>
                <span>Iyun (Hozir)</span>
              </div>
            </div>

            {/* Col 3 - Top users scoreboard */}
            <div className="bg-[#0D0D0D] border border-[#ffffff10] p-5 rounded-xl lg:col-span-3 flex flex-col justify-between space-y-3">
              <div className="border-b border-[#ffffff09] pb-2">
                <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne">Top korxonalar</h4>
              </div>

              <div className="space-y-3 flex-1 overflow-y-auto max-h-[220px]">
                <div className="flex justify-between text-[10.5px] border-b border-[#ffffff04] pb-1 font-bold text-zinc-500">
                  <span>Ism</span>
                  <span>Tranzaksiyalar</span>
                </div>

                {users.length === 0 ? (
                  <div className="py-8 text-center text-xs text-zinc-600">
                    Hozircha korxonalar yo'q.
                  </div>
                ) : (
                  users.slice(0, 4).map((user) => (
                    <div key={user.id} className="flex justify-between text-xs py-1">
                      <span className="font-semibold text-zinc-300">{user.name}</span>
                      <span className="font-bold text-zinc-500">0 k/ch/oy</span>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t border-[#ffffff0a] pt-2 text-center text-[10px]">
                <span className="text-zinc-600">Joriy oylik tahlil oqimi</span>
              </div>
            </div>
          </div>
        </div>
      ) : activeTab === 'users' ? (
        /* Users List Management */
        <div className="p-6 space-y-6">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            {/* Search inputs and Filters */}
            <div className="flex-1 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <input 
                  type="text" 
                  placeholder="Ism yoki email qidirish..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-10 pl-9 pr-4 bg-[#0d0d0d] border border-[#ffffff10] focus:border-[#C0392B]/50 rounded-lg text-xs outline-none"
                />
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
              </div>

              {/* Tariff Filter */}
              <div className="flex gap-2">
                <select
                  value={filterTariff}
                  onChange={(e) => setFilterTariff(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d0d0d] border border-[#ffffff10] text-xs outline-none font-semibold text-zinc-300"
                >
                  <option value="All">Barcha Tariflar</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                  <option value="Starter">Starter</option>
                </select>

                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="h-10 px-3 rounded-lg bg-[#0d0d0d] border border-[#ffffff10] text-xs outline-none font-semibold text-zinc-300"
                >
                  <option value="All">Barcha holatdagilar</option>
                  <option value="Aktiv">Aktiv</option>
                  <option value="Muzlatilgan">Muzlatilgan</option>
                  <option value="Bloklangan">Bloklangan</option>
                </select>
              </div>
            </div>

            {/* Add User trigger btn */}
            <button
              onClick={() => setShowAddUserModal(true)}
              className="bg-[#C0392B] hover:bg-red-700 text-[#0A0A0A] h-10 px-4 rounded-lg text-xs font-bold font-syne flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#0A0A0A]" />
              Foydalanuvchi Qo'shish
            </button>
          </div>

          {/* Table display */}
          <div className="bg-[#0D0D0D] border border-[#ffffff0a] rounded-xl overflow-x-auto">
            <table className="w-full text-left text-xs font-normal border-collapse">
              <thead>
                <tr className="border-b border-[#ffffff12] bg-zinc-900/40 text-zinc-500 font-bold uppercase tracking-wider text-[10px]">
                  <th className="p-4">Foydalanuvchi ID</th>
                  <th className="p-4">Avatar + F.I.Sh</th>
                  <th className="p-4">Email Manzili</th>
                  <th className="p-4">Tarifi</th>
                  <th className="p-4">Ro'yxatdan o'tgan</th>
                  <th className="p-4">Oxirgi faollik</th>
                  <th className="p-4">Holati</th>
                  <th className="p-4 text-center">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ffffff04]">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-zinc-600 font-normal">
                      Qidiruv bo'yicha hech qanday foydalanuvchi topilmadi.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-900/20 transition-all">
                      <td className="p-4 text-zinc-500 font-syne font-bold">#{u.id}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-[30px] h-[30px] bg-zinc-800 rounded-full flex items-center justify-center text-zinc-300 font-syne font-bold text-[10.5px]">
                            {u.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <span className="font-bold text-[#F0EDE6]">{u.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-zinc-400 font-medium">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-extrabold uppercase ${
                          u.tariff === 'Business' 
                            ? 'bg-blue-500/15 text-blue-400 border border-blue-500/25' 
                            : u.tariff === 'Pro' 
                            ? 'bg-gold/15 text-[#C9A84C] border border-gold/25' 
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {u.tariff}
                        </span>
                      </td>
                      <td className="p-4 text-zinc-500">{u.registeredAt}</td>
                      <td className="p-4 text-zinc-400 font-medium">{u.lastActive}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10.5px] font-bold ${
                          u.status === 'Aktiv' 
                            ? 'bg-[#2D9F6E15] text-[#2D9F6E]' 
                            : u.status === 'Muzlatilgan' 
                            ? 'bg-amber-500/15 text-amber-500' 
                            : 'bg-[#C0392B15] text-[#C0392B]'
                        }`}>
                          • {u.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => setViewingUser(u)}
                            className="p-1 px-1.5 bg-zinc-900 border border-zinc-800 hover:border-gold/30 hover:text-gold rounded text-zinc-400 transition-colors cursor-pointer"
                            title="Ko'rish"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          
                          {u.status === 'Aktiv' ? (
                            <button 
                              onClick={() => handleUpdateStatus(u.id, 'Bloklangan')}
                              className="p-1 px-1.5 bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-red-500 hover:bg-red-500/5 rounded transition-colors cursor-pointer"
                              title="Bloklash"
                            >
                              <UserX className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button 
                              onClick={() => handleUpdateStatus(u.id, 'Aktiv')}
                              className="p-1 px-1.5 bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-[#2D9F6E] hover:bg-[#2D9F6E]/5 rounded transition-colors cursor-pointer"
                              title="Faollashtirish"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar mockup */}
          <div className="flex justify-between items-center text-xs text-zinc-500 font-medium">
            <span>25 ta mijoizdan {filteredUsers.length} ta ko'rsatilmoqda</span>
            <div className="flex items-center gap-1.5">
              <button type="button" disabled className="p-1 bg-zinc-900 rounded border border-[#ffffff0a] opacity-50 cursor-not-allowed" title="Oldingi sahifa yo'q"><ChevronLeft className="w-4 h-4" /></button>
              <span className="h-7 w-7 bg-[#C0392B] text-black font-bold rounded flex items-center justify-center">1</span>
              <button type="button" disabled className="p-1 bg-zinc-900 rounded border border-[#ffffff0a] opacity-50 cursor-not-allowed" title="Keyingi sahifa yo'q"><ChevronRight className="w-4 h-4" /></button>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 space-y-6">
          {activeTab === 'billing' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[
                { name: 'Starter', users: users.filter(u => u.tariff === 'Starter').length, revenue: '0 UZS', color: 'text-zinc-300' },
                { name: 'Pro', users: proUsers, revenue: '0 UZS', color: 'text-gold' },
                { name: 'Business', users: businessUsers, revenue: '0 UZS', color: 'text-blue-400' }
              ].map((plan) => (
                <div key={plan.name} className="bg-[#0D0D0D] border border-[#ffffff10] rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`font-syne font-bold ${plan.color}`}>{plan.name}</span>
                    <CreditCard className="w-4 h-4 text-zinc-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#F0EDE6]">{plan.users.toLocaleString('uz-UZ')}</div>
                  <p className="text-xs text-zinc-500">Oylik tushum: <span className="text-gold font-bold">{plan.revenue}</span></p>
                  <button
                    type="button"
                    onClick={() => setLogs([{ time: 'Hozir', msg: `${plan.name} obuna hisoboti tekshirildi`, type: 'info' }, ...logs])}
                    className="w-full h-9 rounded-lg bg-zinc-900 border border-[#ffffff10] text-xs text-zinc-300 hover:text-gold hover:border-gold/30"
                  >
                    Hisobotni tekshirish
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {[
                'AI CFO tavsiyasi foydalanuvchilarga yuborildi',
                'Pro obuna muddati tugashidan 3 kun oldin eslatma',
                'Kassa uzilishi xavfi bo‘yicha ogohlantirish',
                'Yangi hisobot tayyor bo‘lgani haqida xabar'
              ].map((message, idx) => (
                <div key={message} className="bg-[#0D0D0D] border border-[#ffffff10] rounded-xl p-5 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <Bell className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-[#F0EDE6]">{message}</p>
                      <p className="text-[10px] text-zinc-500 mt-1">{idx + 1} ta segment uchun tayyor</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLogs([{ time: 'Hozir', msg: `"${message}" yuborildi`, type: 'success' }, ...logs])}
                    className="h-8 px-3 rounded-lg bg-gold text-black text-[10px] font-bold"
                  >
                    Yuborish
                  </button>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'database' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {[
                { table: 'users', rows: users.length, status: 'Sog‘lom' },
                { table: 'transactions', rows: 0, status: 'Ma\'lumot yo\'q' },
                { table: 'reports', rows: 0, status: 'Ma\'lumot yo\'q' }
              ].map((table) => (
                <div key={table.table} className="bg-[#0D0D0D] border border-[#ffffff10] rounded-xl p-5 space-y-3">
                  <Database className="w-5 h-5 text-gold" />
                  <h4 className="text-sm font-bold font-syne text-[#F0EDE6]">{table.table}</h4>
                  <p className="text-xs text-zinc-500">Qatorlar: <span className="text-zinc-200 font-bold">{table.rows.toLocaleString('uz-UZ')}</span></p>
                  <p className="text-xs text-[#2D9F6E] font-bold">{table.status}</p>
                  <button
                    type="button"
                    onClick={() => setLogs([{ time: 'Hozir', msg: `${table.table} jadvali sinxron tekshirildi`, type: 'info' }, ...logs])}
                    className="w-full h-9 rounded-lg bg-zinc-900 border border-[#ffffff10] text-xs text-zinc-300 hover:text-gold hover:border-gold/30"
                  >
                    Sinxron tekshirish
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in">
          <div className="bg-[#0D0D0D] border border-red-700/20 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Yangi Foydalanuvchi qo'shish</h3>
            
            <form onSubmit={handleAddUser} className="space-y-4 text-xs font-normal">
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Foydalanuvchi F.I.Sh</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Azizbek Karimov"
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Email Manzil</label>
                <input
                  type="email"
                  required
                  placeholder="Masalan: aziz@gmail.com"
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-red-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Tarif Rejasi</label>
                <select
                  value={newUserTariff}
                  onChange={(e) => setNewUserTariff(e.target.value as any)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 outline-none focus:border-red-500"
                >
                  <option value="Starter">Starter</option>
                  <option value="Pro">Pro</option>
                  <option value="Business">Business</option>
                </select>
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded text-zinc-500 hover:text-white"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-[#C0392B] text-black font-bold font-syne"
                >
                  Qo'shish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* User details viewer modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in">
          <div className="bg-[#0D0D0D] border border-red-700/20 rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center border-b border-[#ffffff10] pb-2">
              <h3 className="text-sm font-bold text-[#F0EDE6] font-syne uppercase">Mijoz kartochkasi</h3>
              <button onClick={() => setViewingUser(null)} className="text-zinc-500 hover:text-white text-xs font-semibold">Tepaga</button>
            </div>

            <div className="space-y-3.5 text-xs font-normal">
              <div className="flex justify-between">
                <span className="text-zinc-500">Ism Familiya:</span>
                <span className="font-bold text-[#F0EDE6]">{viewingUser.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Elektron Pochta:</span>
                <span className="text-zinc-305">{viewingUser.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Tarif Rejasi:</span>
                <span className="text-gold font-bold">{viewingUser.tariff}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">Hozirgi holati:</span>
                <span className="text-zinc-200">{viewingUser.status}</span>
              </div>
              
              <div className="border-t border-[#ffffff0a] pt-3.5 space-y-2">
                <span className="text-zinc-500 select-none block text-[10px] uppercase font-bold">Holatni o'zgartirish:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button 
                    onClick={() => handleUpdateStatus(viewingUser.id, 'Aktiv')}
                    className="py-1.5 rounded bg-[#2D9F6E15] text-[#2D9F6E] border border-[#2D9F6E20] font-bold text-[10px]"
                  >
                    Aktivlashtirish
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(viewingUser.id, 'Muzlatilgan')}
                    className="py-1.5 rounded bg-amber-500/15 text-amber-500 border border-amber-500/20 font-bold text-[10px]"
                  >
                    Muzlatish
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(viewingUser.id, 'Bloklangan')}
                    className="py-1.5 rounded bg-[#C0392B15] text-[#C0392B] border border-[#C0392B20] font-bold text-[10px]"
                  >
                    Bloklash
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
