import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Plus, 
  Trash2, 
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Transaction, Project, Recommendation } from '../types';

interface DashboardViewProps {
  project: Project;
  transactions: Transaction[];
  addTransaction: (tr: Omit<Transaction, 'id'>) => void;
  deleteTransaction: (id: string) => void;
  recommendations: Recommendation[];
  applyRecommendation: (recId: string) => void;
}

export default function DashboardView({ 
  project, 
  transactions, 
  addTransaction, 
  deleteTransaction,
  recommendations,
  applyRecommendation
}: DashboardViewProps) {
  const [filter, setFilter] = useState<'all' | 'kirim' | 'chiqim'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newCategory, setNewCategory] = useState('Savdo tushumi');
  const [newType, setNewType] = useState<'kirim' | 'chiqim'>('kirim');

  // Filtered list
  const filteredTransactions = transactions.filter(t => {
    if (filter === 'all') return true;
    return t.type === filter;
  });

  // Calculate dynamically from transactions
  const totalRevenue = transactions
    .filter(t => t.type === 'kirim')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.type === 'chiqim')
    .reduce((sum, t) => sum + t.amount, 0);

  const netProfit = totalRevenue - totalExpenses;
  const cashFlowValue = totalRevenue - totalExpenses; // simplified net change

  const formatUzS = (value: number) => {
    return value.toLocaleString('uz-UZ') + " UZS";
  };

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTitle.trim() && newAmount) {
      addTransaction({
        date: new Date().toISOString().split('T')[0],
        title: newTitle.trim(),
        category: newCategory,
        type: newType,
        amount: parseFloat(newAmount)
      });
      setNewTitle('');
      setNewAmount('');
      setShowAddModal(false);
    }
  };

  // Monthly values for SVG Chart
  // Make it responsive or visually pleasing. Using SVG curves styled with Tailwind variables is robust & 100% beautiful
  const chartData = [
    { month: 'Yan', rev: 9200000, exp: 6100000 },
    { month: 'Fev', rev: 10400000, exp: 6800000 },
    { month: 'Mar', rev: 11100000, exp: 7400000 },
    { month: 'Apr', rev: 11800000, exp: 7900000 },
    { month: 'May', rev: 12450000, exp: 8220000 },
    { month: 'Iyun', rev: totalRevenue || 12450000, exp: totalExpenses || 8220000 },
  ];

  const maxVal = Math.max(...chartData.map(d => Math.max(d.rev, d.exp))) * 1.1;

  // Generate SVG coordinates
  const svgWidth = 500;
  const svgHeight = 200;
  const padding = 20;

  const getX = (index: number) => {
    return padding + (index * (svgWidth - 2 * padding)) / (chartData.length - 1);
  };

  const getY = (value: number) => {
    return svgHeight - padding - (value * (svgHeight - 2 * padding)) / maxVal;
  };

  const revenuePoints = chartData.map((d, i) => `${getX(i)},${getY(d.rev)}`).join(' ');
  const expensePoints = chartData.map((d, i) => `${getX(i)},${getY(d.exp)}`).join(' ');

  // Area under curves
  const revenueAreaPoints = `${getX(0)},${svgHeight - padding} ` + revenuePoints + ` ${getX(chartData.length - 1)},${svgHeight - padding}`;
  const expenseAreaPoints = `${getX(0)},${svgHeight - padding} ` + expensePoints + ` ${getX(chartData.length - 1)},${svgHeight - padding}`;

  return (
    <div className="space-y-6 animate-in">
      
      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 - Daromad */}
        <div className="card p-5 space-y-3 bg-bg-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A8580] uppercase tracking-wider font-semibold">Oylik Jami Kirim</span>
            <div className="w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-[#F0EDE6] tracking-tight font-syne truncate">
              {formatUzS(totalRevenue)}
            </h3>
            <span className="text-[11px] text-[#2D9F6E] font-bold flex items-center gap-1">
              ▲ +8.3% <span className="text-zinc-500 font-normal">o'tgan oyga nisbatan</span>
            </span>
          </div>
        </div>

        {/* Card 2 - Sof Foyda */}
        <div className="card p-5 space-y-3 bg-bg-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A8580] uppercase tracking-wider font-semibold">Taqsimlanmagan Sof Foyda</span>
            <div className="w-8 h-8 rounded-lg bg-[#2D9F6E]/10 border border-[#2D9F6E]/20 flex items-center justify-center text-[#2D9F6E]">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-bold tracking-tight font-syne truncate ${netProfit >= 0 ? 'text-[#2D9F6E]' : 'text-[#C0392B]'}`}>
              {formatUzS(netProfit)}
            </h3>
            <span className="text-[11px] text-[#2D9F6E] font-bold flex items-center gap-1">
              ▲ +12.1% <span className="text-zinc-500 font-normal">foyda marjasi barqaror</span>
            </span>
          </div>
        </div>

        {/* Card 3 - Xarajatlar */}
        <div className="card p-5 space-y-3 bg-bg-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A8580] uppercase tracking-wider font-semibold">Jami Operatsion Cost</span>
            <div className="w-8 h-8 rounded-lg bg-[#C0392B]/10 border border-[#C0392B]/20 flex items-center justify-center text-[#C0392B]">
              <ArrowDownLeft className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-bold text-[#F0EDE6] tracking-tight font-syne truncate">
              {formatUzS(totalExpenses)}
            </h3>
            <span className="text-[11px] text-[#C0392B] font-bold flex items-center gap-1">
              ▼ -2.4% <span className="text-zinc-500 font-normal">xarajatlar qisqardi</span>
            </span>
          </div>
        </div>

        {/* Card 4 - Cash Flow Status */}
        <div className="card p-5 space-y-3 bg-bg-card relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <span className="text-xs text-[#8A8580] uppercase tracking-wider font-semibold">Sof Pul Oqimi (Cash Flow)</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="space-y-1">
            <h3 className={`text-2xl font-bold tracking-tight font-syne truncate ${cashFlowValue >= 0 ? 'text-[#2D9F6E]' : 'text-amber-500'}`}>
              {cashFlowValue >= 0 ? '+' : ''}{formatUzS(cashFlowValue)}
            </h3>
            <span className="text-[11px] text-[#2D9F6E] font-bold flex items-center gap-1">
              <span className="live-dot" /> <span className="text-zinc-300 font-semibold uppercase">YAXSHI</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Chart Graphic & Context Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 8 cols - SVG Chart */}
        <div className="card bg-bg-card p-6 lg:col-span-8 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Moliyaviy Dinamika</h3>
              <p className="text-xs text-[#8A8580]">Oxirgi 6 oylik jami Kirim vs Jami Chiqim diagrammasi</p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-gold inline-block" />
                <span className="text-zinc-300">Daromad</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#C0392B] inline-block" />
                <span className="text-zinc-300">Xarajat</span>
              </div>
            </div>
          </div>

          {/* SVG Container */}
          <div className="w-full h-56 pt-2">
            <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full overflow-visible">
              {/* Grid Lines */}
              {[0, 0.25, 0.5, 0.75, 1].map((pVal, idx) => {
                const yPos = padding + pVal * (svgHeight - 2 * padding);
                const valLabel = Math.round(maxVal * (1 - pVal) / 1000000) + "M";
                return (
                  <g key={idx}>
                    <line 
                      x1={padding} 
                      y1={yPos} 
                      x2={svgWidth - padding} 
                      y2={yPos} 
                      stroke="rgba(255,255,255,0.04)" 
                      strokeWidth="1" 
                    />
                    <text 
                      x={padding - 5} 
                      y={yPos + 4} 
                      fill="rgba(255,255,255,0.3)" 
                      fontSize="9" 
                      textAnchor="end"
                    >
                      {valLabel}
                    </text>
                  </g>
                );
              })}

              {/* Area Fills */}
              <polygon points={revenueAreaPoints} fill="rgba(201, 168, 76, 0.05)" />
              <polygon points={expenseAreaPoints} fill="rgba(192, 57, 43, 0.03)" />

              {/* Lines */}
              <polyline 
                fill="none" 
                stroke="#C9A84C" 
                strokeWidth="2.5" 
                strokeLinecap="round" 
                points={revenuePoints} 
              />
              <polyline 
                fill="none" 
                stroke="#C0392B" 
                strokeWidth="2" 
                strokeLinecap="round" 
                points={expensePoints} 
              />

              {/* Data points */}
              {chartData.map((d, i) => (
                <g key={i}>
                  <circle cx={getX(i)} cy={getY(d.rev)} r="4" fill="#C9A84C" stroke="#161616" strokeWidth="1.5" />
                  <circle cx={getX(i)} cy={getY(d.exp)} r="3" fill="#C0392B" stroke="#161616" strokeWidth="1.5" />
                  <text 
                    x={getX(i)} 
                    y={svgHeight - 2} 
                    fill="rgba(255,255,255,0.4)" 
                    fontSize="9.5" 
                    textAnchor="middle"
                  >
                    {d.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* Right 4 cols - AI Smart Summary overview / quick forecast */}
        <div className="card bg-[#0D0D0D] border border-gold/15 p-5 lg:col-span-4 flex flex-col justify-between relative overflow-hidden">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gold/10 border border-gold/25 flex items-center justify-center text-gold">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-[#F0EDE6] tracking-tight font-syne">AI CFO Status Monitor</h3>
            </div>

            <div className="space-y-3 text-xs leading-relaxed">
              <p className="text-zinc-300 font-normal">
                Ushbu davrda kassa tushumlari oqimi barqaror bo'lib, o'tgan haftaga solishtirganda jami likvidlilik balansi <strong>+4.1%</strong> ga mustahkamlandi.
              </p>
              
              <div className="bg-[#161616] border border-[#ffffff08] p-3 rounded-lg space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                  <span>SALBIY XAVF KO'RSATKICHI</span>
                  <span className="text-[#2D9F6E] uppercase font-syne">PAST (4%)</span>
                </div>
                <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                  <div className="h-full bg-[#2D9F6E] rounded-full w-[4%]" />
                </div>
              </div>

              <div className="space-y-1.5 p-1 pt-2">
                <span className="text-[10px] text-gold uppercase tracking-wider font-extrabold font-syne block">KASSA SENSORI BASHORATI</span>
                <p className="text-zinc-500 font-normal leading-normal">
                  Keyingi 14 kun ichida joriy xarajatlar tushumi bilan solishtirganda kassa uzilishi ehtimoli 0.2% dan kichik.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-[#ffffff0a] flex items-center justify-between text-xs text-zinc-500">
            <span>Sohaviy solishtirish:</span>
            <span className="text-gold font-bold">Top 10% biznes ichida v3</span>
          </div>
        </div>
      </div>

      {/* Bottom 3 Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Col 1 - AI CFO Recommendations */}
        <div className="card bg-bg-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#F0EDE6] font-syne flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-gold" />
              AI CFO Smart Tavsiyalar
            </h3>
            <p className="text-[11px] text-[#8A8580]">Biznes foydasini maksimal darajaga chiqarish bo'yicha maslahatlar</p>
          </div>

          <div className="space-y-3.5 my-3 flex-1 overflow-y-auto max-h-[290px] pr-1">
            {recommendations.map((rec) => (
              <div 
                key={rec.id} 
                className="bg-black/40 border border-[#ffffff07] p-3.5 rounded-lg space-y-2 group hover:border-gold/25 transition-all"
              >
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-bold text-[#F0EDE6] leading-tight group-hover:text-gold transition-colors">{rec.title}</h4>
                  <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase font-extrabold shrink-0 ${
                    rec.priority === 'Yuqori' 
                      ? 'bg-[#C0392B15] text-[#C0392B] border border-[#C0392B30]' 
                      : rec.priority === 'O\'rta' 
                      ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' 
                      : 'bg-zinc-800 text-zinc-400'
                  }`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-normal">{rec.description}</p>
                <div className="flex items-center justify-between pt-1.5 border-t border-[#ffffff08] text-[10.5px]">
                  <span className="text-[#2D9F6E] font-medium">{rec.impact}</span>
                  <button 
                    onClick={() => applyRecommendation(rec.id)}
                    className="text-gold font-bold hover:text-gold-light tracking-wide font-syne flex items-center gap-0.5 cursor-pointer"
                  >
                    Amalga oshirish →
                  </button>
                </div>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-600 text-center font-normal pt-1.5 border-t border-[#ffffff0a]">
            Tavsiyalar har 24 soatda ma'lumotlarga qarab yangilanadi
          </p>
        </div>

        {/* Col 2 - Recent Transactions */}
        <div className="card bg-bg-card p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#F0EDE6] font-syne">Tranzaksiyalar</h3>
              <button 
                onClick={() => setShowAddModal(true)}
                className="w-7 h-7 bg-gold text-black rounded-lg hover:bg-gold-light flex items-center justify-center transition-all cursor-pointer"
                title="Kirim/chiqim qo'shish"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            
            {/* Filter Buttons */}
            <div className="grid grid-cols-3 gap-1 bg-[#0A0A0A] p-0.5 rounded-lg border border-[#ffffff05]">
              <button 
                onClick={() => setFilter('all')}
                className={`py-1.5 text-[10.5px] font-semibold rounded transition-all cursor-pointer ${filter === 'all' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Hammasi
              </button>
              <button 
                onClick={() => setFilter('kirim')}
                className={`py-1.5 text-[10.5px] font-semibold rounded transition-all cursor-pointer ${filter === 'kirim' ? 'bg-[#2D9F6E15] text-[#2D9F6E]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Kirimlar
              </button>
              <button 
                onClick={() => setFilter('chiqim')}
                className={`py-1.5 text-[10.5px] font-semibold rounded transition-all cursor-pointer ${filter === 'chiqim' ? 'bg-[#C0392B15] text-[#C0392B]' : 'text-zinc-500 hover:text-zinc-300'}`}
              >
                Chiqimlar
              </button>
            </div>
          </div>

          {/* Transactions List */}
          <div className="space-y-2.5 my-3 flex-1 overflow-y-auto max-h-[225px] pr-1">
            {filteredTransactions.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-600">
                <Clock className="w-6 h-6 mb-1 opacity-50" />
                <p className="text-xs">Tranzaksiyalar mavjud emas</p>
              </div>
            ) : (
              filteredTransactions.map((tr) => (
                <div 
                  key={tr.id} 
                  className="flex items-center justify-between p-2.5 rounded bg-black/30 border border-[#ffffff04] text-xs hover:border-[#ffffff0f] transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className={`w-7 h-7 rounded flex items-center justify-center shrink-0 ${
                      tr.type === 'kirim' 
                        ? 'bg-[#2D9F6E12] text-[#2D9F6E]' 
                        : 'bg-[#C0392B12] text-[#C0392B]'
                    }`}>
                      {tr.type === 'kirim' ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownLeft className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-[#F0EDE6] truncate">{tr.title}</p>
                      <p className="text-[10px] text-zinc-500 font-medium truncate">{tr.category} • {tr.date}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`font-bold ${tr.type === 'kirim' ? 'text-[#2D9F6E]' : 'text-[#C0392B]'}`}>
                      {tr.type === 'kirim' ? '+' : '-'}{tr.amount.toLocaleString('uz-UZ')}
                    </span>
                    <button 
                      onClick={() => deleteTransaction(tr.id)}
                      className="text-zinc-600 hover:text-red-500 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="pt-2 border-t border-[#ffffff0a] text-center">
            <span className="text-[10.5px] text-zinc-500 font-medium">Buxgalteriya real vaqtda faol</span>
          </div>
        </div>

        {/* Col 3 - Forecast */}
        <div className="card bg-bg-card p-5 flex flex-col justify-between space-y-4 relative overflow-hidden">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-[#F0EDE6] font-syne">Oylik Sof Foyda Forecast</h3>
            <p className="text-[11px] text-[#8A8580]">AI Algoritmlari yordamida oylik bashoratli pul oqimi</p>
          </div>

          <div className="py-2.5 flex-1 flex flex-col justify-center space-y-5">
            {/* Mini Progress bars representing next 3 months forecasts */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-300 font-medium">Iyun (Hozirgi kutilayotgan)</span>
                <span className="text-gold font-bold font-syne">{formatUzS(netProfit)}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold rounded-full w-[80%]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Iyul (Prognoz)</span>
                <span className="text-gold-light font-bold font-syne">{formatUzS(netProfit * 1.12)}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-gold-light rounded-full w-[90%] opacity-85" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400 font-medium">Avgust (Prognoz)</span>
                <span className="text-[#2D9F6E] font-bold font-syne">{formatUzS(netProfit * 1.28)}</span>
              </div>
              <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-[#2D9F6E] rounded-full w-[100%]" />
              </div>
            </div>
          </div>

          <div className="bg-[#C9A84C07] border border-[#C9A84C20] rounded-lg p-3 text-[10.5px] text-zinc-400 leading-relaxed font-normal">
            <div className="flex items-center gap-1 font-bold text-gold mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>CFO Prognoz Xulosasi</span>
            </div>
            Oylik ko'rsatkichlaringiz o'sish tendensiyasida. Avgust oyida jami rentabellik 42.1% ga yetish kutilmoqda.
          </div>
        </div>
      </div>

      {/* Add Transaction Modal & Controller */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center p-4 z-50 animate-in">
          <div className="bg-bg-card border border-[#ffffff15] rounded-xl max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-[#ffffff0f] pb-3">
              <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Tranzaksiya qo'shish</h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-zinc-500 hover:text-white text-xs font-semibold cursor-pointer"
              >
                Yopish
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4 text-xs font-normal">
              {/* Type selector */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setNewType('kirim')}
                  className={`py-2 px-3 rounded font-bold text-center border cursor-pointer ${
                    newType === 'kirim' 
                      ? 'bg-[#2D9F6E15] text-[#2D9F6E] border-[#2D9F6E35]' 
                      : 'bg-zinc-900 text-zinc-500 border-transparent'
                  }`}
                >
                  Kirim (Revenue)
                </button>
                <button
                  type="button"
                  onClick={() => setNewType('chiqim')}
                  className={`py-2 px-3 rounded font-bold text-center border cursor-pointer ${
                    newType === 'chiqim' 
                      ? 'bg-[#C0392B15] text-[#C0392B] border-[#C0392B35]' 
                      : 'bg-zinc-900 text-zinc-500 border-transparent'
                  }`}
                >
                  Chiqim (Expense)
                </button>
              </div>

              {/* Title input */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Tranzaksiya Nomi</label>
                <input
                  type="text"
                  required
                  placeholder="Masalan: Mahsulot sotuvi yoki Ofis ijarasi"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff15] text-zinc-200 outline-none focus:border-gold"
                />
              </div>

              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Kategoriya</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff15] text-zinc-200 outline-none focus:border-gold"
                >
                  {newType === 'kirim' ? (
                    <>
                      <option value="Savdo tushumi">Savdo tushumi</option>
                      <option value="Xizmat ko'rsatish">Xizmat ko'rsatish</option>
                      <option value="Investitsiya">Investitsiya</option>
                      <option value="Boshqalar">Boshqalar</option>
                    </>
                  ) : (
                    <>
                      <option value="Ijara xarajatlari">Ijara xarajatlari</option>
                      <option value="Xodimlar oyliklari">Xodimlar oyliklari</option>
                      <option value="Soliqlar va to'lovlar">Soliqlar va to'lovlar</option>
                      <option value="Marketing & Reklama">Marketing & Reklama</option>
                      <option value="Ofis anjomlari">Ofis anjomlari</option>
                      <option value="Boshqalar">Boshqalar</option>
                    </>
                  )}
                </select>
              </div>

              {/* Amount input */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-semibold block">Summa (UZS)</label>
                <input
                  type="number"
                  required
                  placeholder="Masalan: 1200000"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg bg-black border border-[#ffffff15] text-zinc-200 outline-none focus:border-gold"
                />
              </div>

              <button
                type="submit"
                className="w-full btn-gold h-10 font-syne font-bold text-xs cursor-pointer"
              >
                Tranzaksiyani saqlash
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
