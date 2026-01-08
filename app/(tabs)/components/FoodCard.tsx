import { Heart } from "lucide-react-native";
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { API_CONFIG } from "../../../apiConfig";
import { styles } from './styles';

export const FoodCard = ({ item }: { item: any }) => (
  <TouchableOpacity style={styles.foodCard} activeOpacity={0.9}>
    <Image 
      source={{ uri: API_CONFIG.IMAGE_URL("products", item.photo) }} 
      style={styles.foodImg} 
    />
    <View style={styles.badge}>
      <Text style={styles.badgeText}>Giảm 4%</Text>
    </View>
    <View style={styles.foodInfo}>
      <Text style={styles.foodName} numberOfLines={1}>{item.name || item.title}</Text>
      <Text style={styles.foodSub}>⭐ 4.8 (1.2k)</Text>
      <View style={styles.priceContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
           <Text style={styles.price}>{Number(item.price || 0).toLocaleString()}đ</Text>
        </View>
        <Heart size={18} color="#C62828" />
      </View>
    </View>
  </TouchableOpacity>
);