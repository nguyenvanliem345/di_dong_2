import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

const { width } = Dimensions.get("window");

export default function ModernLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Animation states
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 20,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(API_CONFIG.USERS);
      const data = await response.json();
      const userList = data.content || data;

      const user = userList.find(
        (u: any) => u.email === email.trim() && u.pass === password
      );

      if (user) {
        await AsyncStorage.setItem("user", JSON.stringify(user));
        router.replace("/(tabs)");
      } else {
        Alert.alert("Thất bại", "Email hoặc mật khẩu không đúng");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Không kết nối được máy chủ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ImageBackground
        source={require("../../assets/images/unnamed.jpg")}
        style={styles.backgroundImage}
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.1)", "rgba(0,0,0,0.5)", "#000"]}
          style={styles.gradientOverlay}
        />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header Section */}
            <View style={styles.headerContainer}>
              <View style={styles.logoCircle}>
                <Ionicons name="restaurant" size={40} color="#fff" />
              </View>
              <Text style={styles.brandText}>
                DISH<Text style={styles.highlightText}>DASH</Text>
              </Text>
              <Text style={styles.welcomeText}>
                Khám phá hương vị tuyệt vời ngay!
              </Text>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Email của bạn</Text>
                <View style={styles.inputInner}>
                  <Ionicons
                    name="mail-outline"
                    size={20}
                    color="#fff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="name@example.com"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={styles.labelRow}>
                  <Text style={styles.label}>Mật khẩu</Text>
  
                  <Pressable
                    onPress={() => router.push("/(auth)/ForgotPassword")}
                  >
                    <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                  </Pressable>
                </View>
                <View style={styles.inputInner}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={20}
                    color="#fff"
                    style={styles.inputIcon}
                  />
                  <TextInput
                    placeholder="••••••••"
                    placeholderTextColor="rgba(255,255,255,0.5)"
                    style={styles.textInput}
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <Pressable onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons
                      name={showPassword ? "eye-outline" : "eye-off-outline"}
                      size={20}
                      color="#fff"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Login Button with Scale Animation */}
              <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                <Pressable
                  onPress={handleLogin}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                  disabled={loading}
                >
                  <LinearGradient
                    colors={["#E53935", "#C62828"]}
                    style={styles.loginBtn}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                  >
                    {loading ? (
                      <ActivityIndicator color="#fff" />
                    ) : (
                      <Text style={styles.loginBtnText}>Đăng nhập</Text>
                    )}
                  </LinearGradient>
                </Pressable>
              </Animated.View>

              <View style={styles.footerContainer}>
                <Text style={styles.footerText}>Bạn chưa có tài khoản? </Text>
                <Pressable onPress={() => router.push("/(auth)/Register")}>
                  <Text style={styles.signupText}>Đăng ký ngay</Text>
                </Pressable>
              </View>
            </View>
          </Animated.View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  headerContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#C62828",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 10,
    shadowColor: "#C62828",
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  brandText: {
    fontSize: 42,
    fontWeight: "900",
    color: "#fff",
    letterSpacing: 2,
  },
  highlightText: { color: "#C62828" },
  welcomeText: {
    fontSize: 16,
    color: "rgba(255,255,255,0.7)",
    marginTop: 5,
    textAlign: "center",
  },
  formContainer: {
    gap: 25,
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 20,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backdropFilter: "blur(10px)", // Lưu ý: React Native chuẩn chưa hỗ trợ blur kiểu web, hiệu ứng này từ translucent bg
  },
  inputWrapper: { gap: 10 },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 5,
  },
  forgotText: { color: "#E53935", fontSize: 13 },
  inputInner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.15)",
    borderRadius: 18,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  inputIcon: { marginRight: 10 },
  textInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
  },
  loginBtn: {
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  loginBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  footerText: { color: "rgba(255,255,255,0.7)", fontSize: 15 },
  signupText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
});
