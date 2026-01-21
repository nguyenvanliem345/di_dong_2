import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Check độ mạnh mật khẩu
  const getStrength = () => {
    if (password.length < 6) return { label: "Yếu", color: "#FF5A5F" };
    if (!/\d/.test(password)) return { label: "Trung bình", color: "#FFB020" };
    return { label: "Mạnh", color: "#4CD964" };
  };

  const handleReset = () => {
    if (!password || !confirm)
      return Alert.alert("Thiếu thông tin", "Vui lòng nhập đầy đủ mật khẩu");
    if (password.length < 6)
      return Alert.alert("Mật khẩu yếu", "Mật khẩu phải tối thiểu 6 ký tự");
    if (password !== confirm)
      return Alert.alert("Không khớp", "Mật khẩu nhập lại không trùng");

    Alert.alert("✔ Thành công", "Mật khẩu đã được thay đổi!", [
      { text: "Đăng nhập", onPress: () => router.replace("/login") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* BACKGROUND GRADIENT */}
      <LinearGradient
        colors={["#8B73FF", "#B38BFF", "#E4D2FF"]}
        style={styles.bg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      {/* CARD MÀN HÌNH */}
      <View style={styles.card}>
        <Text style={styles.title}>Đặt lại mật khẩu</Text>
        <Text style={styles.subtitle}>
          Nhập mật khẩu mới của bạn và xác nhận lại để tiếp tục.
        </Text>

        {/* Mật khẩu */}
        <View style={styles.inputWrapper}>
          <Ionicons name="lock-closed-outline" size={22} color="#6A5AE0" />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPass}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity onPress={() => setShowPass(!showPass)}>
            <Ionicons
              name={showPass ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6A5AE0"
            />
          </TouchableOpacity>
        </View>

        {/* Độ mạnh mật khẩu */}
        {password.length > 0 && (
          <Text
            style={{
              color: getStrength().color,
              marginBottom: 12,
              fontWeight: "600",
            }}
          >
            Độ mạnh: {getStrength().label}
          </Text>
        )}

        {/* Nhập lại mật khẩu */}
        <View style={styles.inputWrapper}>
          <Ionicons name="refresh-outline" size={22} color="#6A5AE0" />
          <TextInput
            style={styles.input}
            placeholder="Nhập lại mật khẩu"
            placeholderTextColor="#aaa"
            secureTextEntry={!showConfirm}
            value={confirm}
            onChangeText={setConfirm}
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
            <Ionicons
              name={showConfirm ? "eye-off-outline" : "eye-outline"}
              size={22}
              color="#6A5AE0"
            />
          </TouchableOpacity>
        </View>

        {/* BUTTON */}
        <TouchableOpacity activeOpacity={0.85} onPress={handleReset}>
          <LinearGradient
            colors={["#6A5AE0", "#9B6BFF"]}
            style={styles.button}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Text style={styles.buttonText}>Xác nhận thay đổi</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 18 }}
        >
          <Text style={styles.backTxt}>← Quay lại</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center" },

  bg: {
    position: "absolute",
    width: "140%",
    height: "140%",
    borderRadius: 40,
    transform: [{ rotate: "-12deg" }],
  },

  card: {
    width: "85%",
    backgroundColor: "#fff",
    padding: 25,
    borderRadius: 25,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: "center",
  },

  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#2F2F5E",
    marginBottom: 5,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#6D6DA8",
    marginBottom: 28,
    textAlign: "center",
    lineHeight: 20,
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F8FF",
    paddingHorizontal: 15,
    borderRadius: 16,
    height: 55,
    marginBottom: 15,
    width: "100%",
  },

  input: { flex: 1, fontSize: 16, color: "#333" },

  button: {
    paddingVertical: 15,
    borderRadius: 14,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },

  buttonText: { fontSize: 17, fontWeight: "700", color: "#fff" },

  backTxt: { color: "#6A5AE0", fontSize: 16, fontWeight: "600", marginTop: 6 },
});
