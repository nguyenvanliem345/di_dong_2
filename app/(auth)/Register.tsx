import { Feather, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// API
import { registerUser } from "../../Services/apiService";

export default function RegisterScreen() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    numphone: "",
    password: "",
    confirm: "",
  });

  // animation
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!form.username || !form.email || !form.password || !form.numphone) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    if (form.password !== form.confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        fullName: form.username.trim(),
        email: form.email.trim(),
        phone: form.numphone.trim(),
        password: form.password,
      };

      await registerUser(payload);

      Alert.alert("Thành công 🎉", "Đăng ký tài khoản thành công!", [
        { text: "Đăng nhập", onPress: () => router.replace("/(auth)/login") },
      ]);
    } catch (err: any) {
      Alert.alert(
        "Thất bại",
        err?.response?.data?.message || "Không thể đăng ký, vui lòng thử lại.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Background sáng */}
      <LinearGradient
        colors={["#fff", "#fff7ec"]}
        style={StyleSheet.absoluteFillObject}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll}>
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* LOGO */}
            <View style={styles.logoWrap}>
              <View style={styles.logoBox}>
                <Text style={styles.logoText}>hedio</Text>
              </View>
              <Text style={styles.slogan}>Food & Delivery</Text>
            </View>

            <Text style={styles.title}>Tạo tài khoản</Text>
            <Text style={styles.subtitle}>
              Tham gia để khám phá thế giới ẩm thực 🍔
            </Text>

            {/* FORM */}
            <View style={styles.form}>
              <Input
                label="Tên người dùng"
                icon="user"
                placeholder="Nguyễn Văn A"
                active={activeInput === "user"}
                onFocus={() => setActiveInput("user")}
                onBlur={() => setActiveInput(null)}
                onChangeText={(t: string) => setForm({ ...form, username: t })}
              />

              <Input
                label="Email"
                icon="mail"
                placeholder="email@gmail.com"
                keyboardType="email-address"
                active={activeInput === "email"}
                onFocus={() => setActiveInput("email")}
                onBlur={() => setActiveInput(null)}
                onChangeText={(t: string) => setForm({ ...form, email: t })}
              />

              <Input
                label="Số điện thoại"
                icon="phone"
                placeholder="090xxxxxxx"
                keyboardType="phone-pad"
                active={activeInput === "phone"}
                onFocus={() => setActiveInput("phone")}
                onBlur={() => setActiveInput(null)}
                onChangeText={(t: string) => setForm({ ...form, numphone: t })}
              />

              <Input
                label="Mật khẩu"
                icon="lock"
                placeholder="••••••••"
                secureTextEntry={!showPass}
                isPass
                showPass={showPass}
                setShowPass={setShowPass}
                active={activeInput === "pass"}
                onFocus={() => setActiveInput("pass")}
                onBlur={() => setActiveInput(null)}
                onChangeText={(t: string) => setForm({ ...form, password: t })}
              />

              <Input
                label="Xác nhận mật khẩu"
                icon="shield"
                placeholder="••••••••"
                secureTextEntry
                active={activeInput === "confirm"}
                onFocus={() => setActiveInput("confirm")}
                onBlur={() => setActiveInput(null)}
                onChangeText={(t: string) => setForm({ ...form, confirm: t })}
              />

              <TouchableOpacity
                style={styles.mainBtn}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.mainBtnText}>ĐĂNG KÝ</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* LOGIN */}
            <TouchableOpacity
              style={styles.footer}
              onPress={() => router.push("/(auth)/login")}
            >
              <Text style={styles.footerText}>
                Đã có tài khoản?{" "}
                <Text style={styles.footerLink}>Đăng nhập</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ---------------- INPUT COMPONENT ---------------- */

const Input = ({
  label,
  icon,
  active,
  isPass,
  showPass,
  setShowPass,
  ...props
}: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputBox, active && styles.inputActive]}>
      <Feather name={icon} size={18} color="#ff7a00" />
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        {...props}
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={18}
            color="#999"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 24 },

  logoWrap: { alignItems: "center", marginVertical: 30 },
  logoBox: {
    backgroundColor: "#ff7a00",
    paddingHorizontal: 26,
    paddingVertical: 10,
    borderRadius: 18,
  },
  logoText: { color: "#fff", fontSize: 28, fontWeight: "900" },
  slogan: { marginTop: 6, color: "#777" },

  title: { fontSize: 30, fontWeight: "bold", color: "#222" },
  subtitle: { color: "#777", marginTop: 6, marginBottom: 24 },

  form: { gap: 18 },

  inputGroup: { gap: 6 },
  label: { fontSize: 12, color: "#555", fontWeight: "600" },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "#eee",
  },
  inputActive: { borderColor: "#ff7a00" },
  input: { flex: 1, marginLeft: 10, fontSize: 15 },

  mainBtn: {
    marginTop: 10,
    height: 56,
    borderRadius: 18,
    backgroundColor: "#ff7a00",
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: { color: "#fff", fontWeight: "900", fontSize: 15 },

  footer: { marginTop: 30, alignItems: "center" },
  footerText: { color: "#777" },
  footerLink: { color: "#ff7a00", fontWeight: "bold" },
});
