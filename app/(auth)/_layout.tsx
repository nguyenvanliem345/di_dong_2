import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack 
      screenOptions={{ 
        headerShown: false,
        animation: 'slide_from_right' // Thêm hiệu ứng chuyển cảnh cho mượt
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      
      {/* Kiểm tra xem file của bạn là forgotPassword hay forgotpassword */}
      <Stack.Screen name="forgot-Password" /> 
      
      {/* Trong ảnh trước mình thấy bạn có file resetpassword.jsx, 
          nếu chưa đổi tên thì phải để là resetpassword */}
      <Stack.Screen name="change-Password" />
    </Stack>
  );
}