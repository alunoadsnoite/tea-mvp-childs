# Widget "Preciso de ajuda"

> **Status: implementado no Android.** Um toque abre o app direto na rota
> `/crisis-card`, sem passar pela Home.
>
> **O iOS ainda não tem widget.** O projeto é managed workflow e a pasta `ios/`
> não é versionada; criar um target WidgetKit exige abrir o Xcode e configurar
> a extension manualmente (ver "iOS" abaixo).
>
> Sem o widget, o Cartão de Ajuda continua acessível pelo botão flutuante 🆘
> (`EmergencyFab`) e pelo card da Home. O widget é acessória, nunca obrigatório.

## Como o widget é entregue

O projeto usa managed workflow e `android/` está no `.gitignore`, então nada
do widget é escrito direto na pasta nativa — ela seria apagada no próximo
`expo prebuild`.

Em vez disso:

- **Fontes versionadas** em `widget/android/`
- **Config plugin** `plugins/withCrisisWidget.js`, registrado em `app.json`
  (`plugins`), que copia as fontes e registra o receiver a cada prebuild

> O `.gitignore` precisa manter `/android/` e `/ios/` **ancorados na raiz**.
> Sem a barra inicial, o padrão `android/` também ignoraria `widget/android/` e
> os fontes do widget nunca seriam versionados.

Arquivos-fonte:

| Origem (versionado) | Destino no projeto gerado |
| --- | --- |
| `widget/android/CrisisWidgetProvider.kt` | `android/app/src/main/java/com/teakids/app/CrisisWidgetProvider.kt` |
| `widget/android/crisis_widget_layout.xml` | `android/app/src/main/res/layout/crisis_widget.xml` |
| `widget/android/crisis_widget_background.xml` | `android/app/src/main/res/drawable/crisis_widget_background.xml` |
| `widget/android/crisis_widget_info.xml` | `android/app/src/main/res/xml/crisis_widget_info.xml` |
| `widget/android/crisis_widget_values.xml` | `android/app/src/main/res/values/crisis_widget.xml` |

## Como testar

```bash
npx expo prebuild -p android

# JDK 17 é obrigatório: o AGP 8.1.1 do SDK 50 quebra com JDK 21
JAVA_HOME=/caminho/para/jdk17 ./android/gradlew assembleRelease

adb install android/app/build/outputs/apk/release/app-release.apk
```

Depois, no launcher: segure em um espaço vazio da tela inicial → **Widgets** →
**TEA Kids** → arrastar para a tela.

**Use `assembleRelease`, não `assembleDebug`.** O APK debug não embute o bundle
JS: ele tenta carregar de `localhost:8081` e abre uma tela de erro sem o Metro
conectado ao celular. Para instalar no aparelho e testar sozinho, é
obrigatório o release.

## Decisões de implementação

- **Deep link** `tea-kids://crisis-card`, com o scheme vindo de `app.json`. O
  Expo Router resolve para a rota `/crisis-card`.
- **Conteúdo estático.** Sem lista, sem rolagem e sem atualização automática
  (`updatePeriodMillis=0`): em momento de sobrecarga, o alvo precisa ser
  previsível.
- **Sem dados sensíveis.** O widget mostra apenas 🆘, "Preciso de ajuda" e "Toque
  aqui 💙". Nenhum contato ou mensagem é exposto.
- **Emoji com `importantForAccessibility="no"`.** O `contentDescription` do
  elemento raiz já descreve a ação; sem essa marcação o TalkBack leria o 🆘 duas
  vezes.
- **Contraste.** O fundo usa `accent` (`#63B3ED`) de
  `src/hooks/useThemeMode.ts` — a mesma cor do botão 🆘 dentro do app. Sobre
  ele, `#1A1D23` dá 7.4:1 (título) e `#2D3748` dá 5.25:1 (legenda), ambos acima
  de WCAG AA. O `textSecondary` do tema (`#718096`) foi descartado de
  propósito: sobre o fundo do widget ele fica em 1.76:1.
- **Tema sempre claro.** Independente do tema do app, porque o launcher pode
  renderizar o widget sobre qualquer papel de parede e a leitura precisa ser
  imediata. Se a paleta mudar, atualizar `widget/android/crisis_widget_values.xml`.
- **Tamanho 2x1.** O emoji grande ao lado de duas linhas curtas cabe na célula
  sem truncar o texto; em 1x1 o texto quebraria em três linhas.
- **`PendingIntent.FLAG_IMMUTABLE`** é obrigatório a partir do Android 12
  (API 31).
- **`R.id` resolvido por nome.** O AGP 8 usa `nonFinalResIds` por padrão, então
  os IDs do layout não são garantidos em `R` para recursos injetados por plugin.
  O provider usa `resources.getIdentifier("crisis_widget_root", "id", packageName)`.
- **Fontes de recurso com nomes distintos.** `layout/` e `values/` geram
  arquivos de mesmo nome no destino (`crisis_widget.xml`), então os fontes
  versionados usam sufixos (`crisis_widget_layout.xml`,
  `crisis_widget_values.xml`). Com nomes iguais, a cópia de `values` sobrescreve
  a de `layout` e o build falha em `lintVitalRelease` com `WrongFolder`.

## iOS (não implementado)

Para criar o widget no iOS é preciso, no macOS:

1. `npx expo prebuild -p ios` e abrir o workspace no Xcode.
2. Criar um target **Widget Extension** (`TEAKidsWidget`) no projeto.
3. Implementar a view estática e seu `Info.plist`.
4. Registrar a extension no scheme do app.
5. Reaproveitar as cores de `src/hooks/useThemeMode.ts`.

Não há como validar isso por script, e o `ios/` não é versionado — cada pessoa
que quiser o widget no iOS precisa criar o target.
