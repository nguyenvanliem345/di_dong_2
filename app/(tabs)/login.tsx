import { useState } from "react";
import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = () => {
    // Handle login logic here
    console.log("Login attempt:", { email, password, rememberMe });
    alert("Đăng nhập thành công!");
    // Sau khi đăng nhập, quay về trang chủ
    router.push("/");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Nút quay lại */}
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>← Quay lại</Text>
        </TouchableOpacity>

        {/* Logo and Title */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoIcon}>☕</Text>
          </View>
          <Text style={styles.title}>Đăng Nhập</Text>
          <Text style={styles.subtitle}>Quản lý quán cà phê</Text>
        </View>

        {/* Login Form */}
        <View style={styles.form}>
          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="email@example.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Remember Me and Forgot Password */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.checkboxContainer}
            >
              <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                {rememberMe && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>Ghi nhớ đăng nhập</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text style={styles.forgotPassword}>Quên mật khẩu?</Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Đăng Nhập</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Register Link */}
          <View style={styles.registerContainer}>
  <Text style={styles.registerText}>Chưa có tài khoản? </Text>
  <Link href="/register" asChild>
    <Text style={styles.registerLink}>Đăng ký ngay</Text>
  </Link>
</View>
        </View>

        {/* Additional Info */}
        <Text style={styles.footer}>© 2025 Coffee Shop Management</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF8F0",
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
  },
  backButton: {
    alignSelf: "flex-start",
    marginBottom: 16,
    padding: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: "#D97706",
    fontWeight: "600",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#D97706",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#6B7280",
  },
  form: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 8,
    fontWeight: "500",
  },
  inputContainer: {
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  inputIcon: {
    position: "absolute",
    left: 12,
    fontSize: 20,
    zIndex: 1,
  },
  input: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    paddingLeft: 48,
    paddingRight: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: "#1F2937",
  },
  passwordInput: {
    paddingRight: 48,
  },
  eyeButton: {
    position: "absolute",
    right: 12,
    padding: 4,
  },
  eyeIcon: {
    fontSize: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: "#D97706",
    borderColor: "#D97706",
  },
  checkmark: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  checkboxLabel: {
    fontSize: 14,
    color: "#374151",
  },
  forgotPassword: {
    fontSize: 14,
    color: "#D97706",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#D97706",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#D1D5DB",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#6B7280",
    fontSize: 14,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 14,
    color: "#6B7280",
  },
  registerLink: {
    fontSize: 14,
    color: "#D97706",
    fontWeight: "600",
  },
  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 12,
    marginTop: "auto",
    paddingTop: 24,
  },
});
