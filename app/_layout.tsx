import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      // Lấy dữ liệu người dùng từ bộ nhớ
      const user = await AsyncStorage.getItem('user');
      const inAuthGroup = segments[0] === '(auth)';

      if (!user && !inAuthGroup) {
        // Nếu không có user và chưa ở nhóm Login -> Chuyển về Login
        router.replace('/(auth)/Login');
      } else if (user && inAuthGroup) {
        // Nếu đã có user mà đang ở Login -> Vào ngay App chính
        router.replace('/(tabs)');
      }
      setIsLoaded(true);
    };

    checkAuth();
  }, [segments]); // Lắng nghe sự thay đổi của đường dẫn

  if (!isLoaded) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}