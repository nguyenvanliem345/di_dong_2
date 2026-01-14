import { useRouter } from 'expo-router';
import { Heart } from "lucide-react-native";
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API_CONFIG } from "../../../apiConfig";
import { APP_WIDTH, PRIMARY_COLOR, globalStyles } from './themeStyles';

export const FoodCard = ({ item }: { item: any }) => {
    const router = useRouter();

    const handlePress = () => {
        // Chuyển sang ProductDetailScreen và truyền dữ liệu sản phẩm
        router.push({
            pathname: "/components/ProductDetailScreen",
            params: { product: JSON.stringify(item) }
        });
    };

    return (
        <TouchableOpacity 
            style={[styles.card, globalStyles.shadow]} 
            activeOpacity={0.9}
            onPress={handlePress}
        >
            <View>
                <Image source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }} style={styles.image} />
                <View style={styles.promoBadge}>
                    <Text style={styles.promoText}>Giảm 4%</Text>
                </View>
            </View>
            <View style={styles.info}>
                <Text style={styles.name} numberOfLines={1}>{item.name || item.title}</Text>
                <Text style={styles.subText}>1.5 km | ⭐ 4.8 (1.2k)</Text>
                <View style={styles.priceRow}>
                    <View>
                        <Text style={styles.currentPrice}>{Number(item.price).toLocaleString()}đ</Text>
                        <Text style={styles.oldPrice}>400.000đ</Text>
                    </View>
                    <TouchableOpacity style={styles.heartBtn}>
                        <Heart size={18} color={PRIMARY_COLOR} />
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: { width: APP_WIDTH / 2.25, backgroundColor: '#fff', borderRadius: 16, marginRight: 15, marginBottom: 10 },
    image: { width: '100%', height: 120, borderTopLeftRadius: 16, borderTopRightRadius: 16 },
    promoBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: 'rgba(30, 41, 59, 0.8)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
    promoText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
    info: { padding: 12 },
    name: { fontWeight: 'bold', fontSize: 14, color: '#1A1A1A' },
    subText: { fontSize: 11, color: '#777', marginVertical: 4 },
    priceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 4 },
    currentPrice: { color: PRIMARY_COLOR, fontWeight: 'bold', fontSize: 15 },
    oldPrice: { color: '#BBB', fontSize: 11, textDecorationLine: 'line-through' },
    heartBtn: { padding: 4 }
});