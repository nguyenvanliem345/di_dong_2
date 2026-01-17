import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";
import { BannerSlider } from "./components/BannerSlider";
import { FoodCard } from "./components/FoodCard";
import { Header } from "./components/Header";
import { MenuDiscovery } from "./components/MenuDiscovery";
import { QuickActions } from "./components/QuickActions";

const { width } = Dimensions.get("window");
const APP_WIDTH = width > 500 ? 414 : width;

export default function DishDashApp() {
  const [ads, setAds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Thêm State để quản lý từ khóa tìm kiếm và danh mục đang chọn
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null,
  );

  useEffect(() => {
    Promise.all([
      fetch(API_CONFIG.SLIDESHOWS).then((res) => res.json()),
      fetch(API_CONFIG.PRODUCTS).then((res) => res.json()),
    ])
      .then(([slidesData, productsData]) => {
        const pData = productsData.content || productsData;
        setAds(slidesData.content || slidesData);
        setProducts(pData);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // 2. Logic Lọc tổng hợp: Kết hợp tìm kiếm và danh mục
  // Dùng useMemo để danh sách tự cập nhật mỗi khi searchQuery hoặc selectedCategoryId thay đổi
  const filteredProducts = useMemo(() => {
    return products.filter((p: any) => {
      // Điều kiện 1: Lọc theo Category
      let matchesCategory = true;
      if (selectedCategoryId !== null) {
        const directMatch =
          p.category_id && Number(p.category_id) === Number(selectedCategoryId);
        const objectMatch =
          p.category && Number(p.category.id) === Number(selectedCategoryId);
        matchesCategory = directMatch || objectMatch;
      }

      // Điều kiện 2: Lọc theo Tìm kiếm
      let matchesSearch = true;
      if (searchQuery.trim() !== "") {
        const keyword = searchQuery.toLowerCase().trim();
        const title = (p.name || p.title || "").toLowerCase();
        matchesSearch = title.includes(keyword);
      }

      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategoryId, searchQuery]);

  if (loading)
    return (
      <ActivityIndicator size="large" color="#C62828" style={{ flex: 1 }} />
    );

  return (
    <View style={styles.masterContainer}>
      <View style={styles.container}>
        {/* 3. Truyền state tìm kiếm vào Header */}
        <Header
          value={searchQuery}
          onChangeText={(text: string) => setSearchQuery(text)}
        />

        <ScrollView showsVerticalScrollIndicator={false}>
          <BannerSlider ads={ads} />
          <QuickActions />

          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {searchQuery
                ? `Kết quả cho "${searchQuery}"`
                : "Món ngon dành cho bạn"}
            </Text>
          </View>

          {/* 4. Hiển thị FoodCard dựa trên danh sách đã lọc */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodHorizontalList}
          >
            {filteredProducts.length > 0 ? (
              filteredProducts.map((item: any) => (
                <FoodCard key={item.id} item={item} />
              ))
            ) : (
              <Text
                style={{ marginLeft: 15, color: "#999", paddingVertical: 20 }}
              >
                Không tìm thấy món phù hợp
              </Text>
            )}
          </ScrollView>

          <MenuDiscovery
            products={products}
            onSelectCategory={(id) => setSelectedCategoryId(id)}
          />

          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

// ... Styles giữ nguyên như cũ của bạn
const styles = StyleSheet.create({
  masterContainer: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
  },
  container: { flex: 1, backgroundColor: "#fff", width: APP_WIDTH },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    marginTop: 25,
    marginBottom: 10,
    alignItems: "center",
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  foodHorizontalList: { paddingLeft: 15, paddingRight: 15, paddingBottom: 10 },
});
