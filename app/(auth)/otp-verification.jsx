import React, { useState, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, 
  SafeAreaView, ActivityIndicator, Alert, KeyboardAvoidingView, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { API_CONFIG } from "../../apiConfig"; 

export default function OTPVerificationScreen() {
  const router = useRouter();
  // Nhận email và userId truyền từ màn hình forgot-password sang
  const { email, userId } = useLocalSearchParams();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);
  const inputs = useRef([]);

  // Xử lý khi nhập số vào ô OTP
  const handleOtpChange = (value, index) => {
    const cleanValue = value.replace(/[^0-9]/g, '');
    const newOtp = [...otp];
    newOtp[index] = cleanValue;
    setOtp(newOtp);

    // Tự động nhảy sang ô tiếp theo
    if (cleanValue && index < 3) {
      inputs.current[index + 1].focus();
    }
  };

  // Xử lý phím xóa (Backspace)
  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputs.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    const fullOtp = otp.join('');
    if (fullOtp.length < 4) {
      return Alert.alert("Lỗi", "Vui lòng nhập đủ 4 số mã OTP.");
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/User/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: email, 
          otp: fullOtp 
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", "Mã xác thực chính xác!", [
          {
            text: "Tiếp tục",
            onPress: () => {
              // Chuyển hướng sang reset-password (đã sửa tên file thành viết thường)
              router.push({
                pathname: '/(auth)/reset-password', 
                params: { userId: userId } 
              });
            }
          }
        ]);
      } else {
        Alert.alert("Thất bại", result.message || "Mã OTP không đúng hoặc đã hết hạn.");
      }
    } catch (error) {
      Alert.alert("Lỗi kết nối", "Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#0A0A0A", "#000"]} style={StyleSheet.absoluteFillObject} />
      
      <SafeAreaView style={{ flex: 1 }}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"} 
          style={{ flex: 1 }}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>

          <View style={styles.content}>
            <Text style={styles.title}>Xác nhận OTP</Text>
            <Text style={styles.subtitle}>
              Mã xác thực gồm 4 số đã được gửi tới{"\n"}
              <Text style={{ color: '#FFF', fontWeight: 'bold' }}>{email}</Text>
            </Text>

            <View style={styles.otpRow}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputs.current[index] = ref)}
                  style={[
                    styles.otpInput, 
                    otp[index] ? styles.otpInputActive : null
                  ]}
                  keyboardType="number-pad"
                  maxLength={1}
                  value={digit}
                  onChangeText={(v) => handleOtpChange(v, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  placeholder="0"
                  placeholderTextColor="#222"
                />
              ))}
            </View>

            <TouchableOpacity 
              style={[styles.verifyBtn, loading && { opacity: 0.7 }]} 
              onPress={handleVerify} 
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#000" />
              ) : (
                <Text style={styles.verifyBtnText}>XÁC NHẬN MÃ</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity style={styles.resendBtn} onPress={() => router.back()}>
              <Text style={styles.resendText}>Sai email? <Text style={{color: '#FFF'}}>Quay lại</Text></Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  backBtn: { padding: 20 },
  content: { paddingHorizontal: 30, alignItems: 'center', marginTop: 20 },
  title: { color: '#FFF', fontSize: 28, fontWeight: 'bold' },
  subtitle: { color: '#666', textAlign: 'center', marginTop: 15, lineHeight: 22, fontSize: 15 },
  otpRow: { flexDirection: 'row', gap: 15, marginTop: 50 },
  otpInput: { 
    width: 65, 
    height: 75, 
    backgroundColor: '#0A0A0A', 
    borderRadius: 15, 
    borderWidth: 1, 
    borderColor: '#222', 
    color: '#FFF', 
    fontSize: 28, 
    textAlign: 'center',
    fontWeight: 'bold'
  },
  otpInputActive: {
    borderColor: '#FFF',
    backgroundColor: '#111'
  },
  verifyBtn: { 
    backgroundColor: '#FFF', 
    width: '100%', 
    height: 60, 
    borderRadius: 15, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: 50 
  },
  verifyBtnText: { color: '#000', fontWeight: '900', fontSize: 16, letterSpacing: 1 },
  resendBtn: { marginTop: 30 },
  resendText: { color: '#444', fontSize: 14 }
});