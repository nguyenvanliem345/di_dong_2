import { Link } from "expo-router";
import { ArrowRight, Coffee } from "lucide-react-native";
import {
  Dimensions,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { height, width } = Dimensions.get("window");

// Màu sắc cao cấp
const COLOR_ACCENT = "#C57A36";       // Vàng đồng sang trọng
const COLOR_BG = "#0B0B0B";           // Đen carbon
const COLOR_TEXT = "#F5F5F5";
const COLOR_SUB = "rgba(255,255,255,0.6)";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        
        {/* HERO */}
        <ImageBackground
          source={require("@/assets/images/anhcf.png")}
          style={styles.hero}
          resizeMode="cover"
        >
          <View style={styles.overlay} />

          <View style={styles.heroContent}>
            <Coffee size={56} color={COLOR_TEXT} />
            <Text style={styles.heroTitle}>THE THIRD WAVE</Text>
            <Text style={styles.heroSubtitle}>
              Hành trình trải nghiệm cà phê thủ công chuẩn mực.
            </Text>
          </View>
        </ImageBackground>

        {/* CONTENT */}
        <View style={styles.content}>

          {/* INTRO */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>TRẢI NGHIỆM SỐ</Text>
            <Text style={styles.sectionText}>
              Đăng nhập để khám phá menu, đặt trước, tích điểm và nhận ưu đãi
              dành riêng cho thành viên.
            </Text>
          </View>

          {/* ACTION BUTTONS */}
          <View style={styles.actionBox}>
            
            {/* Login */}
            <Link href="/login" asChild>
              <TouchableOpacity style={styles.loginBtn}>
                <Text style={styles.loginText}>BẮT ĐẦU NGAY</Text>
                <ArrowRight size={22} color="#000" />
              </TouchableOpacity>
            </Link>

            {/* Register */}
            <Link href="/register" asChild>
              <TouchableOpacity style={styles.regBtn}>
                <Text style={styles.regText}>TẠO TÀI KHOẢN</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* CONTACT */}
          <View style={styles.footer}>
            <Text style={styles.footerTitle}>LIÊN HỆ</Text>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>EMAIL</Text>
              <Text style={styles.rowValue}>contact@thethirdwave.com</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.rowLabel}>HOTLINE</Text>
              <Text style={styles.rowValue}>+84 123 456 789</Text>
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLOR_BG,
  },

  scroll: {
    paddingBottom: 80,
  },

  // HERO
  hero: {
    height: height * 0.65, // Cao hơn cho màn hình 12 Pro Max
    width: "100%",
    justifyContent: "flex-end",
    paddingBottom: 60,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  heroContent: {
    paddingHorizontal: 32,
    gap: 12,
  },
  heroTitle: {
    fontSize: 46,
    fontWeight: "800",
    color: COLOR_TEXT,
    letterSpacing: 2,
  },
  heroSubtitle: {
    fontSize: 18,
    fontWeight: "300",
    color: COLOR_SUB,
    lineHeight: 26,
  },

  // MAIN CONTENT
  content: {
    paddingHorizontal: 26,
    paddingTop: 40,
    gap: 48,
  },

  // INTRO
  section: { gap: 14 },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: COLOR_ACCENT,
    letterSpacing: 1.5,
  },
  sectionText: {
    fontSize: 17,
    color: COLOR_TEXT,
    lineHeight: 26,
    opacity: 0.9,
  },

  // ACTION BUTTONS
  actionBox: { gap: 16 },
  loginBtn: {
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: COLOR_ACCENT,
    paddingVertical: 18,
    borderRadius: 10,
    alignItems: "center",
    gap: 10,
  },
  loginText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#000",
    letterSpacing: 1,
  },
  regBtn: {
    paddingVertical: 18,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#3D3D3D",
    alignItems: "center",
  },
  regText: {
    color: COLOR_TEXT,
    fontWeight: "600",
    fontSize: 16,
    letterSpacing: 1,
  },

  // FOOTER
  footer: {
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#292929",
    gap: 18,
  },
  footerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLOR_ACCENT,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#222", 
  },
  rowLabel: {
    color: "#555",
    fontWeight: "600",
    fontSize: 14,
  },
  rowValue: {
    color: COLOR_TEXT,
    fontSize: 14,
  },
});
