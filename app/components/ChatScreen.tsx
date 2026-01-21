import React, { useState } from "react";
import {
    ActivityIndicator,
    Button,
    FlatList,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { askGPT } from "../../apiChat"; // Đã đổi tên hàm từ askGemini sang askGPT

export default function ChatScreen() {
  const [messages, setMessages] = useState<
    { id: string; text: string; sender: "user" | "bot" }[]
  >([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false); // Thêm trạng thái chờ

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMsg = {
      id: Date.now().toString(),
      text: input,
      sender: "user" as const,
    };
    setMessages((prev) => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setLoading(true);

    // Gọi OpenAI thay vì Gemini
    const botReply = await askGPT(currentInput);

    const botMsg = {
      id: (Date.now() + 1).toString(),
      text: botReply,
      sender: "bot" as const,
    };
    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.bubble,
              item.sender === "user" ? styles.user : styles.bot,
            ]}
          >
            <Text style={styles.text}>{item.text}</Text>
          </View>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      {loading && (
        <ActivityIndicator color="#0000ff" style={{ marginBottom: 10 }} />
      )}

      <View style={styles.inputContainer}>
        <TextInput
          value={input}
          onChangeText={setInput}
          style={styles.input}
          placeholder="Hỏi GPT-4o-mini..."
          editable={!loading}
        />
        <Button
          title={loading ? "..." : "Gửi"}
          onPress={handleSend}
          disabled={loading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 50, backgroundColor: "#fff" },
  bubble: { padding: 12, borderRadius: 15, marginVertical: 5, maxWidth: "85%" },
  user: { alignSelf: "flex-end", backgroundColor: "#007AFF" },
  bot: { alignSelf: "flex-start", backgroundColor: "#F0F0F0" },
  text: { fontSize: 16, color: "#000" },
  // Màu chữ trắng cho user để dễ đọc trên nền xanh
  userText: { color: "#fff" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
    paddingTop: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
});
