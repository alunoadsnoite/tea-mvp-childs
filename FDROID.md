# Preparação para o F-Droid

Aplicativo: TEA Kids (`com.teakids.app`). Licença do projeto: MIT; dependências mantêm suas próprias licenças.

A inclusão no catálogo oficial depende da revisão dos mantenedores do F-Droid e de uma receita de compilação aprovada. Os arquivos em `fastlane/metadata/android/` fornecem as descrições e o ícone, em inglês e português do Brasil. As cinco capturas reais fornecidas pelo mantenedor ficam em `images/phoneScreenshots/`, na ordem: início, ajuda, rotinas, atividades para acalmar e contagem calma. A interface capturada está em português, inclusive nos metadados de fallback em inglês.

## Compilação a partir do código

O projeto usa Expo SDK 50 (managed workflow), React Native 0.73.6 e Android Gradle Plugin 8.1.1. Requer Node.js/npm, OpenJDK 17, Android SDK Platform 34, Build Tools 34.0.0 e acesso aos repositórios de dependências durante a preparação. As versões npm são fixadas pelo `package-lock.json`.

```sh
npm ci
npm run lint
npx tsc --noEmit
npx expo prebuild -p android --no-install
cd android
JAVA_HOME=/caminho/para/openjdk17 ./gradlew assembleRelease --no-daemon --max-workers=2
```

Saída: `android/app/build/outputs/apk/release/app-release.apk`. O release inclui o bundle JavaScript e funciona sem Metro. A pasta `android/` é gerada pelo prebuild; os fontes do widget ficam em `widget/android/` e são injetados por `plugins/withCrisisWidget.js`.

O APK local normal usa a chave de desenvolvimento criada pelo template. Com `FDROID_BUILD=1`, o config plugin remove as referências à assinatura e a saída é `app-release-unsigned.apk`. A distribuição oficial deve usar a assinatura administrada pelo F-Droid, ou uma estratégia própria de assinatura e builds reproduzíveis previamente acordada com os mantenedores. As assinaturas podem ser diferentes: a atualização sobre um APK instalado fora do F-Droid não é garantida.

## Receita e auditoria

A receita está em [`fdroid/metadata/com.teakids.app.yml`](fdroid/metadata/com.teakids.app.yml), com preparação de dependências, variante sem assinatura e detecção de novas versões pelo `app.json`. Procedimento e justificativas das exceções: [`fdroid/README.md`](fdroid/README.md). Inventário de licenças: [`fdroid/reports/npm-licenses.json`](fdroid/reports/npm-licenses.json). Origem dos recursos: [`assets/README.md`](assets/README.md).

Resultados da validação: [`fdroid/reports/validation.md`](fdroid/reports/validation.md). A revisão e a publicação no catálogo continuam sob responsabilidade dos mantenedores do F-Droid.

## Otimização de release

O plugin `plugins/withReleaseOptimization.js` ativa R8 e a remoção de recursos
não utilizados em cada `expo prebuild`. As propriedades geradas são
`android.enableProguardInReleaseBuilds=true` e
`android.enableShrinkResourcesInReleaseBuilds=true`. O APK universal ainda inclui
bibliotecas nativas de várias arquiteturas, que não são reduzidas pelo R8.
