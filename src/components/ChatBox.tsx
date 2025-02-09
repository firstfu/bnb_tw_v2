import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, borderRadius } from "../theme";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (text: string) => void;
}

export default function ChatBox({ messages, onSendMessage }: ChatBoxProps) {
  const [newMessage, setNewMessage] = useState("");

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("zh-TW", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[styles.messageContainer, item.isUser ? styles.userMessage : styles.systemMessage]}>
      <Text style={[styles.messageText, item.isUser ? styles.userMessageText : styles.systemMessageText]}>{item.text}</Text>
      <Text style={[styles.timestamp, item.isUser ? styles.userTimestamp : styles.systemTimestamp]}>{formatTime(item.timestamp)}</Text>
    </View>
  );

  const handleSend = () => {
    if (newMessage.trim()) {
      onSendMessage(newMessage.trim());
      setNewMessage("");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <FlatList data={messages} renderItem={renderMessage} keyExtractor={item => item.id} contentContainerStyle={styles.messagesList} inverted />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newMessage}
          onChangeText={setNewMessage}
          placeholder="輸入訊息..."
          placeholderTextColor={colors.textLight}
          multiline
          maxLength={500}
        />
        <TouchableOpacity style={[styles.sendButton, !newMessage.trim() && styles.sendButtonDisabled]} onPress={handleSend} disabled={!newMessage.trim()}>
          <Ionicons name="send" size={24} color={newMessage.trim() ? colors.primary : colors.textLight} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    maxWidth: "80%",
    marginBottom: 16,
    padding: 12,
    borderRadius: borderRadius.lg,
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#f0f0f0",
  },
  messageText: {
    fontSize: typography.body.fontSize,
    marginBottom: 4,
  },
  userMessageText: {
    color: colors.background,
  },
  systemMessageText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: typography.caption.fontSize,
    alignSelf: "flex-end",
  },
  userTimestamp: {
    color: "rgba(255, 255, 255, 0.7)",
  },
  systemTimestamp: {
    color: colors.textLight,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: "#f5f5f5",
    borderRadius: borderRadius.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 8,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
