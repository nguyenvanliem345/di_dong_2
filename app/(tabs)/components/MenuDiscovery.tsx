import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CategoryList } from "./CategoryList";
import { ProductList } from "./ProductList";

// Định nghĩa kiểu dữ liệu để hết lỗi "Property does not exist"
type MenuDiscoveryProps = {
  products: any[];
  onSelectCategory: (id: number | null) => void;
};

export const MenuDiscovery = ({
  products,
  onSelectCategory,
}: MenuDiscoveryProps) => {
  const [localCategoryId, setLocalCategoryId] = useState<number | null>(null);

  const handleSelect = (id: number | null) => {
    setLocalCategoryId(id);
    onSelectCategory(id); // Gọi hàm handleFilter ở file index.tsx
  };

  return (
    <View
      style={{
        backgroundColor: "#C62828",
        paddingVertical: 30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          paddingHorizontal: 20,
          marginBottom: 25,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>
          Khám phá menu
        </Text>
        <TouchableOpacity>
          <Text style={{ color: "#fff", opacity: 0.8 }}>xem thêm</Text>
        </TouchableOpacity>
      </View>

      <CategoryList onSelectCategory={handleSelect} />
      {/* Tách ProductList ra để hiển thị sản phẩm theo danh mục */}
      <ProductList products={products} categoryId={localCategoryId} />
    </View>
  );
};

// import React, { useEffect, useState } from 'react';
// import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
// import { API_CONFIG } from "../../../apiConfig";

// export const MenuDiscovery = ({ products, onSelectCategory }: { products: any[], onSelectCategory: (id: number | null) => void }) => {
//   const [categories, setCategories] = useState([]);
//   const [activeCat, setActiveCat] = useState<number | null>(null);

//   // Tạo danh sách sản phẩm hiển thị dựa trên danh mục đang chọn
//   // Trong MenuDiscovery.tsx
// const displayProducts = activeCat
//   ? products.filter((p: any) => {
//       const idMatch = p.category_id && Number(p.category_id) === Number(activeCat);
//       const objMatch = p.category && Number(p.category.id) === Number(activeCat);
//       return idMatch || objMatch;
//     })
//   : products;

//   useEffect(() => {
//     fetch(API_CONFIG.CATEGORIES)
//       .then(res => res.json())
//       .then(data => setCategories(data.content || data))
//       .catch(err => console.error("Lỗi lấy danh mục:", err));
//   }, []);

//   const handlePress = (id: number | null) => {
//     const newId = activeCat === id ? null : id;
//     setActiveCat(newId);
//     onSelectCategory(newId);
//   };

//   return (
//     <View style={styles.menuDiscoverySection}>
//       <View style={styles.sectionHeaderRow}>
//         <Text style={styles.sectionTitleWhite}>Khám phá menu của chúng tôi</Text>
//         <TouchableOpacity><Text style={styles.seeMoreWhite}>xem thêm</Text></TouchableOpacity>
//       </View>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
//         <TouchableOpacity onPress={() => handlePress(null)} style={styles.categoryItem}>
//             <View style={[styles.categoryIcon, activeCat === null && {borderColor: '#FFD700', borderWidth: 2}]}>
//                 <Text style={{fontSize: 20}}>🍴</Text>
//             </View>
//             <Text style={styles.categoryLabel}>Tất cả</Text>
//         </TouchableOpacity>

//         {categories.map((cat: any) => (
//           <TouchableOpacity
//             key={cat.id.toString()}
//             onPress={() => handlePress(cat.id)}
//             style={styles.categoryItem}
//           >
//             <View style={[styles.categoryIcon, activeCat === cat.id && {borderColor: '#FFD700', borderWidth: 2}]}>
//               <Image source={{ uri: API_CONFIG.IMAGE_URL("categories", cat.photo) }} style={styles.catImage} />
//             </View>
//             <Text style={styles.categoryLabel}>{cat.title}</Text>
//           </TouchableOpacity>
//         ))}
//       </ScrollView>

//       {/* THAY ĐỔI Ở ĐÂY: Dùng displayProducts thay vì products.slice */}
//       <ScrollView
//         horizontal
//         showsHorizontalScrollIndicator={false}
//         style={styles.featuredScroll}
//         contentContainerStyle={{ paddingRight: 30 }}
//       >
//         {displayProducts.length > 0 ? (
//           displayProducts.map((item: any) => (
//             <View key={item.id.toString()} style={styles.featuredCard}>
//               <View style={styles.imageOverlap}>
//                 <Image
//                   source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }}
//                   style={styles.circleImg}
//                 />
//               </View>
//               <View style={styles.cardBody}>
//                 <Text style={styles.featuredName} numberOfLines={2}>{item.title}</Text>
//                 <Text style={styles.featuredRating}>⭐ 4.8 (1.2k)</Text>
//                 <Text style={styles.featuredPrice}>{Number(item.price).toLocaleString()}đ</Text>
//               </View>
//             </View>
//           ))
//         ) : (
//           <Text style={{color: '#fff', marginLeft: 20, marginTop: 20}}>Chưa có món nào trong mục này</Text>
//         )}
//       </ScrollView>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   menuDiscoverySection: {
//     backgroundColor: '#C62828',
//     paddingVertical: 30,
//     marginTop: 20,
//     borderTopLeftRadius: 30,
//     borderTopRightRadius: 30,
//   },
//   sectionHeaderRow: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     paddingHorizontal: 20,
//     marginBottom: 25,
//     alignItems: 'center'
//   },
//   sectionTitleWhite: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
//   seeMoreWhite: { color: '#fff', fontSize: 13, opacity: 0.8 },
//   categoryScroll: { paddingLeft: 20, marginBottom: 40 },
//   categoryItem: { alignItems: 'center', marginRight: 25 },
//   categoryIcon: {
//     width: 55, height: 55, borderRadius: 15,
//     backgroundColor: '#fff', overflow: 'hidden',
//     justifyContent: 'center', alignItems: 'center',
//     elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
//   },
//   catImage: { width: '100%', height: '100%', resizeMode: 'cover' },
//   categoryLabel: { color: '#fff', fontSize: 12, marginTop: 10, fontWeight: '600' },
//   featuredScroll: { paddingLeft: 20 },
//   featuredCard: {
//     width: 160,
//     backgroundColor: '#fff',
//     borderRadius: 20,
//     marginRight: 20,
//     marginTop: 45,
//     paddingBottom: 20,
//     alignItems: 'center',
//     ...Platform.select({
//       ios: { shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 10, shadowOffset: { width: 0, height: 5 } },
//       android: { elevation: 6 }
//     })
//   },
//   imageOverlap: { marginTop: -50, zIndex: 10 },
//   circleImg: {
//     width: 100, height: 100, borderRadius: 50,
//     borderWidth: 5, borderColor: '#fff',
//   },
//   cardBody: { alignItems: 'center', paddingHorizontal: 12, marginTop: 10 },
//   featuredName: { fontWeight: 'bold', fontSize: 14, textAlign: 'center', color: '#222', height: 42, lineHeight: 20 },
//   featuredRating: { fontSize: 11, color: '#999', marginVertical: 6 },
//   featuredPrice: { color: '#C62828', fontWeight: 'bold', fontSize: 16 },
// });
