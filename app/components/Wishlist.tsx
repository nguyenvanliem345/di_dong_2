import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

export default function Wishlist() {
  const [wishlist, setWishlist] = useState<any[]>([]);
  const router = useRouter();

  /* ================= LOAD KHI VÀO MÀN ================= */
  useFocusEffect(
    useCallback(() => {
      loadWishlist();
    }, []),
  );

  const loadWishlist = async () => {
    try {
      const raw = await AsyncStorage.getItem("wishlist");
      const data = raw ? JSON.parse(raw) : [];
      setWishlist(data);
    } catch (e) {
      console.log("Load wishlist error:", e);
    }
  };

  /* ================= REMOVE ITEM ================= */
  const removeItem = async (id: number | string) => {
    const newList = wishlist.filter((item) => String(item.id) !== String(id));

    setWishlist(newList);
    await AsyncStorage.setItem("wishlist", JSON.stringify(newList));
  };

  /* ================= EMPTY STATE ================= */
  if (wishlist.length === 0) {
    return (
      <View style={styles.empty}>
        <Text style={styles.emptyText}>Chưa có sản phẩm yêu thích ❤️</Text>
      </View>
    );
  }

  /* ================= RENDER ================= */
  return (
    <FlatList
      data={wishlist}
      keyExtractor={(item) => String(item.id)}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View style={styles.card}>
          {/* CLICK VÀO ĐÂY MỚI CHUYỂN TRANG */}
          <TouchableOpacity
            style={styles.info}
            activeOpacity={0.7}
            onPress={() => router.push(`/product/${item.id}`)}
          >
            <Image
              source={{
                uri: `${API_CONFIG.BASE_URL}/uploads/product/${item.thumbnail}`,
              }}
              style={styles.image}
            />

            <View style={{ flex: 1 }}>
              <Text style={styles.name} numberOfLines={2}>
                {item.name}
              </Text>
              <Text style={styles.price}>{item.price?.toLocaleString()}₫</Text>
            </View>
          </TouchableOpacity>

          {/* NÚT XÓA */}
          <TouchableOpacity
            onPress={() =>
              Alert.alert(
                "Xóa sản phẩm",
                "Bạn có chắc muốn xóa khỏi wishlist?",
                [
                  { text: "Hủy", style: "cancel" },
                  {
                    text: "Xóa",
                    style: "destructive",
                    onPress: () => removeItem(item.id),
                  },
                ],
              )
            }
            hitSlop={10}
          >
            <Feather name="x" size={22} color="#FF3B30" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
}

/* ================= STYLES ================= */
const styles = StyleSheet.create({
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
  },

  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 4,
  },

  info: {
    flexDirection: "row",
    flex: 1,
    alignItems: "center",
    marginRight: 10,
  },

  image: {
    width: 70,
    height: 70,
    borderRadius: 14,
    marginRight: 12,
    backgroundColor: "#eee",
  },

  name: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111",
  },

  price: {
    marginTop: 4,
    color: "#FF3B30",
    fontWeight: "600",
  },
});
