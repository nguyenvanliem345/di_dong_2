import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Platform } from 'react-native';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#C62828', 
        tabBarInactiveTintColor: '#94a3b8',
        tabBarStyle: { 
            backgroundColor: '#ffffff', // Nên dùng nền trắng cho sạch sẽ
            height: Platform.OS === 'ios' ? 90 : 70,
            paddingBottom: Platform.OS === 'ios' ? 30 : 10,
        } 
    }}>
      <Tabs.Screen name="index" options={{ title: 'Trang chủ', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="menu" options={{ title: 'Menu', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "restaurant" : "restaurant-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="orders" options={{ title: 'Đơn hàng', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "receipt" : "receipt-outline"} size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Cá nhân', tabBarIcon: ({ color, focused }) => <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} /> }} />

      {/* ẨN CÁC COMPONENT PHỤ KHỎI THANH ĐIỀU HƯỚNG DƯỚI CÙNG */}
      <Tabs.Screen name="components/ProductDetailScreen" options={{ href: null }} />
      <Tabs.Screen name="components/ChatScreen" options={{ href: null }} />
      <Tabs.Screen name="components/MenuDiscovery" options={{ href: null }} />
    </Tabs>
  );
}