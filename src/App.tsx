import React, { useEffect, useState } from 'react';
import { Sparkles, BrainCircuit, Shield } from 'lucide-react';
import { ViewType, Project, Transaction, Recommendation, ChatMessage } from './types';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';

// Views
import Landing from './views/Landing';
import DashboardView from './views/DashboardView';
import SimulatorView from './views/SimulatorView';
import AIChatView from './views/AIChatView';
import AnalyticsView from './views/AnalyticsView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';
import AdminPanel from './views/AdminPanel';

const STORAGE_KEY = 'ai-moliyachi-data-v2';

const defaultProjects: Project[] = [
  { id: '1', name: 'Asosiy Biznes', revenue: 0, expenses: 0 }
];

const defaultRecommendations: Recommendation[] = [
  {
    id: 'rec1',
    title: 'Narxlarni 7% ga oshirish',
    description: 'Mijozlarning ketish riski pastligini inobatga olgan holda narxni biroz oshirish jami oylik sof foydani oshirishi mumkin.',
    priority: 'Yuqori',
    impact: 'Foyda o\'sishi'
  },
  {
    id: 'rec2',
    title: 'Marketing xarajatlarini ko\'paytirish',
    description: 'Marketing budjetini oshirish ijtimoiy tarmoqlar orqali xaridorlar oqimini kuchaytirishi mumkin.',
    priority: 'O\'rta',
    impact: 'Tranzaksiyalar soni o\'sishi'
  },
  {
    id: 'rec3',
    title: 'Ijara xarajatlarini optimallash',
    description: 'Ofis yoki omborxona ijara shartnomasini qayta ko\'rib chiqish va kichikroq bo\'limga o\'tish orqali xarajatlarni qisqartirish.',
    priority: 'Past',
    impact: 'Margin barqarorligi'
  }
];

interface StoredAppData {
  projects?: Project[];
  selectedProjectId?: string;
  transactions?: Transaction[];
  userName?: string;
  userTariff?: 'Starter' | 'Pro' | 'Business';
  chatHistory?: ChatMessage[];
  recommendations?: Recommendation[];
}

const loadStoredData = (): StoredAppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as StoredAppData;
  } catch {
    return {};
  }
};

export default function App() {
  const storedData = loadStoredData();
  const [activeView, setActiveView] = useState<ViewType>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState(storedData.userName || 'Foydalanuvchi');
  const [userRole, setUserRole] = useState<'user' | 'admin'>('admin'); // admin so they can fully experience both CFO views
  const [userTariff, setUserTariff] = useState<'Starter' | 'Pro' | 'Business'>(storedData.userTariff || 'Starter');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Set up projects lists
  const [projects, setProjects] = useState<Project[]>(
    storedData.projects?.length ? storedData.projects : defaultProjects
  );
  const [selectedProject, setSelectedProject] = useState<Project>(() => {
    const sourceProjects = storedData.projects?.length ? storedData.projects : defaultProjects;
    return sourceProjects.find(p => p.id === storedData.selectedProjectId) || sourceProjects[0];
  });

  // Handle setting project name setting change from settings views
  const handleUpdateSelectedProjectName = (name: string) => {
    setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, name } : p));
    setSelectedProject(prev => ({ ...prev, name }));
  };

  // Set up transactions local states
  const [transactions, setTransactions] = useState<Transaction[]>(storedData.transactions || []);

  // Set up smart suggestions list
  const [recommendations, setRecommendations] = useState<Recommendation[]>(storedData.recommendations || [
    { 
      id: 'rec1', 
      title: '📈 Narxlarni 7% ga oshirish', 
      description: 'Mijozlarning ketish riski pastligini inobatga olgan holda narxni biroz oshirish jami oylik sof foydani oshirishi mumkin.',
      priority: 'Yuqori',
      impact: 'Foyda o\'sishi'
    },
    { 
      id: 'rec2', 
      title: '💡 Marketing xarajatlarini ko\'paytirish', 
      description: 'Marketing budjetini qo\'shimcha 500,000 UZS ga oshirish ijtimoiy tarmoqlar orqali xaridorlar oqimini 18% ga kuchaytiradi.',
      priority: 'O\'rta',
      impact: 'Tranzaksiyalar soni o\'sishi'
    },
    { 
      id: 'rec3', 
      title: '💸 Ijara xarajatlarini optimallash', 
      description: 'Ofis yoki omborxona ijara shartnomasini qayta ko\'rib chiqish va kichikroq bo\'limga o\'tish orqali xarajatlarni qisqartirish.',
      priority: 'Past',
      impact: 'Margin barqarorligi +2.4%'
    }
  ]);

  // AI CFO chat historical logging
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(storedData.chatHistory || []);

  useEffect(() => {
    const data: StoredAppData = {
      projects,
      selectedProjectId: selectedProject.id,
      transactions,
      userName,
      userTariff,
      chatHistory,
      recommendations
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [projects, selectedProject.id, transactions, userName, userTariff, chatHistory, recommendations]);

  // Auth logins actions
  const handleDemoLogin = () => {
    setIsAuthenticated(true);
    setActiveView('dashboard');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setActiveView('landing');
  };

  // Transaction controllers
  const handleAddTransaction = (newTr: Omit<Transaction, 'id'>) => {
    const tr: Transaction = {
      ...newTr,
      id: 't_' + Math.random().toString()
    };
    setTransactions(prev => [tr, ...prev]);

    // Dynamically update project stats
    if (newTr.type === 'kirim') {
      const updatedRev = selectedProject.revenue + newTr.amount;
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, revenue: updatedRev } : p));
      setSelectedProject(prev => ({ ...prev, revenue: updatedRev }));
    } else {
      const updatedExp = selectedProject.expenses + newTr.amount;
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, expenses: updatedExp } : p));
      setSelectedProject(prev => ({ ...prev, expenses: updatedExp }));
    }
  };

  const handleDeleteTransaction = (id: string) => {
    const target = transactions.find(t => t.id === id);
    if (!target) return;
    setTransactions(prev => prev.filter(t => t.id !== id));

    // Dynamic downgrade inside selected project stats
    if (target.type === 'kirim') {
      const updatedRev = Math.max(0, selectedProject.revenue - target.amount);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, revenue: updatedRev } : p));
      setSelectedProject(prev => ({ ...prev, revenue: updatedRev }));
    } else {
      const updatedExp = Math.max(0, selectedProject.expenses - target.amount);
      setProjects(prev => prev.map(p => p.id === selectedProject.id ? { ...p, expenses: updatedExp } : p));
      setSelectedProject(prev => ({ ...prev, expenses: updatedExp }));
    }
  };

  // Applying smart recommendation action automatically injects financial cash flow
  const handleApplyRecommendation = (recId: string) => {
    const rec = recommendations.find(r => r.id === recId);
    if (!rec) return;

    // Apply simulation
    if (recId === 'rec1') {
      handleAddTransaction({
        date: new Date().toISOString().split('T')[0],
        title: 'Foyda ko\'tarilishi: Narx +7% optimallashdi',
        category: 'Savdo tushumi',
        type: 'kirim',
        amount: 3200000
      });
    } else if (recId === 'rec2') {
      handleAddTransaction({
        date: new Date().toISOString().split('T')[0],
        title: 'Marketing sarmoyasidan yangi savdo oqimi',
        category: 'Savdo tushumi',
        type: 'kirim',
        amount: 1500000
      });
    }

    setRecommendations(prev => prev.filter(r => r.id !== recId));
    alert(`"${rec.title}" chorasi muvaffaqiyatli tatbiq etildi! Biznes xarajat va daromadlari real vaqtda moslashtirildi.`);
  };

  const handleCreateProject = (name: string) => {
    const newProj: Project = {
      id: 'p_' + Math.random().toString(),
      name,
      revenue: 0,
      expenses: 0
    };
    setProjects(prev => [...prev, newProj]);
    setSelectedProject(newProj);
    alert(`"${name}" loyihasi muvaffaqiyatli yaratildi va tanlandi.`);
  };

  // Route selector template functions
  const renderViewContent = () => {
    switch (activeView) {
      case 'dashboard':
        return (
          <DashboardView 
            project={selectedProject} 
            transactions={transactions}
            addTransaction={handleAddTransaction}
            deleteTransaction={handleDeleteTransaction}
            recommendations={recommendations}
            applyRecommendation={handleApplyRecommendation}
          />
        );
      case 'simulator':
        return <SimulatorView project={selectedProject} />;
      case 'ai_chat':
        return (
          <AIChatView 
            project={selectedProject} 
            transactions={transactions}
            chatHistory={chatHistory} 
            setChatHistory={setChatHistory} 
          />
        );
      case 'analytics':
        return <AnalyticsView project={selectedProject} transactions={transactions} />;
      case 'reports':
        return <ReportsView project={selectedProject} />;
      case 'settings':
        return (
          <SettingsView 
            project={selectedProject}
            projectName={selectedProject.name}
            setProjectName={handleUpdateSelectedProjectName}
            userName={userName}
            setUserName={setUserName}
            userTariff={userTariff}
            setUserTariff={setUserTariff}
          />
        );
      case 'admin-dashboard':
      case 'admin-users':
      case 'admin-billing':
      case 'admin-notif':
      case 'admin-db':
        return <AdminPanel section={activeView} />;
      default:
        return <DashboardView 
          project={selectedProject} 
          transactions={transactions}
          addTransaction={handleAddTransaction}
          deleteTransaction={handleDeleteTransaction}
          recommendations={recommendations}
          applyRecommendation={handleApplyRecommendation}
        />;
    }
  };

  // Title for top bar depending on selection
  const getViewTitle = () => {
    switch (activeView) {
      case 'dashboard': return 'Boshqaruv Paneli (Dashboard)';
      case 'analytics': return 'Biznes Tahlil & Moliyaviy Holat';
      case 'simulator': return 'Biznes Simulyatsiya Sandboshi';
      case 'ai_chat': return 'AI CFO Virtual Suhbatdosh';
      case 'reports': return 'Moliyaviy Hisobotlar va Deklaratsiya';
      case 'settings': return 'Tizim va Korxona Sozlamalari';
      case 'admin-dashboard': return 'Platforma Admin Panel Dashboard (CFO)';
      case 'admin-users': return 'Foydalanuvchilar Boshqaruvi (Admin)';
      case 'admin-billing': return 'Obunalar va To\'lovlar Boshqaruvi';
      case 'admin-notif': return 'Bildirishnomalar Markazi';
      case 'admin-db': return 'Ma\'lumotlar Bazasi Monitoring';
      default: return 'Boshqaruv Paneli';
    }
  };

  const handleTopbarSearch = (query: string) => {
    const q = query.toLowerCase();
    if (q.includes('hisobot') || q.includes('report')) {
      setActiveView('reports');
      return;
    }
    if (q.includes('chat') || q.includes('ai') || q.includes('savol')) {
      setActiveView('ai_chat');
      return;
    }
    if (q.includes('tahlil') || q.includes('analytics') || q.includes('analitika')) {
      setActiveView('analytics');
      return;
    }
    if (q.includes('sim') || q.includes('sandbox')) {
      setActiveView('simulator');
      return;
    }
    if (q.includes('soz') || q.includes('setting')) {
      setActiveView('settings');
      return;
    }
    setActiveView('dashboard');
  };

  // Unauthenticated screens
  if (!isAuthenticated) {
    if (activeView === 'login' || activeView === 'register') {
      return (
        <div className="min-h-screen bg-bg-primary flex items-center justify-center px-6 py-12 select-none font-sans text-xs">
          <div className="max-w-md w-full card bg-bg-card border border-gold/15 p-8 shadow-2xl space-y-6 animate-in">
            <div className="text-center space-y-2">
              <div className="w-11 h-11 rounded-full bg-gold/10 border border-gold/25 flex items-center justify-center mx-auto mb-1">
                <BrainCircuit className="w-6 h-6 text-gold" />
              </div>
              <h2 className="text-xl font-extrabold tracking-tight font-syne text-[#F0EDE6]">
                {activeView === 'login' ? 'AI Moliyachi Tizimiga Kirish' : 'Tizimda Ro\'yxatdan O\'tish'}
              </h2>
              <p className="text-zinc-500 font-normal">Kichik bizneslar va xususiy korxonalar uchun virtual CFO.</p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleDemoLogin(); }} className="space-y-4 font-normal text-xs">
              {activeView === 'register' && (
                <div className="space-y-1">
                  <label className="text-zinc-400 font-semibold block">Sizning F.I.Sh</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Masalan: Shavkat Husainov" 
                    className="w-full h-11 px-3.5 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 focus:border-gold outline-none"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Elektron Pochta manzilingiz</label>
                <input 
                  type="email" 
                  required 
                  placeholder="Masalan: shavkat@aimoliyachi.uz" 
                  className="w-full h-11 px-3.5 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 focus:border-gold outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Maxfiy kalit (Password)</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  className="w-full h-11 px-3.5 rounded-lg bg-black border border-[#ffffff12] text-zinc-200 focus:border-gold outline-none"
                />
              </div>

              <button 
                type="submit"
                className="w-full btn-gold h-11 text-xs font-syne font-bold flex items-center justify-center gap-1.5 cursor-pointer pt-0.5"
              >
                <span>Tizimga Kirish (Demo orqali)</span>
              </button>
            </form>

            <div className="text-center pt-2 border-t border-[#ffffff09] space-y-2">
              <button 
                type="button"
                onClick={() => setActiveView(activeView === 'login' ? 'register' : 'login')}
                className="text-gold font-bold hover:text-gold-light"
              >
                {activeView === 'login' ? 'Yangi hisob yaratish (Ro\'yxatdan o\'tish)' : 'Menda allaqachon hisob mavjud (Kirish)'}
              </button>
              <p>
                <button 
                  type="button" 
                  onClick={() => setActiveView('landing')} 
                  className="text-zinc-500 hover:text-zinc-300 font-medium"
                >
                  ← Bosh sahifaga qaytish
                </button>
              </p>
            </div>
          </div>
        </div>
      );
    }

    // Default to Landing Page
    return (
      <Landing 
        onNavigate={setActiveView} 
        onDemoLogin={handleDemoLogin} 
      />
    );
  }

  // Authenticated State Layout with solid sidebar and top bar
  const isAdminSuiteActive = activeView.startsWith('admin');

  return (
    <div className={`layout min-h-screen ${isAdminSuiteActive ? 'bg-[#080808]' : 'bg-bg-primary'}`}>
      
      {/* SIDEBAR BLOCK LAYOUT */}
      <Sidebar 
        activeView={activeView}
        setActiveView={setActiveView}
        projects={projects}
        selectedProject={selectedProject}
        setSelectedProject={setSelectedProject}
        addProject={handleCreateProject}
        userRole={userRole}
        userTariff={userTariff}
        userName={userName}
        onLogout={handleLogout}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
      />

      {/* MAIN CONTENT AREA */}
      <div className="main-content flex flex-col justify-between min-h-screen lg:pl-[260px]">
        <div>
          <Topbar 
            title={getViewTitle()} 
            projectName={selectedProject.name}
            userName={userName}
            setMobileOpen={setMobileSidebarOpen}
            onSearch={handleTopbarSearch}
          />
          
          <main className="page-content p-6">
            {renderViewContent()}
          </main>
        </div>

        {/* Small bottom footer */}
        <footer className="h-12 border-t border-[#ffffff06] bg-black/40 flex items-center justify-between px-6 text-[10.5px] text-zinc-600">
          <span>AI Moliyachi VIRTUAL CFO Platformasi v3.2</span>
          <span>Markaziy Osiyo biznesi uchun maxsus ishlab chiqilgan</span>
        </footer>
      </div>

    </div>
  );
}
