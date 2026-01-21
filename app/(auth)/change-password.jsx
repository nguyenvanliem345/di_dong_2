import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

/* 🎨 PALETTE MÀU */
const COLORS = {
  primary: "#FF7A00",
  primaryDark: "#FF5500",
  background: "#FFF7ED",
  white: "#FFFFFF",
  dark: "#1D1D1F",
  gray: "#8E8E93",
  inputBg: "#FFFFFF",
  border: "#E5E5EA",
  error: "#FF3B30",
};

export default function ChangePasswordScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // State hiển thị mật khẩu
  const [showOldPass, setShowOldPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // State giá trị
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  /* --- XỬ LÝ NÚT BACK (ĐÃ SỬA) --- */
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      // Nếu không có lịch sử để back, quay về trang Profile hoặc Home
      // Bạn hãy thay đổi đường dẫn này nếu file profile của bạn nằm chỗ khác
      router.replace("/(tabs)/profile");
      // Hoặc router.replace('/'); nếu muốn về trang chủ
    }
  };

  const handleChangePassword = async () => {
    if (!oldPass || !newPass || !confirmPass) {
      return Alert.alert("Thông báo", "Vui lòng nhập đầy đủ thông tin.");
    }
    if (newPass !== confirmPass) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không trùng khớp.");
    }
    if (newPass.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu mới phải từ 6 ký tự trở lên.");
    }

    setLoading(true);
    try {
      const userRaw = await AsyncStorage.getItem("userData");
      if (!userRaw) {
        setLoading(false);
        return Alert.alert(
          "Lỗi",
          "Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.",
        );
      }
      const user = JSON.parse(userRaw);

      const currentStoredPass = user.password || user.pass;
      if (oldPass !== currentStoredPass) {
        setLoading(false);
        return Alert.alert("Lỗi", "Mật khẩu hiện tại không chính xác.");
      }

      const formData = new FormData();
      formData.append("Password", newPass.trim());

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/User/${user.id}`,
        {
          method: "PUT",
          headers: { Accept: "application/json" },
          body: formData,
        },
      );

      if (response.ok) {
        const updatedUser = await response.json();
        await AsyncStorage.setItem("userData", JSON.stringify(updatedUser));
        Alert.alert("Thành công", "Mật khẩu của bạn đã được cập nhật.", [
          { text: "OK", onPress: handleBack }, // Đổi mật khẩu xong cũng dùng hàm back này
        ]);
      } else {
        const errorText = await response.text();
        console.error("Lỗi Server:", errorText);
        Alert.alert(
          "Thất bại",
          "Không thể cập nhật mật khẩu. Vui lòng thử lại.",
        );
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Background decoration */}
      <View style={styles.circleDecoration} />

      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={handleBack}
              style={styles.backBtn}
              hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }} // Tăng diện tích bấm
            >
              <Feather name="arrow-left" size={24} color={COLORS.dark} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Đổi Mật Khẩu</Text>
            {/* View rỗng để cân đối header */}
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ILLUSTRATION AREA */}
            <View style={styles.illustrationContainer}>
              <View style={styles.iconCircle}>
                <Feather name="lock" size={40} color={COLORS.primary} />
              </View>
              <Text style={styles.introTitle}>Bảo mật tài khoản</Text>
              <Text style={styles.introText}>
                Mật khẩu mạnh giúp bảo vệ tài khoản{"\n"}và các đơn hàng của
                bạn.
              </Text>
            </View>

            {/* FORM AREA */}
            <View style={styles.formContainer}>
              <PasswordField
                icon="unlock"
                label="Mật khẩu hiện tại"
                value={oldPass}
                onChangeText={setOldPass}
                show={showOldPass}
                onToggle={() => setShowOldPass(!showOldPass)}
                placeholder="Nhập mật khẩu cũ"
              />

              <View style={styles.divider} />

              <PasswordField
                icon="key"
                label="Mật khẩu mới"
                value={newPass}
                onChangeText={setNewPass}
                show={showNewPass}
                onToggle={() => setShowNewPass(!showNewPass)}
                placeholder="Ít nhất 6 ký tự"
              />

              <PasswordField
                icon="check-circle"
                label="Xác nhận mật khẩu"
                value={confirmPass}
                onChangeText={setConfirmPass}
                show={showConfirmPass}
                onToggle={() => setShowConfirmPass(!showConfirmPass)}
                placeholder="Nhập lại mật khẩu mới"
              />

              {/* BUTTON */}
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleChangePassword}
                disabled={loading}
                style={styles.shadowBtn}
              >
                <LinearGradient
                  colors={[COLORS.primary, COLORS.primaryDark]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.mainBtn}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.mainBtnText}>LƯU THAY ĐỔI</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

/* COMPONENT INPUT FIELD TÙY CHỈNH */
const PasswordField = ({
  label,
  value,
  onChangeText,
  show,
  onToggle,
  icon,
  placeholder,
}) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <View style={styles.leftIcon}>
        <Feather name={icon} size={20} color={COLORS.primary} />
      </View>
      <TextInput
        secureTextEntry={!show}
        value={value}
        onChangeText={onChangeText}
        style={styles.textInput}
        placeholderTextColor="#C7C7CC"
        autoCapitalize="none"
        placeholder={placeholder}
      />
      <TouchableOpacity onPress={onToggle} style={styles.eyeBtn}>
        <Ionicons
          name={show ? "eye-off-outline" : "eye-outline"}
          size={22}
          color={COLORS.gray}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },

  /* Trang trí nền */
  circleDecoration: {
    position: "absolute",
    top: -100,
    right: -100,
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "rgba(255, 122, 0, 0.05)",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
    marginTop: Platform.OS === "android" ? 30 : 0, // Fix header bị che trên Android
  },
  headerTitle: { color: COLORS.dark, fontSize: 18, fontWeight: "700" },
  backBtn: {
    width: 40,
    height: 40,
    backgroundColor: COLORS.white,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
    zIndex: 10, // Đảm bảo nút nổi lên trên
  },

  scrollContent: { paddingHorizontal: 24, paddingBottom: 40 },

  illustrationContainer: {
    alignItems: "center",
    marginVertical: 30,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#FFF2E6",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFE0CC",
  },
  introTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.dark,
    marginBottom: 8,
  },
  introText: { textAlign: "center", color: COLORS.gray, lineHeight: 20 },

  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },

  divider: { height: 1, backgroundColor: "#F2F2F7", marginVertical: 10 },

  /* Input Styles */
  inputWrapper: { marginBottom: 20 },
  label: {
    color: COLORS.dark,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 54,
    backgroundColor: "#F9F9F9",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  leftIcon: { width: 50, alignItems: "center", justifyContent: "center" },
  textInput: { flex: 1, color: COLORS.dark, fontSize: 16 },
  eyeBtn: { padding: 12 },

  /* Button Styles */
  shadowBtn: {
    marginTop: 10,
    shadowColor: COLORS.primaryDark,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  mainBtn: {
    height: 56,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },
  mainBtnText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 1,
  },
});
