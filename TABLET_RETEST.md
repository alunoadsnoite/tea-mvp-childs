# Reteste da tela inicial (TAB01 / TAB02)

As correções usam a versão 1.1.6 como base. A tela inicial agora pode rolar
verticalmente, inclusive até Configurar. Os rótulos secundários podem quebrar
linha. O texto principal de ajuda usa uma cor escura com contraste mínimo
4,5:1 sobre o azul dos temas claro e escuro.

Para repetir no Samsung SM-X210:

1. Salve um check-in fictício e volte à tela inicial.
2. Em retrato e paisagem, com fontes a 110% e 200%, role do início ao fim.
   Confirme que Olá, Preciso de ajuda e Configurar ficam acessíveis e legíveis.
3. Em cada tema, abra o cartão pelo botão principal Preciso de ajuda e confira
   também o SOS separado no rodapé.
4. Toque em Configurar e confirme a navegação. Preserve os dados existentes.

Os testes automatizados verificam o contraste e a presença de Configurar no
conteúdo rolável. Eles não comprovam a renderização nem a rolagem física no
Samsung; esse reteste permanece pendente.

## Caminhos das rotinas existentes

Esta versão não implementa uma rotação automática de atividades por períodos
Manhã / Tarde / Noite. Os nomes disponíveis em Minhas rotinas são Manhã,
Hora da Lição, Hora de Dormir e Hora do Brincar. Para executar uma delas:
Minhas rotinas → rotina desejada → Começar. Os passos avançam explicitamente
pelo controle Próximo; o fim do temporizador não avança sozinho. Uma execução
salva pode ser reaberta por Voltar à rotina.
