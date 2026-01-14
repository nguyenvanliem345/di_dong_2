import { Dimensions, Platform, StyleSheet } from 'react-native';
const { width } = Dimensions.get('window');
export const APP_WIDTH = width > 500 ? 414 : width;

export const styles = StyleSheet.create({
  // 1. THÊM CONTAINER ĐỂ HẾT LỖI GẠCH ĐỎ
  container: {
    paddingHorizontal: 15,
    marginVertical: 10,
  },

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

  // Quick Actions (Trắng hiện đại theo mẫu)
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  actionItem: {
    alignItems: 'center',
    width: '23%', 
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionImg: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
  },
  actionLabel: {
    color: '#333',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },

  // Food Card (Thiết kế bo góc hiện đại)
  foodGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 10, justifyContent: "space-between" },
  foodHorizontalList: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 10,
  },
  foodCard: { 
    width: APP_WIDTH / 2.2, 
    backgroundColor: '#fff', 
    borderRadius: 15, 
    marginRight: 12,
    marginBottom: 5, 
    elevation: 3, 
    shadowOpacity: 0.08, 
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  foodImg: { 
    width: '100%', 
    height: 120, 
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