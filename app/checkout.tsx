import {
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
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

export default function CheckoutScreen() {
  const router = useRouter();
  const { items, total } = useLocalSearchParams();

  const selectedItems = useMemo(() => {
    try {
      return JSON.parse(items as string);
    } catch (e) {
      return [];
    }
  }, [items]);

  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    note: "",
    paymentMethod: "cash",
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const userRaw =
          Platform.OS === "web"
            ? localStorage.getItem("userData")
            : await AsyncStorage.getItem("userData");

        if (userRaw) {
          const user = JSON.parse(userRaw);
          setForm((prev) => ({
            ...prev,
            name: user.fullName || user.Name || user.name || "",
            email: user.email || user.Email || "",
            phone: user.phone || user.Phone || "",
          }));
        }
      } catch (err) {
        console.error("Lỗi load user:", err);
      }
    };
    loadUser();
  }, []);

  const processOrder = async () => {
    if (!form.name || !form.phone || !form.address) {
      Alert.alert("Lưu ý", "Vui lòng nhập đầy đủ thông tin nhận hàng.");
      return;
    }

    try {
      setLoading(true);

      // 1. Lấy dữ liệu user
      const userRaw =
        Platform.OS === "web"
          ? localStorage.getItem("userData")
          : await AsyncStorage.getItem("userData");

      // 2. Lấy Token từ Key 'userToken'
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("userToken")
          : await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert(
          "Lỗi",
          "Không tìm thấy mã xác thực (Token). Vui lòng đăng nhập lại.",
        );
        setLoading(false);
        return;
      }

      const user = userRaw ? JSON.parse(userRaw) : {};
      const userId = user.id || user.Id;

      const orderPayload = {
        name: form.name,
        phone: form.phone,
        email: form.email,
        address: form.address,
        note: form.note,
        totalAmount: Number(total),
        paymentMethod: form.paymentMethod,
        orderDetails: selectedItems.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product?.price || 0,
          note: "",
        })),
      };

      // ĐẢM BẢO BEARER TOKEN ĐÚNG ĐỊNH DẠNG
      const authHeader = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;

      console.log("--- DEBUG ORDER ---");
      console.log("URL:", `${API_CONFIG.BASE_URL}/api/Order`);
      console.log("Token gửi đi:", authHeader);
      console.log("Payload:", JSON.stringify(orderPayload));

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        // Xóa giỏ hàng trên server
        if (userId) {
          await fetch(`${API_CONFIG.BASE_URL}/api/Cart/clear/${userId}`, {
            method: "DELETE",
            headers: { Authorization: authHeader },
          }).catch((e) => console.log("Lỗi xóa giỏ hàng:", e));
        }

        Alert.alert(
          "🎉 Thành công",
          "Đơn hàng của bạn đã được đặt thành công!",
          [{ text: "Về trang chủ", onPress: () => router.replace("/") }],
        );
      } else {
        const errorText = await response.text();
        console.log("Chi tiết lỗi từ Server:", errorText);

        if (response.status === 401) {
          Alert.alert(
            "Lỗi 401",
            "Mã xác thực không hợp lệ. Bạn hãy thử Đăng xuất rồi Đăng nhập lại.",
          );
        } else {
          Alert.alert("Lỗi đặt hàng", `Mã lỗi: ${response.status}`);
        }
      }
    } catch (error) {
      console.error("Lỗi kết nối:", error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối tới máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ id, label, icon, color, type, sub }: any) => (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.paymentItem,
        form.paymentMethod === id && styles.paymentActive,
      ]}
      onPress={() => setForm({ ...form, paymentMethod: id })}
    >
      <View style={[styles.paymentIcon, { backgroundColor: color + "20" }]}>
        {type === "ion" ? (
          <Ionicons name={icon} size={22} color={color} />
        ) : type === "fa" ? (
          <FontAwesome5 name={icon} size={18} color={color} />
        ) : (
          <MaterialCommunityIcons name={icon} size={22} color={color} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.paymentText}>{label}</Text>
        <Text style={styles.paymentSubText}>{sub}</Text>
      </View>
      <View
        style={[
          styles.radio,
          form.paymentMethod === id && { borderColor: "#000" },
        ]}
      >
        {form.paymentMethod === id && <View style={styles.radioInner} />}
      </View>
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backCircle}
        >
          <Feather name="arrow-left" size={22} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={18} color="#000" />
            <Text style={styles.sectionTitle}>Địa chỉ giao hàng</Text>
          </View>
          <View style={styles.glassCard}>
            <TextInput
              style={styles.input}
              placeholder="Người nhận hàng"
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              keyboardType="phone-pad"
              value={form.phone}
              onChangeText={(t) => setForm({ ...form, phone: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ chi tiết"
              multiline
              value={form.address}
              onChangeText={(t) => setForm({ ...form, address: t })}
            />
            <TextInput
              style={[styles.input, { borderBottomWidth: 0 }]}
              placeholder="Ghi chú thêm..."
              value={form.note}
              onChangeText={(t) => setForm({ ...form, note: t })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="credit-card" size={18} color="#000" />
            <Text style={styles.sectionTitle}>Phương thức</Text>
          </View>
          <View style={styles.paymentCard}>
            <PaymentOption
              id="cash"
              label="Tiền mặt (COD)"
              sub="Thanh toán khi nhận hàng"
              icon="cash-outline"
              color="#4CD964"
              type="ion"
            />
            <PaymentOption
              id="MOMO"
              label="Ví MoMo"
              sub="Thanh toán qua app MoMo"
              icon="wallet"
              color="#A50064"
              type="fa"
            />
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shopping-bag" size={18} color="#000" />
            <Text style={styles.sectionTitle}>Sản phẩm</Text>
          </View>
          <View style={styles.glassCard}>
            {selectedItems.map((item: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.productRow,
                  index === selectedItems.length - 1 && {
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <Image
                  source={{
                    uri: `${API_CONFIG.BASE_URL}/uploads/product/${item.product?.thumbnail}`,
                  }}
                  style={styles.productImg}
                />
                <View style={styles.productInfo}>
                  <Text style={styles.productName} numberOfLines={1}>
                    {item.product?.name}
                  </Text>
                  <Text style={styles.productMeta}>
                    {item.quantity} x {item.product?.price?.toLocaleString()}₫
                  </Text>
                </View>
                <Text style={styles.productSubtotal}>
                  {(item.product?.price * item.quantity).toLocaleString()}₫
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.totalLabel}>Tổng cộng</Text>
          <Text style={styles.totalPrice}>
            {Number(total).toLocaleString()} ₫
          </Text>
        </View>
        <TouchableOpacity
          style={styles.confirmBtn}
          onPress={processOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <>
              <Text style={styles.confirmText}>Đặt hàng ngay</Text>
              <Feather name="chevron-right" size={20} color="white" />
            </>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFF",
  },
  backCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F2F2F7",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 18, fontWeight: "800" },
  scrollContent: { padding: 20, paddingBottom: 150 },
  section: { marginBottom: 25 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginLeft: 8 },
  glassCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    padding: 16,
    elevation: 3,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
    paddingVertical: 12,
    fontSize: 15,
  },
  paymentCard: {
    backgroundColor: "#FFF",
    borderRadius: 24,
    overflow: "hidden",
    elevation: 3,
  },
  paymentItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F9FB",
  },
  paymentActive: { backgroundColor: "#F2F2F7" },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  paymentText: { fontSize: 16, fontWeight: "700" },
  paymentSubText: { fontSize: 12, color: "#8E8E93" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#E5E5EA",
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#000",
  },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  productImg: { width: 55, height: 55, borderRadius: 12 },
  productInfo: { flex: 1, marginLeft: 15 },
  productName: { fontSize: 15, fontWeight: "600" },
  productMeta: { fontSize: 13, color: "#8E8E93" },
  productSubtotal: { fontSize: 15, fontWeight: "800" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFF",
    padding: 25,
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    flexDirection: "row",
    alignItems: "center",
    elevation: 10,
  },
  priceContainer: { flex: 1 },
  totalLabel: { fontSize: 13, color: "#8E8E93" },
  totalPrice: { fontSize: 24, fontWeight: "900" },
  confirmBtn: {
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 20,
  },
  confirmText: {
    color: "#FFF",
    fontWeight: "800",
    fontSize: 16,
    marginRight: 8,
  },
});
