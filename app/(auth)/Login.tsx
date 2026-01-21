import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import * as LocalAuthentication from "expo-local-authentication";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
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

// --- IMPORT SERVICE ---
import { loginUserByEmail } from "../../Services/apiService";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [activeInput, setActiveInput] = useState<string | null>(null);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // --- LOGIC GIỮ NGUYÊN ---
  const handleLogin = async () => {
    if (!email || !password) {
      return Alert.alert(
        "Nhắc nhở",
        "Bạn ơi, nhập đủ Email và Mật khẩu nhé!", // Đổi text cho thân thiện hơn
      );
    }

    setLoading(true);
    try {
      const result = await loginUserByEmail(
        email.toLowerCase().trim(),
        password.trim(),
      );

      const realToken = result?.token;
      const userId = result?.id;

      if (realToken && userId) {
        const userSession = {
          id: userId,
          name: result?.fullName || "Foodie",
          email: result?.email || email,
          role: result?.role || "customer",
        };

        if (Platform.OS === "web") {
          localStorage.setItem("userToken", realToken);
          localStorage.setItem("userId", String(userId));
          localStorage.setItem("userData", JSON.stringify(userSession));
        } else {
          await AsyncStorage.setItem("userToken", realToken);
          await AsyncStorage.setItem("userId", String(userId));
          await AsyncStorage.setItem("userData", JSON.stringify(userSession));
        }

        console.log("✅ Login Success: ID =", userId);
        router.replace("/(tabs)");
      } else {
        Alert.alert("Lỗi", "Tài khoản không hợp lệ hoặc thiếu dữ liệu.");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Email hoặc mật khẩu chưa đúng.";
      Alert.alert("Rất tiếc", errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/(auth)/forgot-password");
  };

  const handleBiometricAuth = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      if (!compatible) {
        return Alert.alert(
          "Thông báo",
          "Thiết bị không hỗ trợ vân tay/FaceID.",
        );
      }

      const resultAuth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Đăng nhập nhanh để đặt món",
        fallbackLabel: "Nhập mật khẩu",
      });

      if (resultAuth.success) {
        const token =
          Platform.OS === "web"
            ? localStorage.getItem("userToken")
            : await AsyncStorage.getItem("userToken");

        if (token) {
          router.replace("/(tabs)");
        } else {
          Alert.alert(
            "Yêu cầu",
            "Vui lòng đăng nhập thủ công lần đầu để kích hoạt.",
          );
        }
      }
    } catch (error) {
      Alert.alert("Lỗi", "Xác thực sinh trắc học thất bại.");
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F8" />

      {/* Background Decor Circles */}
      <View style={styles.circleDecor1} />
      <View style={styles.circleDecor2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* --- HEADER LOGO --- */}
            <View style={styles.headerSection}>
              <View style={styles.logoContainer}>
                <Image
                  // Placeholder logo đồ ăn (nếu không có ảnh thì dùng icon bên dưới)
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/3075/3075977.png",
                  }}
                  style={styles.foodImage}
                />
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons
                    name="silverware-fork-knife"
                    size={20}
                    color="#FFF"
                  />
                </View>
              </View>
              <Text style={styles.welcomeText}>Xin chào HEDIO!</Text>
              <Text style={styles.subText}>Đăng nhập để săn món ngon ngay</Text>
            </View>

            {/* --- FORM --- */}
            <View style={styles.form}>
              <InputBox
                label="Email"
                icon="mail"
                placeholder="name@example.com"
                keyboardType="email-address"
                active={activeInput === "email"}
                onFocus={() => setActiveInput("email")}
                onBlur={() => setActiveInput(null)}
                onChangeText={setEmail}
                value={email}
              />
              <InputBox
                label="Mật khẩu"
                icon="lock"
                placeholder="Nhập mật khẩu"
                secure={!showPass}
                isPass
                active={activeInput === "pass"}
                onFocus={() => setActiveInput("pass")}
                onBlur={() => setActiveInput(null)}
                showPass={showPass}
                setShowPass={setShowPass}
                onChangeText={setPassword}
                value={password}
              />

              <TouchableOpacity
                onPress={handleForgotPassword}
                style={styles.forgotBtn}
              >
                <Text style={styles.forgotText}>Quên mật khẩu?</Text>
              </TouchableOpacity>

              {/* MAIN BUTTON */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                style={styles.shadowBtn}
              >
                <LinearGradient
                  colors={["#FF8C00", "#FF4500"]} // Gradient Cam -> Đỏ
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainBtn}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.mainBtnText}>ĐĂNG NHẬP NGAY</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>

            {/* --- SOCIAL LOGIN --- */}
            <View style={styles.socialSection}>
              <Text style={styles.dividerText}>Hoặc tiếp tục với</Text>

              <View style={styles.socialRow}>
                <SocialButton
                  icon={
                    <FontAwesome5 name="google" size={20} color="#DB4437" />
                  }
                  bgColor="#FFF"
                />
                <SocialButton
                  icon={
                    <FontAwesome5 name="facebook-f" size={20} color="#4267B2" />
                  }
                  bgColor="#FFF"
                />

                {/* Biometric Button */}
                <TouchableOpacity
                  style={[styles.socialBtn, styles.bioBtn]}
                  onPress={handleBiometricAuth}
                >
                  <MaterialCommunityIcons
                    name="fingerprint"
                    size={24}
                    color="#FF6B6B"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* --- FOOTER --- */}
            <TouchableOpacity
              style={styles.footer}
              onPress={() => router.push("/(auth)/register")}
            >
              <Text style={styles.footerText}>
                Bạn chưa có tài khoản?{" "}
                <Text style={styles.footerLink}>Đăng ký</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- COMPONENTS ---

const InputBox = ({
  label,
  icon,
  active,
  isPass,
  showPass,
  setShowPass,
  secure,
  ...props
}: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.inputLabel}>{label}</Text>
    <View
      style={[
        styles.inputContainer,
        active ? styles.inputActive : styles.inputInactive,
      ]}
    >
      <Feather name={icon} size={20} color={active ? "#FF6B6B" : "#A0A0A0"} />
      <TextInput
        style={styles.textInput}
        placeholderTextColor="#C4C4C4"
        autoCapitalize="none"
        secureTextEntry={secure}
        {...props}
      />
      {isPass && (
        <TouchableOpacity onPress={() => setShowPass(!showPass)}>
          <Ionicons
            name={showPass ? "eye-off" : "eye"}
            size={20}
            color="#A0A0A0"
          />
        </TouchableOpacity>
      )}
    </View>
  </View>
);

const SocialButton = ({ icon, bgColor }: any) => (
  <TouchableOpacity style={[styles.socialBtn, { backgroundColor: bgColor }]}>
    {icon}
  </TouchableOpacity>
);

// --- STYLES ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F8", // Màu nền sáng nhẹ
  },
  // Họa tiết trang trí nền
  circleDecor1: {
    position: "absolute",
    top: -50,
    left: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "rgba(255, 107, 107, 0.1)", // Cam nhạt
  },
  circleDecor2: {
    position: "absolute",
    top: 50,
    right: -30,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "rgba(255, 197, 41, 0.15)", // Vàng nhạt
  },
  scrollContent: {
    paddingHorizontal: 30,
    paddingTop: 80,
    paddingBottom: 40,
  },

  // Header Style
  headerSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  logoContainer: {
    width: 100,
    height: 100,
    marginBottom: 20,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 50,
    elevation: 10,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  foodImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
  iconBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#FF6B6B",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2D2D2D",
    marginBottom: 8,
  },
  subText: {
    fontSize: 14,
    color: "#9A9A9A",
  },

  // Form Style
  form: {
    gap: 20,
  },
  inputWrapper: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D2D2D",
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    borderRadius: 15,
    paddingHorizontal: 15,
    backgroundColor: "#FFF",
    borderWidth: 1,
  },
  inputInactive: {
    borderColor: "#F0F0F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputActive: {
    borderColor: "#FF6B6B",
    elevation: 4,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    color: "#333",
    fontSize: 15,
  },
  forgotBtn: {
    alignSelf: "flex-end",
  },
  forgotText: {
    color: "#FF6B6B",
    fontWeight: "600",
    fontSize: 13,
  },

  // Button Style
  shadowBtn: {
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 8,
    marginTop: 10,
  },
  mainBtn: {
    height: 56,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },

  // Social Style
  socialSection: {
    marginTop: 40,
    alignItems: "center",
  },
  dividerText: {
    color: "#9A9A9A",
    fontSize: 13,
    marginBottom: 20,
  },
  socialRow: {
    flexDirection: "row",
    gap: 20,
  },
  socialBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF",
    // Shadow
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  bioBtn: {
    backgroundColor: "#FFF0EB", // Nền hơi hồng nhạt cho vân tay
    borderWidth: 1,
    borderColor: "rgba(255, 107, 107, 0.2)",
  },

  // Footer Style
  footer: {
    marginTop: 30,
    alignItems: "center",
  },
  footerText: {
    color: "#9A9A9A",
    fontSize: 14,
  },
  footerLink: {
    color: "#FF6B6B",
    fontWeight: "bold",
  },
});
