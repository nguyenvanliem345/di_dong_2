import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../apiConfig";

export default function ListProfile() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await AsyncStorage.getItem("userData");
      if (data) {
        setUser(JSON.parse(data));
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#1D1D1F" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text>Không có thông tin người dùng</Text>
      </View>
    );
  }

  // Avatar
  const avatarUri = user?.avatar
    ? `${API_CONFIG.BASE_URL}/uploads/user/${user.avatar}`
    : `https://ui-avatars.com/api/?name=${
        user.fullName || user.FullName || "User"
      }&background=F2F2F7&color=1D1D1F&size=200`;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFF" />

      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        {/* BACK */}
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
        >
          <Feather name="arrow-left" size={22} color="#1D1D1F" />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Hồ sơ cá nhân</Text>

        {/* EDIT */}
        <TouchableOpacity onPress={() => router.push("/edit-profile")}>
          <Feather name="edit" size={22} color="#1D1D1F" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* AVATAR */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatarUri }} style={styles.avatar} />
          <Text style={styles.fullName}>
            {user.fullName || user.FullName}
          </Text>
          <Text style={styles.role}>
            {user.role || user.Role || "customer"}
          </Text>
        </View>

        {/* INFO */}
        <View style={styles.card}>
          <InfoRow
            icon="mail"
            label="Email"
            value={user.email || user.Email}
          />
          <InfoRow
            icon="phone"
            label="Số điện thoại"
            value={user.phone || user.Phone || "Chưa cập nhật"}
          />
          <InfoRow
            icon="calendar"
            label="Ngày tạo"
            value={
              user.createdAt
                ? new Date(user.createdAt).toLocaleDateString()
                : "—"
            }
          />
        </View>

        {/* ACTION */}
        <TouchableOpacity
          style={styles.editBtn}
          onPress={() => router.push("/edit-profile")}
        >
          <Feather name="edit-3" size={18} color="#FFF" />
          <Text style={styles.editText}>Chỉnh sửa hồ sơ</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

/* ===== INFO ROW ===== */
const InfoRow = ({ icon, label, value }: any) => (
  <View style={styles.infoRow}>
    <View style={styles.infoLeft}>
      <Feather name={icon} size={18} color="#8E8E93" />
      <Text style={styles.infoLabel}>{label}</Text>
    </View>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    height: 60,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1D1D1F",
  },
  backBtn: {
    width: 40,
    alignItems: "flex-start",
  },

  content: { padding: 24 },

  avatarContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: "#F2F2F7",
  },
  fullName: {
    marginTop: 14,
    fontSize: 20,
    fontWeight: "800",
    color: "#1D1D1F",
  },
  role: {
    marginTop: 4,
    fontSize: 14,
    color: "#8E8E93",
    textTransform: "capitalize",
  },

  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F2F2F7",
    padding: 16,
    gap: 18,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  infoLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  infoLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1D1D1F",
    maxWidth: "60%",
    textAlign: "right",
  },

  editBtn: {
    marginTop: 30,
    backgroundColor: "#1D1D1F",
    height: 56,
    borderRadius: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  editText: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "700",
  },
});
