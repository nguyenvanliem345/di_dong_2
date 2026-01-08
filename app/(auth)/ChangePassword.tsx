// import { Ionicons } from "@expo/vector-icons";
// import { LinearGradient } from "expo-linear-gradient";
// import { useEffect, useRef, useState } from "react";
// import {
//   ActivityIndicator,
//   Alert,
//   Animated,
//   Dimensions,
//   ImageBackground,
//   Pressable,
//   ScrollView,
//   StyleSheet,
//   Text,
//   TextInput,
//   View,
// } from "react-native";
// import { API_CONFIG } from "../../apiConfig";

// const { width, height } = Dimensions.get("window");

// interface ChangePasswordProps {
//   user: any; // Bắt buộc phải truyền user từ lúc Login thành công vào đây
//   onBack: () => void;
// }

// export default function ChangePassword({ user, onBack }: ChangePasswordProps) {
//   const [password, setPassword] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [loading, setLoading] = useState(false);

//   // Hiệu ứng khởi đầu
//   const fadeAnim = useRef(new Animated.Value(0)).current;
//   const slideAnim = useRef(new Animated.Value(30)).current;

//   useEffect(() => {
//     Animated.parallel([
//       Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
//       Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
//     ]).start();
//   }, []);

//   const handleChangePassword = async () => {
//     // 1. Kiểm tra đầu vào
//     if (!password || !confirm) {
//       Alert.alert("Lỗi", "Vui lòng nhập mật khẩu mới");
//       return;
//     }

//     if (password !== confirm) {
//       Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
//       return;
//     }

//     // 2. Kiểm tra thông tin người dùng (Bắt buộc phải có ID)
//     if (!user || !user.id) {
//       Alert.alert("Lỗi", "Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại.");
//       return;
//     }

//     try {
//       setLoading(true);

//       // 3. Gửi lệnh cập nhật đến Railway
//       // Đường dẫn: https://api-railway-production-0c51.up.railway.app/api/users/{id}
//       const response = await fetch(`${API_CONFIG.USERS}/${user.id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({
//           ...user,      // Giữ lại username, email, numphone, photo cũ
//           pass: password // Cập nhật mật khẩu mới vào cột 'pass'
//         }),
//       });

//       if (response.ok) {
//         Alert.alert("Thành công", "Mật khẩu của bạn đã được thay đổi!", [
//           { text: "Tuyệt vời", onPress: onBack },
//         ]);
//       } else {
//         const errorData = await response.json();
//         Alert.alert("Thất bại", errorData.message || "Server từ chối cập nhật mật khẩu");
//       }
//     } catch (error) {
//       console.error(error);
//       Alert.alert("Lỗi", "Không thể kết nối đến máy chủ Railway");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground
//         source={require("../assets/images/hinh-nen-anime-06.jpg")}
//         style={styles.backgroundImage}
//       >
//         {/* Lớp phủ sáng trắng để giao diện rõ ràng */}
//         <LinearGradient
//           colors={["rgba(255,255,255,0.2)", "rgba(240, 244, 255, 0.9)", "#f0f4ff"]}
//           style={styles.gradientOverlay}
//         />

//         <ScrollView contentContainerStyle={styles.scrollContent}>
//           <Animated.View style={[styles.headerContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
//             <Pressable onPress={onBack} style={styles.backBtn}>
//                <Ionicons name="chevron-back" size={28} color="#4f46e5" />
//             </Pressable>
//             <Text style={styles.welcomeText}>Bảo mật</Text>
//             <Text style={styles.brandText}>ĐỔI <Text style={styles.cinemaText}>MẬT KHẨU</Text></Text>
//           </Animated.View>

//           <Animated.View style={[styles.formContainer, { opacity: fadeAnim }]}>
            
//             {/* Input Mật khẩu mới */}
//             <View style={styles.inputWrapper}>
//               <Text style={styles.label}>Mật khẩu mới</Text>
//               <View style={styles.inputInner}>
//                 <Ionicons name="key-outline" size={20} color="#4f46e5" />
//                 <TextInput
//                   placeholder="Nhập mật khẩu bạn muốn đổi"
//                   placeholderTextColor="#94a3b8"
//                   style={styles.textInput}
//                   secureTextEntry={true}
//                   // Chặn bảng Strong Password của iPhone
//                   textContentType="oneTimeCode" 
//                   autoCorrect={false}
//                   value={password}
//                   onChangeText={setPassword}
//                 />
//               </View>
//             </View>

//             {/* Input Xác nhận */}
//             <View style={styles.inputWrapper}>
//               <Text style={styles.label}>Xác nhận mật khẩu</Text>
//               <View style={styles.inputInner}>
//                 <Ionicons name="checkmark-shield-outline" size={20} color="#4f46e5" />
//                 <TextInput
//                   placeholder="Nhập lại mật khẩu phía trên"
//                   placeholderTextColor="#94a3b8"
//                   style={styles.textInput}
//                   secureTextEntry={true}
//                   textContentType="oneTimeCode"
//                   autoCorrect={false}
//                   value={confirm}
//                   onChangeText={setConfirm}
//                 />
//               </View>
//             </View>

//             {/* Nút bấm */}
//             <Pressable onPress={handleChangePassword} disabled={loading} style={{ marginTop: 20 }}>
//               <LinearGradient colors={["#818cf8", "#4f46e5"]} style={styles.submitBtn}>
//                 {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitBtnText}>Xác nhận đổi mật khẩu</Text>}
//               </LinearGradient>
//             </Pressable>

//             <Pressable onPress={onBack} style={styles.footerLink}>
//               <Text style={styles.footerText}>Hủy bỏ và quay lại</Text>
//             </Pressable>
//           </Animated.View>
//         </ScrollView>
//       </ImageBackground>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1 },
//   backgroundImage: { flex: 1 },
//   gradientOverlay: { ...StyleSheet.absoluteFillObject },
//   scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },
//   headerContainer: { marginBottom: 30 },
//   backBtn: { marginBottom: 15, width: 45, height: 45, backgroundColor: '#fff', borderRadius: 15, justifyContent: 'center', alignItems: 'center', elevation: 4, shadowOpacity: 0.1 },
//   welcomeText: { fontSize: 16, color: "#475569", fontWeight: "600" },
//   brandText: { fontSize: 34, fontWeight: "900", color: "#1e293b", letterSpacing: -1 },
//   cinemaText: { color: "#4f46e5" },
//   formContainer: { gap: 18 },
//   inputWrapper: { gap: 8 },
//   label: { color: "#334155", fontSize: 14, fontWeight: "700", marginLeft: 4 },
//   inputInner: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     paddingHorizontal: 18,
//     height: 64,
//     borderWidth: 1.5,
//     borderColor: "#e2e8f0",
//   },
//   textInput: { flex: 1, marginLeft: 12, color: "#1e293b", fontSize: 16 },
//   submitBtn: { height: 64, borderRadius: 20, justifyContent: "center", alignItems: "center", elevation: 8, shadowColor: "#4f46e5", shadowOpacity: 0.4, shadowRadius: 12 },
//   submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
//   footerLink: { marginTop: 20, alignItems: "center" },
//   footerText: { color: "#64748b", fontSize: 15, fontWeight: "600" },
// });