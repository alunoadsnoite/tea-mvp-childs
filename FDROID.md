# Preparação para o F-Droid

Aplicativo: TEA Kids (`com.teakids.app`). Licença do projeto: MIT; dependências mantêm suas próprias licenças.

A inclusão no catálogo oficial depende da revisão dos mantenedores do F-Droid e de uma receita de compilação aprovada. Os arquivos em `fastlane/metadata/android/` fornecem as descrições e o ícone, em inglês e português do Brasil. Capturas reais de tela ainda precisam ser adicionadas.

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

O APK local usa a chave de desenvolvimento criada pelo template. A distribuição oficial deve usar a assinatura administrada pelo F-Droid, ou uma estratégia própria de assinatura e builds reproduzíveis previamente acordada com os mantenedores. As assinaturas podem ser diferentes: a atualização sobre um APK instalado fora do F-Droid não é garantida.

## Revisões pendentes do empacotamento

- Preparar e validar a receita de build no ambiente isolado do F-Droid, incluindo preparação das dependências npm e verificação de binários.
- Revisar as licenças de todas as dependências transitivas e recursos.
- Acrescentar capturas reais do aplicativo.

A compilação local com OpenJDK 17 foi validada na versão 1.1.4 (versionCode 4). Isso não substitui o scanner, a compilação isolada nem a aprovação do F-Droid.
