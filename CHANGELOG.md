# 1.1.16

- Adicionado francês (Français) com 287 traduções, seleção persistente de idioma e widget Android traduzido.
- Textos personalizados continuam preservados.

# Histórico de versões

#### v1.1.14

- Aviso de privacidade em Configurações, exclusão do diário e ações mais claras no Cartão de Ajuda.
- Backup automático desativado no Android, com regras de exclusão para cópia na nuvem e transferência entre aparelhos.

#### v1.1.12
- Seletor offline de português do Brasil, inglês e espanhol em Configurações.
- Interface, rótulos acessíveis e conteúdo padrão traduzidos. Registros e textos personalizados são preservados.
- O endereço em Desenvolvedor abre o aplicativo de e-mail.

#### v1.1.11 (2026-11-10)
- Melhora os rótulos acessíveis dos controles de respiração e evita a leitura duplicada de emojis decorativos. Preserva rolagem, contraste e correções anteriores.

#### v1.1.9 (2026-10-24)
- Mantém o ícone decorativo do SOS dentro do botão com fonte do sistema ampliada.
- Aplica cores dos temas ao editor de cartões, incluindo títulos, mensagens, contatos e campos de texto.
- Preserva a escala dos textos informativos e o rótulo acessível do SOS.

#### v1.1.8 (2026-10-23)
- Preserva o fundo e o layout dos botões da tela inicial ao passar pelo `Link asChild`.
- Corrige o teste de contraste para exercitar o Slot real e alternar efetivamente os dois temas.
- O reteste da nova versão no tablet continua pendente com Jyri.

#### v1.1.7 (2026-10-23)
- Tela inicial com rolagem vertical e rótulos secundários que quebram linha.
- Melhor contraste no texto do botão principal de ajuda nos temas claro e escuro.
- Guia de reteste do tablet em `TABLET_RETEST.md`; validação no aparelho permanece pendente.

#### v1.1.6 (2026-10-21)
- Corrige abertura pelo widget, seleção de cartões, recuperação de rotinas pausadas e textos ampliados.
- Mantém o SOS separado dos controles de rotina.

#### v1.1.5 (2026-10-14)
- Remove permissões Android de armazenamento e sobreposição que o app não utiliza.
- Ativa R8 e remoção de recursos sem uso nos builds release.
- Adiciona variante sem assinatura para o F-Droid e receita de empacotamento com detecção automática de versões.
- Documenta origem dos recursos gráficos e inventário de licenças das dependências.


#### v1.1.4 (2026-10-11)
- Timer visual esvazia suavemente e atualiza ao voltar do segundo plano.
- Pausar uma rotina preserva o tempo restante, inclusive após reabrir o app; +5 min funciona também após o prazo terminar.
- Conclusão permanece na tela até tocar em “Voltar às rotinas”, sem saída automática.
- Histórico e cartões de calma reagem à leitura dos dados salvos e às alterações de favoritos.
- Texto e cartões da execução de rotina respeitam o tema escuro.
- Tema compartilhado entre telas, com leitura tolerante a falhas do armazenamento.
- Controles de rotina e tema com semântica de acessibilidade; ações cabem em telas estreitas.
- Versão exibida em Configurações acompanha a configuração do app.
- Falhas de vibração são tratadas; exclusão de mensagem seleciona apenas mensagens restantes.


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
