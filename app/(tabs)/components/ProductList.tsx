import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_CONFIG } from '../../../apiConfig';

export const ProductList = ({ products, categoryId }: { products: any[], categoryId: number | null }) => {
  const router = useRouter();

  const displayProducts = categoryId
    ? products.filter(p => Number(p.category_id || p.category?.id) === Number(categoryId))
    : products;

  return (
    // Sử dụng ScrollView horizontal để vuốt TRÁI - PHẢI
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      contentContainerStyle={styles.listContainer}
    >
      {displayProducts.map(item => (
        <TouchableOpacity 
          key={item.id} 
          onPress={() => router.push({ 
            pathname: "/components/ProductDetailScreen", 
            params: { product: JSON.stringify(item) } 
          })}
          style={styles.card}
          activeOpacity={0.9}
        >
          <View style={styles.imageWrapper}>
            <Image
              source={{ uri: API_CONFIG.IMAGE_URL('products', item.photo) }}
              style={styles.image}
            />
          </View>
          <View style={styles.info}>
            <Text numberOfLines={1} style={styles.title}>{item.title}</Text>
            <Text style={styles.price}>{Number(item.price).toLocaleString()}đ</Text>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    flexDirection: 'row', // Nằm trên cùng 1 dòng
    paddingHorizontal: 15,
    paddingTop: 45, // Khoảng cách cho ảnh đè lên
    paddingBottom: 20,
    // KHÔNG CÓ flexWrap ở đây
  },
  card: {
    width: 130, // Độ rộng cố định để chứa được nhiều sản phẩm trên 1 dòng cuộn
    backgroundColor: '#fff',
    borderRadius: 18,
    marginRight: 15, // Khoảng cách giữa các sản phẩm theo chiều ngang
    paddingBottom: 15,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  imageWrapper: { 
    marginTop: -35, // Đè lên viền card
    zIndex: 10 
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#fff',
  },
  info: { 
    alignItems: 'center', 
    marginTop: 8, 
    paddingHorizontal: 8,
    width: '100%'
  },
  title: { 
    fontWeight: 'bold', 
    textAlign: 'center', 
    fontSize: 13, 
    color: '#333',
    height: 20 
  },
  price: { 
    color: '#C62828', 
    fontWeight: 'bold', 
    marginTop: 5, 
    fontSize: 14 
  },
});