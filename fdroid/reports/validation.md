# Validação do empacotamento

Data: 2026-10-14. Aplicativo: `com.teakids.app`, versão 1.1.5, versionCode 5.

## Resultados

- `npm run lint`: passou.
- `npx tsc --noEmit`: passou.
- `fdroid lint com.teakids.app` (fdroidserver 2.4.5): passou.
- `fdroid rewritemeta com.teakids.app`: receita normalizada.
- `fdroid checkupdates --verbose --allow-dirty com.teakids.app`: identificou v1.1.5 (5), reconheceu v1.1.4 (4) e excluiu v1.1.4-fdroid.1 do filtro de releases; versão atual confirmada.
- Scanner de fontes, com assinaturas atualizadas: zero problemas fatais; um aviso em `Fontisto.ttf`, uma fonte de uma dependência de ferramentas. O APK não contém arquivos TTF/OTF. Resultado completo em `source-scan.json`.
- Scanner de classes do APK: zero detecções de classes não livres e blocos extras de assinatura.
- Compilação Gradle release no contêiner oficial: passou com a árvore submetida ao scanner.
- Fluxo completo `fdroid build --test --scan-binary --refresh-scanner --no-tarball --verbose com.teakids.app:5` no mesmo contêiner: **1 build succeeded**, incluindo preparação, scanner, build, versão/pacote e scanner do APK.
- APK sem assinatura, pacote/versão corretos, arquivo ZIP íntegro e bundle JavaScript incluído. Permissões de armazenamento e sobreposição ausentes; restam INTERNET, VIBRATE e a permissão interna de receiver do AndroidX. Hashes e detalhes em `apk-checks.json`.
- Config plugins: a variante normal mantém a assinatura do template; `FDROID_BUILD=1` gera a saída unsigned. Widget e otimização R8/remoção de recursos mantidos.

## Dependências e recursos

- `npm-licenses.json`: 1.362 entradas do lockfile; zero declarações de licença não identificadas após a conferência dos quatro fallbacks documentados. Inclui ferramentas e dependências opcionais de outras plataformas.
- `maven-runtime-licenses.json`: 110 componentes externos de releaseRuntimeClasspath com licenças identificadas nos POMs (Apache 2.0, MIT ou BSD); registra hashes e eventual herança de POM pai.
- O mantenedor confirmou a autoria e autorizou a distribuição MIT dos ícones e splash. Registro em `assets/README.md`.

## Ambiente e limites

Imagem oficial: `registry.gitlab.com/fdroid/fdroidserver@sha256:9cb68105642ca4e7b295f0ceab10f069f5b3247dc18fa7c36046e9d81aa469a8`.

Debian trixie, Node 20.19.2, OpenJDK Temurin 17.0.20.1+1, Gradle 8.3, SDK 34 e NDK 25.1.8937393. O SDK e o cache de dependências foram reutilizados; o cache Gradle de trabalho é exclusivo do contêiner. A seção `sudo` foi pré-provisionada: instalação de Node/npm e JDK 17 fixado no checksum da receita. O comando foi executado em modo local dentro do buildserver, sem `--on-server`.

Para contornar a falha de primeira execução do fdroidserver 2.4.5 ao definir SOURCE_DATE_EPOCH sem checkout, o repositório foi clonado e posicionado no commit público `0a7524ebbaf680cec8bc8fc6e3f809fc92b3a04d` antes do comando. A receita de teste usou esse SHA em vez da tag ainda não publicada. As alterações seguintes são relatórios e ferramentas de auditoria; não alteram o código do app, as permissões nem os passos de compilação.

O inventário registra evidências das declarações de licença e não substitui uma avaliação jurídica. A reprodução bit a bit não foi verificada. Testes funcionais em aparelho físico e a aprovação pelos mantenedores do F-Droid permanecem pendentes.

## Verificação externa

Pipeline no fork do fdroiddata: https://gitlab.com/alunoadsnoite/fdroiddata/-/pipelines/2947544670 . A execução foi iniciada após a validação local; o resultado externo é independente da aprovação de inclusão no catálogo.

Cópia instalável para conferência do mantenedor: `TEA-Kids-v1.1.5.apk`, assinada com a chave de desenvolvimento do projeto. O APK do fluxo F-Droid permanece separado e sem assinatura.
