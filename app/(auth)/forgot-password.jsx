import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    // 1. Kiểm tra nhập liệu
    if (!email) return Alert.alert("Thông báo", "Vui lòng nhập Email.");

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email))
      return Alert.alert("Lỗi", "Định dạng Email không hợp lệ.");

    setLoading(true);
    try {
      console.log("Đang xử lý khôi phục cho:", email);

      // BƯỚC A: Gọi API gửi mã OTP về Gmail
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/User/forgot-password`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email }),
        },
      );

      const result = await response.json();

      if (response.ok) {
        // BƯỚC B: Lấy UserId dựa trên Email
        // (Để truyền sang màn hình reset-password cuối cùng)
        // Lưu ý: Đảm bảo Backend của bạn có route GET api/User/email/{email}
        const userRes = await fetch(
          `${API_CONFIG.BASE_URL}/api/User/email/${email}`,
        );
        const userData = await userRes.json();

        if (!userData || !userData.id) {
          throw new Error("Không lấy được ID người dùng.");
        }

        // BƯỚC C: Thông báo và chuyển sang màn hình OTP
        Alert.alert(
          "📩 Đã gửi mã",
          "Mã xác thực đã được gửi tới Gmail của bạn. Vui lòng kiểm tra!",
          [
            {
              text: "Nhập mã ngay",
              onPress: () => {
                // CHÚ Ý: Chuyển sang otp-verification kèm userId
                router.push({
                  pathname: "/(auth)/otp-verification",
                  params: {
                    email: email,
                    userId: userData.id, // ID này rất quan trọng để Reset Pass sau này
                  },
                });
              },
            },
          ],
        );
      } else {
        Alert.alert(
          "Lỗi",
          result.message || "Email không tồn tại trong hệ thống.",
        );
      }
    } catch (error) {
      console.error("Lỗi hệ thống:", error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra hoặc Server không phản hồi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={["#0A0A0A", "#000"]}
        style={StyleSheet.absoluteFillObject}
      />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* Nút quay lại */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            <Feather name="chevron-left" size={28} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Quên{"\n"}Mật khẩu?</Text>
            <Text style={styles.subtitle}>
              Đừng lo lắng! Nhập email của bạn để bắt đầu quy trình xác thực và
              đặt lại mật khẩu.
            </Text>

            <View style={styles.form}>
              <View
                style={[styles.inputBox, isFocused && styles.inputBoxActive]}
              >
                <Feather
                  name="mail"
                  size={20}
                  color={isFocused ? "#FFF" : "#444"}
                />
                <TextInput
                  placeholder="Nhập email của bạn"
                  placeholderTextColor="#444"
                  style={styles.input}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  onFocus={() => setIsFocused(true)}
                  onBlur={() => setIsFocused(false)}
                  keyboardType="email-address"
                />
              </View>

              <TouchableOpacity
                style={[
                  styles.mainBtn,
                  (loading || !email) && { opacity: 0.7 },
                ]}
                onPress={handleReset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#000" />
                ) : (
                  <Text style={styles.mainBtnText}>TIẾP TỤC</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  backBtn: { padding: 20 },
  content: { paddingHorizontal: 30, marginTop: 20 },
  title: { color: "#FFF", fontSize: 36, fontWeight: "800" },
  subtitle: { color: "#666", marginTop: 15, lineHeight: 22, fontSize: 16 },
  form: { marginTop: 50 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0A0A0A",
    height: 65,
    borderRadius: 18,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#222",
  },
  inputBoxActive: { borderColor: "#FFF", backgroundColor: "#111" },
  input: { flex: 1, marginLeft: 12, color: "#FFF", fontSize: 16 },
  mainBtn: {
    backgroundColor: "#FFF",
    height: 65,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 30,
  },
  mainBtnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
