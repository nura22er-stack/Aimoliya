import React from 'react';
import { 
  TrendingUp, 
  Sparkles, 
  ArrowRight, 
  Play, 
  Check, 
  CheckCircle,
  Database,
  Users, 
  Layers, 
  Shield, 
  FileText, 
  DollarSign,
  Activity,
  Sliders,
  MessageCircle
} from 'lucide-react';
import { ViewType } from '../types';

interface LandingProps {
  onNavigate: (view: ViewType) => void;
  onDemoLogin: () => void;
}

export default function Landing({ onNavigate, onDemoLogin }: LandingProps) {
  
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const features = [
    {
      icon: DollarSign,
      title: "Moliyaviy Tahlil AI",
      desc: "Pul oqimi, foyda/zarar, balans — har kuni real vaqt tahlili. Raqobatchilarga qaraganda 10x tezroq qaror.",
      badge: "Real-vaqt tahlil"
    },
    {
      icon: Sliders,
      title: "Biznes Simulyatori",
      desc: "Qaror qabul qilishdan oldin natijani ko'ring. 1000+ senariy orqali riskni minimallashtiring.",
      badge: "1000+ Senariy"
    },
    {
      icon: TrendingUp,
      title: "AI Prognoz",
      desc: "30-90 kunlik moliyaviy bashorat. Gemini AI asosida, aniqlik darajasi 94%+.",
      badge: "94%+ Aniqlik"
    },
    {
      icon: Shield,
      title: "Xavf Sensori",
      desc: "Muammolar yuzaga kelishidan 2-4 hafta oldin ogohlantirish. Zarar ko'rishdan oldin harakat qiling.",
      badge: "Erta Ogohlantirish"
    },
    {
      icon: MessageCircle,
      title: "AI CFO Chat",
      desc: "Tajribali moliyachi kabi savollarga javob beradi. O'zbek tilida, 24/7 ishlaydi.",
      badge: "24/7 Faol"
    },
    {
      icon: FileText,
      title: "Hisobot Generator",
      desc: "Bank, investor va davlat uchun professional hisobotlarni bir tugma bilan yarating.",
      badge: "Bank Sifatida"
    }
  ];

  return (
    <div className="bg-[#080808] text-[#EDEAE3] min-h-screen selection:bg-[#C9A84C]/30 relative font-sans">
      
      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 h-16 bg-[#080808]/85 backdrop-blur-[20px] border-b border-[#ffffff06] z-[1000] px-4 md:px-12 flex items-center justify-between">
        {/* Left branding */}
        <div className="flex items-center gap-3">
          {/* logo icon: 32x32px, geometric golden square */}
          <div className="w-8 h-8 bg-[#C9A84C] flex items-center justify-center rounded-[4px] relative group overflow-hidden">
            <span className="text-[#080808] font-bold text-sm tracking-tighter">M</span>
            <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform" />
          </div>
          <div>
            <span className="text-base font-bold tracking-tight font-syne text-[#EDEAE3] block leading-none">
              AI Moliyachi
            </span>
            <span className="text-[9px] text-[#7A7671] font-mono tracking-[0.15em] uppercase font-semibold mt-0.5 block">
              VIRTUAL CFO
            </span>
          </div>
        </div>

        {/* Center links */}
        <div className="hidden md:flex items-center gap-8 text-sm text-[#7A7671] transition-colors">
          <button 
            type="button" 
            onClick={() => scrollToId('imkoniyatlar')}
            className="hover:text-[#EDEAE3] relative py-1 cursor-pointer transition-colors hover:after:w-full after:w-0 after:h-[2px] after:bg-[#C9A84C] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Imkoniyatlar
          </button>
          <button 
            type="button" 
            onClick={() => scrollToId('qadamlar')}
            className="hover:text-[#EDEAE3] relative py-1 cursor-pointer transition-colors hover:after:w-full after:w-0 after:h-[2px] after:bg-[#C9A84C] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Qanday ishlaydi
          </button>
          <button 
            type="button" 
            onClick={() => scrollToId('narxlar')}
            className="hover:text-[#EDEAE3] relative py-1 cursor-pointer transition-colors hover:after:w-full after:w-0 after:h-[2px] after:bg-[#C9A84C] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Narxlar
          </button>
          <button 
            type="button" 
            onClick={onDemoLogin}
            className="hover:text-[#EDEAE3] relative py-1 cursor-pointer transition-colors hover:after:w-full after:w-0 after:h-[2px] after:bg-[#C9A84C] after:absolute after:bottom-0 after:left-0 after:transition-all"
          >
            Haqida (Demo)
          </button>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          <button 
            type="button"
            onClick={() => onNavigate('login')}
            className="text-xs md:text-sm font-medium text-[#7A7671] hover:text-[#EDEAE3] transition-colors cursor-pointer"
          >
            Kirish
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('register')}
            className="h-10 px-5 bg-[#C9A84C] text-[#080808] font-bold font-syne text-xs rounded hover:bg-[#E2C47A] transition-all cursor-pointer shadow-[0_4px_14px_rgba(201,168,76,0.2)]"
          >
            Boshlash →
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="min-h-screen bg-[#080808] px-6 md:px-20 pt-28 pb-16 flex flex-col justify-center">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full">
          
          {/* Left Column: text box */}
          <div className="lg:col-span-7 space-y-6 fade-up">
            
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.30)] w-fit">
              <span className="w-1.5 h-1.5 bg-[#C9A84C] rounded-full pulse" />
              <span className="text-[10px] font-mono tracking-[0.1em] text-[#C9A84C] font-semibold uppercase">
                ● MARKAZIY OSIYONING #1 AI CFO PLATFORMASI
              </span>
            </div>

            {/* Main elegant heading display */}
            <h1 className="text-4xl md:text-5xl lg:text-[68px] lg:leading-[1.05] tracking-tight font-extrabold font-syne">
              Biznesingizning <br />
              Shaxsiy <br />
              <span className="text-[#C9A84C] shimmer-gold inline-block">Moliyaviy</span> <br />
              Direktori — AI
            </h1>

            {/* Description */}
            <p className="text-[#7A7671] text-base md:text-lg max-w-[480px] font-normal leading-relaxed">
              Kichik va o'rta bizneslar uchun sun'iy intellekt asosida pullarni boshqarish, foydani oshirish va moliyaviy xavflarning oldini olish platformasi.
            </p>

            {/* Call to action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-[18px] pt-2">
              <button 
                type="button"
                onClick={onDemoLogin}
                className="bg-[#C9A84C] text-[#080808] h-12 px-7 rounded font-syne font-bold text-sm hover:bg-[#E2C47A] transform hover:translate-y-[-1px] transition-all cursor-pointer shadow-[0_5px_15px_rgba(201,168,76,0.25)] flex items-center justify-center gap-2"
              >
                Demo Tizimga Kirish →
              </button>
              <button 
                type="button"
                onClick={() => onNavigate('register')}
                className="bg-transparent text-[#EDEAE3] h-12 px-7 rounded border border-[rgba(255,255,255,0.1)] hover:border-[rgba(201,168,76,0.3)] hover:text-[#C9A84C] transition-all text-sm font-medium cursor-pointer flex items-center justify-center gap-2"
              >
                ▷ 14 Kun Bepul Sinab Ko'ring
              </button>
            </div>

            {/* Trust markers */}
            <div className="pt-8 border-t border-[rgba(255,255,255,0.06)] grid grid-cols-3 gap-6">
              <div className="space-y-0.5 border-r border-[rgba(255,255,255,0.06)]">
                <div className="text-xl md:text-[26px] font-medium font-mono text-[#EDEAE3]">12,000+</div>
                <div className="text-xs text-[#7A7671] font-sans">Faol Bizneslar</div>
              </div>
              <div className="space-y-0.5 border-r border-[rgba(255,255,255,0.06)]">
                <div className="text-xl md:text-[26px] font-medium font-mono text-[#EDEAE3]">98.3%</div>
                <div className="text-xs text-[#7A7671] font-sans">Tahlil Aniqligi</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xl md:text-[26px] font-medium text-[#C9A84C] font-mono">4+</div>
                <div className="text-xs text-[#7A7671] font-sans">Markaziy Osiyo</div>
              </div>
            </div>

          </div>

          {/* Right Column: Premium Live Dashboard mockup */}
          <div className="lg:col-span-5 fade-up delay-1">
            <div className="bg-[#0F0F0F] border border-[rgba(201,168,76,0.30)] rounded-2xl overflow-hidden shadow-[0_0_0_1px_rgba(201,168,76,0.15),0_32px_64px_rgba(0,0,0,0.6)]">
              
              {/* Top system chrome bar */}
              <div className="h-9 bg-[#141414] border-b border-[rgba(255,255,255,0.06)] px-4 flex items-center justify-between">
                {/* 3 macOS dots */}
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57] opacity-60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E] opacity-60" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#28C840] opacity-60" />
                </div>

                {/* Processing title */}
                <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider text-[#C9A84C] font-bold">
                  <span className="w-1.5 h-1.5 bg-[#1F8A5E] rounded-full pulse" />
                  MOLIYAVIY MONITORING LIVE
                </div>

                {/* Sub Indicator flag */}
                <div className="bg-[#1A1A1A] text-[10px] text-[#7A7671] px-2 py-0.5 rounded font-medium">
                  Chilonzor Filiali
                </div>
              </div>

              {/* Fake dashboard view container */}
              <div className="p-5 space-y-4">
                
                {/* Blok 1: Net Profit metrics */}
                <div className="space-y-1">
                  <span className="text-[10px] text-[#7A7671] font-mono tracking-wider block uppercase">OYLIK SOF FOYDA (P&L)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl md:text-3xl font-medium font-mono text-[#1F8A5E]">+15,482,000 UZS</span>
                    <span className="text-[10px] bg-[rgba(31,138,94,0.12)] text-[#1F8A5E] font-bold px-2 py-0.5 rounded-md font-mono">
                      ↑ +15.4%
                    </span>
                  </div>
                </div>

                {/* Separator line */}
                <div className="border-b border-[rgba(255,255,255,0.06)]" />

                {/* Blok 2: Multi column indicators cards */}
                <div className="grid grid-cols-2 gap-3">
                  {/* Metric 1 */}
                  <div className="bg-[#141414] p-3 rounded-lg border border-[rgba(255,255,255,0.04)] space-y-1">
                    <span className="text-[9px] text-[#7A7671] font-mono uppercase block">RENTABELLIK KO'RSATKICHI</span>
                    <span className="text-xl font-bold font-mono text-[#C9A84C] block">38.4%</span>
                    {/* Linear progress metric bar indicator */}
                    <div className="h-1 w-full bg-[#1A1A1A] rounded-full mt-2 overflow-hidden">
                      <div className="h-full bg-[#C9A84C] rounded-full" style={{ width: '38.4%' }} />
                    </div>
                  </div>

                  {/* Metric 2 */}
                  <div className="bg-[#141414] p-3 rounded-lg border border-[rgba(255,255,255,0.04)] space-y-1">
                    <span className="text-[9px] text-[#7A7671] font-mono uppercase block">CASH FLOW STATUS</span>
                    <span className="text-[13px] text-[#EDEAE3] font-bold block">Barqaror</span>
                    <span className="text-[10px] text-[#1F8A5E] block leading-none font-medium mt-1">Kassa uzilishi xavfi yo'q</span>
                  </div>
                </div>

                {/* Separator line */}
                <div className="border-b border-[rgba(255,255,255,0.06)]" />

                {/* Blok 3: Cost Optimizer */}
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#7A7671] font-mono text-[9px] uppercase">XARAJAT KONTROLI:</span>
                  <div className="flex items-center gap-1 text-[#C9A84C] font-semibold">
                    <span>Yuqori darajada optimallashgan</span>
                    <span className="text-sm">↗</span>
                  </div>
                </div>

                {/* Separator line */}
                <div className="border-b border-[rgba(255,255,255,0.06)]" />

                {/* Blok 4: AI Recommendations Box inside mockup */}
                <div className="bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.30)] rounded-lg p-3.5 space-y-2">
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                    <span className="text-[#C9A84C] font-bold text-xs font-syne">AI CFO Tavsiyasi:</span>
                  </div>
                  <p className="text-[12.5px] text-[#EDEAE3] leading-normal font-sans">
                    Narxlarni 7% ga oshirish mijozlar ketish xavfisiz jami sof foydani <strong className="text-[#C9A84C] font-bold">+3,200,000 UZS</strong> ga ko'paytirish imkonini beradi.
                  </p>
                  <div className="flex items-center justify-between text-[10.5px] text-[#7A7671] pt-1 font-mono">
                    <span>Ishonchlilik: 94%</span>
                    <span className="text-[#C9A84C] font-semibold hover:underline cursor-pointer">Ko'rish →</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FEATURES SECTION */}
      <section id="imkoniyatlar" className="border-t border-[rgba(255,255,255,0.06)] bg-[#080808] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] text-[#C9A84C] uppercase tracking-[0.15em] font-mono block font-bold">
              TIZIM IMKONIYATLARI
            </span>
            <h2 className="text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight font-syne text-[#EDEAE3]">
              Nega aynan AI Moliyachi?
            </h2>
            <p className="text-[#7A7671] text-sm md:text-base leading-relaxed">
              Har bir kichik biznes va savdo nuqtasi uchun maxsus ishlab chiqilgan, murakkab hisob-kitoblarni oddiy va aniq ko'rinishga keltiruvchi texnologiyalar.
            </p>
          </div>

          {/* Cards Grid using exact requested aesthetics borders */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-[rgba(255,255,255,0.06)] rounded-2xl overflow-hidden">
            {features.map((feat, index) => {
              const Icon = feat.icon;
              return (
                <div 
                  key={index} 
                  className="bg-[#0F0F0F] relative p-8 group overflow-hidden transition-colors hover:bg-[#141414] border-t-2 border-t-transparent hover:border-t-[#C9A84C] flex flex-col justify-between min-h-[290px]"
                >
                  <div className="space-y-4">
                    {/* Icon container */}
                    <div className="w-11 h-11 rounded-lg bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.30)] flex items-center justify-center text-[#C9A84C]">
                      <Icon className="w-5 h-5 text-[#C9A84C]" />
                    </div>

                    <h3 className="text-lg font-bold text-[#EDEAE3] tracking-tight font-syne transition-colors group-hover:text-[#C9A84C]">
                      {feat.title}
                    </h3>
                    
                    <p className="text-xs text-[#7A7671] leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>

                  {/* bottom custom indicator pill badge requested */}
                  <div className="pt-5">
                    <span className="inline-block text-[10px] text-[#C9A84C] bg-[rgba(201,168,76,0.15)] border border-[rgba(201,168,76,0.20)] px-3 py-1 rounded-full font-mono font-bold uppercase">
                      {feat.badge}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="qadamlar" className="bg-[#0F0F0F] border-t border-b border-[rgba(255,255,255,0.06)] py-24 px-6 md:px-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Header left */}
          <div className="lg:col-span-4 sticky top-24 space-y-2">
            <span className="text-[11px] text-[#C9A84C] font-mono tracking-widest font-bold block uppercase">QANDAY ISHLAYDI</span>
            <h3 className="text-3xl md:text-[40px] leading-tight font-bold font-syne text-[#EDEAE3]">3 ta oddiy qadam</h3>
            <p className="text-xs text-[#7A7671] pt-2">Ma'lumotlar xavfsizligi to'liq himoyalangan va har sekundda avtomatlashtirilgan.</p>
          </div>

          {/* Steps right vertical list */}
          <div className="lg:col-span-8 space-y-12">
            {/* Step 1 */}
            <div className="flex gap-6 items-start">
              <span className="text-4xl md:text-[50px] font-mono leading-none text-[#C9A84C] opacity-40 font-bold shrink-0 block">01</span>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold font-syne text-[#EDEAE3]">Ma'lumotlarni kiriting</h4>
                <p className="text-xs text-[#7A7671] leading-relaxed max-w-xl">
                  Daromad, xarajat va kredit ma'lumotlaringizni bir marta kiriting. Excel hisob-kitob varaqlarini yuklash yoki retail tizimlar orqali integratsiya qilish imkoniyati ham mavjud.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-6 items-start">
              <span className="text-4xl md:text-[50px] font-mono leading-none text-[#C9A84C] opacity-40 font-bold shrink-0 block">02</span>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold font-syne text-[#EDEAE3]">AI tahlil qiladi</h4>
                <p className="text-xs text-[#7A7671] leading-relaxed max-w-xl">
                  Gemini AI sizning hozirgi do'koningiz yoki korxonangiz holatini soniyalar ichida skanerlaydi, kassa uzilish xavfi bilan foyda yo'qolish muammolarini aniqlaydi.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-6 items-start">
              <span className="text-4xl md:text-[50px] font-mono leading-none text-[#C9A84C] opacity-40 font-bold shrink-0 block">03</span>
              <div className="space-y-1.5">
                <h4 className="text-lg font-bold font-syne text-[#EDEAE3]">Tavsiyalarni bajaring</h4>
                <p className="text-xs text-[#7A7671] leading-relaxed max-w-xl">
                  Biznesingiz margin barqarorligini va aylanma soliq foizlarini pastga tushirish bo'yicha aniq, amaliy, raqamlarga asoslangan virtual moliyaviy tavsiyalarga amal qiling.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* PRICING PLANS SECTION */}
      <section id="narxlar" className="bg-[#080808] py-24 px-6 md:px-12">
        <div className="max-w-7xl mx-auto space-y-16">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] text-[#C9A84C] uppercase tracking-[0.15em] font-mono block font-bold">
              NARXLAR
            </span>
            <h2 className="text-3xl md:text-[44px] leading-tight font-extrabold tracking-tight font-syne text-[#EDEAE3]">
              Biznesingizga mos tarif oling
            </h2>
            <p className="text-[#7A7671] text-xs md:text-sm">
              Hech qanday bank yoki kassa limitlarisiz, istalgan reja doirasida o'zingizga qulay tarzda boshlang.
            </p>
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto items-stretch">
            
            {/* Starter Plan card */}
            <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold font-syne text-[#EDEAE3]">Starter</h4>
                <p className="text-xs text-[#7A7671]">Kichik o'sib borayotgan jismoniy korxonalar va do'konlar uchun.</p>
                <div className="space-y-1 pt-1">
                  <div className="text-3xl md:text-[40px] font-extrabold tracking-tight font-syne text-[#EDEAE3]">Bepul</div>
                  <div className="text-xs font-mono text-[#7A7671]">Hamisha va cheksiz bepul</div>
                </div>

                <div className="border-t border-[rgba(255,255,255,0.06)] my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>AI tahlil (oyiga 50 ta)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>1 ta faol biznes loyixa</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Asosiy moliyaviy hisobot</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>AI Chat (10 so'rov/oy)</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={onDemoLogin}
                className="w-full py-3 rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-[#C9A84C] text-[#EDEAE3] hover:text-[#C9A84C] font-bold font-syne text-xs transition-colors cursor-pointer"
              >
                Bepul Boshlash
              </button>
            </div>

            {/* Pro Plan card - Highlighted */}
            <div className="bg-[#0F0F0F] border border-[#C9A84C] rounded-2xl p-8 flex flex-col justify-between space-y-6 relative shadow-[0_0_24px_rgba(201,168,76,0.12)] transform md:scale-105 z-10">
              {/* Popular flag */}
              <span className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-[#C9A84C] text-[#080808] text-[9.5px] uppercase font-mono tracking-widest font-extrabold px-3.5 py-1 rounded-sm">
                EN MASHHUR
              </span>

              <div className="space-y-4">
                <h4 className="text-lg font-bold font-syne text-[#C9A84C]">Pro</h4>
                <p className="text-xs text-[#7A7671]">O'sayotgan va daromadni optimallashtiruvchi xususiy kompaniyalar uchun.</p>
                <div className="space-y-1 pt-1">
                  <div className="text-3xl md:text-[40px] font-extrabold tracking-tight font-syne text-[#EDEAE3]">149,000</div>
                  <div className="text-xs font-mono text-[#7A7671]">UZS / oy</div>
                </div>

                <div className="border-t border-[rgba(201,168,76,0.30)] my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>AI tahlil (cheksiz)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>5 ta loyiha / filial tahlil</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Biznes Simulyatori ham faol</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>AI Prognoz (90 kunlik bashorat)</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Xavf Sensori ogohlantirishlari</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#EDEAE3]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>AI CFO Chat (cheksiz ko'mak)</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={onDemoLogin}
                className="w-full py-3.5 rounded-lg bg-[#C9A84C] text-[#080808] hover:bg-[#E2C47A] font-bold font-syne text-xs tracking-wide transition-colors cursor-pointer"
              >
                Pro Boshlash →
              </button>
            </div>

            {/* Business Plan card */}
            <div className="bg-[#0F0F0F] border border-[rgba(255,255,255,0.06)] rounded-2xl p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <h4 className="text-lg font-bold font-syne text-[#EDEAE3]">Business</h4>
                <p className="text-xs text-[#7A7671]">Do'konlar tarmog'i, xolding va ko'p filialli biznes egallari uchun.</p>
                <div className="space-y-1 pt-1">
                  <div className="text-3xl md:text-[40px] font-extrabold tracking-tight font-syne text-[#EDEAE3]">449,000</div>
                  <div className="text-xs font-mono text-[#7A7671]">UZS / oy</div>
                </div>

                <div className="border-t border-[rgba(255,255,255,0.06)] my-4" />

                <div className="space-y-3">
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Hamma Pro imkoniyatlari qo'shilgan</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Cheksiz loyihalar va filiyallar</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>10 tagacha jamoa a'zolari</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>API integratsiya + White-label</span>
                  </div>
                  <div className="flex items-center gap-2.5 text-xs text-[#7A7671]">
                    <span className="text-[#C9A84C] font-bold">✓</span>
                    <span>Maxsus 24/7 telefon operator ko'mak</span>
                  </div>
                </div>
              </div>

              <button 
                type="button"
                onClick={() => alert("Biznesingiz uchun API sozlash va shartnoma rasmiylashtirish buyicha so'rov qabul qilindi. Siz bilan tez fursatda bog'lanishadi.")}
                className="w-full py-3 rounded-lg border border-[rgba(255,255,255,0.1)] hover:border-[#C9A84C] text-[#EDEAE3] hover:text-[#C9A84C] font-bold font-syne text-xs transition-colors cursor-pointer"
              >
                Bog'lanish →
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="h-20 border-t border-[rgba(255,255,255,0.06)] bg-black/40 flex flex-col md:flex-row items-center justify-between px-6 md:px-16 text-[11px] text-[#7A7671] gap-2.5 py-4">
        <span>© {new Date().getFullYear()} AI Moliyachi Platformasi. Hamma huquqlar himoyalangan.</span>
        <span className="font-mono text-[9.5px]">CRAFTED IN CENTRAL ASIA • DESIGNED FOR MODERN SMBs</span>
      </footer>

    </div>
  );
}
