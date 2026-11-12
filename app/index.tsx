import { useTranslation } from "@/hooks/useTranslation";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckInCard } from "@/components/CheckInCard";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function HomeScreen() {
  const { t } = useTranslation();
  const { fontSize } = useFontScale();
  const { colors, isDark } = useThemeMode();
  const secondaryButtonStyle = StyleSheet.flatten([
    styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" },
  ]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>{t("Olá!")} <Text importantForAccessibility="no">👋</Text></Text>
        
        {/* Ação principal — Cartão de Ajuda */}
        <Link href="/crisis-card" asChild>
          <Pressable
            style={StyleSheet.flatten([styles.crisisButton, { backgroundColor: colors.accent }])}
            accessibilityRole="button"
            accessibilityLabel={t("Preciso de ajuda")}
            accessibilityHint={t("Toque para abrir o cartão de ajuda")}
          >
            <Text style={styles.crisisButtonEmoji} importantForAccessibility="no">
              🆘
            </Text>
            <Text style={[styles.crisisButtonText, { fontSize: fontSize(20), color: isDark ? colors.background : colors.text }]}>{t("Preciso de ajuda")}</Text>
          </Pressable>
        </Link>

        {/* Check-in Card */}
        <CheckInCard />

        {/* Navegação secundária */}
        <View style={styles.secondaryActions}>
          <Link href="/interception" asChild>
            <Pressable style={secondaryButtonStyle} accessibilityRole="button">
              <Text style={styles.secondaryButtonEmoji} importantForAccessibility="no">
                💭
              </Text>
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15), color: colors.text }]}>{t("Como estou me sentindo")}</Text>
            </Pressable>
          </Link>

          <Link href="/routines" asChild>
            <Pressable style={secondaryButtonStyle} accessibilityRole="button">
              <Text style={styles.secondaryButtonEmoji} importantForAccessibility="no">
                📋
              </Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>{t("Minhas rotinas")}</Text>
            </Pressable>
          </Link>

          <Link href="/regulation" asChild>
            <Pressable style={secondaryButtonStyle} accessibilityRole="button">
              <Text style={styles.secondaryButtonEmoji} importantForAccessibility="no">
                🧘
              </Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>{t("Hora de acalmar")}</Text>
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable style={secondaryButtonStyle} accessibilityRole="button">
              <Text style={styles.secondaryButtonEmoji} importantForAccessibility="no">
                ⚙️
              </Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>{t("Configurar")}</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    paddingTop: 24,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
    gap: 20,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  crisisButton: {
    paddingVertical: 24,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: "100%",
    alignItems: "center",
    minHeight: 80,
    justifyContent: "center",
    gap: 8,
  },
  crisisButtonEmoji: {
    fontSize: 32,
  },
  crisisButtonText: {
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryActions: {
    gap: 12,
    width: "100%",
  },
  secondaryButton: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  secondaryButtonEmoji: {
    fontSize: 24,
  },
  secondaryButtonText: {
    flexShrink: 1,
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
