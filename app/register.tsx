import { useState } from "react";
import { Link, router } from "expo-router";
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

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    // Validation
    if (formData.password !== formData.confirmPassword) {
      alert("Mật khẩu không khớp!");
      return;
    }

    if (!formData.agreeToTerms) {
      alert("Vui lòng đồng ý với điều khoản sử dụng");
      return;
    }

    // Handle register logic here
    console.log("Đăng ký thành công:", formData);
    setIsSubmitted(true);
  };

  const handleBack = () => {
    // Quay về trang trước hoặc trang đăng nhập
    console.log("Quay lại");
  };

  if (isSubmitted) {
    return (
      <View style={styles.container}>
        <View style={styles.successContainer}>
          <View style={styles.successIconCircle}>
            <Text style={styles.successIcon}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Đăng ký thành công! 🎉</Text>
          <Text style={styles.successText}>
            Chào mừng <Text style={styles.highlightText}>{formData.fullName}</Text>!
            Tài khoản của bạn đã được tạo thành công.
          </Text>
          <TouchableOpacity
            style={styles.submitButton}
            onPress={() => setIsSubmitted(false)}
          >
            <Text style={styles.submitButtonText}>Quay lại</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

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
          <Text style={styles.title}>Đăng Ký</Text>
          <Text style={styles.subtitle}>Quản lý quán cà phê</Text>
        </View>

        {/* Register Form */}
        <View style={styles.form}>
          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Họ và tên</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                value={formData.fullName}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, fullName: text }))
                }
                placeholder="Nguyễn Văn A"
                placeholderTextColor="#9CA3AF"
                autoCapitalize="words"
              />
            </View>
          </View>

          {/* Email Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, email: text }))
                }
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
                value={formData.password}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, password: text }))
                }
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

          {/* Confirm Password Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Xác nhận mật khẩu</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={[styles.input, styles.passwordInput]}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData((prev) => ({ ...prev, confirmPassword: text }))
                }
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeIcon}>
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms and Conditions */}
          <View style={styles.row}>
            <TouchableOpacity
              onPress={() =>
                setFormData((prev) => ({
                  ...prev,
                  agreeToTerms: !prev.agreeToTerms,
                }))
              }
              style={styles.checkboxContainer}
            >
              <View
                style={[
                  styles.checkbox,
                  formData.agreeToTerms && styles.checkboxChecked,
                ]}
              >
                {formData.agreeToTerms && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </View>
              <Text style={styles.checkboxLabel}>
                Tôi đồng ý với{" "}
                <Text style={styles.linkText}>điều khoản sử dụng</Text> và{" "}
                <Text style={styles.linkText}>chính sách bảo mật</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Submit Button */}
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Đăng Ký</Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>hoặc</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Login Link */}
          <View style={styles.registerContainer}>
  <Text style={styles.registerText}>Đã có tài khoản? </Text>
  <Link href="/login" asChild>
    <Text style={styles.registerLink}>Đăng Nhập</Text>
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
    marginBottom: 24,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    borderRadius: 4,
    marginRight: 8,
    marginTop: 2,
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
    flex: 1,
    lineHeight: 20,
  },
  linkText: {
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
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#FFFFFF",
    margin: 24,
    borderRadius: 16,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#D97706",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successIcon: {
    fontSize: 40,
    color: "#FFFFFF",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 12,
    textAlign: "center",
  },
  successText: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 24,
  },
  highlightText: {
    color: "#D97706",
    fontWeight: "600",
  },
});
