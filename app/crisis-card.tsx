import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { CrisisCardModal } from "@/components/CrisisCardModal";

export default function CrisisCardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Preciso de Ajuda",
          headerStyle: { backgroundColor: "#F0F4F8" },
          headerTintColor: "#2D3748",
          headerBackTitle: "Voltar",
        }}
      />
      <CrisisCardModal />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
  },
});
