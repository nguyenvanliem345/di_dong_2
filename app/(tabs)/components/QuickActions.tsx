import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { styles } from './styles';

const ActionItem = ({ label, img }: { label: string, img: any }) => (
  <TouchableOpacity style={styles.actionItem}>
    <View style={styles.actionIconContainer}>
      <Image source={img} style={styles.actionImg} />
    </View>
    <Text style={styles.actionLabel}>{label}</Text>
  </TouchableOpacity>
);

export const QuickActions = () => (
  <View style={styles.quickActions}>
    <ActionItem label="Flash deals" img={require("../../../assets/images/flashsale.png")} />
    <ActionItem label="Mini game" img={require("../../../assets/images/lucky.png")} />
    <ActionItem label="Hội viên" img={require("../../../assets/images/icon1.png")} />
    <ActionItem label="Boxchat" img={require("../../../assets/images/lienhe.png")} />
  </View>
);