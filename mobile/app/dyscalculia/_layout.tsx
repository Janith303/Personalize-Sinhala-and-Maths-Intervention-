// Import only the 3 weights used (the package index would bundle all 9).
import { NotoSansSinhala_400Regular } from '@expo-google-fonts/noto-sans-sinhala/400Regular';
import { NotoSansSinhala_500Medium } from '@expo-google-fonts/noto-sans-sinhala/500Medium';
import { NotoSansSinhala_700Bold } from '@expo-google-fonts/noto-sans-sinhala/700Bold';
import { useFonts } from 'expo-font';
import { Stack, useNavigation } from 'expo-router';
import { useLayoutEffect } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../constants/dyscalculia/theme';
import { DyscalculiaProvider } from '../../contexts/dyscalculia/DyscalculiaContext';

export default function DyscalculiaLayout() {
  const [fontsLoaded] = useFonts({ NotoSansSinhala_400Regular, NotoSansSinhala_500Medium, NotoSansSinhala_700Bold });

  // Hide the root stack's header for this module (the module has its own blue top bar).
  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: colors.primary }}>
      {fontsLoaded ? (
        <DyscalculiaProvider>
          <Stack screenOptions={{ headerShown: false, animation: 'fade', contentStyle: { backgroundColor: colors.page } }} />
        </DyscalculiaProvider>
      ) : (
        <View className="flex-1 items-center justify-center" style={{ backgroundColor: colors.page }}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      )}
    </SafeAreaView>
  );
}
