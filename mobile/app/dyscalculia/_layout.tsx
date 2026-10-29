// Dyscalculia module: shared state for all its screens. Fonts and the hidden header come from the root layout.
import { Stack } from 'expo-router';

import { DyscalculiaProvider } from '@/contexts/dyscalculia/DyscalculiaContext';

export default function DyscalculiaLayout() {
  return (
    <DyscalculiaProvider>
      <Stack screenOptions={{ headerShown: false, animation: 'fade' }} />
    </DyscalculiaProvider>
  );
}
