# Instruções para agentes

## Contexto do projeto

- Este é um app móvel Expo/React Native com TypeScript para autonomia, previsibilidade e regulação de crianças e adolescentes no Espectro Autista.
- O app é offline-first: o estado de usuário deve continuar funcionando sem rede e é persistido localmente com Zustand + AsyncStorage.
- Preserve a baixa carga cognitiva: uma ação principal por tela, transições suaves, contraste legível e ausência de alertas visuais agressivas.
- Use emojis em toda a interface para facilitar a compreensão.
- Linguagem simples e direta, adequada para crianças e adolescentes.

## Comandos

```bash
npm install
npm run lint
npx tsc --noEmit
npx expo start
npm run android
npm run ios
npx eas build -p android --profile preview
npx expo prebuild -p android   # gera android/ antes de qualquer comando Gradle
```

Não há runner de testes configurado atualmente. Para qualquer alteração, execute pelo menos `npm run lint` e `npx tsc --noEmit`.

O projeto é **managed workflow**: não existe pasta `ios/` versionada e `android/` está no `.gitignore`. Portanto `npm run android`, `npm run ios` e qualquer comando Gradle exigem `npx expo prebuild -p android` antes. Para instalar no aparelho use `assembleRelease` — o APK `debug` não embute o bundle JS e depende do Metro em `localhost:8081`.

**JDK 17 é obrigatório**: o AGP 8.1.1 do SDK 50 falha com JDK 21 (jlink).

```bash
JAVA_HOME=/caminho/para/jdk17 ./android/gradlew assembleRelease
```

Só faça isso quando a tarefa realmente exigir build nativo — `expo prebuild` gera dezenas de arquivos e `npx expo export --platform android` já valida o bundle JS sem esse custo.

## Organização e limites

- `src/app/`: telas e rotas Expo Router. Cada arquivo `.tsx` é uma rota; `_layout.tsx` define o Stack, o SafeAreaProvider, o StatusBar e o `EmergencyFab` global.
- `src/components/`: componentes de UI reutilizáveis e interações compartilhadas.
- `src/stores/`: estado de domínio e persistência local. Stores atuais cobrem check-ins, crise, rotinas e cartões de regulação.
- `src/types/`: tipos e dados padrão do domínio.
- `src/hooks/`: custom hooks para fonte, tema e feedback háptico.
- O fluxo existente é predominantemente `app -> components -> stores -> types`.

> Nota: as rotas estão em `app/` na **raiz** (não em `src/app/`), como registram
> `README.md` e o changelog da v1.1.0.

## Convenções de implementação

- Use os aliases `@/...` definidos em `tsconfig.json` para imports dentro de `src`.
- Siga Expo Router: use `useRouter` para navegação imperativa e `useLocalSearchParams` em rotas dinâmicas.
- Use `StyleSheet` e os padrões visuais já presentes nas telas.
- Para estado persistido, siga o padrão dos stores existentes: `create`, `persist`, `createJSONStorage` e `AsyncStorage`, com um nome de storage estável.
- Adicione `accessibilityLabel`, `accessibilityHint` e estado semântico a controles interativos.
- Evite animações piscantes, contagens que aumentem ansiedade e cores agressivas.
- Use emojis em toda a interface para facilitar a compreensão das crianças.

## Widget do Android

- O widget **existe no Android** (fontes em `widget/android/`, injetadas por `plugins/withCrisisWidget.js`) e **não existe no iOS**. Consulte [WIDGET_SETUP.md](WIDGET_SETUP.md) antes de alterá-lo.
- **Nunca edite os arquivos gerados em `android/`** — a mudança seria perdida no próximo prebuild. Altere o fonte em `widget/android/` ou o plugin.
- O `.gitignore` precisa manter `/android/` e `/ios/` ancorados na raiz; sem a barra inicial o padrão também esconde `widget/android/`.
- Antes de documentar um recurso, verifique que ele existe no código. Prefira um "não implementado" explícito a instruções de setup que não funcionam.

## Processo de mudança

1. Leia a tela, componente, store e tipo diretamente envolvidos antes de editar.
2. Mantenha a mudança pequena e preserve APIs públicas e comportamento offline.
3. Atualize documentação somente quando o comportamento ou o setup realmente mudar.
4. Execute lint e typecheck após a alteração.
