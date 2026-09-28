/**
 * Schema de dados — Cartão de Comunicação de Crise (Versão Kids)
 * 
 * Linguagem adaptada para crianças e adolescentes.
 * Estrutura local-first para funcionamento 100% offline.
 */

export interface CrisisMessage {
  id: string;
  title: string;
  content: string;
  emoji: string;
  isDefault: boolean;
}

export interface EmergencyContact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  emoji: string;
}

export interface CrisisCardState {
  messages: CrisisMessage[];
  contacts: EmergencyContact[];
  activeMessageId: string | null;
  isLoading: boolean;
  primaryContactId: string | null;
}

// Mensagens pré-configuradas para crianças/adolescentes
export const DEFAULT_MESSAGES: CrisisMessage[] = [
  {
    id: "default-1",
    title: "Preciso de ajuda",
    content:
      "Estou me sentindo sobrecarregado(a) e preciso de um momento. Pode me ajudar a encontrar um lugar quieto?",
    emoji: "🫂",
    isDefault: true,
  },
  {
    id: "default-2",
    title: "Não quero barulho",
    content:
      "Os sons estão muito altos para mim. Por favor, vamos para um lugar mais silencioso?",
    emoji: "🔇",
    isDefault: true,
  },
  {
    id: "default-3",
    title: "Estou confuso(a)",
    content:
      "Estou me sentindo confuso(a) e preciso de um tempo para pensar. Pode me dar um minuto?",
    emoji: "🤔",
    isDefault: true,
  },
  {
    id: "default-4",
    title: "Preciso de um abraço",
    content:
      "Estou me sentindo triste ou com medo. Um abraço pode me ajudar?",
    emoji: "🤗",
    isDefault: true,
  },
  {
    id: "default-5",
    title: "Não estou bem",
    content:
      "Não estou me sentindo bem. Preciso de ajuda. Pode chamar um adulto?",
    emoji: "😢",
    isDefault: true,
  },
];
