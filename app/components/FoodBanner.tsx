import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BANNERS = [
  {
    id: 1,
    title: "Lẩu & Nướng Chuẩn Vị",
    subtitle: "Tươi ngon mỗi ngày – Giao nhanh tận nơi",
    tag: "HOT DEAL",
    image: require("../../assets/images/banners/banner1.png"),
  },
  {
    id: 2,
    title: "Đồ Ăn Kèm Hấp Dẫn",
    subtitle: "Ăn là ghiền Giá cực mềm",
    tag: "MUST TRY",
    image: require("../../assets/images/banners/banner.png"),
  },
];

export default function FoodBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  const banner = BANNERS[index];

  return (
    <View style={styles.wrapper}>
      <LinearGradient
        colors={["#8B0000", "#FF6347"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        <View style={styles.content}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{banner.tag}</Text>
          </View>

          <Text style={styles.title}>{banner.title}</Text>
          <Text style={styles.subTitle}>{banner.subtitle}</Text>

          <TouchableOpacity style={styles.btn}>
            <Text style={styles.btnText}>Đặt món ngay</Text>
            <Feather name="arrow-right" size={14} color="#000" />
          </TouchableOpacity>
        </View>

        <Image source={banner.image} style={styles.image} />
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
  },
  card: {
    height: 210,
    borderRadius: 24,
    padding: 20,
    overflow: "hidden",
  },
  content: {
    flex: 1,
    justifyContent: "center",
  },
  tag: {
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
  },
  tagText: {
    color: "#fff",
    fontSize: 9,
    fontWeight: "bold",
  },
  title: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 10,
  },
  subTitle: {
    color: "rgba(255,255,255,0.85)",
    fontSize: 12,
    marginTop: 6,
  },
  btn: {
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: "flex-start",
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  btnText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 11,
  },
  image: {
    width: 200,
    height: 200,
    position: "absolute",
    right: -30,
    bottom: -10,
    resizeMode: "contain",
  },
});
