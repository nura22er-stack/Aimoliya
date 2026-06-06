export interface Transaction {
  id: string;
  date: string;
  title: string;
  category: string;
  type: 'kirim' | 'chiqim';
  amount: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export interface Project {
  id: string;
  name: string;
  revenue: number;
  expenses: number;
}

export interface Recommendation {
  id: string;
  title: string;
  description: string;
  priority: 'Yuqori' | 'O\'rta' | 'Past';
  impact: string;
}

export type ViewType = 
  | 'landing' 
  | 'login' 
  | 'register' 
  | 'dashboard' 
  | 'analytics' 
  | 'simulator' 
  | 'ai_chat' 
  | 'reports' 
  | 'settings' 
  | 'admin-dashboard' 
  | 'admin-users'
  | 'admin-billing'
  | 'admin-notif'
  | 'admin-db';

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  tariff: 'Starter' | 'Pro' | 'Business';
  registeredAt: string;
  status: 'Aktiv' | 'Muzlatilgan' | 'Bloklangan';
  lastActive: string;
}

export interface SimulationParams {
  scenario: string;
  priceChange: number;
  employeesCount: number;
  marketingBudget: number;
  durationMonths: number;
}

export interface SimulationResult {
  newRevenue: number;
  newExpenses: number;
  newProfit: number;
  profitDiff: number;
  riskLevel: 'Past' | 'O\'rta' | 'Yuqori' | 'Kritik';
  riskDetails: string;
  competitorReaction: 'Sust' | 'O\'rta' | 'Faol';
  aiRecommendation: string;
  currentStats: {
    revenue: number;
    expenses: number;
    profit: number;
  };
}
