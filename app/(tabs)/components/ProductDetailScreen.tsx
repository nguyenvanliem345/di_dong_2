import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router"; // Sử dụng expo-router để nhận params
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { API_CONFIG } from "../../../apiConfig";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen() {
    const router = useRouter(); //
    const params = useLocalSearchParams(); // Lấy dữ liệu được truyền từ router.push

    // Parse chuỗi JSON sản phẩm nhận được từ FoodCard hoặc ProductList
    const product = params.product ? JSON.parse(params.product as string) : null;
    
    const [qty, setQty] = useState(1);

    // Xử lý tăng giảm số lượng
    const increase = () => setQty((p) => p + 1);
    const decrease = () => setQty((p) => (p > 1 ? p - 1 : 1));

    // Nếu không có dữ liệu sản phẩm, hiển thị thông báo lỗi
    if (!product) {
        return (
            <View style={styles.errorContainer}>
                <Text>Không tìm thấy thông tin sản phẩm.</Text>
                <TouchableOpacity onPress={() => router.back()}>
                    <Text style={{ color: "#C62828", marginTop: 10 }}>Quay lại</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ===== HEADER ===== */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>

                <Text style={styles.headerTitle} numberOfLines={1}>
                    {product.title || product.name}
                </Text>

                <TouchableOpacity style={styles.backBtn}>
                    <Ionicons name="heart-outline" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                {/* ===== IMAGE ===== */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{
                            uri: API_CONFIG.IMAGE_URL("products", product.photo),
                        }}
                        style={styles.image}
                    />
                </View>

                {/* ===== INFO BOX ===== */}
                <View style={styles.infoBox}>
                    <View style={styles.mainInfo}>
                        <Text style={styles.title}>{product.title || product.name}</Text>
                        <Text style={styles.price}>
                            {Number(product.price).toLocaleString()}đ
                        </Text>
                    </View>

                    <View style={styles.ratingRow}>
                        <Ionicons name="star" size={16} color="#FFD700" />
                        <Text style={styles.ratingText}> 4.8 (1.2k đánh giá) • 1.5km</Text>
                    </View>

                    <View style={styles.divider} />

                    <Text style={styles.sectionLabel}>Mô tả món ăn</Text>
                    <Text style={styles.desc}>
                        {product.description ||
                            "Món ăn được chế biến từ những nguyên liệu tươi ngon nhất trong ngày, đảm bảo giữ trọn hương vị đặc trưng và vệ sinh an toàn thực phẩm. Thích hợp cho cả bữa chính và bữa phụ."}
                    </Text>

                    {/* ===== QUANTITY SELECTOR ===== */}
                    <View style={styles.quantitySection}>
                        <Text style={styles.sectionLabel}>Số lượng</Text>
                        <View style={styles.qtyRow}>
                            <TouchableOpacity onPress={decrease} style={styles.qtyBtn}>
                                <Ionicons name="remove" size={24} color="#C62828" />
                            </TouchableOpacity>

                            <Text style={styles.qtyText}>{qty}</Text>

                            <TouchableOpacity onPress={increase} style={styles.qtyBtn}>
                                <Ionicons name="add" size={24} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </ScrollView>

            {/* ===== BOTTOM ACTION BAR ===== */}
            <View style={styles.bottomBar}>
                <View style={styles.priceContainer}>
                    <Text style={styles.totalLabel}>Tổng thanh toán</Text>
                    <Text style={styles.totalPrice}>
                        {(Number(product.price) * qty).toLocaleString()}đ
                    </Text>
                </View>

                <TouchableOpacity style={styles.addCartBtn} activeOpacity={0.8}>
                    <Text style={styles.addCartText}>Thêm vào giỏ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F8F9FA" },
    errorContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
    
    header: {
        backgroundColor: "#C62828",
        paddingTop: Platform.OS === "ios" ? 50 : 25,
        paddingBottom: 15,
        paddingHorizontal: 15,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        zIndex: 10,
    },
    headerTitle: { color: "#fff", fontSize: 18, fontWeight: "bold", flex: 1, textAlign: "center", marginHorizontal: 10 },
    backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },

    imageContainer: {
        backgroundColor: "#fff",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 5,
    },
    image: {
        width: width,
        height: width * 0.8,
        resizeMode: "cover",
    },

    infoBox: {
        padding: 20,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        marginTop: -30,
    },
    mainInfo: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start",
    },
    title: { fontSize: 22, fontWeight: "800", color: "#222", flex: 1, marginRight: 10 },
    price: { fontSize: 22, fontWeight: "800", color: "#C62828" },
    
    ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
    ratingText: { color: "#777", fontSize: 14 },
    
    divider: { height: 1, backgroundColor: "#EEE", marginVertical: 20 },
    
    sectionLabel: { fontSize: 16, fontWeight: "bold", color: "#333", marginBottom: 10 },
    desc: { fontSize: 15, color: "#555", lineHeight: 22 },

    quantitySection: { marginTop: 25 },
    qtyRow: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F1F3F5",
        alignSelf: "flex-start",
        borderRadius: 30,
        padding: 4,
    },
    qtyBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
    },
    qtyText: { fontSize: 18, fontWeight: "bold", marginHorizontal: 20, color: "#222" },

    bottomBar: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        backgroundColor: "#fff",
        flexDirection: "row",
        padding: 20,
        paddingBottom: Platform.OS === "ios" ? 35 : 20,
        borderTopWidth: 1,
        borderTopColor: "#EEE",
        alignItems: "center",
        justifyContent: "space-between",
    },
    priceContainer: { flex: 1 },
    totalLabel: { fontSize: 12, color: "#777", textTransform: "uppercase", marginBottom: 4 },
    totalPrice: { fontSize: 20, fontWeight: "800", color: "#222" },
    
    addCartBtn: {
        backgroundColor: "#C62828",
        paddingHorizontal: 25,
        paddingVertical: 15,
        borderRadius: 15,
        marginLeft: 20,
    },
    addCartText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});