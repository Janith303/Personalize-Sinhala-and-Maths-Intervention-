// Stage 1 intro: child's name and what will happen.
import { router } from 'expo-router';
import { useState } from 'react';
import { TextInput, View } from 'react-native';
import { MathBackground } from '../../../components/dyscalculia/MathBackground';
import { BigButton, Card, Mascot, SiText, TopBar } from '../../../components/dyscalculia/ui';
import { si } from '../../../constants/dyscalculia/strings.si';
import { colors, fonts } from '../../../constants/dyscalculia/theme';
import { useDyscalculia } from '../../../contexts/dyscalculia/DyscalculiaContext';

export default function ScreeningIntro() {
  const { childName, setChildName } = useDyscalculia();
  const [name, setName] = useState(childName);
  const [error, setError] = useState(false);

  const start = () => {
    if (!name.trim()) {
      setError(true);
      return;
    }
    setChildName(name.trim());
    router.replace('/dyscalculia/screening/play');
  };

  return (
    <View className="flex-1">
      <TopBar title={si.screening.introTitle} />
      <MathBackground>
        <View className="flex-1 flex-row items-center justify-center px-6">
          <Mascot size={110} />
          <Card className="ml-6" style={{ width: '55%' }}>
            <SiText weight="bold" style={{ fontSize: 19, marginBottom: 8 }}>
              {si.screening.askName}
            </SiText>
            <TextInput
              value={name}
              onChangeText={(t) => {
                setName(t);
                setError(false);
              }}
              placeholder={si.screening.namePlaceholder}
              placeholderTextColor={colors.primarySoft}
              accessibilityLabel={si.screening.askName}
              className="rounded-2xl px-4 py-2"
              style={{
                fontFamily: fonts.medium,
                fontSize: 18,
                color: colors.ink,
                backgroundColor: colors.page,
                borderWidth: 2,
                borderColor: error ? colors.red : colors.border,
              }}
            />
            {error ? (
              <SiText style={{ color: colors.red, fontSize: 13, marginTop: 4 }}>{si.screening.nameRequired}</SiText>
            ) : null}
            <SiText style={{ fontSize: 15, marginTop: 12 }}>{si.screening.explain}</SiText>
            <SiText style={{ fontSize: 13, color: colors.muted, marginTop: 4 }}>{si.screening.tip}</SiText>
            <View className="mt-4 flex-row justify-end">
              <BigButton label={si.common.start} icon="▶" onPress={start} />
            </View>
          </Card>
        </View>
      </MathBackground>
    </View>
  );
}
