import { Bell, Search, ShoppingCart } from "lucide-react-native";
import React from "react";
import {
    Platform,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { PRIMARY_COLOR } from "./themeStyles";

// Thêm props: value (giá trị hiện tại) và onChange (hàm xử lý khi nhập)
export const Header = ({ value, onChangeText, onCartPress }: any) => (
  <View style={styles.container}>
    <View style={styles.topRow}>
      <TouchableOpacity>
        <Bell color="#fff" size={24} />
      </TouchableOpacity>

      <View style={styles.searchBar}>
        <Search color="#999" size={18} style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Tìm kiếm món ăn..."
          placeholderTextColor="#999"
          style={styles.input}
          value={value} // Gán giá trị từ state
          onChangeText={onChangeText} // Cập nhật state khi gõ
          returnKeyType="search"
          clearButtonMode="while-editing" // Hiện nút X xóa nhanh trên iOS
        />
      </View>

      <TouchableOpacity onPress={onCartPress}>
        <ShoppingCart color="#fff" size={24} />
      </TouchableOpacity>

      <View style={styles.rightGroup}>
        <TouchableOpacity style={styles.miniBtn}>
          <Text style={styles.btnText}>···</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.miniBtn}>
          <Text style={styles.btnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
// Styles giữ nguyên như cũ của bạn...
const styles = StyleSheet.create({
  container: {
    backgroundColor: PRIMARY_COLOR,
    paddingTop: Platform.OS === "ios" ? 50 : 20,
    paddingBottom: 15,
    paddingHorizontal: 15,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 12,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    paddingHorizontal: 12,
  },
  input: { flex: 1, fontSize: 14, color: "#333", paddingVertical: 0 },
  rightGroup: { flexDirection: "row", gap: 6 },
  miniBtn: {
    backgroundColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: 8,
    borderRadius: 10,
    justifyContent: "center",
  },
  btnText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
