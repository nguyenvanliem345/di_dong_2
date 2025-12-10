import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgetPasswordScreen() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleChangePassword = () => {
    if (!password || !confirm) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      alert("Mật khẩu nhập lại không khớp");
      return;
    }

    // Gọi API đổi mật khẩu nếu muốn
    console.log("Mật khẩu mới:", password);

    alert("Đổi mật khẩu thành công!");
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>☕</Text>
          </View>
          <Text style={styles.title}>Đổi mật khẩu</Text>
          <Text style={styles.subtitle}>Nhập mật khẩu mới để cập nhật</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Mật khẩu mới</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập mật khẩu mới"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            onChangeText={setPassword}
            value={password}
          />

          <Text style={styles.label}>Nhập lại mật khẩu</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#9CA3AF"
            secureTextEntry
            onChangeText={setConfirm}
            value={confirm}
          />

          <TouchableOpacity style={styles.submitButton} onPress={handleChangePassword}>
            <Text style={styles.submitButtonText}>Xác nhận đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>© 2025 Coffee Shop Management</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF8F0" },
  scrollContent: { flexGrow: 1, padding: 24 },
  backButton: { alignSelf: "flex-start", marginBottom: 16, padding: 8 },
  backButtonText: { fontSize: 16, color: "#D97706", fontWeight: "600" },
  logoContainer: { alignItems: "center", marginBottom: 32 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D97706",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: { fontSize: 32 },
  title: { fontSize: 28, fontWeight: "bold", color: "#1F2937", marginBottom: 6 },
  subtitle: { fontSize: 14, color: "#6B7280" },
  form: { marginTop: 8 },
  label: { fontSize: 14, color: "#374151", marginBottom: 8 },
  input: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 16,
    color: "#1F2937",
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: "#D97706",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  submitButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  footer: { textAlign: "center", color: "#9CA3AF", fontSize: 12, marginTop: "auto" },
});
