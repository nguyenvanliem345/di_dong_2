import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_CONFIG } from '../../apiConfig';

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Lấy dữ liệu giỏ hàng (Giả sử User ID là 1 cho bản demo)
  const fetchCart = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/cart/user/1`);
      const data = await response.json();
      setCartItems(data.cart_details || []); // cart_details nối với products
    } catch (error) {
      console.log("Lỗi lấy giỏ hàng:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCart(); }, []);

  // Tính tổng tiền dựa trên cột price của bảng products
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  const renderItem = ({ item }: any) => (
    <View style={styles.cartCard}>
      <Image source={{ uri: API_CONFIG.IMAGE_URL('products', item.product.photo) }} style={styles.foodImg} />
      <View style={styles.info}>
        <Text style={styles.name}>{item.product.title}</Text>
        <Text style={styles.price}>{item.product.price.toLocaleString()}đ</Text>
        <View style={styles.quantityRow}>
          <TouchableOpacity><Ionicons name="remove-circle-outline" size={24} color="#C62828" /></TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity><Ionicons name="add-circle-outline" size={24} color="#C62828" /></TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.deleteBtn}>
        <Ionicons name="trash-outline" size={20} color="#94a3b8" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Giỏ hàng của tôi</Text></View>
      
      {loading ? <ActivityIndicator size="large" color="#C62828" /> : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 15 }}
          ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 50 }}>Giỏ hàng trống</Text>}
        />
      )}

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Tổng cộng:</Text>
          <Text style={styles.totalValue}>{totalPrice.toLocaleString()}đ</Text>
        </View>
        <TouchableOpacity style={styles.checkoutBtn}>
          <Text style={styles.checkoutText}>Thanh toán ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#C62828', paddingTop: 50, paddingBottom: 15, alignItems: 'center' },
  headerTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  cartCard: { flexDirection: 'row', backgroundColor: 'white', padding: 12, borderRadius: 15, marginBottom: 15, elevation: 2 },
  foodImg: { width: 80, height: 80, borderRadius: 10 },
  info: { flex: 1, marginLeft: 12, justifyContent: 'space-between' },
  name: { fontSize: 15, fontWeight: 'bold' },
  price: { color: '#C62828', fontWeight: 'bold' },
  quantityRow: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  qtyText: { fontSize: 16, fontWeight: 'bold' },
  deleteBtn: { justifyContent: 'center' },
  footer: { backgroundColor: 'white', padding: 20, borderTopLeftRadius: 30, borderTopRightRadius: 30, elevation: 10 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  totalLabel: { fontSize: 16, color: '#64748b' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#C62828' },
  checkoutBtn: { backgroundColor: '#C62828', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  checkoutText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});