import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import WishlistScreen from "./Wishlist";

const COLORS = {
  white: "#FFFFFF",
  dark: "#111827",
  gray: "#6B7280",
  red: "#FF3B30",
  lightGray: "#F3F4F6",
};

export default function AppHeader({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (v: string) => void;
}) {
  const router = useRouter();
  const [isSearching, setIsSearching] = useState(false);
  const [showWishlist, setShowWishlist] = useState(false);

  const toggleSearch = () => {
    setIsSearching(!isSearching);
    setSearchQuery("");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {!isSearching ? (
        <View style={styles.headerRow}>
          <Text style={styles.logo}>HEDIO</Text>

          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.iconBtn} onPress={toggleSearch}>
              <Feather name="search" size={20} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => setShowWishlist(true)}
            >
              <Feather name="heart" size={20} color={COLORS.red} />
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.iconBtn, styles.cartBtn]}
              onPress={() => router.push("/cart")}
            >
              <Feather name="shopping-bag" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View style={styles.searchContainer}>
          <TextInput
            autoFocus
            placeholder="Tìm sản phẩm..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity onPress={toggleSearch}>
            <Text style={{ color: COLORS.red }}>Hủy</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={showWishlist}
        animationType="slide"
        transparent
        onRequestClose={() => setShowWishlist(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <WishlistScreen onClose={() => setShowWishlist(false)} />
          </View>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowWishlist(false)}
          />
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { backgroundColor: COLORS.white, zIndex: 10 },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
  },

  logo: { fontWeight: "900", fontSize: 18 },

  actionRow: { flexDirection: "row", gap: 10 },

  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.lightGray,
    justifyContent: "center",
    alignItems: "center",
  },

  cartBtn: { backgroundColor: COLORS.dark },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    gap: 10,
  },

  searchInput: {
    flex: 1,
    backgroundColor: COLORS.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 40,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },

  modalContent: {
    height: "90%",
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
});
