# TEA Kids 1.1.6 — respostas ao relatório de 21/10/2026

Referência: https://github.com/alunoadsnoite/tea-mvp-childs/issues/4

| Observação | Correção |
| --- | --- |
| OBS01 / #5 | O widget aponta explicitamente para MainActivity com ACTION_VIEW e NEW_TASK/CLEAR_TASK. Isso recria a tarefa de navegação com o link de ajuda, evitando restaurar a tarefa antiga da Home. O layout reaplica o link inicial quando o navegador está pronto. A navegação anterior pode ser reiniciada pelo widget; o estado persistido não é apagado. |
| OBS02 / #6 | A seleção vem do ID ativo persistido; o deslocamento inicial, a montagem, mudanças de largura e conteúdo sincronizam a página com o contador. |
| OBS03 / #7 | A lista apresenta “Voltar à rotina” para a execução salva. Abrir a mesma rotina não chama startExecution nem altera pausa, passo ou horários. O botão Retomar na execução continua sendo uma ação explícita. |
| OBS04 / #8 | Cada página de ajuda tem rolagem vertical; os textos não são comprimidos com flexShrink para caber em uma altura fixa. |
| OBS05 / #9 | Remover a mensagem ativa atualiza a seleção a partir do store e mostra uma das mensagens restantes. Configurações agora oferece acesso aos cartões pela interface comum. |
| OBS06 / #10 | O SOS ocupa uma faixa inferior própria, com safe area, fora do viewport do Stack. Não fica sobre os controles da rotina. |

## Validação e limites

Seis testes Jest/Expo cobrem seleção e deslocamento dos cartões, exclusão da mensagem ativa, páginas roláveis, preservação da execução pausada, intenção inicial após montagem e ausência de redirecionamento no início comum. ESLint e TypeScript também foram executados.

Uma compilação Android release x86_64 com as alterações funcionais passou. As tentativas de abrir os emuladores locais falharam no processo do emulador (SIGSEGV), incluindo imagem AOSP Android 16/API 36; o aplicativo não chegou a ser instalado nelas. Portanto **não se declara repetição visual dos testes do Jyri, comprovação em fonte 200%, toque real no widget ou validação humana de usabilidade**. Os resultados de código e testes automatizados não substituem essa conferência. Solicita-se nova verificação do APK corrigido.

## TR07 follow-up: use an existing two-minute step

The additional short-expiry case does not require a routine editor. In the
ordinary UI, open **Minhas Rotinas**, start **Manhã**, and use its first step,
**Acordar** (two minutes). **Hora da Lição / Pegar material** and
**Hora do Brincar / Escolher brincadeira** also begin with two-minute steps.

Suggested device retest, on fictional data:

1. Start Manhã, wait about 30 seconds, and pause.
2. Background the app and terminate only its background process. Reopen through
   the launcher, then use **Voltar à rotina**. Confirm the same step is paused.
3. Use **Continuar** and let the remaining roughly 90 seconds elapse naturally.
   The visual bar should reach empty without restarting the timer.
4. Repeat by backgrounding a running step before its deadline, waiting until
   after its original deadline, and reopening it. The visual bar should be empty.
5. Expiry does not automatically mark the task or routine completed. **Próximo**
   and **Terminar** remain deliberate user actions; **+5 min** can extend time.

The timer regression suite covers fresh countdown configuration, expired-step
remount, foreground recalculation after the deadline, paused progress after the
old deadline, persisted pause/rehydration/resume, and listener cleanup. These
are Jest/Expo tests with a controlled clock and mocked animation scheduling;
they do not constitute a real-time Android expiry or process-death test.
