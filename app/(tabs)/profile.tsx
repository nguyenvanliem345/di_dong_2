import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { API_CONFIG } from '../../apiConfig';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Hiệu ứng hiện trang dần dần
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();

    const loadUser = async () => {
      const userData = await AsyncStorage.getItem('user');
      if (userData) setUser(JSON.parse(userData));
    };
    loadUser();
  }, []);

  // Hàm thực hiện đăng xuất thực tế
  const performLogout = async () => {
    // Bước 1: Xóa sạch dữ liệu trong AsyncStorage
    await AsyncStorage.clear(); 
    
    // Bước 2: Ép buộc quay về Login và xóa lịch sử điều hướng
    router.replace('/(auth)/Login');
  };

  // Hàm xử lý nhấn nút đăng xuất kèm thông báo đa nền tảng
  const handleLogout = () => {
    if (Platform.OS === 'web') {
      // Trên trình duyệt (Chrome) dùng window.confirm để tránh bị chặn popup
      const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất khỏi DishDash không?");
      if (confirmed) {
        performLogout();
      }
    } else {
      // Trên điện thoại dùng Alert.alert mặc định của hệ thống
      Alert.alert(
        "Xác nhận thoát",
        "Bạn có chắc chắn muốn đăng xuất khỏi DishDash không?",
        [
          { text: "Hủy", style: "cancel" },
          { 
            text: "Đăng xuất", 
            style: "destructive", 
            onPress: performLogout 
          }
        ]
      );
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Thông tin người dùng */}
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          {user?.photo ? (
            <Image 
              source={{ uri: API_CONFIG.IMAGE_URL("users", user.photo) }} 
              style={styles.avatar} 
            />
          ) : (
            <Ionicons name="person-circle" size={100} color="#C62828" />
          )}
        </View>
        <Text style={styles.username}>{user?.username || 'Người dùng DishDash'}</Text>
        <Text style={styles.email}>{user?.email || 'Chưa cập nhật email'}</Text>
      </View>

      {/* Menu chức năng */}
      <View style={styles.menuContainer}>
        <TouchableOpacity style={styles.menuItem}>
          <Ionicons name="settings-outline" size={22} color="#fff" />
          <Text style={styles.menuText}>Cài đặt tài khoản</Text>
          <Ionicons name="chevron-forward" size={20} color="#666" />
        </TouchableOpacity>

        {/* NÚT ĐĂNG XUẤT */}
        <TouchableOpacity 
          style={[styles.menuItem, styles.logoutBtn]} 
          onPress={handleLogout}
        >
          <Ionicons name="log-out-outline" size={22} color="#FF5252" />
          <Text style={[styles.menuText, { color: '#FF5252', fontWeight: 'bold' }]}>
            Đăng xuất
          </Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 20 },
  header: { alignItems: 'center', marginTop: 60, marginBottom: 40 },
  avatarContainer: {
    padding: 5,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#C62828',
    marginBottom: 15,
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  username: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  email: { color: '#94a3b8', fontSize: 14, marginTop: 5 },
  menuContainer: { 
    width: '100%', 
    backgroundColor: 'rgba(30, 41, 59, 0.5)', 
    borderRadius: 20, 
    padding: 10 
  },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 18, 
    paddingHorizontal: 15,
    borderBottomWidth: 0.5, 
    borderBottomColor: 'rgba(255,255,255,0.1)' 
  },
  menuText: { flex: 1, color: 'white', fontSize: 16, marginLeft: 15 },
  logoutBtn: { borderBottomWidth: 0, marginTop: 10 }
});