import { Dimensions, Platform, StyleSheet } from 'react-native';

const { width } = Dimensions.get('window');
export const APP_WIDTH = width > 500 ? 414 : width;
export const PRIMARY_COLOR = '#C62828'; // Đỏ chủ đạo
export const BACKGROUND_COLOR = '#F8F9FA'; // Nền xám nhạt hiện đại

export const globalStyles = StyleSheet.create({
    shadow: {
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 4 } },
            android: { elevation: 4 }
        })
    }
});