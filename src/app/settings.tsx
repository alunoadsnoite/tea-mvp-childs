import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useThemeMode } from "@/hooks/useThemeMode";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";

export default function SettingsScreen() {
  const { mode, changeMode, colors } = useThemeMode();
  const { trigger } = useHapticFeedback();

  const themeOptions: { key: typeof mode; label: string; description: string; emoji: string }[] = [
    { key: "light", label: "Claro", description: "Para ambientes bem iluminados", emoji: "☀️" },
    { key: "dark", label: "Escuro", description: "Reduz fadiga visual", emoji: "🌙" },
    { key: "auto", label: "Automático", description: "Segue o tema do sistema", emoji: "🔄" },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Configurações",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Tema */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            🎨 Tema
          </Text>
          <Text style={[styles.sectionDescription, { color: colors.textSecondary }]}>
            Escolha como o app aparece
          </Text>

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
              accessibilityLabel={option.label}
              accessibilityHint={option.description}
            >
              <View style={styles.optionContent}>
                <Text style={styles.optionEmoji}>{option.emoji}</Text>
                <View>
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

        {/* Sobre */}
        <View style={[styles.section, { backgroundColor: colors.surface }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            ℹ️ Sobre
          </Text>
          <Text style={[styles.aboutText, { color: colors.textSecondary }]}>
            TEA Kids v1.0.0{'\n'}
            App para crianças e adolescentes no Espectro Autista.
          </Text>
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
    borderColor: "#E2E8F0",
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
});
