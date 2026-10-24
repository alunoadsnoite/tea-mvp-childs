# Reteste da tela inicial (TAB01 / TAB02)

A rolagem da 1.1.7 passou no reteste do Jyri nas oito combinações. O texto
de ajuda ainda desapareceu no tema escuro; a correção adicional está na 1.1.8.
A tela inicial agora pode rolar
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

Na 1.1.8, os estilos dos cinco botões são achatados antes do Link asChild,
pois o Slot da dependência atual transforma arrays em objetos com chaves
numéricas e perde fundo e layout. Os testes exercitam esse Slot real,
alternam efetivamente os temas e verificam contraste, layout, navegação e
a presença de Configurar no conteúdo rolável. Eles não comprovam a
renderização nem a rolagem física no
Samsung; esse reteste permanece pendente.

## Caminhos das rotinas existentes

Esta versão não implementa uma rotação automática de atividades por períodos
Manhã / Tarde / Noite. Os nomes disponíveis em Minhas rotinas são Manhã,
Hora da Lição, Hora de Dormir e Hora do Brincar. Para executar uma delas:
Minhas rotinas → rotina desejada → Começar. Os passos avançam explicitamente
pelo controle Próximo; o fim do temporizador não avança sozinho. Uma execução
salva pode ser reaberta por Voltar à rotina.
