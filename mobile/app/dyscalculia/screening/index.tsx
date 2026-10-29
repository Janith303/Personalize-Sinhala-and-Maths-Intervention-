// Stage 1 intro: child's name (owl scene).
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Keyboard, Pressable, ScrollView, TextInput, View } from 'react-native';

import { Txt, useU } from '@/components/common/layout';
import { Btn3D, Highlight, InfoBox, PaperCard, Screen, StarPill } from '@/components/dyscalculia/kit';
import { fonts } from '@/constants/common/theme';
import { si } from '@/constants/dyscalculia/strings.si';
import { colors } from '@/constants/dyscalculia/theme';
import { useDyscalculia } from '@/contexts/dyscalculia/DyscalculiaContext';

export default function ScreeningIntro() {
  const { s } = useU();
  const { childName, setChildName, stars } = useDyscalculia();
  const [name, setName] = useState(childName);
  const [error, setError] = useState(false);

  const start = () => {
    Keyboard.dismiss();
    if (!name.trim()) {
      setError(true);
      return;
    }
    setChildName(name.trim());
    router.replace('/dyscalculia/screening/play');
  };

  return (
    <Screen scene="owl" gear title={si.screening.introTitle} right={<StarPill label={`${si.common.stars} ${stars}`} />}>
      {/* Tapping outside the text box closes the keyboard; the card scrolls when the keyboard is open. */}
      <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <Pressable onPress={Keyboard.dismiss} accessible={false}>
          <PaperCard>
            <Highlight>{si.screening.askName}</Highlight>
            <View
              style={{
                marginTop: s(18),
                height: s(78),
                borderRadius: s(18),
                borderWidth: s(3),
                borderColor: error ? colors.red : '#7FB8EA',
                backgroundColor: colors.sky,
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: s(22),
              }}
            >
              <TextInput
                value={name}
                onChangeText={(t) => {
                  setName(t);
                  setError(false);
                }}
                placeholder={si.screening.namePlaceholder}
                placeholderTextColor="#9FB3C8"
                accessibilityLabel={si.screening.askName}
                returnKeyType="done"
                submitBehavior="blurAndSubmit"
                onSubmitEditing={Keyboard.dismiss}
                disableFullscreenUI
                autoCorrect={false}
                style={{ flex: 1, fontFamily: fonts.semi, fontSize: s(30), color: colors.navy, paddingVertical: 0 }}
              />
              <Ionicons name="person" size={s(40)} color="#8A97A8" />
            </View>
            {error ? (
              <Txt size={18} weight="semi" color={colors.red} style={{ marginTop: s(4) }}>
                {si.screening.nameRequired}
              </Txt>
            ) : null}
            <InfoBox style={{ marginTop: s(16) }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Txt size={21} weight="semi" color={colors.navy} style={{ flex: 1 }}>
                  {si.screening.nameHelp}
                </Txt>
                <Ionicons name="pencil" size={s(58)} color={colors.amber} />
              </View>
            </InfoBox>
            <View style={{ marginTop: s(16), alignItems: 'flex-end' }}>
              <Btn3D label={si.common.start} icon="play" onPress={start} style={{ width: s(380) }} />
            </View>
          </PaperCard>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}
