import { View, Text, Pressable, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { CheckInCard } from "@/components/CheckInCard";
import { useFontScale } from "@/hooks/useFontScale";

export default function HomeScreen() {
  const { fontSize } = useFontScale();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.welcomeText}>Olá! 👋</Text>
        
        {/* Ação principal — Cartão de Ajuda */}
        <Link href="/crisis-card" asChild>
          <Pressable
            style={styles.crisisButton}
            accessibilityLabel="Preciso de ajuda"
            accessibilityHint="Toque para abrir o cartão de ajuda"
          >
            <Text style={styles.crisisButtonEmoji}>🆘</Text>
            <Text style={[styles.crisisButtonText, { fontSize: fontSize(20) }]}>
              Preciso de ajuda
            </Text>
          </Pressable>
        </Link>

        {/* Check-in Card */}
        <CheckInCard />

        {/* Navegação secundária */}
        <View style={styles.secondaryActions}>
          <Link href="/interception" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonEmoji}>💭</Text>
              <Text style={[styles.secondaryButtonText, { fontSize: fontSize(15) }]}>
                Como estou me sentindo
              </Text>
            </Pressable>
          </Link>

          <Link href="/routines" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonEmoji}>📋</Text>
              <Text style={styles.secondaryButtonText}>
                Minhas rotinas
              </Text>
            </Pressable>
          </Link>

          <Link href="/regulation" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonEmoji}>🧘</Text>
              <Text style={styles.secondaryButtonText}>
                Hora de acalmar
              </Text>
            </Pressable>
          </Link>

          <Link href="/settings" asChild>
            <Pressable style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonEmoji}>⚙️</Text>
              <Text style={styles.secondaryButtonText}>
                Configurar
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingBottom: 80,
    gap: 20,
  },
  welcomeText: {
    color: "#2D3748",
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  crisisButton: {
    backgroundColor: "#FF6B6B",
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
    color: "#FFFFFF",
    fontWeight: "700",
    textAlign: "center",
  },
  secondaryActions: {
    gap: 12,
    width: "100%",
  },
  secondaryButton: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
  },
  secondaryButtonEmoji: {
    fontSize: 24,
  },
  secondaryButtonText: {
    color: "#4A5568",
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
  },
});
