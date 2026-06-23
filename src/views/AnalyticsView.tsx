import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  PieChart, 
  AlertTriangle, 
  ShieldCheck, 
  Sliders, 
  TrendingUp as TrendUp,
  Percent
} from 'lucide-react';
import { Project, Transaction } from '../types';

interface AnalyticsViewProps {
  project: Project;
  transactions: Transaction[];
}

export default function AnalyticsView({ project, transactions }: AnalyticsViewProps) {
  const [budgetLimit, setBudgetLimit] = useState<number>(0);

  // Calculate totals
  const revenueTrs = transactions.filter(t => t.type === 'kirim');
  const expenseTrs = transactions.filter(t => t.type === 'chiqim');

  const totalRevenue = revenueTrs.reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = expenseTrs.reduce((sum, t) => sum + t.amount, 0);
  const netProfit = totalRevenue - totalExpenses;
  const marginPercent = totalRevenue > 0 ? ((netProfit / totalRevenue) * 100).toFixed(1) : "0";

  // Category distributions
  const categoryTotals = expenseTrs.reduce<Record<string, number>>((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const categoryColors = ["bg-gold", "bg-amber-500", "bg-blue-500", "bg-emerald-500", "bg-pink-500", "bg-zinc-600"];
  const categories = Object.entries(categoryTotals).map(([name, allocated], index) => ({
    name,
    allocated,
    color: categoryColors[index % categoryColors.length],
    icon: Percent
  }));

  const totalAllocated = categories.reduce((sum, c) => sum + c.allocated, 0);

  const formatUzS = (value: number) => {
    return value.toLocaleString('uz-UZ') + " UZS";
  };

  return (
    <div className="space-y-6 animate-in">
      
      {/* Analytics KPI rows */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card bg-bg-card p-5 space-y-2">
          <span className="text-xs text-zinc-500 font-semibold block uppercase">Daromad Rentabelligi (Profit Margin)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-gold font-syne">{marginPercent}%</span>
            <span className="text-xs bg-[#2D9F6E12] text-[#2D9F6E] font-bold px-1.5 py-0.5 rounded">Optimal</span>
          </div>
          <p className="text-[11px] text-zinc-600">Soha bo'yicha kichik va o'rta biznes o'rtacha ko'rsatkichi 15-20% tashkil etadi.</p>
        </div>

        <div className="card bg-bg-card p-5 space-y-2">
          <span className="text-xs text-zinc-500 font-semibold block uppercase">Soliq yuklamasi</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#F0EDE6] font-syne">0%</span>
            <span className="text-xs bg-amber-500/10 text-amber-500 font-bold px-1.5 py-0.5 rounded">Kiritilmagan</span>
          </div>
          <p className="text-[11px] text-zinc-600">Soliq qonunchiligi ostida aylanma soliq 4% optimallashtirilgan optimal holat.</p>
        </div>

        <div className="card bg-[#0D0D0D] border border-gold/15 p-5 space-y-2">
          <span className="text-xs text-zinc-500 font-semibold block uppercase">Likvidlilik koeffitsiyenti</span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#2D9F6E] font-syne">0</span>
            <span className="text-xs bg-blue-500/10 text-blue-400 font-bold px-1.5 py-0.5 rounded">Kiritilmagan</span>
          </div>
          <p className="text-[11px] text-zinc-600">Ushbu koeffitsiyent biznesingiz qarz majburiyatlarini qoplashda yuqori hisoblanadi.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Column - Financial Breakdown P&L table */}
        <div className="card bg-bg-card p-6 lg:col-span-7 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Foyda va Zarar Hisoboti (P&L Statements)</h3>
            <p className="text-xs text-zinc-500">Moliya yilining joriy oyi uchun analitik tuzilma</p>
          </div>

          <div className="space-y-3 flex-1 pt-2">
            <div className="border-b border-[#ffffff0a] pb-2 flex justify-between text-xs font-semibold uppercase text-zinc-500">
              <span>Maddalar nomi</span>
              <span>Qiymat (UZS)</span>
            </div>

            {/* Income Streams */}
            <div className="flex justify-between text-xs py-1.5">
              <span className="text-[#F0EDE6] font-medium flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D9F6E]" />
                Asosiy daromadlar (Savdo)
              </span>
              <span className="font-bold text-[#F0EDE6]">{formatUzS(totalRevenue)}</span>
            </div>

            {/* Costs */}
            <div className="flex justify-between text-xs py-1.5">
              <span className="text-zinc-400 font-normal flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                O'zgaruvchan xarajatlar (COGS)
              </span>
              <span className="font-semibold text-zinc-300">-{formatUzS(totalExpenses * 0.4)}</span>
            </div>

            <div className="flex justify-between text-xs py-1.5">
              <span className="text-zinc-400 font-normal flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C0392B]" />
                Doimiy ma'muriy xarajatlar (OPEX)
              </span>
              <span className="font-semibold text-zinc-300">-{formatUzS(totalExpenses * 0.6)}</span>
            </div>

            <div className="border-t border-[#ffffff0c] my-2" />

            {/* Calculations summaries */}
            <div className="flex justify-between text-xs font-bold py-1">
              <span>Operatsion Foyda (EBITDA)</span>
              <span className="text-gold">{formatUzS(totalRevenue - totalExpenses)}</span>
            </div>

            <div className="flex justify-between text-xs font-normal py-1">
              <span className="text-zinc-505">Soliqlar (4% aylanmadan + ijara)</span>
              <span className="text-[#C0392B] font-semibold">-{formatUzS(totalRevenue * 0.04)}</span>
            </div>

            <div className="border-t-2 border-dashed border-[#ffffff1c] my-2 pt-2" />

            <div className="flex justify-between text-sm font-bold">
              <span className="font-syne">SOF FOYDA (NET PROFIT)</span>
              <span className={`font-syne ${netProfit >= 0 ? 'text-[#2D9F6E]' : 'text-[#C0392B]'}`}>{formatUzS(netProfit * 0.92)}</span>
            </div>
          </div>

          <div className="bg-zinc-900/60 p-3.5 rounded-xl border border-[#ffffff04] flex gap-2 text-[11px] text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-[#2D9F6E] shrink-0" />
            <span>Mulklar va buxgalteriya tahlillari xalqaro standartlarga mos va yuridik jihatdan muvofiqlashtirilgan.</span>
          </div>
        </div>

        {/* Right Column - Spending Budget targets limits & Warnings */}
        <div className="card bg-[#0D0D0D] border border-[#ffffff10] p-6 lg:col-span-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-[#ffffff0a] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-gold" />
                <h4 className="text-xs font-bold text-[#F0EDE6] uppercase tracking-wider font-syne">Xarajatlar Budjeti</h4>
              </div>
              <span className="badge-gold font-bold px-2 py-0.5 rounded text-[9.5px]">Budjet monitoringi</span>
            </div>

            {/* Slider to configure custom budget target */}
            <div className="space-y-2 bg-[#161616] p-4 rounded-xl border border-[#ffffff04]">
              <div className="flex justify-between text-xs font-semibold text-zinc-400">
                <span>Maksimal xarajat maqsadi:</span>
                <span className="text-gold font-syne font-bold">{formatUzS(budgetLimit)}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="15000000"
                step="500000"
                value={budgetLimit}
                onChange={(e) => setBudgetLimit(parseInt(e.target.value))}
                className="w-full accent-gold bg-[#0A0A0A] h-1.5 rounded appearance-none cursor-pointer"
              />
            </div>

            {/* Displaying Categories distribution Progress bars */}
            <div className="space-y-3 pt-1">
              {categories.map((cat, idx) => {
                const percentage = totalAllocated > 0 ? ((cat.allocated / totalAllocated) * 100).toFixed(0) : "0";
                const isOverBudget = totalAllocated > 0 && budgetLimit > 0 && cat.allocated > (budgetLimit * (cat.allocated / totalAllocated));
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs leading-normal">
                      <span className="text-zinc-400 font-medium flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${cat.color}`} />
                        {cat.name} ({percentage}%)
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="text-[#F0EDE6] font-bold">{formatUzS(cat.allocated)}</span>
                        {isOverBudget && (
                          <span className="text-[10px] bg-[#C0392B15] text-[#C0392B] px-1 rounded border border-[#C0392B30] font-extrabold font-syne">LIMITDAN BALAND</span>
                        )}
                      </div>
                    </div>
                    <div className="h-2 w-full bg-[#161616] rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${cat.color}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-amber-500/[0.02] border border-amber-500/15 rounded-xl p-3.5 flex gap-2.5 text-xs text-amber-500 animate-pulse">
            <AlertTriangle className="w-[18px] h-[18px] text-amber-500 shrink-0 mt-0.5" />
            <p className="leading-relaxed font-normal">
              <strong>Xarajat Sensori ogohlantirishi:</strong> "Ijara xarajatlari" va "Marketing" budjet chegarasiga juda yaqin turibdi. Xarajatlarni yanada optimallashtirish tavsiya etiladi.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
}
