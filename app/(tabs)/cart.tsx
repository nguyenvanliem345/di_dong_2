import { Feather, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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
  View
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

type CartItem = {
  id: number;
  productId: number;
  quantity: number;
  selected: boolean;
  product: {
    name: string;
    price: number;
    thumbnail: string;
  };
};

export default function RealCartScreen() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedAll, setSelectedAll] = useState(true);

  const getAuthData = async () => {
    try {
      if (Platform.OS === "web") {
        const user = localStorage.getItem("userData");
        const token = localStorage.getItem("userToken");
        return { user: user ? JSON.parse(user) : null, token };
      }
      const [user, token] = await Promise.all([
        AsyncStorage.getItem("userData"),
        AsyncStorage.getItem("userToken"),
      ]);
      return { user: user ? JSON.parse(user) : null, token };
    } catch (e) {
      return { user: null, token: null };
    }
  };

  const loadCartFromServer = async (isManualRefresh = false) => {
    try {
      if (isManualRefresh) setRefreshing(true);
      const { user, token } = await getAuthData();

      if (!user?.id || !token) {
        setLoading(false);
        setRefreshing(false);
        return;
      }

      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/Cart/user/${user.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 401) {
        Alert.alert("Phiên đăng nhập hết hạn", "Vui lòng đăng nhập lại.");
        router.replace("/(auth)/login");
        return;
      }

      const textData = await response.text();

      if (response.ok && textData) {
        const data = JSON.parse(textData);
        setCartItems(
          Array.isArray(data)
            ? data.map((item: any) => ({ ...item, selected: true }))
            : [],
        );
        setSelectedAll(true);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi tải giỏ hàng:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCartFromServer();
    }, []),
  );

  const handleQuantity = async (
    id: number,
    currentQty: number,
    delta: number,
  ) => {
    const newQty = currentQty + delta;
    if (newQty < 1 || isUpdating) return;

    setIsUpdating(true);
    const oldItems = [...cartItems];
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: newQty } : item,
      ),
    );

    try {
      const { token } = await getAuthData();
      const response = await fetch(
        `${API_CONFIG.BASE_URL}/api/Cart/update/${id}?quantity=${newQty}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error();
    } catch (error) {
      setCartItems(oldItems);
      Alert.alert("Lỗi", "Không thể cập nhật số lượng");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (id: number) => {
    Alert.alert("Xác nhận", "Xóa sản phẩm này khỏi giỏ hàng?", [
      { text: "Hủy", style: "cancel" },
      {
        text: "Xóa",
        style: "destructive",
        onPress: async () => {
          try {
            const { token } = await getAuthData();
            const response = await fetch(
              `${API_CONFIG.BASE_URL}/api/Cart/delete/${id}`,
              {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` },
              },
            );
            if (response.ok) {
              setCartItems((prev) => prev.filter((item) => item.id !== id));
            }
          } catch (e) {
            Alert.alert("Lỗi", "Không thể xóa sản phẩm");
          }
        },
      },
    ]);
  };

  const toggleSelectAll = () => {
    const newSelectedState = !selectedAll;
    setSelectedAll(newSelectedState);
    setCartItems((prev) =>
      prev.map((item) => ({ ...item, selected: newSelectedState })),
    );
  };

  const totalPrice = useMemo(() => {
    return cartItems
      .filter((i) => i.selected)
      .reduce((sum, i) => sum + i.product?.price * i.quantity, 0);
  }, [cartItems]);

  const selectedCount = useMemo(() => {
    return cartItems.filter((item) => item.selected).length;
  }, [cartItems]);

  const goToCheckout = () => {
    const selectedItems = cartItems.filter((i) => i.selected);
    if (selectedItems.length === 0) {
      Alert.alert("Thông báo", "Vui lòng chọn ít nhất một sản phẩm.");
      return;
    }
    router.push({
      pathname: "/checkout",
      params: {
        items: JSON.stringify(selectedItems),
        total: totalPrice,
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#FF6B6B" />
        <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Giỏ hàng của bạn</Text>
          <Text style={styles.headerSubtitle}>{cartItems.length} sản phẩm</Text>
        </View>
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="ellipsis-horizontal" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* SELECT ALL & CLEAR */}
      {cartItems.length > 0 && (
        <View style={styles.actionsBar}>
          <TouchableOpacity
            style={styles.selectAllButton}
            onPress={toggleSelectAll}
          >
            <View
              style={[styles.checkBox, selectedAll && styles.checkBoxActive]}
            >
              {selectedAll && (
                <Ionicons name="checkmark" size={14} color="#FFF" />
              )}
            </View>
            <Text style={styles.selectAllText}>
              {selectedAll ? "Bỏ chọn tất cả" : "Chọn tất cả"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => {
              if (cartItems.length === 0) return;
              Alert.alert("Xác nhận", "Xóa tất cả sản phẩm?", [
                { text: "Hủy", style: "cancel" },
                {
                  text: "Xóa",
                  style: "destructive",
                  onPress: async () => {
                    try {
                      const { user, token } = await getAuthData();
                      const response = await fetch(
                        `${API_CONFIG.BASE_URL}/api/Cart/clear/${user.id}`,
                        {
                          method: "DELETE",
                          headers: { Authorization: `Bearer ${token}` },
                        },
                      );
                      if (response.ok) setCartItems([]);
                    } catch (e) {
                      Alert.alert("Lỗi", "Thao tác thất bại");
                    }
                  },
                },
              ]);
            }}
          >
            <Feather name="trash-2" size={18} color="#FF6B6B" />
            <Text style={styles.clearText}>Xóa tất cả</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* CART ITEMS LIST */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadCartFromServer(true)}
            colors={["#FF6B6B"]}
            tintColor="#FF6B6B"
          />
        }
      >
        {cartItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIllustration}>
              <MaterialCommunityIcons
                name="cart-outline"
                size={100}
                color="#E0E0E0"
              />
            </View>
            <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptyDescription}>
              Hãy thêm những món ăn ngon vào giỏ hàng của bạn
            </Text>
            <TouchableOpacity
              style={styles.shopButton}
              onPress={() => router.push("/")}
            >
              <Text style={styles.shopButtonText}>Mua sắm ngay</Text>
            </TouchableOpacity>
          </View>
        ) : (
          cartItems.map((item) => (
            <View key={item.id} style={styles.cartItem}>
              {/* SELECT CHECKBOX */}
              <TouchableOpacity
                onPress={() =>
                  setCartItems((prev) =>
                    prev.map((i) =>
                      i.id === item.id ? { ...i, selected: !i.selected } : i,
                    ),
                  )
                }
                style={styles.itemSelect}
              >
                <View
                  style={[
                    styles.itemCheckbox,
                    item.selected && styles.itemCheckboxActive,
                  ]}
                >
                  {item.selected && (
                    <Ionicons name="checkmark" size={12} color="#FFF" />
                  )}
                </View>
              </TouchableOpacity>

              {/* PRODUCT IMAGE */}
              <Image
                source={{
                  uri: `${API_CONFIG.BASE_URL}/uploads/product/${item.product.thumbnail}`,
                }}
                style={styles.productImage}
                resizeMode="cover"
              />

              {/* PRODUCT INFO */}
              <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={2}>
                  {item.product.name}
                </Text>
                <Text style={styles.productPrice}>
                  {item.product.price.toLocaleString()}₫
                </Text>

                {/* QUANTITY CONTROLS */}
                <View style={styles.quantityContainer}>
                  <TouchableOpacity
                    style={[
                      styles.quantityButton,
                      item.quantity <= 1 && styles.quantityButtonDisabled,
                    ]}
                    onPress={() => handleQuantity(item.id, item.quantity, -1)}
                    disabled={item.quantity <= 1}
                  >
                    <Feather
                      name="minus"
                      size={16}
                      color={item.quantity <= 1 ? "#CCC" : "#666"}
                    />
                  </TouchableOpacity>

                  <View style={styles.quantityDisplay}>
                    <Text style={styles.quantityText}>{item.quantity}</Text>
                  </View>

                  <TouchableOpacity
                    style={styles.quantityButton}
                    onPress={() => handleQuantity(item.id, item.quantity, 1)}
                  >
                    <Feather name="plus" size={16} color="#666" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDelete(item.id)}
                  >
                    <Feather name="trash-2" size={18} color="#FF6B6B" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}

        {/* SPACER FOR FOOTER */}
        {cartItems.length > 0 && <View style={styles.spacer} />}
      </ScrollView>

      {/* CHECKOUT FOOTER */}
      {cartItems.length > 0 && selectedCount > 0 && (
        <View style={styles.checkoutFooter}>
          <View style={styles.totalContainer}>
            <Text style={styles.totalLabel}>Tổng cộng:</Text>
            <Text style={styles.totalPrice}>
              {totalPrice.toLocaleString()}₫
            </Text>
            <Text style={styles.selectedCount}>({selectedCount} sản phẩm)</Text>
          </View>

          <TouchableOpacity
            style={styles.checkoutButton}
            onPress={goToCheckout}
          >
            <Text style={styles.checkoutButtonText}>Tiến hành thanh toán</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerCenter: {
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#333",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  actionsBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  selectAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#DDD",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkBoxActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  selectAllText: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  clearButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: "#FFF5F5",
  },
  clearText: {
    fontSize: 14,
    color: "#FF6B6B",
    fontWeight: "500",
    marginLeft: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  emptyIllustration: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: "#FF6B6B",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  shopButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  itemSelect: {
    marginRight: 12,
  },
  itemCheckbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  itemCheckboxActive: {
    backgroundColor: "#FF6B6B",
    borderColor: "#FF6B6B",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: "#F5F5F5",
  },
  productInfo: {
    flex: 1,
    marginLeft: 16,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
    lineHeight: 22,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FF6B6B",
    marginBottom: 12,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F8F9FA",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#EEE",
  },
  quantityButtonDisabled: {
    backgroundColor: "#F8F9FA",
    borderColor: "#EEE",
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: "center",
    marginHorizontal: 8,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  deleteButton: {
    marginLeft: "auto",
    padding: 8,
  },
  spacer: {
    height: 100,
  },
  checkoutFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: 16,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  totalContainer: {
    marginBottom: 16,
  },
  totalLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  totalPrice: {
    fontSize: 28,
    fontWeight: "800",
    color: "#333",
    marginBottom: 4,
  },
  selectedCount: {
    fontSize: 13,
    color: "#999",
  },
  checkoutButton: {
    backgroundColor: "#FF6B6B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 14,
    shadowColor: "#FF6B6B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
});
