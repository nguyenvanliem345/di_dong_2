import { Dimensions, Platform, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
export const APP_WIDTH = width > 500 ? 414 : width;

export const styles = StyleSheet.create({
  // Header DishDash Đỏ chuẩn
  redHeader: { 
    backgroundColor: '#C62828', 
    paddingTop: Platform.OS === 'ios' ? 50 : 20, 
    paddingBottom: 12, 
    paddingHorizontal: 15 
  },
  headerTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  headerTitle: { color: '#fff', fontSize: 20, fontWeight: 'bold', letterSpacing: 0.5 },
  headerRightButtons: { flexDirection: 'row', gap: 8 },
  dotMenu: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
  closeBtn: { backgroundColor: 'rgba(255,255,255,0.2)', paddingHorizontal: 10, paddingVertical: 2, borderRadius: 12 },
  whiteBold: { color: '#fff', fontWeight: 'bold', fontSize: 16 },

  // Quick Actions (Icon tròn, chữ mảnh dưới)
  quickActions: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 20, backgroundColor: '#fff' },
  actionItem: { alignItems: 'center' },
  actionIconContainer: { 
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#fff', 
    elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5,
    justifyContent: 'center', alignItems: 'center' 
  },
  actionImg: { width: 30, height: 30 },
  actionLabel: { fontSize: 12, marginTop: 8, color: '#333', fontWeight: '500' },

  // Food Card (Thiết kế bo góc hiện đại)
  foodGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 10, justifyContent: "space-between" },
// Container cho ScrollView ngang
  foodHorizontalList: {
    paddingLeft: 15, // Lề trái để card đầu tiên không dính sát mép
    paddingRight: 15,
    paddingBottom: 10,
  },
  
  // Sửa lại foodCard để chạy ngang
  foodCard: { 
    // Hiển thị ~2 card: (APP_WIDTH / 2.2) giúp hiện 2 card và 1 phần card thứ 3
    width: APP_WIDTH / 2.2, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    marginRight: 12, // Khoảng cách giữa các card
    marginBottom: 5, 
    elevation: 3, 
    shadowOpacity: 0.08, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  
  foodImg: { 
    width: '100%', 
    height: 120, // Giảm chiều cao một chút cho cân đối khi nằm ngang
    borderTopLeftRadius: 15, 
    borderTopRightRadius: 15 
  },
  badge: { 
    position: 'absolute', top: 10, left: 10, backgroundColor: 'rgba(0,0,0,0.6)', 
    paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  foodInfo: { padding: 12 },
  foodName: { fontWeight: 'bold', fontSize: 14, color: '#222' },
  foodSub: { fontSize: 11, color: '#888', marginVertical: 4 },
  priceContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 },
  price: { color: '#C62828', fontWeight: 'bold', fontSize: 15 },
  oldPrice: { textDecorationLine: 'line-through', color: '#BBB', fontSize: 11, marginLeft: 5 },

  // Section Header chung
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, alignItems: 'center' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  seeMore: { color: '#C62828', fontSize: 12, fontWeight: '600' },
});