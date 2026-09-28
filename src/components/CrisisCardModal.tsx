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
  const [currentIndex, setCurrentIndex] = useState(() => {
    if (!activeMessageId || messages.length === 0) return 0;
    const index = messages.findIndex((m) => m.id === activeMessageId);
    return index >= 0 ? index : 0;
  });

  const scrollViewRef = useRef<ScrollView>(null);
  const { width } = useWindowDimensions();
  const { trigger } = useHapticFeedback();

  const currentMessage = messages[currentIndex];

  const handleScroll = (event: ScrollViewEvent) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== currentIndex && index >= 0 && index < messages.length) {
      setCurrentIndex(index);
      setActiveMessage(messages[index].id);
    }
  };

  const handleEmergencyCall = () => {
    trigger("success");
    const contact = contacts.find((c) => c.id === primaryContactId) ?? contacts[0];
    if (contact?.phone) {
      Linking.openURL(`tel:${contact.phone}`);
    }
  };

  const handleEmergencyMessage = () => {
    trigger("light");
    const contact = contacts.find((c) => c.id === primaryContactId) ?? contacts[0];
    if (contact?.phone) {
      const message = encodeURIComponent(currentMessage?.content || "");
      Linking.openURL(`sms:${contact.phone}?body=${message}`);
    }
  };

  if (!currentMessage) return null;

  return (
    <View style={styles.container}>
      {messages.length > 1 && (
        <View style={styles.pageIndicator}>
          <Text style={styles.pageIndicatorText}>
            {currentIndex + 1} / {messages.length}
          </Text>
        </View>
      )}

      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        scrollEventThrottle={16}
      >
        {messages.map((message) => (
          <View key={message.id} style={[styles.messageContainer, { width }]}>
            <View style={styles.messageContentWrapper}>
              <Text style={styles.messageEmoji}>{message.emoji}</Text>
              <Text style={styles.messageTitle}>{message.title}</Text>
              <View style={styles.divider} />
              <Text style={styles.messageContent}>{message.content}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {contacts[0] && (
        <View style={styles.emergencyActions}>
          <Pressable
            style={styles.emergencyButton}
            onPress={handleEmergencyCall}
            accessibilityLabel={`Ligar para ${contacts[0].name}`}
          >
            <Text style={styles.emergencyButtonText}>
              📞 Ligar para {contacts[0].name}
            </Text>
          </Pressable>

          <Pressable
            style={styles.emergencyButtonSecondary}
            onPress={handleEmergencyMessage}
            accessibilityLabel={`Enviar mensagem para ${contacts[0].name}`}
          >
            <Text style={styles.emergencyButtonSecondaryText}>
              💬 Enviar mensagem
            </Text>
          </Pressable>
        </View>
      )}

      {messages.length > 1 && (
        <Text style={styles.swipeHint}>
          👈 Deslize para ver mais 👉
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F0F4F8",
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 32,
  },
  pageIndicator: {
    alignItems: "center",
    marginBottom: 16,
  },
  pageIndicatorText: {
    color: "#718096",
    fontSize: 14,
  },
  messageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  messageContentWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 8,
  },
  messageEmoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  messageTitle: {
    color: "#2D3748",
    fontSize: 32,
    fontWeight: "800",
    marginBottom: 24,
    textAlign: "center",
  },
  divider: {
    width: 60,
    height: 4,
    backgroundColor: "#63B3ED",
    borderRadius: 2,
    marginBottom: 32,
  },
  messageContent: {
    color: "#4A5568",
    fontSize: 22,
    lineHeight: 32,
    textAlign: "center",
    fontWeight: "500",
  },
  emergencyActions: {
    gap: 12,
    marginTop: 32,
  },
  emergencyButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
  },
  emergencyButtonText: {
    color: "#FFFFFF",
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
    borderColor: "#FF6B6B",
  },
  emergencyButtonSecondaryText: {
    color: "#FF6B6B",
    fontSize: 16,
    fontWeight: "600",
  },
  swipeHint: {
    color: "#A0AEC0",
    fontSize: 14,
    textAlign: "center",
    marginTop: 16,
  },
});
