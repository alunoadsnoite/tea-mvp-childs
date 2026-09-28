/**
 * Schema de dados — Cartões de Calma (Versão Kids)
 * 
 * Estratégias de regulação adaptadas para crianças e adolescentes.
 */

export type CopingCardCategory = "breathing" | "grounding" | "movement" | "creative" | "custom";

export interface CopingCard {
  id: string;
  title: string;
  description: string;
  emoji: string;
  category: CopingCardCategory;
  steps: string[];
  isDefault: boolean;
  isFavorite: boolean;
  createdAt: number;
}

export interface BreathingExerciseConfig {
  id: string;
  name: string;
  description: string;
  emoji: string;
  pattern: [number, number, number, number];
  cycles: number;
}

// Exercícios de respiração para crianças
export const BREATHING_EXERCISES: BreathingExerciseConfig[] = [
  {
    id: "balloon",
    name: "Respiração de Balão",
    description: "Imagine que seu barriga é um balão. Encha e esvazie!",
    emoji: "🎈",
    pattern: [4, 2, 4, 0],
    cycles: 4,
  },
  {
    id: "bunny",
    name: "Respiração de Coelho",
    description: "Cheire como um coelho (inspire) e sopre como se apagasse uma vela (expire).",
    emoji: "🐰",
    pattern: [3, 0, 3, 0],
    cycles: 5,
  },
  {
    id: "flower",
    name: "Respiração de Flor",
    description: "Cheire uma flor (inspire) e sopre um dente de leão (expire).",
    emoji: "🌸",
    pattern: [4, 0, 4, 0],
    cycles: 4,
  },
];

// Cartões de calma pré-configurados para crianças
export const DEFAULT_COPING_CARDS: CopingCard[] = [
  {
    id: "default-breathing-balloon",
    title: "Respiração de Balão",
    description: "Encha a barriga como um balão e esvazie devagar",
    emoji: "🎈",
    category: "breathing",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Coloque a mão na barriga",
      "Inspire pelo nariz contando até 4 (enchendo o balão)",
      "Segure por 2 segundos",
      "Expire pela boca contando até 4 (esvaziando o balão)",
      "Repita 4 vezes",
    ],
  },
  {
    id: "default-grounding-5-4-3-2-1",
    title: "Jogo dos 5 Sentidos",
    description: "Use seus sentidos para se acalmar",
    emoji: "👀",
    category: "grounding",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Olhe ao redor e encontre 5 coisas que você pode ver",
      "Toque em 4 coisas e sinta a textura",
      "Escute e identifique 3 sons diferentes",
      "Sinta 2 cheiros ao redor",
      "Encontre 1 coisa que você pode provar ou tocar com a boca",
    ],
  },
  {
    id: "default-movement-stretch",
    title: "Alongamento de Gato",
    description: "Estique o corpo como um gato",
    emoji: "🐱",
    category: "movement",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Fique de pé com os pés afastados",
      "Estique os braços para cima como um gato",
      "Inspire enquanto estica",
      "Expire enquanto dobra o corpo para frente",
      "Deixe os braços caírem relaxados",
      "Repita 3 vezes",
    ],
  },
  {
    id: "default-creative-draw",
    title: "Desenho da Calma",
    description: "Desenhe como você está se sentindo",
    emoji: "🎨",
    category: "creative",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Pegue papel e lápis de cor",
      "Feche os olhos e respire fundo 3 vezes",
      "Desenho como você se sente (pode ser abstrato!)",
      "Use cores que representam suas emoções",
      "Quando terminar, respire fundo e sorria",
    ],
  },
  {
    id: "default-movement-jump",
    title: "Pulo de Energia",
    description: "Gaste energia com pulos divertidos",
    emoji: "🦘",
    category: "movement",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Fique de pé no lugar",
      "Pule 10 vezes como um canguru",
      "Descanse e respire fundo",
      "Pule mais 10 vezes",
      "Alongue o corpo",
    ],
  },
  {
    id: "default-breathing-count",
    title: "Contagem Calma",
    description: "Conte devagar para se acalmar",
    emoji: "🔢",
    category: "breathing",
    isDefault: true,
    isFavorite: false,
    createdAt: Date.now(),
    steps: [
      "Feche os olhos",
      "Inspire contando até 5",
      "Expire contando até 5",
      "Repita 5 vezes",
      "Abra os olhos e sorria",
    ],
  },
];
