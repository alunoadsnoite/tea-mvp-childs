# Validação do empacotamento

Data: 2026-10-14. Aplicativo: `com.teakids.app`, versão 1.1.5, versionCode 5.

- `npm run lint`: passou.
- `npx tsc --noEmit`: passou.
- `fdroid lint com.teakids.app` (fdroidserver 2.4.5): passou.
- `fdroid rewritemeta com.teakids.app`: receita normalizada.
- Scanner de fontes (fdroidserver 2.4.5, assinaturas atualizadas): zero problemas fatais; um aviso em `Fontisto.ttf`, uma fonte de `@expo/vector-icons`. Resultado completo: `source-scan.json`.
- Inventário npm: 1.362 entradas, zero declarações de licença não identificadas após conferência dos quatro fallbacks documentados. Inclui dependências de ferramentas e opcionais de outras plataformas; não é uma lista de componentes efetivamente embarcados.
- Config plugins: removem as referências à assinatura somente com `FDROID_BUILD=1`; a variante normal mantém seu comportamento. As três permissões sem uso têm marcação de remoção; widget e otimização mantidos.

Compilação, scanner do APK e execução completa do comando `fdroid build`: em validação. Este relatório será atualizado com os resultados; não representa aprovação pelo F-Droid.

Ambiente: imagem oficial `registry.gitlab.com/fdroid/fdroidserver:buildserver`, Debian trixie, Node 20.19.2, OpenJDK Temurin 17.0.20.1+1, Gradle 8.3, SDK 34, NDK 25.1.8937393. O SDK e o cache de dependências foram reutilizados do ambiente local; o cache Gradle de trabalho é exclusivo do contêiner.
