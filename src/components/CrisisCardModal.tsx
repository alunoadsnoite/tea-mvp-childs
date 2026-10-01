import React, { useState, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  useWindowDimensions,
  Linking,
} from "react-native";
import { useCrisisStore } from "@/stores/crisisStore";
import { useHapticFeedback } from "@/hooks/useHapticFeedback";
import { useThemeMode } from "@/hooks/useThemeMode";

interface ScrollViewEvent {
  nativeEvent: {
    contentOffset: {
      x: number;
    };
  };
}

export function CrisisCardModal() {
  const { messages, contacts, activeMessageId, setActiveMessage, primaryContactId } =
    useCrisisStore();
  const { colors } = useThemeMode();
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!activeMessageId || messages.length === 0) return 0;
    const index = messages.findIndex((m) => m.id === activeMessageId);
    return index >= 0 ? index : 0;
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const [viewportWidth, setViewportWidth] = useState(width);
  const { trigger } = useHapticFeedback();

  const currentMessage = messages[currentIndex];

  const primaryContact =
    contacts.find((c) => c.id === primaryContactId) ?? contacts[0];

  const handleScroll = (event: ScrollViewEvent) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / viewportWidth);
    if (index !== currentIndex && index >= 0 && index < messages.length && messages[index]) {
      setCurrentIndex(index);
      setActiveMessage(messages[index].id);
    }
  };

  const handleEmergencyCall = () => {
    trigger("success");
    if (primaryContact?.phone) {
      Linking.openURL(`tel:${primaryContact.phone}`);
    }
  };

  const handleEmergencyMessage = () => {
    trigger("light");
    if (primaryContact?.phone) {
      const message = encodeURIComponent(currentMessage?.content || "");
      Linking.openURL(`sms:${primaryContact.phone}?body=${message}`);
    }
  };

  if (!currentMessage) return null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {messages.length > 1 && (
        <View style={styles.pageIndicator}>
          <Text style={[styles.pageIndicatorText, { color: colors.textSecondary }]}>
            {currentIndex + 1} / {messages.length}
          </Text>
        </View>
      )}

      {messages.length > 1 && (
        <Text style={[styles.swipeHint, { color: colors.textSecondary }]}>
          👈 Deslize para ver mais 👉
        </Text>
      )}

      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        onLayout={(event) => setViewportWidth(event.nativeEvent.layout.width)}
        scrollEventThrottle={16}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, { width: viewportWidth }]}>
            <View style={[styles.messageContentWrapper, { 
              backgroundColor: colors.surface,
              borderColor: colors.accent,
            }]}>
              <Text style={styles.messageEmoji}>{message.emoji}</Text>
              <Text style={[styles.messageTitle, { color: colors.text }]}>{message.title}</Text>
              <View style={[styles.divider, { backgroundColor: colors.accent }]} />
              <Text style={[styles.messageContent, { color: colors.textSecondary }]}>{message.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {primaryContact && (
        <View style={styles.emergencyActions}>
          <Pressable
            style={[styles.emergencyButton, { backgroundColor: colors.accent }]}
            onPress={handleEmergencyCall}
            accessibilityLabel={`Ligar para ${primaryContact.name}`}
          >
            <Text style={[styles.emergencyButtonText, { color: colors.background }]}>
              📞 Ligar para {primaryContact.name}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.emergencyButtonSecondary, { borderColor: colors.accent }]}
            onPress={handleEmergencyMessage}
            accessibilityLabel={`Enviar mensagem para ${primaryContact.name}`}
          >
            <Text style={[styles.emergencyButtonSecondaryText, { color: colors.accent }]}>
              💬 Enviar mensagem
            </Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  scrollView: {
    flex: 1,
  },
  pageIndicator: {
    alignItems: "center",
    marginBottom: 16,
  },
  pageIndicatorText: {
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageContentWrapper: {
    flexShrink: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "88%",
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    borderWidth: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  messageEmoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 16,
    textAlign: "center",
    flexShrink: 1,
  },
  divider: {
    width: 60,
    height: 4,
    borderRadius: 2,
    marginBottom: 24,
  },
  messageContent: {
    fontSize: 18,
    lineHeight: 28,
    textAlign: "center",
    fontWeight: "500",
    flexShrink: 1,
  },
  emergencyActions: {
    gap: 12,
    marginTop: 32,
  },
  emergencyButton: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  emergencyButtonText: {
    fontSize: 18,
    fontWeight: "700",
  },
  emergencyButtonSecondary: {
    backgroundColor: "transparent",
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
  },
  emergencyButtonSecondaryText: {
    fontSize: 16,
    fontWeight: "600",
  },
  swipeHint: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
});
