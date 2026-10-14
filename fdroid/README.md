# Empacotamento para o F-Droid

`metadata/com.teakids.app.yml` é a receita destinada a `fdroiddata/metadata/`.
O ID é `com.teakids.app`. A versão 1.1.5 usa `versionCode` 5.

## Sequência

1. Instalar Node/npm do Debian e o OpenJDK Temurin 17 fixado e verificado por SHA-256. O AGP 8.1.1 deste projeto requer JDK 17; o buildserver atual fornece JDK 21 por padrão.
2. Executar `npm ci` com o lockfile e a telemetria da ferramenta Expo desativada.
3. Executar `python3 fdroid/prepare.py` para remover os AARs JSC não utilizados, compiladores Hermes de outros sistemas e wrappers de exemplos.
4. Gerar o projeto com `FDROID_BUILD=1 EXPO_NO_TELEMETRY=1 npx --no-install expo prebuild -p android --no-install`.
5. Aplicar o scanner do F-Droid e suas regras `scandelete`/`scanignore`.
6. Compilar com o Gradle fornecido pelo F-Droid e JDK 17. Saída: `android/app/build/outputs/apk/release/app-release-unsigned.apk`.
7. Verificar o APK com o scanner de binários e conferir pacote, versão, permissões e ausência de assinatura. O F-Droid é responsável pela assinatura final.

Não há `subdir`: a pasta `android/` ainda não existe quando o F-Droid verifica o checkout. O projeto permanece managed workflow; os ajustes do Android vivem em config plugins.

## Exceções de scanner

- `node_modules/react-native/sdks/hermesc/linux64-bin/hermesc`: compilador oficial Hermes, permitido expressamente na política do F-Droid.
- Os arquivos Gradle listados individualmente em `scanignore` contêm repositórios de publicação `mavenLocal()` ou referências legadas ao Maven local do React Native. Foram inspecionados: não há dependência proprietária nessas declarações. As dependências Android usadas são obtidas dos repositórios permitidos. A exceção evita que o scanner apague scripts de compilação necessários.
- `scandelete: node_modules` remove os outros binários identificados (incluindo ferramentas de outras plataformas, arquivos de testes e bibliotecas Sharp usadas somente na geração prévia das imagens). Não se ignora a árvore inteira de dependências.

O scanner pode emitir aviso sobre `Fontisto.ttf` em `@expo/vector-icons`: é uma fonte distribuída com o pacote, não código executável do aplicativo. O aviso deve permanecer visível no relatório.

## Licenças e recursos

`python3 fdroid/audit-licenses.py` gera `reports/npm-licenses.json` a partir do lockfile e registra hashes dos arquivos LICENSE presentes. Quatro declarações ausentes/incompletas no lockfile foram conferidas nos respectivos arquivos LICENSE: loosely-validate-event, qrcode-terminal, requireg e valid-url. O relatório inclui ferramentas de build e dependências opcionais de outros sistemas; nem todas entram no APK. A declaração da licença não substitui a conferência de suas condições e do conteúdo efetivamente distribuído.

A origem dos ícones e splash está documentada em `assets/README.md`, com autorização do mantenedor. O aplicativo usa os emojis do sistema e não distribui uma fonte própria de emojis.

## Atualizações

Somente tags de release no formato `vX.Y.Z` são consideradas. O F-Droid extrai `version` e `versionCode` de `app.json`. Aumentar ambos em cada release; manter `package.json`, o lockfile e os changelogs Fastlane correspondentes sincronizados. Tags auxiliares antigas como `v1.1.4-fdroid.1` não serão consideradas releases automáticas.

## Verificação no checkout do fdroiddata

Copiar a receita para `metadata/com.teakids.app.yml`, então executar:

```sh
fdroid lint com.teakids.app
fdroid rewritemeta com.teakids.app
fdroid checkupdates com.teakids.app
fdroid build --verbose --test com.teakids.app:5
```

O build completo requer que a tag de release esteja publicada. A aprovação continua dependendo da revisão do F-Droid; os resultados locais são registrados em `reports/validation.md`.
