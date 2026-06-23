import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const FALLBACK_MODELS = [
  GEMINI_MODEL,
  ...(process.env.GEMINI_FALLBACK_MODELS || 'gemini-2.5-flash-lite')
    .split(',')
    .map((model) => model.trim())
    .filter(Boolean)
].filter((model, index, models) => models.indexOf(model) === index);

app.use(express.json());

const appKnowledgeBase = {
  name: 'AI Moliyachi',
  role: 'Virtual CFO and business assistant for Uzbek SMB owners',
  language: 'Uzbek first; adapt to the user language when asked',
  modules: [
    'Landing: product, features, pricing and demo entry points',
    'Dashboard: revenue, expenses, net profit, cash flow, transactions and AI recommendations',
    'Analytics: margin, tax, liquidity, trend and risk analysis',
    'Simulator: price, employee, marketing and period scenario modeling',
    'AI CFO Chat: finance and general business questions',
    'Reports: financial report export flows',
    'Settings: profile, company, tariff and AI tuning controls',
    'Admin panel: users, subscriptions, platform metrics and activity monitoring'
  ],
  answerRules: [
    'Always be practical, specific and honest about uncertainty.',
    'For financial questions, show calculations in UZS when the needed numbers are available.',
    'For broad questions, answer clearly and then connect the answer to business or finance if useful.',
    'For tax, legal, investment or credit decisions, explain risks and recommend checking a qualified local specialist before final commitment.',
    'Do not claim live internet, bank, tax office or hidden database access unless the user provided that data in the chat context.'
  ]
};

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'ai-moliyachi',
      }
    }
  });
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorText(error: any) {
  if (!error) return '';
  if (typeof error.message === 'string') return error.message;
  if (typeof error === 'string') return error;
  try {
    return JSON.stringify(error);
  } catch {
    return '';
  }
}

function isRetryableGeminiError(error: any) {
  const text = getErrorText(error).toLowerCase();
  return (
    text.includes('503') ||
    text.includes('unavailable') ||
    text.includes('overloaded') ||
    text.includes('high demand') ||
    text.includes('rate limit') ||
    text.includes('429')
  );
}

async function generateWithFallback(
  ai: GoogleGenAI,
  contents: Array<{ role: string; parts: Array<{ text: string }> }>,
  systemInstruction: string
) {
  let lastError: any = null;

  for (const model of FALLBACK_MODELS) {
    for (let attempt = 1; attempt <= 2; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model,
          contents,
          config: {
            systemInstruction,
            temperature: 0.35,
          },
        });

        return {
          model,
          text: response.text || "Uzr, hozirda javob tayyorlashda xatolik yuz berdi."
        };
      } catch (error: any) {
        lastError = error;
        if (!isRetryableGeminiError(error)) {
          throw error;
        }
        await sleep(500 * attempt);
      }
    }
  }

  throw lastError;
}

// Health check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    model: GEMINI_MODEL,
    fallbackModels: FALLBACK_MODELS,
    time: new Date().toISOString()
  });
});

// AI CFO Chat API
app.post('/api/ai-chat', async (req, res) => {
  const { message, context, history } = req.body;
  
  if (!message) {
    return res.status(400).json({ error: 'Xabar yuborilmagan' });
  }

  const ai = getGeminiClient();
  if (!ai) {
    return res.status(503).json({
      error: 'AI kaliti sozlanmagan',
      details: 'Serverda GEMINI_API_KEY topilmadi.'
    });
  }

  try {
    const businessContextStr = context ? JSON.stringify(context, null, 2) : 'Ma\'lumotlar mavjud emas';
    const platformContextStr = JSON.stringify(appKnowledgeBase, null, 2);
    
    const systemInstruction = `
Sen "AI Moliyachi" platformasining sun'iy intellekt yordamchisisan.
Asosiy roling: O'zbekistondagi kichik va o'rta biznes egalari uchun virtual moliyaviy direktor (AI CFO), lekin foydalanuvchining umumiy savollariga ham aniq, foydali va muloyim javob berasan.

Platforma haqida ichki ma'lumot:
${platformContextStr}

Foydalanuvchining hozirgi biznes va sahifa konteksti:
${businessContextStr}

Javob berish qoidalari:
1. Avvalo foydalanuvchi savoliga bevosita javob ber. Keyin kerak bo'lsa izoh, hisob-kitob va tavsiya ber.
2. Moliyaviy savollarda daromad, xarajat, sof foyda, marja, cash flow va risklarni UZS hamda foizlarda ko'rsat.
3. Agar raqam yetishmasa, qisqa taxmin formulasi ber va qaysi ma'lumot kerakligini so'ra.
4. Platforma bo'yicha savollarda qaysi bo'limga kirish, qaysi tugmani bosish va nimani tekshirish kerakligini amaliy qilib ayt.
5. "Har qanday savol"ga javob ber, lekin noto'g'ri ishonch bilan gapirma. Noaniq joyda "aniq bilmayman" deb, tekshirish yo'lini ko'rsat.
6. Soliq, huquq, kredit, investitsiya va shifokorlik kabi yuqori mas'uliyatli mavzularda ehtiyotkor bo'l va yakuniy qarordan oldin mutaxassis bilan tekshirishni ayt.
7. Javobni o'zbek tilida, qisqa sarlavhalar, punktlar va zarur bo'lsa jadval bilan chiroyli Markdown formatida yoz.
`;

    // Reconstruct conversation history if any
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      for (const turn of history) {
        formattedContents.push({
          role: turn.role,
          parts: [{ text: turn.text }]
        });
      }
    }
    
    // Add current user user_message
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const result = await generateWithFallback(ai, formattedContents, systemInstruction);
    res.json({ response: result.text, model: result.model });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ 
      error: 'AI xizmatida xatolik yuz berdi', 
      details: getErrorText(error) || 'Noma\'lum xatolik'
    });
  }
});

// Business Simulation API
app.post('/api/simulate', (req, res) => {
  const { scenario, priceChange, employeesCount, marketingBudget, durationMonths, currentStats } = req.body;

  // Simple and highly stable mathematical simulator logic based on real inputs
  const monthlyRevenue = currentStats?.revenue ?? 0;
  const monthlyExpenses = currentStats?.expenses ?? 0;
  const currentEmployees = 5;
  const baseSalaryPerEmployee = 1200000; // UZS average

  // Price change simulation: +10% price might increase revenue but might decrease transaction volume slightly
  const priceMultiplier = 1 + (priceChange / 100);
  
  // High prices could drop volume if price goes too high
  let volumeMultiplier = 1;
  if (priceChange > 0) {
    volumeMultiplier = Math.max(0.5, 1 - (priceChange * 0.005)); // e.g., +20% price matches 90% volume
  } else if (priceChange < 0) {
    volumeMultiplier = Math.min(1.5, 1 - (priceChange * 0.003)); // e.g., -20% price matches 106% volume
  }

  // Marketing impact: +1M marketing increases volume
  const addedMarketing = Math.max(0, marketingBudget - 500000);
  const marketingMultiplier = 1 + (addedMarketing / 3000000); // 3M additional marketing increases volume by 100%

  // Employee expenses adjustment
  const employeeDiff = employeesCount - currentEmployees;
  const addedSalaryExpense = employeeDiff * baseSalaryPerEmployee;

  // New Revenue calculation
  const newMonthlyRevenue = Math.round(monthlyRevenue * priceMultiplier * volumeMultiplier * marketingMultiplier);
  const newMonthlyExpenses = Math.round(monthlyExpenses + addedSalaryExpense + (marketingBudget - 500000));
  const newMonthlyProfit = newMonthlyRevenue - newMonthlyExpenses;

  const currentProfit = monthlyRevenue - monthlyExpenses;
  const profitDiff = newMonthlyProfit - currentProfit;

  // Assess Risks
  let riskLevel = 'Past';
  let riskDetails = 'Biznes ko\'rsatkichlari barqaror holatda.';
  let competitorReaction = 'O\'rta';

  if (priceChange > 20) {
    riskLevel = 'Yuqori';
    riskDetails = 'Narxlar keskin oshishi sababli mijozlarni yo\'qotish va raqobatchilarga o\'tib ketish xavfi juda yuqori!';
    competitorReaction = 'Faol';
  } else if (priceChange > 8) {
    riskLevel = 'O\'rta';
    riskDetails = 'Narx oshishi qisman xaridorlar noroziligiga sabab bo\'lishi mumkin. Lekin rentabellikni yaxshilaydi.';
    competitorReaction = 'O\'rta';
  }

  if (newMonthlyProfit < 0) {
    riskLevel = 'Kritik';
    riskDetails = 'Ushbu strategiya ostida biznes minus (zarar)ga kirib bormoqda! Xarajatlarni tekshiring.';
    competitorReaction = 'Sust';
  }

  // AI CFO recommendation explanation
  let aiRecommendation = '';
  if (profitDiff > 0) {
    aiRecommendation = `Ushbu o'zgarishlar oylik foydangizni taxminan +${profitDiff.toLocaleString()} UZS ga oshiradi. Narxlarni sekin-asta 2-3 hafta davomida va marketingni ko'paytirish orqali amalga oshirishingizni tavsiya etaman.`;
  } else {
    aiRecommendation = `Ushbu qaror foydangizni pasaytiradi (-${Math.abs(profitDiff).toLocaleString()} UZS xato). Xodimlar sonini optimallashtirish va marketing xarajatlarini nazorat qilishni maslahat beramiz.`;
  }

  res.json({
    results: {
      newRevenue: newMonthlyRevenue,
      newExpenses: newMonthlyExpenses,
      newProfit: newMonthlyProfit,
      profitDiff: profitDiff,
      riskLevel: riskLevel,
      riskDetails: riskDetails,
      competitorReaction: competitorReaction,
      aiRecommendation: aiRecommendation,
      currentStats: {
        revenue: monthlyRevenue,
        expenses: monthlyExpenses,
        profit: currentProfit
      }
    }
  });
});

async function startServer() {
  // Vite integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AI Moliyachi server local address: http://localhost:${PORT}`);
  });
}

startServer();
