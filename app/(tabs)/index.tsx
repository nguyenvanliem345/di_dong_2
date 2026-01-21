import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";
import ChatScreen from "../components/ChatScreen";
import FoodBanner from "../components/FoodBanner";
import AppHeader from "../components/Header";

const { width } = Dimensions.get("window");

const COLORS = {
  background: "#F8F9FD",
  white: "#FFFFFF",
  dark: "#1A1D26",
  textGray: "#8E94A3",
  primary: "#2563EB",
  border: "rgba(0,0,0,0.05)",
};

const shadowStyle = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 6 },
  shadowOpacity: 0.08,
  shadowRadius: 12,
  elevation: 6,
};

export default function MeiPremiumStore() {
  const router = useRouter();

  /* ===== STATE ===== */
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showChat, setShowChat] = useState(false); // 🔥 CHAT STATE

  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);

  const [selectedBrandId, setSelectedBrandId] = useState<number | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  const [searchQuery, setSearchQuery] = useState("");

  /* ===== FETCH ===== */
  const loadData = async () => {
    try {
      const [b, c, p] = await Promise.all([
        fetch(`${API_CONFIG.BASE_URL}/api/Brand`).then((r) => r.json()),
        fetch(`${API_CONFIG.BASE_URL}/api/Category`).then((r) => r.json()),
        fetch(`${API_CONFIG.BASE_URL}/api/Product`).then((r) => r.json()),
      ]);

      setBrands(b?.content || b || []);
      setCategories(c?.content || c || []);
      setProducts(p?.content || p || []);
    } catch (e) {
      console.log("Fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData().finally(() => setRefreshing(false));
  }, []);

  /* ===== FILTER ===== */
  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (searchQuery.trim()) {
      list = list.filter((p) =>
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (selectedBrandId) {
      list = list.filter(
        (p) => p.brandId === selectedBrandId || p.brand?.id === selectedBrandId,
      );
    }

    if (selectedCategoryId) {
      list = list.filter(
        (p) =>
          p.categoryId === selectedCategoryId ||
          p.category?.id === selectedCategoryId,
      );
    }

    return list;
  }, [products, searchQuery, selectedBrandId, selectedCategoryId]);

  const featured = filteredProducts.slice(0, 3);
  const arrivals = filteredProducts.slice(3);

  const imageUrl = (item: any) => ({
    uri: API_CONFIG.IMAGE_URL("products", item.thumbnail),
  });

  /* ===== RENDER ===== */
  return (
    <View style={styles.container}>
      <StatusBar translucent barStyle="dark-content" />

      <AppHeader searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={{ paddingHorizontal: 20, marginTop: 16 }}>
          <FoodBanner />
        </View>

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Đang tải dữ liệu...</Text>
          </View>
        ) : (
          <>
            {/* ===== BRANDS ===== */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>ĐỐI TÁC</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {brands.map((b) => {
                  const active = selectedBrandId === b.id;
                  return (
                    <TouchableOpacity
                      key={b.id}
                      onPress={() => setSelectedBrandId(active ? null : b.id)}
                      style={[styles.brandItem, active && styles.brandActive]}
                    >
                      <Text
                        style={[
                          styles.brandText,
                          active && styles.brandTextActive,
                        ]}
                      >
                        {b.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* ===== FEATURED ===== */}
            <View style={styles.section}>
              <Text style={styles.heading}>NỔI BẬT</Text>
              <View style={styles.featuredRow}>
                {featured.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={styles.featuredCard}
                    onPress={() => router.push(`/product/${item.id}`)}
                  >
                    <Image source={imageUrl(item)} style={styles.image} />
                    <Text numberOfLines={1} style={styles.name}>
                      {item.name}
                    </Text>
                    <Text style={styles.price}>
                      {item.price?.toLocaleString()}đ
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* ===== ARRIVALS ===== */}
            <View style={styles.section}>
              <Text style={styles.heading}>GỢI Ý HÔM NAY</Text>
              {arrivals.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.rowCard}
                  onPress={() => router.push(`/product/${item.id}`)}
                >
                  <Image source={imageUrl(item)} style={styles.rowImg} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.rowName} numberOfLines={2}>
                      {item.name}
                    </Text>
                    <Text style={styles.rowPrice}>
                      {item.price?.toLocaleString()}đ
                    </Text>
                  </View>
                  <Feather name="chevron-right" size={20} />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* ===== CHAT BUBBLE ===== */}
      <TouchableOpacity
        style={styles.chatBubble}
        onPress={() => setShowChat(true)}
        activeOpacity={0.85}
      >
        <Feather name="message-circle" size={26} color="#fff" />
      </TouchableOpacity>

      {/* ===== CHAT MODAL ===== */}
      <Modal visible={showChat} animationType="slide">
        <View style={{ flex: 1 }}>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => setShowChat(false)}
          >
            <Feather name="x" size={26} />
          </TouchableOpacity>

          <ChatScreen />
        </View>
      </Modal>
    </View>
  );
}

/* ===== STYLES ===== */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  loadingBox: { marginTop: 40, alignItems: "center" },
  loadingText: { marginTop: 10, color: COLORS.textGray },

  section: { marginTop: 24, paddingHorizontal: 20 },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "700",
    color: COLORS.textGray,
    marginBottom: 12,
  },
  heading: { fontSize: 20, fontWeight: "800", marginBottom: 12 },

  brandItem: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: COLORS.white,
    marginRight: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  brandActive: { backgroundColor: COLORS.dark },
  brandText: { fontWeight: "600" },
  brandTextActive: { color: COLORS.white },

  featuredRow: { flexDirection: "row", gap: 12 },
  featuredCard: {
    width: width / 3 - 20,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 10,
    ...shadowStyle,
  },
  image: { width: "100%", height: 100, borderRadius: 12 },
  name: { marginTop: 6, fontWeight: "600" },
  price: { fontWeight: "800", color: COLORS.primary },

  rowCard: {
    flexDirection: "row",
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 10,
    marginBottom: 12,
    alignItems: "center",
    ...shadowStyle,
  },
  rowImg: {
    width: 70,
    height: 70,
    borderRadius: 12,
    marginRight: 12,
  },
  rowName: { fontWeight: "700" },
  rowPrice: { marginTop: 4, color: COLORS.primary, fontWeight: "800" },

  chatBubble: {
    position: "absolute",
    right: 20,
    bottom: 30,
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
  },

  closeBtn: {
    position: "absolute",
    top: 45,
    right: 20,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
    elevation: 4,
  },
});
