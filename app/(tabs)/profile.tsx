import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

/* 🎨 MÀU SÁNG – PHÙ HỢP APP ĐỒ ĂN */
const COLORS = {
  primary: "#FF7A00", // cam đồ ăn
  dark: "#1D1D1F",
  secondary: "#8E8E93",
  background: "#FFF7ED",
  white: "#FFFFFF",
  danger: "#FF3B30",
};

export default function Profile() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  /* LOAD USER KHI VÀO MÀN */
  useFocusEffect(
    useCallback(() => {
      checkLoginStatus();
    }, []),
  );

  const checkLoginStatus = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("userData");
      setUserData(jsonValue ? JSON.parse(jsonValue) : null);
    } catch (e) {
      console.error("Lỗi đọc user:", e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /* LOGOUT */
  /* LOGOUT - Đã sửa lỗi Web */
  const handleLogout = async () => {
    // Tách hàm xử lý xóa dữ liệu để dùng chung
    const performLogout = async () => {
      try {
        await AsyncStorage.multiRemove(["userData", "userToken", "userId"]);
        setUserData(null);
        // Dùng replace để không quay lại được màn hình profile sau khi logout
        router.replace("/(auth)/login");
      } catch (error) {
        console.error("Lỗi khi đăng xuất:", error);
      }
    };

    // Kiểm tra nền tảng
    if (Platform.OS === "web") {
      // Trên Web dùng window.confirm
      if (window.confirm("Bạn chắc chắn muốn đăng xuất?")) {
        await performLogout();
      }
    } else {
      // Trên Mobile (iOS/Android) dùng Alert.alert
      Alert.alert("Đăng xuất", "Bạn chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        {
          text: "Đăng xuất",
          style: "destructive",
          onPress: performLogout,
        },
      ]);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    checkLoginStatus();
  };

  const navigateToHistory = () => {
    if (!userData) {
      Alert.alert("Yêu cầu đăng nhập", "Vui lòng đăng nhập để xem đơn hàng.", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng nhập", onPress: () => router.push("/(auth)/login") },
      ]);
      return;
    }
    router.push("/order-history");
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* HEADER */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Tài khoản</Text>
          <Text style={styles.headerSubtitle}>
            {userData ? "Chào mừng bạn quay lại 👋" : "Khách HEDIO"}
          </Text>
        </View>
        <TouchableOpacity style={styles.iconBtn}>
          <Feather name="settings" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* USER CARD */}
        <TouchableOpacity
          style={styles.userCard}
          activeOpacity={0.9}
          onPress={() =>
            userData
              ? router.push("/edit-profile")
              : router.push("/(auth)/login")
          }
        >
          <Image
            source={{
              uri: userData?.avatar
                ? `${API_CONFIG.BASE_URL}/uploads/user/${userData.avatar}`
                : `https://ui-avatars.com/api/?name=${
                    userData?.fullName || "HEDIO"
                  }&background=FF7A00&color=fff&size=128`,
            }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {userData?.fullName || "Đăng nhập / Đăng ký"}
            </Text>
            <Text style={styles.userEmail}>
              {userData?.email || "Nhận ưu đãi món ngon mỗi ngày 🍔"}
            </Text>

            {userData && (
              <LinearGradient
                colors={["#FF7A00", "#FF9F0A"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.badge}
              >
                <Feather name="star" size={10} color="#FFF" />
                <Text style={styles.badgeText}>HEDIO MEMBER</Text>
              </LinearGradient>
            )}
          </View>
          <Feather name="chevron-right" size={20} color={COLORS.secondary} />
        </TouchableOpacity>

        {/* ĐƠN HÀNG */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Đơn hàng của bạn</Text>
            <TouchableOpacity onPress={navigateToHistory}>
              <Text style={styles.seeAll}>Xem tất cả</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.statusGrid}>
            <StatusItem
              icon="clock"
              label="Chờ xác nhận"
              onPress={navigateToHistory}
            />
            <StatusItem
              icon="truck"
              label="Đang giao"
              onPress={navigateToHistory}
            />
            <StatusItem
              icon="check-circle"
              label="Hoàn thành"
              onPress={navigateToHistory}
            />
            <StatusItem
              icon="star"
              label="Đánh giá"
              onPress={navigateToHistory}
            />
          </View>
        </View>

        {/* MENU */}
        <View style={styles.menuContainer}>
          <MenuItem
            icon="user"
            label="Thông tin cá nhân"
            onPress={() => router.push("/lish-profile")}
          />
          <MenuItem
            icon="phone"
            label={userData?.numphone || "Liên kết số điện thoại"}
          />
          <MenuItem
            icon="key"
            label="Đổi mật khẩu"
            onPress={() => router.push("/(auth)/change-password")}
          />
          <MenuItem icon="help-circle" label="Hỗ trợ khách hàng" isLast />
        </View>

        {/* LOGOUT */}
        {userData && (
          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        )}

        <Text style={styles.version}>HEDIO FOOD APP v1.0.0</Text>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

/* ===== COMPONENT CON ===== */

const StatusItem = ({ icon, label, onPress }: any) => (
  <TouchableOpacity style={styles.statusItem} onPress={onPress}>
    <View style={styles.statusIconBg}>
      <Feather name={icon} size={20} color={COLORS.primary} />
    </View>
    <Text style={styles.statusLabel}>{label}</Text>
  </TouchableOpacity>
);

const MenuItem = ({ icon, label, onPress, isLast }: any) => (
  <TouchableOpacity
    style={[styles.menuRow, !isLast && styles.menuBorder]}
    onPress={onPress}
  >
    <View style={styles.menuLeft}>
      <Feather name={icon} size={18} color={COLORS.dark} />
      <Text style={styles.menuText}>{label}</Text>
    </View>
    <Feather name="chevron-right" size={16} color="#C7C7CC" />
  </TouchableOpacity>
);

/* ===== STYLE ===== */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  center: { justifyContent: "center", alignItems: "center" },

  header: {
    paddingTop: Platform.OS === "android" ? 40 : 60,
    paddingHorizontal: 20,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerTitle: { fontSize: 28, fontWeight: "800", color: COLORS.dark },
  headerSubtitle: { color: COLORS.secondary, marginTop: 4 },

  iconBtn: { padding: 8, backgroundColor: "#FFF", borderRadius: 50 },

  scrollContent: { paddingHorizontal: 20 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 24,
    marginTop: 10,
  },
  avatar: { width: 64, height: 64, borderRadius: 32 },
  userInfo: { flex: 1, marginLeft: 16 },
  userName: { fontSize: 18, fontWeight: "700", color: COLORS.dark },
  userEmail: { fontSize: 13, color: COLORS.secondary, marginTop: 4 },

  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    gap: 4,
  },
  badgeText: { fontSize: 10, color: "#FFF", fontWeight: "700" },

  sectionContainer: { marginTop: 24 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: COLORS.dark },
  seeAll: { color: COLORS.primary, fontWeight: "600" },

  statusGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: COLORS.white,
    padding: 20,
    borderRadius: 20,
  },
  statusItem: { alignItems: "center", width: "22%" },
  statusIconBg: {
    width: 44,
    height: 44,
    backgroundColor: "#FFF2E6",
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statusLabel: { fontSize: 11, fontWeight: "500" },

  menuContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    marginTop: 24,
  },
  menuRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },
  menuBorder: { borderBottomWidth: 1, borderBottomColor: "#F2F2F7" },
  menuLeft: { flexDirection: "row", alignItems: "center", gap: 14 },
  menuText: { fontSize: 15, fontWeight: "500" },

  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#FFECEC",
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
  },
  logoutText: { color: COLORS.danger, fontWeight: "700" },

  version: {
    textAlign: "center",
    color: "#C7C7CC",
    fontSize: 11,
    marginTop: 30,
  },
});
