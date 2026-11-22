import { LANGUAGES } from "@/lib/i18n";
import { useLanguageStore } from "@/stores/languageStore";
import { useTranslation } from "@/hooks/useTranslation";
import React, { useState } from "react";
import appConfig from "../app.json";
import {
  Alert,
  Clipboard,
  Linking,
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, Link } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

const PIX_KEY = "81063e93-0c1b-4ddb-8a16-b9be68a75d4e";
const SPONSORS_URL = "https://github.com/sponsors/alunoadsnoite";

const DEVELOPER_EMAIL = "valdenorsa@proton.me";

export default function SettingsScreen() {
  const { t, language } = useTranslation();
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { mode, changeMode, colors } = useThemeMode();
  const { trigger } = useHapticFeedback();
  const [supportMessage, setSupportMessage] = useState("");

  const themeOptions: { key: typeof mode; label: string; description: string; emoji: string }[] = [
    { key: "light", label: t("Claro"), description: t("Para ambientes bem iluminados"), emoji: "☀️" },
    { key: "dark", label: t("Escuro"), description: t("Reduz fadiga visual"), emoji: "🌙" },
    { key: "auto", label: t("Automático"), description: t("Segue o tema do sistema"), emoji: "🔄" },
  ];

  const contactDeveloper = async () => {
    try {
      await Linking.openURL(`mailto:${DEVELOPER_EMAIL}`);
    } catch {
      Alert.alert(t("Não foi possível abrir o e-mail"), t("Envie um e-mail para {0}.", DEVELOPER_EMAIL));
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: t("Configurações"),
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Link href="/crisis-settings" asChild>
          <Pressable accessibilityRole="button" accessibilityLabel={t("Configurar cartões de ajuda")}
            style={StyleSheet.flatten([styles.section, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }])}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("💬 Cartões de ajuda")}</Text>
          </Pressable>
        </Link>
        <View accessibilityRole="radiogroup"
          style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>
            {t("🌐 Idioma")}
          </Text>
          {LANGUAGES.map(({ code, label }) => {
            const checked = language === code;
            return (
              <Pressable
                key={code}
                accessibilityRole="radio"
                accessibilityLabel={label}
                accessibilityLanguage={code}
                accessibilityState={{ checked }}
                onPress={() => {
                  trigger("light");
                  setLanguage(code);
                }}
                style={[
                  styles.optionButton,
                  { borderColor: colors.textSecondary },
                  checked && { borderColor: colors.accent, backgroundColor: colors.accent + "20" },
                ]}
              >
                <Text style={[styles.optionLabel, styles.optionText, { color: colors.text }]}>{label}</Text>
                {checked && <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>}
              </Pressable>
            );
          })}
        </View>

        {/* Tema */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("🎨 Tema")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Escolha como o app aparece")}</Text>

          {themeOptions.map((option) => (
            <Pressable
              key={option.key}
              style={[
                styles.optionButton,
                { borderColor: colors.textSecondary },
                mode === option.key && { borderColor: colors.accent, backgroundColor: colors.accent + "20" },
              ]}
              onPress={() => {
                trigger("light");
                changeMode(option.key);
              }}
              accessibilityRole="radio"
              accessibilityState={{ checked: mode === option.key }}
              accessibilityLabel={option.label}
              accessibilityHint={option.description}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <View style={styles.optionText}>
                  <Text style={[styles.optionLabel, { color: colors.text }]}>
                    {option.label}
                  </Text>
                  <Text style={[styles.optionDescription, { color: colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </View>
              {mode === option.key && (
                <Text style={[styles.checkmark, { color: colors.accent }]}>✓</Text>
              )}
            </Pressable>
          ))}
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{t("Privacidade")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Seu diário fica neste aparelho. Ele guarda como você se sentiu e o que você anotou.")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Em Meu Diário, toque em Apagar meu diário. Suas rotinas, seus cartões e seus contatos ficam aqui.")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Ao preparar um SMS, o app de mensagens recebe o número e o texto. Você decide se quer enviar.")}</Text>
        </View>

        <View style={styles.section}>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{t("Para responsáveis")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("O desenvolvedor não recebe os registros pelo app. O Android recebe instruções para excluir os dados de backups e transferências.")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Para apagar todos os dados do TEA Kids, abra os ajustes do Android, toque em Armazenamento e limpe os dados do app. Mensagens enviadas ou salvas no app de mensagens ficam lá.")}</Text>
          <Pressable
            accessibilityRole="button"
            style={[styles.optionButton, { borderColor: colors.textSecondary }]}
            onPress={() => void Linking.openSettings().catch(() => {
              Alert.alert(t("Abra Ajustes do Android, toque em Apps e selecione TEA Kids."));
            })}
          >
            <Text style={[styles.optionLabel, { color: colors.text }]}>{t("Abrir ajustes do TEA Kids no Android")}</Text>
          </Pressable>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Dúvidas sobre privacidade: {0}.", DEVELOPER_EMAIL)}</Text>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>{t("Acompanhar e limitar o tempo de uso")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Acompanhar e limitar o tempo de uso")}</Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>{t("Se o aparelho estiver sob supervisão no Family Link, abra o Family Link no aparelho do responsável. Selecione a criança e vá a Tempo de tela → Limites de tempo → Limites de apps → TEA Kids. Ali você pode acompanhar o uso e definir um limite.")}</Text>
          <Text accessibilityRole="header" style={[styles.sectionTitle, { color: colors.text }]}>
            {t("💛 Apoie o desenvolvedor")}
          </Text>
          <Pressable
            style={[styles.optionButton, { borderColor: colors.textSecondary }]}
            onPress={() => {
              try {
                Clipboard.setString(PIX_KEY);
                setSupportMessage("Chave Pix copiada.");
              } catch {
                setSupportMessage("Não foi possível copiar a chave Pix.");
              }
            }}
            accessibilityRole="button"
            accessibilityLabel={t("📋 Copiar chave Pix")}
            accessibilityHint={t("Use a chave no aplicativo do seu banco.")}
          >
            <Text style={[styles.optionText, styles.optionLabel, { color: colors.text }]}>
              {t("📋 Copiar chave Pix")}
            </Text>
          </Pressable>
          <Pressable
            style={[styles.optionButton, { borderColor: colors.textSecondary }]}
            onPress={async () => {
              setSupportMessage("");
              try {
                await Linking.openURL(SPONSORS_URL);
              } catch {
                setSupportMessage("Não foi possível abrir o GitHub Sponsors.");
              }
            }}
            accessibilityRole="link"
            accessibilityLabel="GitHub Sponsors"
            accessibilityHint={t("Abre a página de patrocínio no navegador.")}
          >
            <Text style={[styles.optionText, styles.optionLabel, { color: colors.text }]}>
              ↗ GitHub Sponsors
            </Text>
          </Pressable>
          <Text accessibilityLiveRegion="polite" style={[styles.optionDescription, { color: colors.textSecondary }]}>
            {supportMessage && t(supportMessage)}
          </Text>
        </View>

        {/* Sobre */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("ℹ️ Sobre")}</Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            TEA Kids v{appConfig.expo.version}{'\n'}
            {t("App para crianças e adolescentes no Espectro Autista.")}
          </Text>
        </View>

        {/* Desenvolvedor */}
        <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t("👨‍💻 Desenvolvedor")}</Text>
          <Text style={[styles.developerName, { color: colors.text }]}>Valdenor Tavares</Text>
          <Pressable
            onPress={contactDeveloper}
            accessibilityRole="link"
            accessibilityLabel={t("Enviar e-mail ao desenvolvedor")}
            accessibilityHint={t("Abre seu aplicativo de e-mail")}
            style={styles.emailLink}
          >
            <Text style={[styles.developerEmail, { color: colors.text }]}>{DEVELOPER_EMAIL}</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
    gap: 24,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    gap: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    marginBottom: 8,
  },
  optionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  optionEmoji: {
    fontSize: 24,
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
  },
  optionDescription: {
    fontSize: 13,
    marginTop: 2,
  },
  checkmark: {
    fontSize: 20,
    fontWeight: "700",
  },
  aboutText: {
    fontSize: 14,
    lineHeight: 20,
  },
  developerName: {
    fontSize: 16,
    fontWeight: "600",
  },
  optionText: { flex: 1 },
  emailLink: { minHeight: 48, justifyContent: "center" },
  developerEmail: {
    textDecorationLine: "underline",
    fontSize: 14,
  },
});
