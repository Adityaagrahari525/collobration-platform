import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { DirectMessage } from "../../types";
import { colors } from "../../theme/colors";
import { typography } from "../../theme/typography";
import { borderRadius, spacing, shadows } from "../../theme/spacing";
import { dbService } from "../../services/dbService";
import { useAuth } from "../../context/AuthContext";

export const ChatScreen = ({ route }: any) => {
  const { participantId, name } = route.params || {};
  const { user } = useAuth();

  const [messages, setMessages] = useState<DirectMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const flatListRef = useRef<FlatList>(null);

  const loadMessages = async () => {
    if (!user || !participantId) return;
    const msgs = await dbService.getMessagesByConversationId(participantId, user.id);
    setMessages(msgs);
  };

  useEffect(() => {
    loadMessages();
  }, [participantId, user]);

  const handleSend = async () => {
    if (!inputText.trim() || !user || !participantId) return;

    const textToSend = inputText.trim();
    setInputText("");

    const newMsg = await dbService.sendMessage(user.id, participantId, textToSend);
    setMessages((prev) => [...prev, newMsg]);

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <View style={styles.header}>
        <Text style={styles.headerName}>{name || "Academic Scholar"}</Text>
        <Text style={styles.headerStatus}>Verified Network Peer • Online</Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          const isMe = item.senderId === user?.id;
          return (
            <View
              style={[
                styles.messageBubble,
                isMe ? styles.myBubble : styles.theirBubble,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  isMe ? styles.myText : styles.theirText,
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  isMe ? styles.myTime : styles.theirTime,
                ]}
              >
                {item.timestamp}
              </Text>
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>Start Academic Conversation</Text>
            <Text style={styles.emptySub}>
              Share project inquiries, code collaboration notes, or research papers with {name}.
            </Text>
          </View>
        }
      />

      {/* Input Composer */}
      <View style={styles.composerContainer}>
        <TextInput
          style={styles.input}
          placeholder={`Message ${name || "scholar"}...`}
          placeholderTextColor={colors.textLight}
          value={inputText}
          onChangeText={setInputText}
          multiline={true}
        />
        <TouchableOpacity
          style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim()}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderLight,
    alignItems: "center",
  },
  headerName: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  headerStatus: {
    ...typography.caption,
    color: colors.secondary,
    fontWeight: "600",
  },
  messagesList: {
    padding: spacing.screenPadding,
    flexGrow: 1,
    justifyContent: "flex-end",
  },
  messageBubble: {
    maxWidth: "80%",
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: colors.primary,
    borderBottomRightRadius: 2,
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: colors.surface,
    borderBottomLeftRadius: 2,
    borderWidth: 1,
    borderColor: colors.borderLight,
  },
  messageText: {
    ...typography.bodyMedium,
    lineHeight: 20,
  },
  myText: {
    color: colors.onPrimary,
  },
  theirText: {
    color: colors.textPrimary,
  },
  timeText: {
    ...typography.caption,
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
  },
  myTime: {
    color: colors.primaryLight,
  },
  theirTime: {
    color: colors.textMuted,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: spacing.xl,
    marginTop: spacing.xl,
  },
  emptyIcon: {
    fontSize: 40,
    marginBottom: spacing.sm,
  },
  emptyTitle: {
    ...typography.titleMedium,
    color: colors.textPrimary,
  },
  emptySub: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: "center",
    maxWidth: 240,
    marginTop: 4,
  },
  composerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.screenPadding,
    paddingVertical: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.borderLight,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    maxHeight: 100,
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: spacing.sm,
  },
  sendBtnDisabled: {
    backgroundColor: colors.surfaceContainer,
  },
  sendIcon: {
    color: colors.onPrimary,
    fontSize: 16,
    fontWeight: "700",
  },
});
