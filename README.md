# TEA Kids — MVP

Aplicativo móvel para crianças e adolescentes no Espectro Autista (TEA) focado em **autonomia, previsibilidade e regulação emocional**.

## Versão Atual: 1.1.1

### Changelog

#### v1.1.0 (2026-09-29)
- **Tema claro/escuro/automático** em todas as telas
- **Card SOS estilo carta de baralho** com bordas arredondadas e sombra
- **Ícone da fita de puzzle** (símbolo do autismo) em todas as densidades Android
- **Informações do desenvolvedor** na seção Sobre
- **Estrutura de rotas** corrigida (app/ na raiz para Expo Router)

#### v1.1.1 (2026-09-30)
- **Correção: Check-in histórico** — gatilhos agora exibem emoji + label (ex: "🏫 Escola") em vez de ID cru
- **Correção: Cartão de crise** — botões de emergência respeitam `primaryContactId` em vez de usar sempre o primeiro contato
- **Correção: Cartão de crise** — header usa cores do tema dinâmico em vez de hard-coded
- **Correção: Execução de rotina** — remove `setInterval` desnecessário (re-render a cada 1s sem efeito)
- **Correção: Respiração guiada** — `cycleCount` adicionado à dependência do `useEffect`
- **Correção: Execução de rotina** — `resumeExecution` concede tempo mínimo de 2s para o timer não zerar ao retomar
- **Correção: ESLint** — `metro.config.js` agora tem `eslint-disable` para CommonJS

#### v1.0.0 (2026-09-28)
- Lançamento inicial do MVP Kids
- Cartão de Comunicação de Ajuda com emojis
- Check-in de Emoções com emojis
- Rotinas Visuais com emojis e passos simples
- Central de Cartões de Calma
- Respiração Guiada com exercícios divertidos (Balão, Coelho, Flor)
- Tema claro por padrão (mais adequado para crianças)
- Interface colorida e acolhedora

## Principais Funcionalidades

### 1. Cartão de Comunicação de Ajuda
- Acesso instantâneo em 1 toque na Home ou pelo botão flutuante
- Mensagens pré-configuradas com emojis
- Contatos de emergência (ligar/mensagem)
- Funcionalidade 100% offline
- Linguagem adaptada para crianças

### 2. Check-in de Emoções
- Registro rápido com emojis (😞 😕 😐 🙂 😄)
- Felicidade, Energia e Calma
- Gatilhos com emojis (Escola, Amigos, Família, etc.)
- Sugestões automáticas de regulação
- Histórico dos últimos 7 dias

### 3. Rotinas Visuais Sequenciais
- Execução passo-a-passo (uma tarefa por vez)
- Timer visual suave (sem números estressantes)
- Rotinas pré-configuradas (Manhã, Lição, Dormir, Brincar)
- Emojis em cada passo
- Pausa e extensão de tempo sem penalidade

### 4. Central de Cartões de Calma
- Exercícios de respiração divertidos (Balão, Coelho, Flor)
- Jogo dos 5 Sentidos
- Alongamento de Gato
- Desenho da Calma
- Pulo de Energia
- Favoritos e categorias

## Stack Tecnológica

- **Frontend**: React Native + Expo SDK 50 + TypeScript
- **Estilização**: StyleSheet (padrão do projeto original)
- **Estado**: Zustand + AsyncStorage (offline-first)
- **Navegação**: Expo Router
- **Build**: EAS Build / Gradle

## Instalação

```bash
# Instalar dependências
npm install

# Iniciar em modo desenvolvimento
npx expo start

# Build Android (APK)
npx eas build -p android --profile preview

# Build local
cd android && ./gradlew assembleDebug
```

## Estrutura do Projeto

```
src/
├── app/                    # Telas (Expo Router)
│   ├── _layout.tsx         # Layout raiz + FAB
│   ├── index.tsx           # Home
│   ├── crisis-card.tsx     # Cartão de Ajuda
│   ├── crisis-settings.tsx # Configurações do Cartão
│   ├── interception.tsx    # Check-in de Emoções
│   ├── checkin-history.tsx # Histórico
│   ├── routines.tsx        # Lista de Rotinas
│   ├── routine-execution.tsx # Execução
│   ├── regulation.tsx      # Cartões de Calma
│   ├── breathing-guide.tsx # Respiração Guiada
│   └── coping-card/        # Detalhe do Cartão
├── components/             # Componentes reutilizáveis
├── stores/                 # Stores Zustand
├── types/                  # Schemas TypeScript
└── hooks/                  # Custom hooks
```

## Princípios de UX Neurodivergente (Kids)

- **Tema claro por padrão**: Mais adequado para crianças
- **Emojis em tudo**: Facilita a compreensão
- **Linguagem simples**: Palavras curtas e frases diretas
- **Cores vibrantes mas suaves**: Azul, verde, amarelo
- **Baixa carga cognitiva**: Uma ação principal por tela
- **Sem animações piscantes**: Apenas transições suaves
- **Sem alertas vermelhos**: Notificações discretas
- **Tipografia legível**: Contraste WCAG AA
- **Espaçamento generoso**: Respiro visual

## Diferenças do MVP Adultos

| Aspecto | Adultos | Crianças/Adolescentes |
|---------|---------|----------------------|
| Tema padrão | Escuro | Claro |
| Linguagem | Formal | Simples e divertida |
| Check-in | Números (0-100%) | Emojis (😞 😕 😐 🙂 😄) |
| Gatilhos | Texto | Emojis + texto |
| Rotinas | Trabalho/Adulto | Escola/Casa/Brincar |
| Respiração | 4-4-4-4, 4-7-8 | Balão, Coelho, Flor |
| Cartões | Ancoragem 5-4-3-2-1 | Jogo dos 5 Sentidos |
| Cores | Pastel suave | Vibrantes mas suaves |

## Licença

MIT
