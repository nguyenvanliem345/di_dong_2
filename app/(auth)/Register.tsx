import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [numphone, setNumphone] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleRegister = async () => {
    if (!username || !email || !numphone || !password || !confirm) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin");
      return;
    }
    if (password !== confirm) {
      Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
      return;
    }

    try {
      setLoading(true);
      const newUser = {
        username: username.trim(),
        email: email.trim(),
        numphone,
        pass: password,
        photo: "", // Mặc định trống
      };

      const response = await fetch(API_CONFIG.USERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) throw new Error("Đăng ký thất bại");

      Alert.alert("Thành công", "Tài khoản DishDash đã sẵn sàng! 🎉", [
        { text: "Đăng nhập ngay", onPress: () => router.replace("/(auth)/Login") },
      ]);
    } catch (err) {
      Alert.alert("Lỗi", "Không thể kết nối máy chủ Railway");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground source={require("../../assets/images/unnamed.jpg")} style={styles.backgroundImage}>
        <LinearGradient colors={["rgba(0,0,0,0.3)", "rgba(0,0,0,0.7)", "#000"]} style={styles.gradientOverlay} />
        
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
            
            <Pressable style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="chevron-back" size={24} color="#fff" />
            </Pressable>

            <View style={styles.headerContainer}>
              <Text style={styles.brandText}>DISH<Text style={styles.highlightText}>DASH</Text></Text>
              <Text style={styles.welcomeText}>Gia nhập cộng đồng ẩm thực lớn nhất</Text>
            </View>

            <View style={styles.formContainer}>
              {renderInput("person-outline", "Tên hiển thị", username, setUsername)}
              {renderInput("mail-outline", "Email", email, setEmail, "email-address")}
              {renderInput("call-outline", "Số điện thoại", numphone, setNumphone, "phone-pad")}
              {renderInput("lock-closed-outline", "Mật khẩu", password, setPassword, "default", true)}
              {renderInput("shield-checkmark-outline", "Xác nhận lại", confirm, setConfirm, "default", true)}

              <Pressable onPress={handleRegister} disabled={loading}>
                <LinearGradient colors={["#E53935", "#C62828"]} style={styles.registerBtn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Đăng ký ngay</Text>}
                </LinearGradient>
              </Pressable>

              <Pressable style={styles.footerLink} onPress={() => router.replace("/(auth)/Login")}>
                <Text style={styles.footerText}>Đã có tài khoản? <Text style={styles.loginText}>Đăng nhập</Text></Text>
              </Pressable>
            </View>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

function renderInput(icon: any, label: string, value: string, onChange: (v: string) => void, kType: any = "default", secure = false) {
  return (
    <View style={styles.inputWrapper}>
      <View style={styles.inputInner}>
        <Ionicons name={icon} size={20} color="rgba(255,255,255,0.6)" />
        <TextInput
          style={styles.textInput}
          placeholder={label}
          placeholderTextColor="rgba(255,255,255,0.4)"
          value={value}
          onChangeText={onChange}
          keyboardType={kType}
          secureTextEntry={secure}
          autoCapitalize="none"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: 24, paddingTop: 60 },
  backBtn: { width: 44, height: 44, backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 12, justifyContent: "center", alignItems: "center", marginBottom: 20 },
  headerContainer: { marginBottom: 30 },
  brandText: { fontSize: 38, fontWeight: "900", color: "#fff", letterSpacing: 1 },
  highlightText: { color: "#C62828" },
  welcomeText: { fontSize: 15, color: "rgba(255,255,255,0.6)", marginTop: 5 },
  formContainer: { gap: 15 },
  inputWrapper: { width: "100%" },
  inputInner: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.1)", borderRadius: 16, paddingHorizontal: 16, height: 58, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  textInput: { flex: 1, marginLeft: 12, color: "#fff", fontSize: 16 },
  registerBtn: { height: 58, borderRadius: 16, justifyContent: "center", alignItems: "center", marginTop: 10, elevation: 5 },
  registerBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerLink: { marginTop: 20, alignItems: "center" },
  footerText: { color: "rgba(255,255,255,0.6)" },
  loginText: { color: "#fff", fontWeight: "bold" },
});