import {
  NotoSansSinhala_400Regular,
  NotoSansSinhala_600SemiBold,
  NotoSansSinhala_700Bold,
  NotoSansSinhala_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/noto-sans-sinhala";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    NotoSansSinhala_400Regular,
    NotoSansSinhala_600SemiBold,
    NotoSansSinhala_700Bold,
    NotoSansSinhala_800ExtraBold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) SplashScreen.hideAsync();
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <>
      <StatusBar hidden />
      <Stack screenOptions={{ headerShown: false, animation: "fade" }} />
    </>
  );
}
