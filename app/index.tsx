import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckInCard } from "@/components/CheckInCard";
import { useFontScale } from "@/hooks/useFontScale";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function HomeScreen() {
  const { fontSize } = useFontScale();
  const { colors } = useThemeMode();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Text style={[styles.welcomeText, { color: colors.text }]}>Olá! 👋</Text>
        
        {/* Link asChild merges styles as objects: flatten before its Slot boundary. */}
        {/* Ação principal — Cartão de Ajuda */}
        <Link href="/crisis-card" asChild>
          <Pressable
            style={StyleSheet.flatten([styles.crisisButton, { backgroundColor: colors.accent }])}
            accessibilityRole="button"
            accessibilityLabel="Preciso de ajuda"
            accessibilityHint="Toque para abrir o cartão de ajuda"
          >
            <Text style={styles.crisisButtonEmoji}>🆘</Text>
            <Text style={[styles.crisisButtonText, { fontSize: fontSize(20), color: "#1A1D23" }]}>
              Preciso de ajuda
            </Text>
          </Pressable>
        </Link>

        {/* Check-in Card */}
        <CheckInCard />

        {/* Navegação secundária */}
        <View style={styles.secondaryActions}>
          <Link href="/interception" asChild>
            <Pressable style={StyleSheet.flatten([styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }])}>
              <Text style={styles.secondaryButtonEmoji}>💭</Text>
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15), color: colors.text }]}>
                Como estou me sentindo
              </Text>
            </Pressable>
          </Link>

          <Link href="/routines" asChild>
            <Pressable style={StyleSheet.flatten([styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }])}>
              <Text style={styles.secondaryButtonEmoji}>📋</Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Minhas rotinas
              </Text>
            </Pressable>
          </Link>

          <Link href="/regulation" asChild>
            <Pressable style={StyleSheet.flatten([styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }])}>
              <Text style={styles.secondaryButtonEmoji}>🧘</Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Hora de acalmar
              </Text>
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable style={StyleSheet.flatten([styles.secondaryButton, { backgroundColor: colors.surface, borderColor: colors.textSecondary + "40" }])}>
              <Text style={styles.secondaryButtonEmoji}>⚙️</Text>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                Configurar
              </Text>
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
  scrollView: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
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
