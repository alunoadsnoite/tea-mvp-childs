/**
 * Schema de dados — Rotinas Visuais (Versão Kids)
 * 
 * Rotinas adaptadas para crianças e adolescentes com emojis.
 */

export interface RoutineStep {
  id: string;
  title: string;
  description?: string;
  emoji: string;
  estimatedMinutes: number;
}

export interface Routine {
  id: string;
  name: string;
  description?: string;
  emoji: string;
  steps: RoutineStep[];
  isDefault: boolean;
  createdAt: number;
}

export interface RoutineExecutionState {
  routineId: string;
  currentStepIndex: number;
  isRunning: boolean;
  isPaused: boolean;
  startedAt: number | null;
  completedAt: number | null;
  stepStartedAt: number | null;
  stepEndsAt: number | null;
  extendedMinutes: number;
}

// Rotinas pré-configuradas para crianças
export const DEFAULT_ROUTINES: Routine[] = [
  {
    id: "default-morning",
    name: "Manhã",
    description: "Preparação para começar o dia",
    emoji: "🌅",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "morning-1", title: "Acordar", description: "Abrir os olhos e espreguiçar", emoji: "⏰", estimatedMinutes: 2 },
      { id: "morning-2", title: "Escovar os dentes", description: "Escovar bem os dentinhos", emoji: "🪥", estimatedMinutes: 3 },
      { id: "morning-3", title: "Tomar café", description: "Comer algo gostoso", emoji: "🥣", estimatedMinutes: 10 },
      { id: "morning-4", title: "Vestir roupa", description: "Colocar a roupa do dia", emoji: "👕", estimatedMinutes: 5 },
      { id: "morning-5", title: "Pegar mochila", description: "Colocar tudo que precisa", emoji: "🎒", estimatedMinutes: 3 },
    ],
  },
  {
    id: "default-homework",
    name: "Hora da Lição",
    description: "Fazer a lição de casa",
    emoji: "📚",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "homework-1", title: "Pegar material", description: "Caderno, lápis e borracha", emoji: "✏️", estimatedMinutes: 2 },
      { id: "homework-2", title: "Ler a tarefa", description: "Entender o que precisa fazer", emoji: "👀", estimatedMinutes: 3 },
      { id: "homework-3", title: "Fazer a lição", description: "Com calma e atenção", emoji: "📝", estimatedMinutes: 20 },
      { id: "homework-4", title: "Guardar tudo", description: "Organizar o material", emoji: "🗂️", estimatedMinutes: 2 },
    ],
  },
  {
    id: "default-bedtime",
    name: "Hora de Dormir",
    description: "Preparação para dormir",
    emoji: "🌙",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "bedtime-1", title: "Escovar os dentes", description: "Escovar bem os dentinhos", emoji: "🪥", estimatedMinutes: 3 },
      { id: "bedtime-2", title: "Colocar pijama", description: "Trocar de roupa", emoji: "👚", estimatedMinutes: 3 },
      { id: "bedtime-3", title: "Ler ou ouvir história", description: "Um momento tranquilo", emoji: "📖", estimatedMinutes: 10 },
      { id: "bedtime-4", title: "Deitar", description: "Fechar os olhos e descansar", emoji: "🛏️", estimatedMinutes: 5 },
    ],
  },
  {
    id: "default-play",
    name: "Hora do Brincar",
    description: "Tempo para se divertir",
    emoji: "🎮",
    isDefault: true,
    createdAt: Date.now(),
    steps: [
      { id: "play-1", title: "Escolher brincadeira", description: "O que vamos fazer hoje?", emoji: "🎯", estimatedMinutes: 2 },
      { id: "play-2", title: "Pegar brinquedos", description: "Preparar tudo", emoji: "🧸", estimatedMinutes: 3 },
      { id: "play-3", title: "Brincar", description: "Se divertir!", emoji: "🎉", estimatedMinutes: 30 },
      { id: "play-4", title: "Guardar brinquedos", description: "Organizar o espaço", emoji: "📦", estimatedMinutes: 5 },
    ],
  },
];
