import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  // Vì login hiện tại nằm trong (auth)
  initialRouteName: "(auth)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        {/* 1. Nhóm Auth: Chứa Login, Register, ForgotPassword */}
        <Stack.Screen
          name="(auth)"
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />

        {/* 2. Nhóm trang chính (Tabs) */}
        <Stack.Screen
          name="(tabs)"
          options={{
            animation: "fade",
            headerShown: false,
          }}
        />

        {/* 3. Màn hình Chỉnh sửa hồ sơ (Để ngoài tabs để ẩn TabBar) */}
        <Stack.Screen
          name="edit-profile"
          options={{
            presentation: "modal",
            animation: "slide_from_bottom",
            headerShown: true,
            title: "Chỉnh sửa hồ sơ",
          }}
        />

        {/* 4. Màn hình thông báo lỗi (Nếu có file +not-found.tsx) */}
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
