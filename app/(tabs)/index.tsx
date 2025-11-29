import { Image, Platform, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { Link } from 'expo-router';
import { Coffee } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#FDE68A', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/coffe.jpg')} // ảnh quán cà phê
          style={styles.headerImage}
        />
      }
    >
      <ThemedView style={styles.titleContainer}>
        <Coffee color="#F59E0B" size={32} />
        <ThemedText type="title">Coffee Shop</ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Chào mừng đến với quán cà phê của chúng tôi!</ThemedText>
        <ThemedText>
          Thưởng thức cà phê ngon và không gian ấm cúng. 
          Nhấn vào bên dưới để đăng nhập hoặc đăng ký tài khoản.
        </ThemedText>
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <Link href="/login" asChild>
          <ThemedText style={styles.linkText}>
            → Đăng Nhập
          </ThemedText>
        </Link>

        {/* <Link href="/register" asChild>
          <ThemedText style={styles.linkText}>
            → Đăng Ký
          </ThemedText>
        </Link> */}
      </ThemedView>

      <ThemedView style={styles.stepContainer}>
        <ThemedText type="subtitle">Liên hệ</ThemedText>
        <ThemedText>Email: contact@coffeeshop.com</ThemedText>
        <ThemedText>Hotline: 0123 456 789</ThemedText>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  linkText: {
    color: '#F59E0B',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
});
