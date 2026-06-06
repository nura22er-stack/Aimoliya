import React, { useState } from 'react';
import { 
  FileSpreadsheet, 
  FileText, 
  Download, 
  Plus, 
  CheckCircle, 
  Printer, 
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  Clock
} from 'lucide-react';
import { Project } from '../types';

interface ReportsViewProps {
  project: Project;
}

export default function ReportsView({ project }: ReportsViewProps) {
  const [reportType, setReportType] = useState('P&L Statement');
  const [format, setFormat] = useState('PDF');
  const [month, setMonth] = useState('Iyun 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState<{name: string, date: string, size: string} | null>(null);

  // Static list of downloaded statements
  const [statements, setStatements] = useState([
    { id: 1, name: "P&L_Kassa_Hisoboti_May_2026.pdf", date: "2026-05-31", size: "1.2 MB", type: "P&L Statement", status: "Tayyor" },
    { id: 2, name: "Balans_Budjeti_Aprel_2026.xlsx", date: "2026-04-30", size: "840 KB", type: "Balance Sheet", status: "Tayyor" },
    { id: 3, name: "Kassa_Uzilishi_Xavfi_Tahlili.pdf", date: "2026-04-15", size: "2.4 MB", type: "Xavf Analizi", status: "Eski" },
  ]);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);
    setGeneratedReport(null);

    // Simulate standard document generation in 1000ms
    setTimeout(() => {
      const fileName = `${reportType.replace(/\s+/g, '_')}_${month.replace(/\s+/g, '_')}.${format.toLowerCase()}`;
      setGeneratedReport({
        name: fileName,
        date: new Date().toISOString().split('T')[0],
        size: format === 'PDF' ? '1.8 MB' : '920 KB'
      });
      setIsGenerating(false);
    }, 1000);
  };

  const handleAddToArchive = () => {
    if (generatedReport) {
      setStatements(prev => [
        {
          id: Date.now(),
          name: generatedReport.name,
          date: generatedReport.date,
          size: generatedReport.size,
          type: reportType,
          status: "Tayyor"
        },
        ...prev
      ]);
      setGeneratedReport(null);
    }
  };

  const downloadFile = (name: string, content: string) => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const buildReportContent = (name: string, type: string) => {
    return [
      `AI Moliyachi - ${type}`,
      `Fayl: ${name}`,
      `Loyiha: ${project.name}`,
      `Davr: ${month}`,
      `Yaratilgan sana: ${new Date().toISOString()}`,
      '',
      'Ushbu demo fayl UI orqali real yuklab olish oqimini tekshirish uchun yaratildi.',
      'Keyingi bosqichda bu joyga backend PDF/Excel generator ulanishi mumkin.'
    ].join('\n');
  };

  return (
    <div className="space-y-6 animate-in">
      
      {/* 2 column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left 5 cols - Generate Configuration */}
        <div className="card bg-bg-card p-6 lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 border-b border-[#ffffff0a] pb-3">
              <FileSpreadsheet className="w-5 h-5 text-gold" />
              <h4 className="text-sm font-bold text-[#F0EDE6] font-syne">Hisobot Generator</h4>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4 text-xs font-normal">
              {/* Report selection */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Hisobot Turi (Report Type)</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-100 outline-none focus:border-gold"
                >
                  <option value="P&L Statement">Foyda va zararlar hisoboti (P&L Statement)</option>
                  <option value="Cash Flow Statement">Pul oqimi harakati (Cash Flow Statement)</option>
                  <option value="Balance Sheet">Buxgalteriya balansi (Balance Sheet)</option>
                  <option value="Tax Report">Soliq deklaratsiyasi (Tax Estimate)</option>
                  <option value="AI Risk Analysis">AI Moliyaviy xavflar tahlili (Risk Analysis)</option>
                </select>
              </div>

              {/* Month Selector */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Davr / Sana</label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full h-11 px-3 rounded-lg bg-black border border-[#ffffff12] text-zinc-100 outline-none focus:border-gold"
                >
                  <option value="Iyun 2026">Iyun 2026 (Joriy davr)</option>
                  <option value="May 2026">May 2026</option>
                  <option value="Aprel 2026">Aprel 2026</option>
                  <option value="I chorak 2026">I Chorak 2026</option>
                </select>
              </div>

              {/* Format Selection */}
              <div className="space-y-1.5">
                <label className="text-zinc-400 font-semibold block">Yuborish / Yuklab olish Formati</label>
                <div className="grid grid-cols-3 gap-2">
                  {['PDF', 'EXCEL', 'JSON'].map((fmt) => (
                    <button
                      key={fmt}
                      type="button"
                      onClick={() => setFormat(fmt)}
                      className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                        format === fmt 
                          ? 'bg-gold text-[#0A0A0A]' 
                          : 'bg-zinc-900 text-zinc-400 border border-[#ffffff0a] hover:bg-zinc-800'
                      }`}
                    >
                      {fmt}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full btn-gold h-11 text-xs font-syne font-bold flex items-center justify-center gap-1.5 cursor-pointer mt-4"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#0a0a0a]" />
                    <span>Hisobot shakllantirilmoqda...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-[#0a0a0a]" />
                    <span>Hisobotni Shakllantirish</span>
                  </>
                )}
              </button>
            </form>
          </div>

          <div className="bg-[#C9A84C04] border border-[#C9A84C15] rounded-lg p-3 text-[10.5px] text-zinc-500 font-normal leading-relaxed">
            Hisobotlar xalqaro <strong>IFRS (MHXS)</strong> standartlariga muvofiq, O'zbekiston soliq rejimiga to'g'ri integrallashgan holda generatsiya qilinadi.
          </div>
        </div>

        {/* Right 7 cols - Real Time feedback & Download block */}
        <div className="card bg-[#0D0D0D] border border-[#ffffff10] p-6 lg:col-span-7 flex flex-col justify-between space-y-6">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-[#ffffff09] pb-3">
              <div>
                <span className="text-[10px] text-gold uppercase tracking-wider font-extrabold font-syne">Yuklangan fayllar</span>
                <h3 className="text-base font-bold text-[#F0EDE6] font-syne">Hisobotlar Arxivi va Status</h3>
              </div>
              <Clock className="w-4 h-4 text-zinc-500" />
            </div>

            {/* Generated Report Highlight box if newly prepared */}
            {generatedReport && (
              <div className="bg-gold/[0.04] border border-gold/30 rounded-xl p-4 space-y-3.5 animate-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gold/15 flex items-center justify-center text-gold">
                      {format === 'PDF' ? <FileText className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-[#F0EDE6] truncate max-w-sm">{generatedReport.name}</h4>
                      <p className="text-[10.5px] text-zinc-500">{generatedReport.size} • Tayyorlandi • {generatedReport.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="text-[10.5px] bg-[#2D9F6E12] text-[#2D9F6E] border border-[#2D9F6E1c] px-2 py-0.5 rounded font-extrabold font-syne flex items-center gap-1 animate-pulse">
                      <CheckCircle className="w-3.5 h-3.5" />
                      YUKLANGAN
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 justify-end text-xs font-semibold">
                  <button 
                    onClick={() => {
                      downloadFile(
                        generatedReport.name,
                        buildReportContent(generatedReport.name, reportType)
                      );
                      handleAddToArchive();
                    }}
                    className="btn-gold h-9 px-[18px] text-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Yuklab olish
                  </button>
                  <button 
                    onClick={() => setGeneratedReport(null)}
                    className="px-3.5 py-1.5 bg-[#ffffff05] rounded text-zinc-400 hover:text-white"
                  >
                    Bekor qilish
                  </button>
                </div>
              </div>
            )}

            {/* List of Previous Statements */}
            <div className="space-y-2.5">
              {statements.map((st) => (
                <div 
                  key={st.id} 
                  className="flex items-center justify-between p-3 rounded-lg bg-black/40 border border-[#ffffff04] hover:border-[#ffffff10] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-[34px] h-[34px] rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400">
                      {st.name.endsWith('xlsx') ? <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> : <FileText className="w-4 h-4 text-blue-400" />}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-[#F0EDE6] truncate">{st.name}</p>
                      <p className="text-[10px] text-zinc-500 font-medium">{st.type} • {st.date} • {st.size}</p>
                    </div>
                  </div>

                  <button 
                    onClick={() => downloadFile(st.name, buildReportContent(st.name, st.type))}
                    className="p-2 bg-zinc-900/80 border border-[#ffffff06] hover:border-gold/30 hover:text-gold rounded text-zinc-400 transition-all cursor-pointer"
                    title="Yuklab olish"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[10.5px] text-zinc-600 text-center font-normal pt-2.5 border-t border-[#ffffff09]">
            Hujjatlarni chop etish yoki Excel orqali eksport qilish to'liq qo'llab-quvvatlanadi
          </p>
        </div>

      </div>

    </div>
  );
}
