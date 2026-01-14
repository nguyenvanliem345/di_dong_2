import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router"; // Sử dụng router để chuyển trang
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

const { width } = Dimensions.get("window");

/* ================= TYPES ================= */
type Product = {
  id: number;
  title: string;
  price: number;
  photo: string;
  category_id?: number;
  category?: { id: number };
  description?: string;
};

type Category = {
  id: number;
  title: string;
  photo: string;
};

export default function MenuScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Giỏ hàng: { productId: quantity }
  const [cart, setCart] = useState<Record<number, number>>({});

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pRes, cRes, sRes] = await Promise.all([
          fetch(API_CONFIG.PRODUCTS),
          fetch(API_CONFIG.CATEGORIES),
          fetch(API_CONFIG.SLIDESHOWS),
        ]);

        const pJson = await pRes.json();
        const cJson = await cRes.json();
        const sJson = await sRes.json();

        const pData = pJson.content || pJson;
        const cData = cJson.content || cJson;
        const sData = sJson.content || sJson;

        setProducts(pData);
        setCategories(cData);
        setSlides(sData);

        if (cData.length > 0) setSelectedCategory(cData[0].id);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  /* ================= FILTER ================= */
  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(
      (p) => Number(p.category_id ?? p.category?.id) === Number(selectedCategory)
    );
  }, [products, selectedCategory]);

  /* ================= ACTIONS ================= */
  
  // HÀM QUAN TRỌNG: Chuyển sang trang ProductDetail của bạn
const goToDetail = (item: Product) => {
  router.push({
    // Ép kiểu về 'any' để TypeScript không chặn việc biên dịch
    pathname: "/(tabs)/menu/productDetail" as any, 
    params: { product: JSON.stringify(item) },
  });
};

  const increaseQty = (id: number) => {
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const decreaseQty = (id: number) => {
    setCart((prev) => {
      if (!prev[id]) return prev;
      const next = { ...prev };
      if (next[id] === 1) delete next[id];
      else next[id]--;
      return next;
    });
  };

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="notifications-outline" size={24} color="#fff" />
          <View style={styles.cartBox}>
            <Ionicons name="cart-outline" size={26} color="#fff" />
            {cartCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartCount}</Text>
              </View>
            )}
          </View>
        </View>
        <Text style={styles.headerTitle}>DeliFood Menu</Text>
        <View style={styles.headerRight}>
          <View style={styles.iconCircle}><Ionicons name="search" size={18} color="#fff" /></View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== SLIDE ===== */}
        <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={{ marginTop: 15 }}>
          {slides.map((s, i) => (
            <Image key={i} source={{ uri: API_CONFIG.IMAGE_URL("slideShows", s.photo) }} style={styles.slideImg} />
          ))}
        </ScrollView>

        {/* ===== CATEGORY ===== */}
        <View style={styles.catSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 10 }}>
            {categories.map((cat) => {
              const active = selectedCategory === cat.id;
              return (
                <TouchableOpacity key={cat.id} onPress={() => setSelectedCategory(cat.id)} style={styles.catItem}>
                  <View style={[styles.catIcon, active && styles.catIconActive]}>
                    <Image source={{ uri: API_CONFIG.IMAGE_URL("categories", cat.photo) }} style={styles.catImg} resizeMode="contain" />
                  </View>
                  <Text style={[styles.catText, active && styles.catTextActive]}>{cat.title}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ===== PRODUCT LIST ===== */}
        <View style={{ padding: 15 }}>
          <Text style={styles.listTitle}>Món ăn gợi ý</Text>
          {filteredProducts.map((item) => (
            <TouchableOpacity 
              key={item.id} 
              activeOpacity={0.9} 
              onPress={() => goToDetail(item)} // Gọi hàm chuyển trang
            >
              <View style={styles.card}>
                <Image source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }} style={styles.cardImg} />
                <View style={styles.cardInfo}>
                  <Text numberOfLines={1} style={styles.cardName}>{item.title}</Text>
                  <Text style={styles.cardSub}>⭐ 4.8 · Phục vụ nhanh</Text>
                  
                  <View style={styles.priceRow}>
                    <Text style={styles.price}>{item.price.toLocaleString()}đ</Text>
                    
                    {/* Cụm tăng giảm số lượng nhanh */}
                    <View style={styles.qtyBox}>
                      <TouchableOpacity onPress={() => decreaseQty(item.id)}>
                        <Ionicons name="remove-circle-outline" size={26} color="#C62828" />
                      </TouchableOpacity>
                      <Text style={styles.qtyText}>{cart[item.id] || 0}</Text>
                      <TouchableOpacity onPress={() => increaseQty(item.id)}>
                        <Ionicons name="add-circle" size={26} color="#C62828" />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FDFDFD" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#C62828",
    paddingTop: Platform.OS === "ios" ? 50 : 40,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 18 },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  headerRight: { flexDirection: "row", gap: 10 },
  iconCircle: { width: 36, height: 36, borderRadius: 18, backgroundColor: "rgba(255,255,255,0.2)", justifyContent: "center", alignItems: "center" },
  cartBox: { position: "relative" },
  badge: { position: "absolute", top: -5, right: -8, backgroundColor: "#FFD700", width: 18, height: 18, borderRadius: 9, justifyContent: "center", alignItems: "center", borderWidth: 1, borderColor: '#C62828' },
  badgeText: { fontSize: 10, fontWeight: "bold", color: "#C62828" },
  slideImg: { width: width - 30, height: 160, borderRadius: 20, marginHorizontal: 15 },
  catSection: { paddingVertical: 15 },
  catItem: { alignItems: "center", marginHorizontal: 10 },
  catIcon: { width: 60, height: 60, borderRadius: 20, backgroundColor: "#fff", justifyContent: "center", alignItems: "center", elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5 },
  catIconActive: { backgroundColor: "#C62828" },
  catImg: { width: 30, height: 30 },
  catText: { fontSize: 12, marginTop: 8, color: "#666", fontWeight: '500' },
  catTextActive: { color: "#C62828", fontWeight: "700" },
  listTitle: { fontSize: 18, fontWeight: '800', color: '#222', marginBottom: 15 },
  card: { flexDirection: "row", backgroundColor: "#fff", borderRadius: 20, padding: 12, marginBottom: 16, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6 },
  cardImg: { width: 95, height: 95, borderRadius: 15 },
  cardInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  cardName: { fontSize: 16, fontWeight: "700", color: "#333" },
  cardSub: { fontSize: 12, color: "#aaa" },
  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontSize: 18, fontWeight: "800", color: "#C62828" },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 8 },
  qtyText: { minWidth: 18, textAlign: "center", fontSize: 14, fontWeight: "700" },
});