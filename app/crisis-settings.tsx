import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { useCrisisStore } from "@/stores/crisisStore";
import { useThemeMode } from "@/hooks/useThemeMode";

export default function CrisisSettingsScreen() {
  const {
    messages,
    contacts,
    primaryContactId,
    addMessage,
    updateMessage,
    deleteMessage,
    addContact,
    updateContact,
    deleteContact,
    setPrimaryContact,
    resetToDefaults,
  } = useCrisisStore();
  const { colors } = useThemeMode();

  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [messageTitle, setMessageTitle] = useState("");
  const [messageContent, setMessageContent] = useState("");
  const [messageEmoji, setMessageEmoji] = useState("💬");

  const [editingContact, setEditingContact] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactRelationship, setContactRelationship] = useState("");
  const [contactEmoji, setContactEmoji] = useState("👤");

  const handleSaveMessage = () => {
    if (!messageTitle.trim() || !messageContent.trim()) return;

    if (editingMessage) {
      updateMessage(editingMessage, {
        title: messageTitle,
        content: messageContent,
        emoji: messageEmoji,
      });
    } else {
      addMessage({
        title: messageTitle,
        content: messageContent,
        emoji: messageEmoji,
      });
    }

    setEditingMessage(null);
    setMessageTitle("");
    setMessageContent("");
    setMessageEmoji("💬");
  };

  const handleEditMessage = (id: string) => {
    const message = messages.find((m) => m.id === id);
    if (!message) return;

    setEditingMessage(id);
    setMessageTitle(message.title);
    setMessageContent(message.content);
    setMessageEmoji(message.emoji);
  };

  const handleSaveContact = () => {
    if (!contactName.trim() || !contactPhone.trim()) return;

    if (editingContact) {
      updateContact(editingContact, {
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
        emoji: contactEmoji,
      });
    } else {
      addContact({
        name: contactName,
        phone: contactPhone,
        relationship: contactRelationship,
        emoji: contactEmoji,
      });
    }

    setEditingContact(null);
    setContactName("");
    setContactPhone("");
    setContactRelationship("");
    setContactEmoji("👤");
  };

  const handleEditContact = (id: string) => {
    const contact = contacts.find((c) => c.id === id);
    if (!contact) return;

    setEditingContact(id);
    setContactName(contact.name);
    setContactPhone(contact.phone);
    setContactRelationship(contact.relationship);
    setContactEmoji(contact.emoji);
  };

  const handleReset = () => {
    Alert.alert(
      "Restaurar padrões",
      "Isso irá restaurar as mensagens padrão e remover todas as personalizações. Deseja continuar?",
      [
        { text: "Cancelar", style: "cancel" },
        { text: "Restaurar", style: "destructive", onPress: resetToDefaults },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerTitle: "Configurar Cartão",
          headerStyle: { backgroundColor: colors.background },
          headerTintColor: colors.text,
        }}
      />
      
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        {/* Mensagens */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💬 Mensagens</Text>
          
          {messages.map((message) => (
            <View key={message.id} style={styles.itemCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemEmoji}>{message.emoji}</Text>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemTitle}>{message.title}</Text>
                  <Text style={styles.itemDescription}>{message.content}</Text>
                </View>
                <View style={styles.itemActions}>
                  <Pressable
                    onPress={() => handleEditMessage(message.id)}
                    style={styles.actionButton}
                  >
                    <Text style={styles.actionButtonText}>Editar</Text>
                  </Pressable>
                  {!message.isDefault && (
                    <Pressable
                      onPress={() => deleteMessage(message.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonTextDelete}>Excluir</Text>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          ))}

          {/* Formulário de mensagem */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {editingMessage ? "Editar mensagem" : "Nova mensagem"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Título"
              placeholderTextColor="#A0AEC0"
              value={messageTitle}
              onChangeText={setMessageTitle}
            />
            
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Conteúdo da mensagem"
              placeholderTextColor="#A0AEC0"
              value={messageContent}
              onChangeText={setMessageContent}
              multiline
              numberOfLines={4}
            />

            <View style={styles.emojiSelector}>
              {["💬", "🫂", "🔇", "🤔", "🤗", "😢", "😰", "🥺"].map((emoji) => (
                <Pressable
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    messageEmoji === emoji && styles.emojiOptionActive,
                  ]}
                  onPress={() => setMessageEmoji(emoji)}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.formActions}>
              {editingMessage && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingMessage(null);
                    setMessageTitle("");
                    setMessageContent("");
                    setMessageEmoji("💬");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveMessage}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Contatos */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>👥 Contatos de Emergência</Text>

          {contacts.length === 0 ? (
            <Text style={styles.emptyText}>Nenhum contato cadastrado</Text>
          ) : (
            contacts.map((contact) => (
              <View key={contact.id} style={styles.itemCard}>
                <View style={styles.itemHeader}>
                  <Text style={styles.itemEmoji}>{contact.emoji}</Text>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle}>{contact.name}</Text>
                    <Text style={styles.itemDescription}>
                      {contact.phone} {contact.relationship && `• ${contact.relationship}`}
                    </Text>
                  </View>
                  <View style={styles.itemActions}>
                    <Pressable
                      onPress={() => setPrimaryContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={primaryContactId === contact.id ? styles.actionButtonTextDelete : styles.actionButtonText}>
                        {primaryContactId === contact.id ? "Desmarcar" : "Primário"}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleEditContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonText}>Editar</Text>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteContact(contact.id)}
                      style={styles.actionButton}
                    >
                      <Text style={styles.actionButtonTextDelete}>Excluir</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))
          )}

          {/* Formulário de contato */}
          <View style={styles.form}>
            <Text style={styles.formTitle}>
              {editingContact ? "Editar contato" : "Novo contato"}
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Nome"
              placeholderTextColor="#A0AEC0"
              value={contactName}
              onChangeText={setContactName}
            />
            
            <TextInput
              style={styles.input}
              placeholder="Telefone"
              placeholderTextColor="#A0AEC0"
              value={contactPhone}
              onChangeText={setContactPhone}
              keyboardType="phone-pad"
            />
            
            <TextInput
              style={styles.input}
              placeholder="Parentesco (opcional)"
              placeholderTextColor="#A0AEC0"
              value={contactRelationship}
              onChangeText={setContactRelationship}
            />

            <View style={styles.emojiSelector}>
              {["👤", "👨", "👩", "👦", "👧", "👴", "👵", "👨‍👩‍👧"].map((emoji) => (
                <Pressable
                  key={emoji}
                  style={[
                    styles.emojiOption,
                    contactEmoji === emoji && styles.emojiOptionActive,
                  ]}
                  onPress={() => setContactEmoji(emoji)}
                >
                  <Text style={styles.emojiOptionText}>{emoji}</Text>
                </Pressable>
              ))}
            </View>

            <View style={styles.formActions}>
              {editingContact && (
                <Pressable
                  style={styles.cancelButton}
                  onPress={() => {
                    setEditingContact(null);
                    setContactName("");
                    setContactPhone("");
                    setContactRelationship("");
                    setContactEmoji("👤");
                  }}
                >
                  <Text style={styles.cancelButtonText}>Cancelar</Text>
                </Pressable>
              )}
              <Pressable
                style={styles.saveButton}
                onPress={handleSaveContact}
              >
                <Text style={styles.saveButtonText}>Salvar</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Reset */}
        <Pressable style={styles.resetButton} onPress={handleReset}>
          <Text style={styles.resetButtonText}>Restaurar padrões</Text>
        </Pressable>
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
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
  },
  itemCard: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
  },
  itemHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  itemEmoji: {
    fontSize: 32,
  },
  itemInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  itemDescription: {
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  itemActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    padding: 4,
  },
  actionButtonText: {
    color: "#63B3ED",
    fontSize: 14,
  },
  actionButtonTextDelete: {
    color: "#FC8181",
    fontSize: 14,
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
    padding: 16,
  },
  form: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 2,
    gap: 12,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  input: {
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    borderWidth: 2,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  emojiSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  emojiOption: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
  },
  emojiOptionActive: {
    borderColor: "#63B3ED",
    backgroundColor: "#EBF8FF",
  },
  emojiOptionText: {
    fontSize: 24,
  },
  formActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
  },
  cancelButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  cancelButtonText: {
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#63B3ED",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
  },
  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },
  resetButton: {
    backgroundColor: "transparent",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FC8181",
  },
  resetButtonText: {
    color: "#FC8181",
    fontSize: 16,
  },
});
