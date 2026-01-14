import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Animated,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import { API_CONFIG } from '../../apiConfig';

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isEditNameModal, setEditNameModal] = useState(false);
  const [newName, setNewName] = useState('');
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, { 
      toValue: 1, 
      duration: 800, 
      useNativeDriver: true 
    }).start();

    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await AsyncStorage.getItem('user');
    if (userData) {
      const parsed = JSON.parse(userData);
      setUser(parsed);
      setNewName(parsed.username || '');
    }
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return;
    // Logic cập nhật tên (Ở đây mình cập nhật local, bạn hãy gọi thêm API update nhé)
    const updatedUser = { ...user, username: newName };
    await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setEditNameModal(false);
    Alert.alert("Thành công", "Đã cập nhật tên hiển thị!");
  };

  const performLogout = async () => {
    await AsyncStorage.clear(); 
    router.replace('/(auth)/Login' as any);
  };

  const handleLogout = () => {
    if (Platform.OS === 'web') {
      if (window.confirm("Bạn có chắc chắn muốn đăng xuất?")) performLogout();
    } else {
      Alert.alert("Xác nhận", "Bạn có chắc chắn muốn đăng xuất?", [
        { text: "Hủy", style: "cancel" },
        { text: "Đăng xuất", style: "destructive", onPress: performLogout }
      ]);
    }
  };

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* HEADER */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrapper}>
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
            <View style={styles.editBadge}>
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={styles.username}>{user?.username || 'Người dùng'}</Text>
          <Text style={styles.email}>{user?.email || 'Chưa cập nhật email'}</Text>
        </View>

        {/* THỐNG KÊ NHANH */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statCount}>12</Text>
            <Text style={styles.statLabel}>Đơn hàng</Text>
          </View>
          <View style={[styles.statBox, styles.statBorder]}>
            <Text style={styles.statCount}>5</Text>
            <Text style={styles.statLabel}>Yêu thích</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statCount}>200k</Text>
            <Text style={styles.statLabel}>Ví xu</Text>
          </View>
        </View>

        {/* MENU CHỨC NĂNG */}
        <Text style={styles.sectionTitle}>Tài khoản của tôi</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem} onPress={() => setEditNameModal(true)}>
            <View style={[styles.iconBox, { backgroundColor: '#3b82f6' }]}>
              <Ionicons name="person-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.menuText}>Thay đổi tên hiển thị</Text>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.menuItem} 
            onPress={() => router.push('/(auth)/ChangePassword' as any)}
          >
            <View style={[styles.iconBox, { backgroundColor: '#8b5cf6' }]}>
              <Ionicons name="lock-closed-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.menuText}>Đổi mật khẩu</Text>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#f59e0b' }]}>
              <Ionicons name="location-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.menuText}>Địa chỉ đã lưu</Text>
            <Ionicons name="chevron-forward" size={18} color="#475569" />
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Khác</Text>
        <View style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <View style={[styles.iconBox, { backgroundColor: '#10b981' }]}>
              <Ionicons name="help-buoy-outline" size={20} color="#fff" />
            </View>
            <Text style={styles.menuText}>Trung tâm trợ giúp</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleLogout}>
            <View style={[styles.iconBox, { backgroundColor: '#ef4444' }]}>
              <Ionicons name="log-out-outline" size={20} color="#fff" />
            </View>
            <Text style={[styles.menuText, { color: '#ef4444', fontWeight: '600' }]}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* MODAL ĐỔI TÊN */}
      <Modal visible={isEditNameModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Đổi tên hiển thị</Text>
            <TextInput 
              style={styles.input}
              value={newName}
              onChangeText={setNewName}
              placeholder="Nhập tên mới..."
              placeholderTextColor="#94a3b8"
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity onPress={() => setEditNameModal(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleUpdateName} style={styles.saveBtn}>
                <Text style={styles.saveText}>Cập nhật</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a' },
  header: { alignItems: 'center', marginTop: 50, marginBottom: 30 },
  avatarWrapper: { position: 'relative' },
  avatarContainer: {
    padding: 3,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#C62828',
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  editBadge: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    backgroundColor: '#C62828',
    borderRadius: 15,
    padding: 6,
    borderWidth: 2,
    borderColor: '#0f172a',
  },
  username: { color: 'white', fontSize: 24, fontWeight: 'bold', marginTop: 15 },
  email: { color: '#94a3b8', fontSize: 14, marginTop: 4 },
  
  statsRow: { 
    flexDirection: 'row', 
    backgroundColor: '#1e293b', 
    marginHorizontal: 20, 
    borderRadius: 15, 
    paddingVertical: 15,
    marginBottom: 30 
  },
  statBox: { flex: 1, alignItems: 'center' },
  statBorder: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#334155' },
  statCount: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  statLabel: { color: '#94a3b8', fontSize: 12, marginTop: 4 },

  sectionTitle: { color: '#64748b', fontSize: 13, fontWeight: 'bold', marginLeft: 25, marginBottom: 10, textTransform: 'uppercase' },
  menuContainer: { backgroundColor: '#1e293b', marginHorizontal: 20, borderRadius: 20, marginBottom: 25, overflow: 'hidden' },
  menuItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 15, 
    paddingHorizontal: 15,
    borderBottomWidth: 0.5, 
    borderBottomColor: '#334155' 
  },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  menuText: { flex: 1, color: 'white', fontSize: 15, marginLeft: 15 },

  // Modal styles
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '85%', backgroundColor: '#1e293b', borderRadius: 20, padding: 25 },
  modalTitle: { color: 'white', fontSize: 18, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#0f172a', color: 'white', padding: 15, borderRadius: 12, marginBottom: 20 },
  modalButtons: { flexDirection: 'row', gap: 10 },
  cancelBtn: { flex: 1, padding: 15, alignItems: 'center' },
  cancelText: { color: '#94a3b8', fontWeight: '600' },
  saveBtn: { flex: 1, backgroundColor: '#C62828', padding: 15, borderRadius: 12, alignItems: 'center' },
  saveText: { color: 'white', fontWeight: 'bold' },
});