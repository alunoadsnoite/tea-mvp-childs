/**
 * Schema de dados — Check-in de Emoções (Versão Kids)
 * 
 * Usa emojis e linguagem simples para crianças e adolescentes.
 */

export interface CheckInEntry {
  id: string;
  timestamp: number;
  
  // Níveis com emojis (1-5)
  happiness: number;        // 1-5 — 😊 Nível de felicidade
  energy: number;           // 1-5 — ⚡ Nível de energia
  calm: number;             // 1-5 — 🧘 Nível de calma
  
  // Gatilhos selecionados
  triggers: string[];
  
  // Nota opcional
  note?: string;
}

// Gatilhos pré-definidos para crianças
export const COMMON_TRIGGERS = [
  { id: "school", label: "Escola", emoji: "🏫" },
  { id: "friends", label: "Amigos", emoji: "👫" },
  { id: "family", label: "Família", emoji: "👨‍👩‍👧" },
  { id: "noise", label: "Barulho", emoji: "🔊" },
  { id: "lights", label: "Luzes", emoji: "💡" },
  { id: "change", label: "Mudança", emoji: "🔄" },
  { id: "tired", label: "Cansaço", emoji: "😴" },
  { id: "hunger", label: "Fome", emoji: "🍎" },
  { id: "homework", label: "Lição", emoji: "📚" },
  { id: "game", label: "Jogo", emoji: "🎮" },
] as const;

// Sugestões de regulação baseadas nos níveis
export interface RegulationSuggestion {
  condition: (entry: Omit<CheckInEntry, "id" | "timestamp">) => boolean;
  message: string;
  emoji: string;
}

export const REGULATION_SUGGESTIONS: RegulationSuggestion[] = [
  {
    condition: (entry) => entry.calm <= 2,
    message: "Você parece agitado(a). Vamos tentar respirar fundo juntos? Inspire pelo nariz e solte pela boca.",
    emoji: "🌬️",
  },
  {
    condition: (entry) => entry.energy <= 2,
    message: "Sua energia está baixa. Que tal beber água e fazer uma pausa?",
    emoji: "💧",
  },
  {
    condition: (entry) => entry.happiness <= 2,
    message: "Parece que você não está muito feliz. Quer conversar com alguém de confiança?",
    emoji: "💬",
  },
  {
    condition: (entry) => entry.calm >= 4 && entry.happiness >= 4,
    message: "Você parece bem! Continue assim! 🌟",
    emoji: "⭐",
  },
];
