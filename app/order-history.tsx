import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../apiConfig"; // Adjust path as needed

export default function OrderHistory() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      if (!refreshing) setLoading(true);

      const token =
        Platform.OS === "web"
          ? localStorage.getItem("userToken")
          : await AsyncStorage.getItem("userToken");

      if (!token) {
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/Order/user`, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const sortedData = data.sort((a: any, b: any) => b.id - a.id);
        setOrders(sortedData);
      }
    } catch (error) {
      console.error("Lỗi tải đơn hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadOrders();
  };

  const handleCancelOrder = async (orderId: number) => {
    Alert.alert("Hủy đơn hàng?", "Bạn có chắc muốn hủy đơn này không?", [
      { text: "Để lại", style: "cancel" },
      {
        text: "Hủy ngay",
        style: "destructive",
        onPress: async () => {
          try {
            const token =
              Platform.OS === "web"
                ? localStorage.getItem("userToken")
                : await AsyncStorage.getItem("userToken");

            const response = await fetch(
              `${API_CONFIG.BASE_URL}/api/Order/${orderId}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              },
            );

            if (response.ok) {
              Alert.alert("Thành công", "Đơn hàng đã được hủy.");
              onRefresh();
            } else {
              Alert.alert("Lỗi", "Không thể hủy đơn hàng này.");
            }
          } catch (error) {
            Alert.alert("Lỗi", "Lỗi kết nối server.");
          }
        },
      },
    ]);
  };

  const getStatusInfo = (status: number) => {
    switch (status) {
      case 0:
        return {
          label: "Chờ xác nhận",
          color: "#FF9F1C",
          bg: "#FFF5E0",
          icon: "clock",
        };
      case 1:
        return {
          label: "Đang giao",
          color: "#3498DB",
          bg: "#EBF5FB",
          icon: "truck",
        };
      case 2:
        return {
          label: "Hoàn thành",
          color: "#27AE60",
          bg: "#E9F7EF",
          icon: "check-circle",
        };
      case 3:
        return {
          label: "Đã hủy",
          color: "#E74C3C",
          bg: "#FDEDEC",
          icon: "x-circle",
        };
      default:
        return {
          label: "Khác",
          color: "#95A5A6",
          bg: "#F4F6F6",
          icon: "help-circle",
        };
    }
  };

  const renderOrderItem = ({ item }: any) => {
    const status = getStatusInfo(item.status);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.9}
        onPress={() =>
          router.push({
            pathname: "/order/id", // Ensure this matches your file structure app/order/id.tsx
            params: { id: item.id },
          })
        }
      >
        <View style={styles.cardHeader}>
          <Text style={styles.orderId}>Đơn hàng #{item.id}</Text>
          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <Feather
              name={status.icon as any}
              size={12}
              color={status.color}
              style={{ marginRight: 4 }}
            />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.productList}>
          {(item.orderDetails || []).map((detail: any, index: number) => (
            <View key={index} style={styles.productRow}>
              {/* FIXED IMAGE URL HERE */}
              <Image
                source={{
                  uri: API_CONFIG.IMAGE_URL(
                    "products",
                    detail.product?.thumbnail || "",
                  ),
                }}
                style={styles.productThumb}
                defaultSource={{ uri: "https://via.placeholder.com/60" }}
              />

              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                  {detail.product?.name || "Sản phẩm không tên"}
                </Text>
                <Text style={styles.productVariant}>
                  Số lượng: x{detail.quantity}
                </Text>
              </View>

              <Text style={styles.productPrice}>
                {detail.price?.toLocaleString()}đ
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        <View style={styles.cardFooter}>
          <View>
            <Text style={styles.dateLabel}>
              {new Date(item.createdAt).toLocaleDateString("vi-VN")}
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Text style={styles.totalLabel}>Tổng tiền: </Text>
              <Text style={styles.totalValue}>
                {item.totalAmount?.toLocaleString()}đ
              </Text>
            </View>
          </View>

          {item.status === 0 && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => handleCancelOrder(item.id)}
            >
              <Text style={styles.cancelText}>Hủy đơn</Text>
            </TouchableOpacity>
          )}

          {(item.status === 2 || item.status === 3) && (
            <TouchableOpacity style={styles.reorderBtn}>
              <Text style={styles.reorderText}>Mua lại</Text>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F8" />

      <View style={styles.screenHeader}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.screenTitle}>Lịch sử đơn hàng</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FF9F1C" />
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item: any) => item.id.toString()}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.emptyView}>
              <MaterialCommunityIcons
                name="clipboard-text-outline"
                size={80}
                color="#DDD"
              />
              <Text style={styles.emptyText}>Chưa có đơn hàng nào</Text>
              <TouchableOpacity
                style={styles.shopNowBtn}
                onPress={() => router.push("/(tabs)")}
              >
                <Text style={styles.shopNowText}>Đặt món ngay</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F8" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  screenHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFF",
    elevation: 2,
  },
  backBtn: { padding: 4 },
  screenTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  listContent: { padding: 16, paddingBottom: 40 },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  orderId: { fontSize: 15, fontWeight: "700", color: "#333" },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: "600" },
  divider: { height: 1, backgroundColor: "#F0F0F0", marginVertical: 8 },
  productList: { marginBottom: 4 },
  productRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  productThumb: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: "#EEE",
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  productInfo: { flex: 1, marginLeft: 12, marginRight: 8 },
  productName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productVariant: { fontSize: 12, color: "#888" },
  productPrice: { fontSize: 14, fontWeight: "bold", color: "#333" },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginTop: 4,
  },
  dateLabel: { fontSize: 12, color: "#999", marginBottom: 2 },
  totalLabel: { fontSize: 13, color: "#555" },
  totalValue: { fontSize: 16, fontWeight: "bold", color: "#FF4500" },
  cancelBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#E74C3C",
    backgroundColor: "#FFF",
  },
  cancelText: { color: "#E74C3C", fontSize: 12, fontWeight: "bold" },
  reorderBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#FF9F1C",
  },
  reorderText: { color: "#FFF", fontSize: 12, fontWeight: "bold" },
  emptyView: { alignItems: "center", marginTop: 80 },
  emptyText: { color: "#999", fontSize: 16, marginTop: 10, marginBottom: 20 },
  shopNowBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: "#FF9F1C",
    borderRadius: 25,
  },
  shopNowText: { color: "#FFF", fontWeight: "bold" },
});
