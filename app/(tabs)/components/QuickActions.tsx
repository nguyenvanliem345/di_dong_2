import { useRouter } from 'expo-router';
import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
// Đảm bảo đường dẫn này trỏ đúng đến file styles bên dưới
import { styles } from './styles';

const ActionItem = ({ label, img, onPress }: { label: string, img: any, onPress?: () => void }) => (
    <TouchableOpacity 
        style={styles.actionItem} 
        onPress={onPress} 
        activeOpacity={0.7}
    >
        <View style={styles.actionIconContainer}>
            <Image source={img} style={styles.actionImg} />
        </View>
        <Text style={styles.actionLabel} numberOfLines={1}>{label}</Text>
    </TouchableOpacity>
);

export const QuickActions = () => {
    const router = useRouter();

    return (
        <View style={styles.container}>
            <View style={styles.quickActionsRow}>
                <ActionItem 
                    label="Flash deals" 
                    img={require("../../../assets/images/flashsale.png")} 
                />
                <ActionItem 
                    label="Mini game" 
                    img={require("../../../assets/images/lucky.png")} 
                />
                <ActionItem 
                    label="Hội viên" 
                    img={require("../../../assets/images/icon1.png")} 
                />
                <ActionItem 
                    label="Boxchat" 
                    img={require("../../../assets/images/lienhe.png")} 
                    onPress={() => router.push('/(tabs)/components/ChatScreen')} 
                />
            </View>
        </View>
    );
};