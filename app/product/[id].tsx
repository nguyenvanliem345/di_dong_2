import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  Animated,
  Dimensions,
  Image,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

const { width, height } = Dimensions.get("window");
const WISHLIST_KEY = "wishlist";
const [showWishlist, setShowWishlist] = useState(false);

export default function ProductDetail() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [liked, setLiked] = useState(false);

  const scaleValue = useRef(new Animated.Value(1)).current;

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_CONFIG.BASE_URL}/api/Product/${id}`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        setProduct(data);
        checkLiked(data.id);
      } catch {
        Alert.alert("Lỗi", "Không tải được sản phẩm");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  /* ================= CHECK WISHLIST ================= */
  const checkLiked = async (productId: number) => {
    const raw =
      Platform.OS === "web"
        ? localStorage.getItem(WISHLIST_KEY)
        : await AsyncStorage.getItem(WISHLIST_KEY);

    const wishlist = raw ? JSON.parse(raw) : [];
    setLiked(wishlist.some((p: any) => p.id === productId));
  };

  /* ================= TOGGLE WISHLIST (LOCAL) ================= */
  const toggleWishlist = async () => {
    if (!product) return;

    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.8,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 80,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 80,
        useNativeDriver: true,
      }),
    ]).start();

    const raw =
      Platform.OS === "web"
        ? localStorage.getItem(WISHLIST_KEY)
        : await AsyncStorage.getItem(WISHLIST_KEY);

    let wishlist = raw ? JSON.parse(raw) : [];

    const exists = wishlist.find((p: any) => p.id === product.id);

    if (exists) {
      wishlist = wishlist.filter((p: any) => p.id !== product.id);
      setLiked(false);
    } else {
      wishlist.push({
        id: product.id,
        name: product.name,
        price: product.price,
        thumbnail: product.thumbnail,
      });
      setLiked(true);
    }

    if (Platform.OS === "web") {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } else {
      await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    }
  };

  /* ================= ADD TO CART (GIỮ NGUYÊN) ================= */
  /* ================= SỬA LẠI HÀM NÀY TRONG PRODUCTDETAIL ================= */
  const handleAddToCart = async () => {
    if (isAdding || !product) return;
    try {
      setIsAdding(true);

      // 1. Lấy token
      const token =
        Platform.OS === "web"
          ? localStorage.getItem("userToken")
          : await AsyncStorage.getItem("userToken");

      // 2. Lấy User ID từ "userData" (THAY ĐỔI QUAN TRỌNG)
      // Thay vì lấy key "userId", ta lấy "userData" rồi parse ra để đảm bảo đồng bộ với màn hình Giỏ hàng
      const userRaw =
        Platform.OS === "web"
          ? localStorage.getItem("userData")
          : await AsyncStorage.getItem("userData");

      const userData = userRaw ? JSON.parse(userRaw) : null;
      const userId = userData?.id; // Lấy id từ object userData

      // Kiểm tra kỹ
      if (!token || !userId) {
        Alert.alert(
          "Yêu cầu",
          "Vui lòng đăng nhập lại để thực hiện chức năng này",
        );
        // Có thể thêm router.push('/login') tại đây nếu cần
        return;
      }

      console.log("Adding to cart for User ID:", userId); // Debug xem ID đúng chưa

      const res = await fetch(API_CONFIG.CART_ADD, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: product.id,
          userId: userId, // Dùng ID đã lấy chuẩn xác
          quantity: 1,
        }),
      });

      if (res.ok) {
        Alert.alert("Thành công", "Đã thêm vào giỏ hàng");
      } else {
        // Log lỗi ra để biết server trả về gì nếu không ok
        const errorText = await res.text();
        console.log("Add cart failed:", errorText);
        Alert.alert("Lỗi", "Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Đã có lỗi xảy ra");
    } finally {
      setIsAdding(false);
    }
  };

  /* ================= RENDER ================= */
  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );

  if (!product)
    return (
      <View style={styles.center}>
        <Text>Không tìm thấy sản phẩm</Text>
      </View>
    );

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />

      {/* IMAGE */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: `${API_CONFIG.BASE_URL}/uploads/product/${product.thumbnail}`,
          }}
          style={styles.image}
        />
        <LinearGradient
          colors={["rgba(0,0,0,0.05)", "transparent", "#fff"]}
          style={styles.gradient}
        />
      </View>

      {/* HEADER */}
      <SafeAreaView style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.glassBtn}>
          <Ionicons name="arrow-back" size={22} />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setShowWishlist(true)}
          style={styles.glassBtn}
        ></TouchableOpacity>
      </SafeAreaView>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.sheet}>
          <Text style={styles.category}>
            {product.category?.name || "COLLECTION"}
          </Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>{product.price?.toLocaleString()}₫</Text>

          <Text style={styles.desc}>{product.description}</Text>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={toggleWishlist} style={styles.heartBtn}>
          <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
            <Ionicons
              name={liked ? "heart" : "heart-outline"}
              size={28}
              color={liked ? "#FF3B30" : "#000"}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartText}>
            {isAdding ? "Adding..." : "Add to Cart"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  imageContainer: {
    height: height * 0.55,
    position: "absolute",
    width,
  },
  image: { width: "100%", height: "100%" },
  gradient: {
    position: "absolute",
    bottom: 0,
    height: 120,
    width: "100%",
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: Platform.OS === "android" ? 40 : 10,
  },
  glassBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.85)",
    justifyContent: "center",
    alignItems: "center",
  },

  content: { paddingTop: height * 0.5 },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    minHeight: height * 0.6,
  },

  category: { color: "#888", fontWeight: "700" },
  name: { fontSize: 28, fontWeight: "800" },
  price: { fontSize: 22, fontWeight: "700", color: "#FF3B30" },
  desc: { fontSize: 15, lineHeight: 24, color: "#666" },

  footer: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    height: 70,
    backgroundColor: "#fff",
    borderRadius: 25,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    elevation: 10,
  },

  heartBtn: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  cartBtn: {
    flex: 1,
    backgroundColor: "#000",
    borderRadius: 18,
    paddingVertical: 14,
    alignItems: "center",
  },
  cartText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
