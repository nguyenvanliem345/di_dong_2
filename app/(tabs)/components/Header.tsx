import { Bell, ShoppingCart } from "lucide-react-native";
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

export const Header = () => (
  <View style={styles.redHeader}>
    <View style={styles.headerTop}>
      <TouchableOpacity><Bell color="#fff" size={22} /></TouchableOpacity>
      <TouchableOpacity><ShoppingCart color="#fff" size={22} /></TouchableOpacity>
      <Text style={styles.headerTitle}>DishDash</Text>
      <View style={styles.headerRightButtons}>
        <TouchableOpacity style={styles.dotMenu}><Text style={styles.whiteBold}>···</Text></TouchableOpacity>
        <TouchableOpacity style={styles.closeBtn}><Text style={styles.whiteBold}>✕</Text></TouchableOpacity>
      </View>
    </View>
  </View>
);