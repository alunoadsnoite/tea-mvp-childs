# TEA Kids — MVP

Aplicativo móvel para crianças e adolescentes no Espectro Autista (TEA) focado em **autonomia, previsibilidade e regulação emocional**.

## Versão Atual: 1.1.3

### Changelog

#### v1.1.3 (2026-10-02)
- **Widget "Preciso de ajuda" no Android** — novo widget de tela inicial (2x1) que abre o app direto em `/crisis-card` pelo deep link `tea-kids://crisis-card`, sem passar pela Home. Emoji 🆘 e a mesma cor de destaque do botão flutuante, para que o widget e o botão dentro do app sejam reconhecidos como a mesma ação. Conteúdo estático, sem lista e sem rolagem: em momento de sobrecarga o alvo precisa ser previsível
- **Acessibilidade do widget** — `contentDescription` descrevendo a ação, contraste de 7.4:1 no título e 5.25:1 na legenda (ambos acima de WCAG AA), e o emoji marcado como decorativo para o TalkBack não lê-lo duas vezes
- **Correção de build** — `.gitignore` ignorava `android/` em qualquer nível, o que também esconderia a pasta versionada `widget/android/` dos fontes do widget. As regras agora são ancoradas na raiz (`/android/`, `/ios/`)
- **Correção de lint** — `nativewind.config.js` recebia `no-undef` em `require`/`module` e quebrava `npm run lint`; `plugins/` foi adicionado ao ignore do ESLint, já que config plugins do Expo rodam em Node/CommonJS
- **Correção de versão** — `app.json` estava em `1.0.0` enquanto o changelog documentava `1.1.2`. Alinhado em `1.1.3` com `versionCode` 3, que antes não existia

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

#### v1.1.2 (2026-10-01)
- **Acessibilidade: botão SOS centralizado** — o botão flutuante 🆘 sai do canto direito e passa ao centro da tela, facilitando o alcance para destros e canhotos
- **Cartão de crise: dica de deslize acima dos cards** — "👈 Deslize para ver mais 👉" aparece antes dos cards, e não depois
- **Correção: Cartão de crise** — cards eram exibidos deslocados para a direita e cortados na borda. As páginas do carrossel usavam a largura total da tela em vez da área visível (o container tem `paddingHorizontal: 24`); agora a largura real da viewport é medida via `onLayout` e usada tanto nas páginas quanto no cálculo da paginação, que também estava dessincronizada
- **Cartão de crise: cards centralizados verticalmente** — o espaço vertical é distribuído entre a dica de deslize e os botões de emergência, com o grupo posicionado mais alto na tela
- **Cartão de crise: card "Estou confuso(a)" removido** das mensagens padrão
- **Migração de dados (`crisis-card-storage-kids` v2)** — como mensagens padrão não podem ser excluídas pela tela de configuração, a migração remove o card "Estou confuso(a)" já salvo no dispositivo. Mensagens criadas pela criança/adolescente são preservadas

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
npx expo prebuild -p android          # gera android/ (managed workflow)
JAVA_HOME=/caminho/para/jdk17 ./android/gradlew assembleRelease
```

O projeto usa **managed workflow**: a pasta `android/` não é versionada. Rode
`npx expo prebuild -p android` antes de qualquer comando Gradle.

Para instalar no aparelho use `assembleRelease`. O APK **debug** não embute o
bundle JS e depende do Metro rodando em `localhost:8081` — instalado sozinho,
abre uma tela de erro.

> **Atenção: JDK 17 é obrigatório.** O AGP 8.1.1 do SDK 50 falha com JDK 21.

O widget "Preciso de ajuda" está **implementado no Android** (um toque abre
`/crisis-card`) e **não implementado no iOS** — ver
[WIDGET_SETUP.md](WIDGET_SETUP.md). Sem o widget, o cartão de ajuda continua
acessível pelo botão flutuante 🆘 e pelo card da Home.

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
