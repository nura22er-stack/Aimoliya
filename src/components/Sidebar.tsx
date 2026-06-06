import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Calculator, 
  MessageSquare, 
  FileSpreadsheet, 
  Settings as SettingsIcon, 
  Shield, 
  Plus, 
  ChevronDown, 
  Sparkles,
  LogOut,
  X,
  CreditCard,
  Bell,
  Users,
  Database
} from 'lucide-react';
import { ViewType, Project } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
  projects: Project[];
  selectedProject: Project;
  setSelectedProject: (project: Project) => void;
  addProject: (name: string) => void;
  userRole: 'user' | 'admin';
  userTariff: 'Starter' | 'Pro' | 'Business';
  userName: string;
  onLogout: () => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export default function Sidebar({
  activeView,
  setActiveView,
  projects,
  selectedProject,
  setSelectedProject,
  addProject,
  userRole,
  userTariff,
  userName,
  onLogout,
  mobileOpen,
  setMobileOpen
}: SidebarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');

  // Determine if admin panel views are currently active
  const isAdminSuite = activeView.startsWith('admin');

  // Interactive items based on context
  const menuItems = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', icon: LayoutDashboard },
    { id: 'analytics', label: 'Moliyaviy Tahlil', icon: TrendingUp },
    { id: 'simulator', label: 'Simulyator', icon: Calculator },
    { id: 'ai_chat', label: 'AI CFO Chat', icon: MessageSquare },
    { id: 'reports', label: 'Hisobotlar', icon: FileSpreadsheet },
    { id: 'settings', label: 'Sozlamalar', icon: SettingsIcon },
  ] as const;

  const adminItems = [
    { id: 'admin-dashboard', label: 'Admin Panel', icon: LayoutDashboard },
    { id: 'admin-users', label: 'Foydalanuvchilar', icon: Users },
    { id: 'admin-billing', label: 'Obunalar & To\'lovlar', icon: CreditCard },
    { id: 'admin-notif', label: 'Bildirishnomalar', icon: Bell },
    { id: 'admin-db', label: 'Ma\'lumotlar Bazasi', icon: Database },
  ] as const;

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (newProjectName.trim()) {
      addProject(newProjectName.trim());
      setNewProjectName('');
      setShowAddProjectModal(false);
    }
  };

  return (
    <>
      {/* Mobile Backdrop overlay */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/85 z-[990] lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Styled Sidebar Container */}
      <aside 
        className={`
          fixed top-0 left-0 h-full w-[260px] z-[995] 
          flex flex-col justify-between transition-all duration-300 lg:translate-x-0
          ${isAdminSuite ? 'bg-[#050505] border-r border-[#A33020]/20' : 'bg-[#080808] border-r border-[rgba(255,255,255,0.06)]'}
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          {/* LOGO block (Header) */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-[rgba(255,255,255,0.06)]">
            <div className="flex items-center gap-2.5">
              <div className={`w-[30px] h-[30px] rounded bg-[#C9A84C] flex items-center justify-center relative`}>
                <span className="text-[#080808] font-bold text-xs font-syne">M</span>
              </div>
              <div>
                <h1 className="text-sm font-bold text-[#EDEAE3] font-syne leading-tight flex items-center gap-1.5">
                  AI Moliyachi
                </h1>
                <p className="text-[9px] text-[#7A7671] font-mono tracking-[0.15em] uppercase font-semibold leading-none mt-0.5">
                  VIRTUAL CFO
                </p>
              </div>
            </div>

            {isAdminSuite && (
              <span className="bg-[#A33020] text-white font-mono text-[8px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase leading-none scale-90">
                ADMIN
              </span>
            )}

            <button 
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1 text-[#7A7671] hover:text-[#EDEAE3]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* PROJECT SELECTOR DROPDOWN (Hide/Disabled during Admin Panel view) */}
          {!isAdminSuite ? (
            <div className="px-4 py-4 border-b border-[rgba(255,255,255,0.06)]">
              <span className="text-[9px] text-[#7A7671] font-mono tracking-wider uppercase block mb-1.5">LOYIHA</span>
              
              <div className="relative">
                <button 
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-full h-10 px-3 rounded-lg bg-[#0F0F0F] border border-[rgba(255,255,255,0.06)] hover:border-[#C9A84C]/40 flex items-center justify-between text-xs text-[#EDEAE3] transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-2 max-w-[80%]">
                    <div className="w-2 h-2 rounded-full bg-[#C9A84C] pulse" />
                    <span className="font-semibold truncate">{selectedProject.name}</span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-[#7A7671]" />
                </button>

                {dropdownOpen && (
                  <div className="absolute top-[108%] left-0 w-full bg-[#141414] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-2xl py-1.5 z-50 animate-in">
                    <div className="px-3 py-1 text-[9.5px] text-[#7A7671] uppercase tracking-widest font-mono">
                      Loyihalar ro'yxati
                    </div>
                    {projects.map((proj) => (
                      <button
                        key={proj.id}
                        type="button"
                        onClick={() => {
                          setSelectedProject(proj);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer ${
                          proj.id === selectedProject.id 
                            ? 'text-[#C9A84C] bg-[rgba(201,168,76,0.1)]' 
                            : 'text-[#7A7671] hover:bg-white/[0.03] hover:text-[#EDEAE3]'
                        }`}
                      >
                        <span className="truncate">{proj.name}</span>
                        {proj.id === selectedProject.id && <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]" />}
                      </button>
                    ))}
                    
                    <div className="border-t border-[rgba(255,255,255,0.06)] mt-1.5 pt-1.5 px-2">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddProjectModal(true);
                          setDropdownOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded text-[10.5px] text-[#C9A84C] bg-[rgba(201,168,76,0.1)] border border-dashed border-[rgba(201,168,76,0.30)] hover:bg-[rgba(201,168,76,0.18)] transition-all cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Yangi Loyiha
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-[#141414]/30 px-6 py-[18px] border-b border-[#A33020]/10 flex items-center justify-between text-xs text-[#7A7671]">
              <span className="font-mono tracking-widest">LOYIHA BOSHQARUVI</span>
              <span className="text-[10px] bg-[#A33020]/20 text-[#E05A47] px-1.5 py-0.5 rounded border border-[#A33020]/30 font-bold uppercase">SECURE</span>
            </div>
          )}

          {/* DYNAMIC NAVIGATION LINKS */}
          <nav className="py-4 space-y-[2px]">
            {(!isAdminSuite ? menuItems : adminItems).map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id || (isAdminSuite && activeView.startsWith('admin') && item.id === 'admin-dashboard' && activeView === 'admin-dashboard');
              
              // Custom active formatting based on general or admin dashboards
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id as any);
                    setMobileOpen(false);
                  }}
                  className={`w-full flex items-center gap-3.5 py-3 px-6 text-xs text-[#7A7671] transition-all hover:text-[#EDEAE3] hover:bg-white/[0.02] border-l-2 text-left cursor-pointer ${
                    isActive 
                      ? isAdminSuite 
                        ? 'text-[#E05A47] bg-red-dim border-[#A33020] font-semibold'
                        : 'text-[#C9A84C] bg-[#C9A84C0f] border-[#C9A84C] font-semibold'
                      : 'border-transparent'
                  }`}
                >
                  <Icon className={`w-4 h-4 transition-colors ${isActive ? (isAdminSuite ? 'text-[#E05A47]' : 'text-[#C9A84C]') : 'text-zinc-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* BOTTOM USER PANEL & ADMIN SWITCH LINK */}
        <div className={`border-t ${isAdminSuite ? 'border-[#A33020]/20 bg-[#080808]/40' : 'border-[rgba(255,255,255,0.06)] bg-[#0F0F0F]/40'}`}>
          
          {/* Admin panel redirect toggle */}
          {userRole === 'admin' && (
            <div className="px-4 pt-3.5">
              <button
                type="button"
                onClick={() => {
                  setActiveView(isAdminSuite ? 'dashboard' : 'admin-dashboard');
                  setMobileOpen(false);
                }}
                className={`w-full h-10 px-3 rounded-lg flex items-center justify-center gap-2 text-[10.5px] font-bold uppercase tracking-wider transition-all border cursor-pointer ${
                  isAdminSuite
                    ? 'bg-[#141414] text-[#EDEAE3] border-[rgba(255,255,255,0.06)] hover:bg-[#1A1A1A]'
                    : 'bg-[#A33020]/15 text-[#E05A47] border-[#A33020]/25 hover:bg-[#A33020]/25'
                }`}
              >
                <Shield className="w-3.5 h-3.5 shrink-0" />
                {isAdminSuite ? 'User Panelga o\'tish' : 'Admin Panel (CFO)'}
              </button>
            </div>
          )}

          {/* Profile Section Box */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-[34px] h-[34px] rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.3)] flex items-center justify-center text-[#C9A84C] font-syne font-bold text-xs shrink-0">
                {userName.split(' ').map(n => n[0]).join('')}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-[#EDEAE3] leading-tight truncate">
                  {userName}
                </div>
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-[8.5px] bg-[rgba(201,168,76,0.15)] text-[#C9A84C] border border-[rgba(201,168,76,0.2)] px-1.5 py-0.5 rounded font-mono font-bold uppercase leading-none">
                    {userTariff}
                  </span>
                </div>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2 rounded hover:text-[#A33020] text-[#7A7671] transition-colors cursor-pointer"
              title="Chiqish"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Add Project Modal Popup window */}
      {showAddProjectModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-[1100] animate-in">
          <div className="bg-[#0F0F0F] border border-[rgba(201,168,76,0.3)] rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-[#EDEAE3] font-syne uppercase tracking-wider">Yangi Biznes Loyiha</h3>
              <p className="text-[11px] text-[#7A7671] font-sans mt-0.5">Qo'shimcha do'kon yoki yangi filial:</p>
            </div>
            
            <form onSubmit={handleAddProject} className="space-y-4">
              <input
                type="text"
                required
                placeholder="Masalan: Yunusobod 3-Filial"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                className="w-full h-11 px-3.5 rounded-lg bg-black border border-[rgba(255,255,255,0.06)] focus:border-[#C9A84C] outline-none text-[#EDEAE3] placeholder-[#3D3B38] text-xs"
              />
              
              <div className="flex justify-end gap-2.5 pt-1.5">
                <button
                  type="button"
                  onClick={() => setShowAddProjectModal(false)}
                  className="px-4 text-xs text-[#7A7671] hover:text-[#EDEAE3] cursor-pointer"
                >
                  Bekor qilish
                </button>
                <button
                  type="submit"
                  className="h-9 px-4 rounded bg-[#C9A84C] text-[#080808] hover:bg-[#E2C47A] font-bold font-syne text-xs cursor-pointer"
                >
                  Yaratish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
