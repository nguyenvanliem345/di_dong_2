// app/(tabs)/orders.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";
import { useCart } from "./components/CartContext";

export default function OrdersScreen() {
  const { cart, addToCart, removeFromCart, clearCart, totalPrice } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setIsProcessing(true);

    try {
      // Cấu trúc Payload chuẩn để khớp với quan hệ One-to-Many trong Java JPA
      const orderPayload = {
        user: { id: 1 }, // Map vào cột user_id trong bảng orders
        date: new Date().toISOString(), // Map vào cột date TIMESTAMP
        // Quan trọng: Tên "orderDetails" phải khớp với tên List trong Order Entity ở Backend
        orderDetails: cart.map((item) => ({
          product: { id: item.id }, // Map vào cột product_id trong bảng order_details
          quantity: item.quantity, // Map vào cột quantity
          price: item.price, // Giá tại thời điểm mua
        })),
      };

      const response = await fetch(API_CONFIG.ORDERS, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        // Sau khi đặt hàng thành công, xóa giỏ hàng trong Database bảng cart_detail
        await fetch(`${API_CONFIG.BASE_URL}/cart/clear/1`, {
          method: "DELETE",
        });

        Alert.alert(
          "Thành công",
          "Đơn hàng và chi tiết đã được lưu vào Database! 🎉",
        );
        clearCart(); // Xóa giỏ hàng trên UI App
      } else {
        const errorMsg = await response.text();
        console.log("Lỗi Server:", errorMsg);
        Alert.alert(
          "Lỗi 500",
          "Server không thể lưu chi tiết đơn hàng (order_details).",
        );
      }
    } catch (error) {
      Alert.alert("Lỗi kết nối", "Vui lòng kiểm tra IP 192.168.1.107");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <View style={styles.empty}>
        <Ionicons name="basket-outline" size={80} color="#ddd" />
        <Text style={{ color: "#999", marginTop: 10 }}>Giỏ hàng trống!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Xác nhận thanh toán</Text>
      </View>
      <ScrollView style={{ flex: 1 }}>
        {cart.map((item) => (
          <View key={item.id} style={styles.card}>
            <Image
              source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }}
              style={styles.img}
            />
            <View style={{ flex: 1, marginLeft: 15 }}>
              <Text style={styles.name}>{item.title}</Text>
              <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
              <View style={styles.qtyRow}>
                <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                  <Ionicons
                    name="remove-circle-outline"
                    size={26}
                    color="#C62828"
                  />
                </TouchableOpacity>
                <Text style={styles.qtyText}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => addToCart(item)}>
                  <Ionicons name="add-circle" size={26} color="#C62828" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalPrice.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={handleCheckout}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.checkoutText}>XÁC NHẬN MUA</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FA" },
  header: { backgroundColor: "#C62828", padding: 20, paddingTop: 50 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  empty: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    margin: 10,
    padding: 12,
    borderRadius: 15,
    elevation: 2,
  },
  img: { width: 80, height: 80, borderRadius: 10 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { color: "#C62828", fontWeight: "700", marginVertical: 4 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 15, marginTop: 5 },
  qtyText: { fontSize: 16, fontWeight: "bold" },
  footer: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: { fontSize: 16, color: "#666" },
  totalValue: { fontSize: 22, fontWeight: "bold", color: "#C62828" },
  checkoutBtn: {
    backgroundColor: "#C62828",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  checkoutText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
