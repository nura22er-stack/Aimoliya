import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Sparkles, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Users, 
  TrendingUp, 
  ShieldAlert, 
  Coins, 
  Layers,
  HelpCircle
} from 'lucide-react';
import { Project, SimulationResult } from '../types';

interface SimulatorViewProps {
  project: Project;
}

export default function SimulatorView({ project }: SimulatorViewProps) {
  const [scenario, setScenario] = useState('Narx o\'zgarishi');
  const [priceChange, setPriceChange] = useState<number>(0);
  const [employeesCount, setEmployeesCount] = useState<number>(0);
  const [marketingBudget, setMarketingBudget] = useState<number>(0);
  const [durationMonths, setDurationMonths] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SimulationResult | null>(null);

  // Trigger calculation
  const handleSimulate = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          scenario,
          priceChange,
          employeesCount,
          marketingBudget,
          durationMonths,
          currentStats: {
            revenue: project.revenue,
            expenses: project.expenses
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Artificially wait 600ms for premium UX loading feeling
        setTimeout(() => {
          setResult(data.results);
          setLoading(false);
        }, 600);
      } else {
        throw new Error("Xatolik simulyatsiya API da");
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  // Run simulation once initially
  useEffect(() => {
    handleSimulate();
  }, [project]);

  // Adjust sliders depending on scenario
  const handleScenarioChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    setScenario(val);
    if (val === 'Narx o\'zgarishi') {
      setPriceChange(15);
      setMarketingBudget(500000);
    } else if (val === 'Kengayish va xodim yollash') {
      setPriceChange(0);
      setEmployeesCount(7);
      setMarketingBudget(1200000);
    } else if (val === 'Katta marketing kampaniyasi') {
      setPriceChange(0);
      setMarketingBudget(3500000);
    }
  };

  const formatUzS = (value: number) => {
    return value.toLocaleString('uz-UZ') + " UZS";
  };

  return (
    <div className="space-y-6 animate-in">
      
      {/* Description Header */}
      <div className="bg-gradient-to-r from-[#C9A84C0f] to-transparent border-l-4 border-gold p-4 rounded-r-xl space-y-1">
        <h3 className="text-sm font-bold text-[#F0EDE6] font-syne">Vizual Biznes Simulyatori (CFO Sandbox)</h3>
        <p className="text-xs text-zinc-400 font-normal leading-relaxed">
          Ushbu sandboxda siz narx, xodimlar yoki marketing kabi parametrlarni o'zgartirib ko'rishingiz mumkin. AI algoritmlari real vaqtda yangi sof foyda va bozor xavflarini hisoblab beradi.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left 5 cols - Sliders Configuration */}
        <div className="card bg-bg-card p-6 lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#ffffff0a] pb-3">
              <Layers className="w-5 h-5 text-gold" />
              <h4 className="text-sm font-bold text-[#F0EDE6] font-syne">Simulyatsiya Parametrlari</h4>
            </div>

            {/* Scenario Selection */}
            <div className="space-y-1.5">
              <label className="text-xs text-[#8A8580] font-semibold block">Biznes Senariysi</label>
              <select
                value={scenario}
                onChange={handleScenarioChange}
                className="w-full h-11 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-100 outline-none focus:border-gold text-xs font-semibold"
              >
                <option value="Narx o'zgarishi">Narx o'zgarishi senariysi (Price Optimization)</option>
                <option value="Kengayish va xodim yollash">Yangi filial va xodim yollash (Staffing & Scale)</option>
                <option value="Katta marketing kampaniyasi">Marketing xarajatlarini oshirish (Customer Acquisition)</option>
              </select>
            </div>

            {/* Range 1: Price change */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold">Narx o'zgarishi:</span>
                <span className={`font-syne font-extrabold ${priceChange > 0 ? 'text-[#2D9F6E]' : priceChange < 0 ? 'text-[#C0392B]' : 'text-zinc-500'}`}>
                  {priceChange > 0 ? `+${priceChange}` : priceChange}%
                </span>
              </div>
              <input 
                type="range"
                min="-50"
                max="100"
                step="5"
                value={priceChange}
                onChange={(e) => setPriceChange(parseInt(e.target.value))}
                className="w-full accent-gold bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9.5px] text-zinc-600 font-semibold uppercase">
                <span>Demping (-50%)</span>
                <span>O'zgarishsiz</span>
                <span>Premium (+100%)</span>
              </div>
            </div>

            {/* Range 2: Employees */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold">Xodimlar soni:</span>
                <span className="text-gold font-syne font-extrabold">{employeesCount} kishi</span>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setEmployeesCount(prev => Math.max(1, prev - 1))}
                  className="w-10 h-9 bg-[#ffffff05] hover:bg-zinc-800 text-[#F0EDE6] text-sm font-bold rounded-lg border border-[#ffffff0c] transition-colors cursor-pointer"
                >
                  -
                </button>
                <div className="flex-1 text-center bg-black/40 h-9 flex items-center justify-center rounded-lg border border-[#ffffff05] text-xs font-semibold text-zinc-300">
                  <Users className="w-[18px] h-[18px] mr-2 text-gold inline" />
                  Maket bo'yicha: {employeesCount} faol ishchi
                </div>
                <button 
                  onClick={() => setEmployeesCount(prev => Math.min(30, prev + 1))}
                  className="w-10 h-9 bg-[#ffffff05] hover:bg-zinc-800 text-[#F0EDE6] text-sm font-bold rounded-lg border border-[#ffffff0c] transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Range 3: Marketing Budget */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-zinc-300 font-bold">Marketing & Reklama budjeti:</span>
                <span className="text-gold font-syne font-extrabold">{formatUzS(marketingBudget)}</span>
              </div>
              <input 
                type="range"
                min="0"
                max="10000000"
                step="250000"
                value={marketingBudget}
                onChange={(e) => setMarketingBudget(parseInt(e.target.value))}
                className="w-full accent-gold bg-zinc-900 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9.5px] text-zinc-600 font-semibold uppercase">
                <span>0 UZS</span>
                <span>5M UZS</span>
                <span>10M UZS</span>
              </div>
            </div>

            {/* Range 4: Period selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs text-[#8A8580] font-semibold block">Simulyatsiya Davri</label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setDurationMonths(m)}
                    className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      durationMonths === m 
                        ? 'bg-gold text-[#0A0A0A]' 
                        : 'bg-[#ffffff05] hover:bg-zinc-800 text-zinc-300 border border-[#ffffff0c]'
                    }`}
                  >
                    {m} oy
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleSimulate}
            disabled={loading}
            className="w-full btn-gold h-12 text-sm font-syne font-bold flex items-center justify-center gap-2 cursor-pointer mt-4"
          >
            <Calculator className="w-[18px] h-[18px]" />
            {loading ? 'Simulyatsiya hisoblanmoqda...' : 'Simulyatsiyani Boshlash'}
          </button>
        </div>

        {/* Right 7 cols - Simulation Results Display */}
        <div className="card bg-[#0D0D0D] border border-[#ffffff10] p-6 lg:col-span-7 flex flex-col justify-between space-y-6 min-h-[480px]">
          {loading ? (
            <div className="flex-1 flex flex-col justify-center items-center space-y-4">
              {/* Shimmer loading spinner */}
              <div className="w-12 h-12 rounded-full border-4 border-gold/15 border-t-gold animate-spin" />
              <div className="space-y-1.5 text-center">
                <p className="text-sm font-bold text-[#F0EDE6] font-syne animate-pulse">Biznes natijalari tahlil qilinmoqda...</p>
                <p className="text-xs text-zinc-500 font-normal">Gemini CFO Sandbox hisobotlarni simulyatsiya qilmoqda.</p>
              </div>
            </div>
          ) : result ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Top header values comparison */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-[#ffffff09] pb-3">
                  <div>
                    <span className="text-[10px] text-gold uppercase tracking-wider font-extrabold font-syne">Simulyatsiya Natijalari</span>
                    <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Senariy: {scenario} ({durationMonths} oylik davr)</h3>
                  </div>
                  <span className={`px-2.5 py-1 rounded text-xs font-extrabold ${
                    result.riskLevel === 'Past' 
                      ? 'badge-success' 
                      : result.riskLevel === 'O\'rta' 
                      ? 'bg-amber-500/10 text-amber-500' 
                      : 'badge-danger'
                  }`}>
                    Xavf darajasi: {result.riskLevel}
                  </span>
                </div>

                {/* KPI Metrics block */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-[#161616] border border-[#ffffff06] p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Bashoratli Daromad</span>
                    <span className="text-lg font-bold font-syne text-[#F0EDE6] block">
                      {formatUzS(result.newRevenue)}
                    </span>
                  </div>

                  <div className="bg-[#161616] border border-[#ffffff06] p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Bashoratli Xarajat</span>
                    <span className="text-lg font-bold font-syne text-[#F0EDE6] block">
                      {formatUzS(result.newExpenses)}
                    </span>
                  </div>

                  <div className="bg-[#161616] border border-[#ffffff06] p-4 rounded-xl space-y-1">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Bashoratli Sof Foyda</span>
                    <span className={`text-lg font-bold font-syne block ${result.newProfit >= 0 ? 'text-[#2D9F6E]' : 'text-[#C0392B]'}`}>
                      {formatUzS(result.newProfit)}
                    </span>
                  </div>
                </div>

                {/* Comparative Visualizer columns */}
                <div className="bg-zinc-950 p-4 border border-[#ffffff04] rounded-xl space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-zinc-400 font-bold">Foyda O'zgarishi:</span>
                    <span className={`font-syne font-extrabold ${result.profitDiff >= 0 ? 'text-[#2D9F6E]' : 'text-[#C0392B]'}`}>
                      {result.profitDiff >= 0 ? '+' : ''}{formatUzS(result.profitDiff)} /oy
                    </span>
                  </div>

                  {/* Graphical comparison bar */}
                  <div className="h-[18px] w-full bg-zinc-900 rounded-lg overflow-hidden flex text-[10px] text-black font-extrabold">
                    <div className="h-full bg-zinc-700 text-zinc-300 px-2 flex items-center justify-center font-bold" style={{ width: '45%' }}>
                      Hozirgi: {Math.round((result.currentStats.profit) / 1000000)}M
                    </div>
                    <div className={`h-full px-2 flex items-center justify-center font-bold font-syne text-black ${result.profitDiff >= 0 ? 'bg-gold' : 'bg-[#C0392B]'}`} style={{ width: '55%' }}>
                      Simulyatsiya: {Math.round((result.newProfit) / 1000000)}M
                    </div>
                  </div>
                  
                  {/* Competitor reaction detail */}
                  <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-500 pt-1">
                    <span>Raqobatchilar munosabati xavfi:</span>
                    <span className="text-zinc-300 font-bold uppercase">{result.competitorReaction} darajada faol</span>
                  </div>
                </div>

                {/* Risk detail commentary */}
                <div className="flex gap-2 text-xs bg-zinc-900/60 p-3 rounded-lg border border-[#ffffff04]">
                  <HelpCircle className="w-[18px] h-[18px] text-zinc-500 shrink-0 mt-0.5" />
                  <p className="text-zinc-400 font-normal leading-relaxed">
                    <strong>Bozordagi Tahliliy Xulosalar:</strong> {result.riskDetails}
                  </p>
                </div>
              </div>

              {/* AI CFO recommendation section */}
              <div className="bg-gold/[0.03] border border-gold/25 rounded-xl p-[18px] space-y-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold text-gold font-syne">
                  <Sparkles className="w-4 h-4 text-gold shrink-0 animate-pulse" />
                  <span>AI CFO Virtual Tavsiyasi:</span>
                </div>
                <p className="text-xs text-[#F0EDE6] leading-relaxed font-normal">
                  {result.aiRecommendation}
                </p>
              </div>

            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center items-center text-center text-zinc-600">
              <Sparkles className="w-10 h-10 mb-2 opacity-50 text-gold" />
              <p className="text-xs">Parametrlarni o'zgartirib va "Simulyatsiyani Boshlash" tugmasini bosing</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
