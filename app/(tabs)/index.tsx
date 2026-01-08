import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";
import { API_CONFIG } from "../../apiConfig";
import { BannerSlider } from "./components/BannerSlider";
import { FoodCard } from "./components/FoodCard";
import { Header } from "./components/Header";
import { MenuDiscovery } from "./components/MenuDiscovery"; // Đảm bảo đã import cái này
import { QuickActions } from "./components/QuickActions";

const { width } = Dimensions.get('window');
const APP_WIDTH = width > 500 ? 414 : width;

export default function DishDashApp() {
  const [ads, setAds] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]); // Danh sách sau khi lọc
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(API_CONFIG.SLIDESHOWS).then(res => res.json()),
      fetch(API_CONFIG.PRODUCTS).then(res => res.json())
    ])
    .then(([slidesData, productsData]) => {
      const pData = productsData.content || productsData;
      setAds(slidesData.content || slidesData);
      setProducts(pData);
      setFilteredProducts(pData); // Mặc định hiện tất cả
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  // Hàm xử lý lọc món ăn
 const handleFilter = (categoryId: number | null) => {
  if (categoryId === null) {
    setFilteredProducts(products);
  } else {
    const filtered = products.filter((p: any) => {
      // 1. Kiểm tra nếu p.category_id là số/chuỗi trực tiếp
      const directMatch = p.category_id && Number(p.category_id) === Number(categoryId);

      // 2. Kiểm tra nếu category là một Object lồng nhau (Cấu trúc thường gặp của JPA/Hibernate)
      const objectMatch = p.category && Number(p.category.id) === Number(categoryId);

      // 3. Dự phòng lọc theo tên danh mục hiển thị
      const nameMatch = p.category_title === "Món Hấp" && Number(categoryId) === 1;

      return directMatch || objectMatch || nameMatch;
    });
    setFilteredProducts(filtered);
  }
};

  return (
    <View style={styles.masterContainer}>
      <View style={styles.container}>
        <Header />
        <ScrollView showsVerticalScrollIndicator={false}>
          <BannerSlider ads={ads} />
          <QuickActions />

          {/* Phần Giảm giá ăn ngon giờ sẽ hiển thị danh sách đã lọc */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Món ngon dành cho bạn</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.foodHorizontalList}>
            {filteredProducts.map((item: any) => (
              <FoodCard key={item.id} item={item} />
            ))}
          </ScrollView>

          {/* Truyền hàm lọc vào MenuDiscovery */}
          <MenuDiscovery 
            products={products} 
            onSelectCategory={handleFilter} 
          />
          
          <View style={{ height: 100 }} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  masterContainer: { 
    flex: 1, 
    backgroundColor: "#000", 
    alignItems: "center", 
    justifyContent: "center" 
  },
  container: { 
    flex: 1, 
    backgroundColor: "#fff", 
    width: APP_WIDTH 
  },
  loadingCenter: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#fff' 
  },
  sectionHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 15, 
    marginTop: 25, 
    marginBottom: 10,
    alignItems: 'center' 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#333' 
  },
  seeMore: { 
    color: '#C62828', 
    fontSize: 12, 
    fontWeight: '600' 
  },
  foodHorizontalList: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
});