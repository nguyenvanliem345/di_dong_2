import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
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
import { API_CONFIG } from "../apiConfig";

export default function EditProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // State dữ liệu form
  const [originalUser, setOriginalUser] = useState<any>(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        const user = JSON.parse(data);
        setOriginalUser(user);
        // Gán dữ liệu ban đầu
        setFullName(user.fullName || user.FullName || "");
        setEmail(user.email || user.Email || "");
        setPhone(user.phone || user.Phone || user.numphone || "");
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (value: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSave = async () => {
    if (!fullName.trim() || !email.trim()) {
      return Alert.alert("Thông báo", "Vui lòng nhập đủ Họ tên và Email.");
    }

    if (!validateEmail(email)) {
      return Alert.alert("Thông báo", "Email không hợp lệ.");
    }

    if (!originalUser?.id && !originalUser?.Id) return;

    setUpdating(true);
    try {
      const formData = new FormData();
      formData.append("FullName", fullName.trim());
      formData.append("Email", email.trim());
      formData.append("Phone", phone.trim());

      const userId = originalUser.id || originalUser.Id;

      console.log("Updating user:", userId);

      const res = await fetch(`${API_CONFIG.BASE_URL}/api/User/${userId}`, {
        method: "PUT",
        body: formData,
        // Lưu ý: Khi dùng FormData, thường không cần set Content-Type thủ công, fetch tự xử lý
      });

      if (!res.ok) {
        const text = await res.text();
        console.log("Error response:", text);
        throw new Error("Update failed");
      }

      const result = await res.json();

      // Lưu lại thông tin mới vào Storage để profile cập nhật ngay
      await AsyncStorage.setItem("userData", JSON.stringify(result));

      Alert.alert("Thành công ✨", "Hồ sơ đã được cập nhật.");
      router.back();
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể cập nhật hồ sơ. Vui lòng thử lại.");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1D1D1F" />
      </View>
    );
  }

  // URL Avatar
  const avatarUri = originalUser?.avatar
    ? `${API_CONFIG.BASE_URL}/uploads/user/${originalUser.avatar}`
    : `https://ui-avatars.com/api/?name=${fullName || "User"}&background=F2F2F7&color=1D1D1F&size=200`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color="#1D1D1F" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chỉnh sửa hồ sơ</Text>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.content}>
          {/* AVATAR SECTION */}
          <View style={styles.avatarContainer}>
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
            <TouchableOpacity style={styles.cameraBtn}>
              <Feather name="camera" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* FORM INPUTS */}
          <View style={styles.form}>
            <InputWithIcon
              icon="user"
              label="Họ và tên"
              value={fullName}
              onChangeText={setFullName}
              placeholder="Nhập họ tên của bạn"
            />
            <InputWithIcon
              icon="mail"
              label="Email"
              value={email}
              onChangeText={setEmail}
              placeholder="example@gmail.com"
              keyboardType="email-address"
            />
            <InputWithIcon
              icon="phone"
              label="Số điện thoại"
              value={phone}
              onChangeText={setPhone}
              placeholder="09xx xxx xxx"
              keyboardType="phone-pad"
            />
          </View>
        </ScrollView>

        {/* SAVE BUTTON FOOTER */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={updating}
          >
            {updating ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.saveText}>Lưu thay đổi</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

// --- Component Input With Icon ---
const InputWithIcon = ({ icon, label, ...props }: any) => (
  <View style={styles.inputGroup}>
    <Text style={styles.label}>{label}</Text>
    <View style={styles.inputContainer}>
      <Feather
        name={icon}
        size={20}
        color="#8E8E93"
        style={{ marginRight: 12 }}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor="#C7C7CC"
        {...props}
      />
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    height: 60,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#1D1D1F" },
  backBtn: { width: 40, alignItems: "flex-start" },

  content: { padding: 24 },

  avatarContainer: { alignItems: "center", marginBottom: 32 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#F2F2F7",
  },
  cameraBtn: {
    position: "absolute",
    bottom: 0,
    right: "35%",
    backgroundColor: "#1D1D1F",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFF",
  },

  form: { gap: 20 },
  inputGroup: { marginBottom: 5 },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1D1D1F",
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9FB",
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "#F2F2F7",
  },
  input: { flex: 1, fontSize: 16, color: "#1D1D1F", height: "100%" },

  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    backgroundColor: "#FFF",
  },
  saveBtn: {
    backgroundColor: "#1D1D1F",
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  saveText: { color: "#FFF", fontSize: 16, fontWeight: "700" },
});
