import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, Alert, ActivityIndicator, KeyboardAvoidingView, Platform 
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG } from "../../apiConfig"; 

export default function ResetPasswordScreen() {
  const router = useRouter();
  // Nhận userId được truyền từ màn hình OTP sang
  const { userId } = useLocalSearchParams(); 
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleReset = async () => {
    // 1. Kiểm tra nhập liệu
    if (!password || !confirmPassword) {
      return Alert.alert("Lỗi", "Vui lòng nhập đầy đủ mật khẩu mới.");
    }
    if (password.length < 6) {
      return Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự.");
    }
    if (password !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp.");
    }

    setLoading(true);
    try {
      console.log("Đang đặt lại mật khẩu cho UserId:", userId);

      // 2. Gọi API PUT để cập nhật mật khẩu mới
      // Ở đây dùng FormData vì Backend của bạn thường nhận [FromForm]
      const formData = new FormData();
      formData.append('Password', password);

      const response = await fetch(`${API_CONFIG.BASE_URL}/api/User/${userId}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        Alert.alert(
          "🎉 Thành công", 
          "Mật khẩu của bạn đã được thay đổi. Hãy đăng nhập lại!", 
          [{ text: "Đăng nhập ngay", onPress: () => router.replace('/(auth)/login') }]
        );
      } else {
        const errorData = await response.json().catch(() => ({}));
        Alert.alert("Lỗi", errorData.message || "Không thể cập nhật mật khẩu. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi Reset Password:", error);
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0A0A", "#000"]} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={styles.content}
        >
          <Text style={styles.title}>Mật khẩu mới</Text>
          <Text style={styles.subtitle}>Thiết lập mật khẩu mới để bảo mật tài khoản của bạn.</Text>

          <View style={styles.form}>
            {/* Ô nhập mật khẩu mới */}
            <View style={styles.inputBox}>
              <Feather name="lock" size={20} color="#444" />
              <TextInput 
                placeholder="Mật khẩu mới" 
                placeholderTextColor="#444" 
                secureTextEntry={!showPass}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                <Feather name={showPass ? "eye" : "eye-off"} size={20} color="#444" />
              </TouchableOpacity>
            </View>

            {/* Ô xác nhận mật khẩu */}
            <View style={[styles.inputBox, { marginTop: 20 }]}>
              <Feather name="shield" size={20} color="#444" />
              <TextInput 
                placeholder="Xác nhận mật khẩu" 
                placeholderTextColor="#444" 
                secureTextEntry={!showPass}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>

            {/* Nút lưu */}
            <TouchableOpacity 
              style={[styles.mainBtn, loading && { opacity: 0.7 }]} 
              onPress={handleReset} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.mainBtnText}>CẬP NHẬT MẬT KHẨU</Text>
              )}
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  safe: { flex: 1 },
  content: { flex: 1, paddingHorizontal: 30, paddingTop: 60 },
  title: { color: '#FFF', fontSize: 32, fontWeight: '800' },
  subtitle: { color: '#666', marginTop: 10, fontSize: 16 },
  form: { marginTop: 40 },
  inputBox: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#0A0A0A', 
    height: 65, 
    borderRadius: 15, 
    paddingHorizontal: 20, 
    borderWidth: 1, 
    borderColor: '#222' 
  },
  input: { flex: 1, marginLeft: 15, color: '#FFF', fontSize: 16 },
  mainBtn: { 
    backgroundColor: '#FFF', 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 40 
  },
  mainBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 }
});