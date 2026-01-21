import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type NotificationItem = {
  id: string;
  title: string;
  description: string;
  date: string;
};

const SAMPLE_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "Đơn hàng đã được giao",
    description: "Đơn hàng #12345 của bạn đã được giao thành công.",
    date: "02/12/2025",
  },
  {
    id: "2",
    title: "Khuyến mãi đặc biệt",
    description: "Giảm 20% cho tất cả đồng hồ thông minh hôm nay!",
    date: "01/12/2025",
  },
  {
    id: "3",
    title: "Cập nhật ứng dụng",
    description: "Phiên bản mới đã có sẵn với nhiều tính năng hấp dẫn.",
    date: "30/11/2025",
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thông báo</Text>
      <FlatList
        data={SAMPLE_NOTIFICATIONS}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Ionicons
              name="notifications-outline"
              size={28}
              color="#4f46e5"
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationDesc}>{item.description}</Text>
              <Text style={styles.notificationDate}>{item.date}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f7fa", paddingTop: 50 },
  title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginBottom: 20 },
  notificationCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    alignItems: "flex-start",
  },
  notificationTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  notificationDesc: { fontSize: 14, color: "#555", marginBottom: 4 },
  notificationDate: { fontSize: 12, color: "#aaa" },
});
