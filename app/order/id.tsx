import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig"; // Adjust path as needed

export default function OrderDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrderDetail();
    }
  }, [id]);

  const fetchOrderDetail = async () => {
    try {
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("userToken")
          : await AsyncStorage.getItem("userToken");

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Lỗi:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );

  if (!order)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy dữ liệu đơn hàng.</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{ marginTop: 20 }}
        >
          <Text style={{ color: "blue" }}>Quay lại</Text>
        </TouchableOpacity>
      </View>
    );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={router.back}>
          <Ionicons name="chevron-back" size={26} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.orderCard}>
          <Text style={styles.orderCode}>ĐƠN HÀNG #{order.id}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>
              {order.status === 0 && "⏳ Chờ xác nhận"}
              {order.status === 1 && "🚚 Đang giao"}
              {order.status === 2 && "✅ Hoàn thành"}
              {order.status === 3 && "❌ Đã hủy"}
            </Text>
          </View>
          <Text style={styles.orderTime}>
            {new Date(order.createdAt).toLocaleString("vi-VN")}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Thông tin nhận hàng</Text>
          <Text style={styles.bold}>{order.user?.fullName}</Text>
          <Text style={styles.muted}>{order.user?.phoneNumber}</Text>
          <Text style={styles.muted}>
            {order.shippingAddress || "Địa chỉ trong hệ thống"}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>🛍️ Sản phẩm</Text>

          {order.orderDetails?.map((item: any, i: number) => (
            <View key={i} style={styles.productItem}>
              {/* FIXED IMAGE URL HERE */}
              <Image
                source={{
                  uri: API_CONFIG.IMAGE_URL(
                    "products",
                    item.product?.thumbnail || "",
                  ),
                }}
                style={styles.productImg}
              />
              <View style={{ flex: 1 }}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product?.name}
                </Text>
                <Text style={styles.productQty}>SL: {item.quantity}</Text>
              </View>
              <Text style={styles.productPrice}>
                {(item.price * item.quantity).toLocaleString()}₫
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text>Tạm tính</Text>
            <Text>{order.totalAmount?.toLocaleString()}₫</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>Phí vận chuyển</Text>
            <Text>0₫</Text>
          </View>
          <View style={styles.line} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tổng cộng</Text>
            <Text style={styles.totalPrice}>
              {order.totalAmount?.toLocaleString()}₫
            </Text>
          </View>
        </View>

        <Text style={styles.paymentText}>Phương thức thanh toán: COD</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F7" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    backgroundColor: "#FFF",
    borderBottomWidth: 0.5,
    borderBottomColor: "#DDD",
  },
  headerTitle: { fontSize: 18, fontWeight: "700" },
  orderCard: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },
  orderCode: { fontWeight: "700", fontSize: 15, marginBottom: 8 },
  statusBadge: {
    backgroundColor: "#EEF4FF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 8,
  },
  statusText: { color: "#007AFF", fontWeight: "600" },
  orderTime: { fontSize: 12, color: "#8E8E93" },
  card: {
    backgroundColor: "#FFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 18,
    padding: 16,
  },
  cardTitle: { fontWeight: "700", fontSize: 15, marginBottom: 12 },
  bold: { fontWeight: "600", fontSize: 15 },
  muted: { color: "#6E6E73", marginTop: 2 },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  productImg: {
    width: 56,
    height: 56,
    borderRadius: 12,
    marginRight: 12,
    backgroundColor: "#EEE",
  },
  productName: { fontWeight: "500" },
  productQty: { fontSize: 12, color: "#8E8E93", marginTop: 2 },
  productPrice: { fontWeight: "700" },
  totalCard: {
    backgroundColor: "#FFF",
    margin: 16,
    borderRadius: 20,
    padding: 18,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  line: { height: 1, backgroundColor: "#EEE", marginVertical: 10 },
  totalLabel: { fontWeight: "700", fontSize: 16 },
  totalPrice: { fontWeight: "800", fontSize: 20, color: "#FF3B30" },
  paymentText: {
    textAlign: "center",
    color: "#8E8E93",
    marginBottom: 30,
  },
});
