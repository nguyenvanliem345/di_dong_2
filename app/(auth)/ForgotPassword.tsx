import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Animated,
    Image,
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { API_CONFIG } from "../../apiConfig";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [currentUserData, setCurrentUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // State lưu URI ảnh mới nếu người dùng chọn thay đổi
  const [selectedImageUri, setSelectedImageUri] = useState<string | null>(null);

  const animValue = useRef(new Animated.Value(0)).current;

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert("Lỗi", "Bạn cần cấp quyền truy cập thư viện ảnh");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImageUri(result.assets[0].uri);
    }
  };

  const handleCheckEmail = async () => {
    if (!email) return Alert.alert("Lỗi", "Vui lòng nhập email");
    try {
      setLoading(true);
      const response = await fetch(API_CONFIG.USERS);
      const data = await response.json();
      const userList = data.content || data;
      const user = userList.find((u: any) => u.email === email.trim());

      if (user) {
        setIsEmailVerified(true);
        setCurrentUserData(user);
        Animated.timing(animValue, { toValue: 1, duration: 500, useNativeDriver: true }).start();
      } else {
        Alert.alert("Lỗi", "Email không tồn tại.");
      }
    } catch (error) {
      Alert.alert("Lỗi", "Kết nối máy chủ thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return Alert.alert("Lỗi", "Mật khẩu xác nhận không khớp");
    }

    try {
      setLoading(true);

      // SỬA TẠI ĐÂY: Dùng FormData để khớp với @PutMapping và MultipartFile của Java
      const formData = new FormData();
      
      // Thêm thông tin User (Phải khớp chính xác tên field trong Entity Java)
      formData.append("username", currentUserData.username);
      formData.append("email", currentUserData.email);
      formData.append("numphone", currentUserData.numphone);
      formData.append("pass", newPassword);

      // Xử lý ảnh: Nếu có chọn ảnh mới thì gửi file mới, nếu không Backend sẽ giữ ảnh cũ hoặc lỗi tùy logic Java
      if (selectedImageUri) {
        const uri = selectedImageUri;
        const fileName = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(fileName || '');
        const type = match ? `image/${match[1]}` : `image/jpeg`;

        formData.append('file', {
          uri: uri,
          name: fileName,
          type: type,
        } as any);
      }

      const response = await fetch(`${API_CONFIG.USERS}/${currentUserData.id}`, {
        method: "PUT",
        headers: {
          // QUAN TRỌNG: Không set Content-Type khi dùng FormData
          'Accept': 'application/json',
        },
        body: formData,
      });

      if (response.ok) {
        Alert.alert("Thành công", "Mật khẩu đã được cập nhật!", [
          { text: "Đăng nhập", onPress: () => router.replace("/(auth)/Login") },
        ]);
      } else {
        const errorText = await response.text();
        Alert.alert("Lỗi Server", errorText);
      }
    } catch (error) {
      Alert.alert("Lỗi", "Cập nhật thất bại.");
    } finally {
      setLoading(false);
    }
  };

  const photoUrl = selectedImageUri 
    ? selectedImageUri 
    : (currentUserData?.photo 
        ? `${API_CONFIG.BASE_URL}/image/users/${currentUserData.photo}` 
        : `https://ui-avatars.com/api/?name=${currentUserData?.username || 'User'}&background=C62828&color=fff`);

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
      <ImageBackground source={require("../../assets/images/unnamed.jpg")} style={styles.backgroundImage}>
        <LinearGradient colors={["rgba(0,0,0,0.6)", "#000"]} style={styles.gradientOverlay} />
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <Text style={styles.brandText}>DISH<Text style={styles.highlightText}>DASH</Text></Text>

          <View style={styles.formContainer}>
            {isEmailVerified && (
              <Animated.View style={{ opacity: animValue, alignItems: 'center', marginBottom: 20 }}>
                <Pressable onPress={pickImage} style={styles.photoWrapper}>
                  <Image source={{ uri: photoUrl }} style={styles.profilePhoto} />
                  <View style={styles.cameraIcon}>
                    <Ionicons name="camera" size={18} color="#fff" />
                  </View>
                </Pressable>
                <Text style={styles.usernameText}>{currentUserData?.username}</Text>
                <Text style={styles.hintText}>Nhấn vào ảnh để thay đổi</Text>
              </Animated.View>
            )}

            <View style={styles.inputWrapper}>
              <Text style={styles.label}>Email tài khoản</Text>
              <View style={styles.inputInner}>
                <Ionicons name="mail-outline" size={20} color="rgba(255,255,255,0.6)" />
                <TextInput
                  style={[styles.textInput, isEmailVerified && styles.disabledInput]}
                  value={email}
                  onChangeText={setEmail}
                  editable={!isEmailVerified}
                  placeholder="Nhập email..."
                  placeholderTextColor="#94a3b8"
                  autoCapitalize="none"
                />
              </View>
            </View>

            {!isEmailVerified ? (
              <Pressable onPress={handleCheckEmail} disabled={loading}>
                <LinearGradient colors={["#E53935", "#C62828"]} style={styles.btn}>
                  {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Xác thực Email</Text>}
                </LinearGradient>
              </Pressable>
            ) : (
              <Animated.View style={{ opacity: animValue, gap: 15 }}>
                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Mật khẩu mới</Text>
                  <View style={styles.inputInner}>
                    <Ionicons name="lock-closed-outline" size={20} color="rgba(255,255,255,0.6)" />
                    <TextInput
                      placeholder="••••••••"
                      secureTextEntry={!showNewPassword}
                      placeholderTextColor="#94a3b8"
                      style={styles.textInput}
                      value={newPassword}
                      onChangeText={setNewPassword}
                    />
                    <Pressable onPress={() => setShowNewPassword(!showNewPassword)}>
                      <Ionicons name={showNewPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#fff" />
                    </Pressable>
                  </View>
                </View>

                <View style={styles.inputWrapper}>
                  <Text style={styles.label}>Xác nhận mật khẩu</Text>
                  <View style={styles.inputInner}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="rgba(255,255,255,0.6)" />
                    <TextInput
                      placeholder="••••••••"
                      secureTextEntry={!showConfirmPassword}
                      placeholderTextColor="#94a3b8"
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons name={showConfirmPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#fff" />
                    </Pressable>
                  </View>
                </View>

                <Pressable onPress={handleUpdatePassword} disabled={loading}>
                  <LinearGradient colors={["#4CAF50", "#2E7D32"]} style={styles.btn}>
                    {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Cập nhật mật khẩu</Text>}
                  </LinearGradient>
                </Pressable>
              </Animated.View>
            )}

            <Pressable onPress={() => router.back()} style={{ marginTop: 10 }}>
              <Text style={styles.backLink}>Quay lại Đăng nhập</Text>
            </Pressable>
          </View>
        </ScrollView>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  backgroundImage: { flex: 1 },
  gradientOverlay: { ...StyleSheet.absoluteFillObject },
  scrollContent: { padding: 24, flexGrow: 1, justifyContent: 'center' },
  brandText: { fontSize: 32, fontWeight: "900", color: "#fff", textAlign: 'center', marginBottom: 20 },
  highlightText: { color: "#C62828" },
  formContainer: { gap: 15, backgroundColor: "rgba(255,255,255,0.15)", padding: 20, borderRadius: 25, borderWidth: 1, borderColor: "rgba(255,255,255,0.1)" },
  photoWrapper: { position: 'relative' },
  profilePhoto: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#C62828', backgroundColor: 'rgba(255,255,255,0.1)' },
  cameraIcon: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#C62828', borderRadius: 15, padding: 6, elevation: 5 },
  usernameText: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  hintText: { color: 'rgba(255,255,255,0.5)', fontSize: 12, marginTop: 4 },
  inputWrapper: { gap: 8 },
  label: { color: "#fff", fontSize: 14, fontWeight: "600", marginLeft: 5 },
  inputInner: { flexDirection: 'row', alignItems: 'center', backgroundColor: "rgba(0,0,0,0.3)", borderRadius: 15, height: 58, paddingHorizontal: 15, borderWidth: 1, borderColor: "rgba(255,255,255,0.2)" },
  textInput: { flex: 1, color: "#fff", fontSize: 16, marginLeft: 10 },
  disabledInput: { opacity: 0.5 },
  btn: { height: 58, borderRadius: 15, justifyContent: "center", alignItems: "center", marginTop: 10 },
  btnText: { color: "#fff", fontSize: 17, fontWeight: "bold" },
  backLink: { color: "#fff", textAlign: 'center', opacity: 0.8, fontSize: 15 }
});