import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
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
import { useCart } from "../(tabs)/components/CartContext";
import { API_CONFIG } from "../../apiConfig";

const { width } = Dimensions.get("window");

type Product = {
  id: number;
  title: string;
  price: number;
  photo: string;
  category_id?: number;
  category?: { id: number };
};

type Category = {
  id: number;
  title: string;
  photo: string;
};

export default function MenuScreen() {
  const router = useRouter();
  const { cart, addToCart, removeFromCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [slides, setSlides] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [p, c, s] = await Promise.all([
          fetch(API_CONFIG.PRODUCTS),
          fetch(API_CONFIG.CATEGORIES),
          fetch(API_CONFIG.SLIDESHOWS),
        ]);

        const pJson = await p.json();
        const cJson = await c.json();
        const sJson = await s.json();

        setProducts(pJson.content || pJson);
        setCategories(cJson.content || cJson);
        setSlides(sJson.content || sJson);

        if (cJson.content?.length) setSelectedCategory(cJson.content[0].id);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredProducts = useMemo(() => {
    if (!selectedCategory) return [];
    return products.filter(
      (p) => Number(p.category_id ?? p.category?.id) === selectedCategory,
    );
  }, [products, selectedCategory]);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#C62828" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>

        <TouchableOpacity onPress={() => router.push("/(tabs)/orders")}>
          <Ionicons name="cart-outline" size={26} color="#fff" />
          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView>
        {/* BANNER */}
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {slides.map((s, i) => (
            <Image
              key={i}
              source={{ uri: API_CONFIG.IMAGE_URL("slideShows", s.photo) }}
              style={styles.slide}
            />
          ))}
        </ScrollView>

        {/* CATEGORY */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginVertical: 15 }}
        >
          {categories.map((c) => (
            <TouchableOpacity
              key={c.id}
              style={[
                styles.catItem,
                selectedCategory === c.id && styles.catActive,
              ]}
              onPress={() => setSelectedCategory(c.id)}
            >
              <Text
                style={{ color: selectedCategory === c.id ? "#fff" : "#333" }}
              >
                {c.title}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* PRODUCTS */}
        <View style={{ padding: 15 }}>
          {filteredProducts.map((item) => {
            const qty = cart.find((c) => c.id === item.id)?.quantity || 0;
            return (
              <View key={item.id} style={styles.card}>
                <Image
                  source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }}
                  style={styles.img}
                />

                <View style={{ flex: 1 }}>
                  <Text style={styles.name}>{item.title}</Text>
                  <Text style={styles.price}>
                    {item.price.toLocaleString()}đ
                  </Text>

                  <View style={styles.qtyRow}>
                    <TouchableOpacity onPress={() => removeFromCart(item.id)}>
                      <Ionicons
                        name="remove-circle-outline"
                        size={26}
                        color="#C62828"
                      />
                    </TouchableOpacity>

                    <Text style={styles.qty}>{qty}</Text>

                    <TouchableOpacity
                      onPress={() =>
                        addToCart({
                          id: item.id,
                          title: item.title,
                          price: item.price,
                          photo: item.photo,
                        })
                      }
                    >
                      <Ionicons name="add-circle" size={26} color="#C62828" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  header: {
    backgroundColor: "#C62828",
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingBottom: 15,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: { color: "#fff", fontSize: 18, fontWeight: "800" },
  badge: {
    position: "absolute",
    top: -6,
    right: -10,
    backgroundColor: "#FFD700",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: { fontSize: 10, fontWeight: "700" },

  slide: { width, height: 160 },

  catItem: {
    backgroundColor: "#eee",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 8,
  },
  catActive: { backgroundColor: "#C62828" },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 15,
    marginBottom: 15,
    elevation: 3,
  },
  img: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  name: { fontSize: 16, fontWeight: "700" },
  price: { color: "#C62828", fontWeight: "800", marginVertical: 5 },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  qty: { fontSize: 16, fontWeight: "700" },
});
