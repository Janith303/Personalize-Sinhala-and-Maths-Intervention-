import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { useRouter } from "expo-router";

import LetterIntroduction from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/letterintro";
import SoundAndLetter from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/soundandletter";
import LetterPairs from "../../../../components/sinhala-writing/mahaprana/akuruhadunaganimu/letterpair";

const activities = [
  "අකුරු හඳුනාගනිමු",
  "අකුර සහ ශබ්දය",
  "අල්පප්‍රාණ හා මහාප්‍රාණ",
];

export default function AkuruHadunaganimu() {
  const router = useRouter();
  const [currentActivity, setCurrentActivity] = useState(0);

  const renderActivity = () => {
    switch (currentActivity) {
      case 0:
        return <LetterIntroduction />;

      case 1:
        return <SoundAndLetter />;

      case 2:
        return <LetterPairs />;

      default:
        return <LetterIntroduction />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backIcon}>‹</Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>අකුරු හඳුනාගනිමු</Text>
          <Text style={styles.headerSubtitle}>මහාප්‍රාණ අකුරු</Text>
        </View>

        <View style={styles.counter}>
          <Text style={styles.counterText}>
            {currentActivity + 1}/3
          </Text>
        </View>
      </View>

      {/* Activity tabs */}
      <View style={styles.activityTabs}>
        {activities.map((activity, index) => {
          const active = index === currentActivity;

          return (
            <Pressable
              key={activity}
              onPress={() => setCurrentActivity(index)}
              style={[
                styles.tab,
                active && styles.activeTab,
              ]}
            >
              <Text
                numberOfLines={1}
                style={[
                  styles.tabText,
                  active && styles.activeTabText,
                ]}
              >
                {activity}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Learning content */}
      <View style={styles.contentWrapper}>
        <ImageBackground
          source={require("../../../../assets/images/sinhala-writing/maharecog.png")}
          style={styles.background}
          resizeMode="cover"
          imageStyle={styles.backgroundImage}
        >
          <View style={styles.backgroundOverlay}>
            {renderActivity()}
          </View>
        </ImageBackground>
      </View>

      {/* Bottom navigation */}
      <View style={styles.bottomBar}>
        <Pressable
          disabled={currentActivity === 0}
          onPress={() =>
            setCurrentActivity((previous) => previous - 1)
          }
          style={[
            styles.navigationButton,
            currentActivity === 0 && styles.disabledButton,
          ]}
        >
          <Text style={styles.navigationText}>‹ පෙර</Text>
        </Pressable>

        <View style={styles.dots}>
          {activities.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === currentActivity && styles.activeDot,
              ]}
            />
          ))}
        </View>

        <Pressable
          disabled={currentActivity === activities.length - 1}
          onPress={() =>
            setCurrentActivity((previous) => previous + 1)
          }
          style={[
            styles.navigationButton,
            currentActivity === activities.length - 1 &&
              styles.disabledButton,
          ]}
        >
          <Text style={styles.navigationText}>ඊළඟට ›</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F8F5",
  },

  header: {
    height: 68,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E4EAE5",
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  backIcon: {
    fontSize: 32,
    color: "#2E7D32",
    lineHeight: 35,
  },

  headerCenter: {
    flex: 1,
    marginLeft: 13,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#263238",
  },

  headerSubtitle: {
    fontSize: 13,
    color: "#78909C",
    marginTop: 1,
  },

  counter: {
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderRadius: 13,
    backgroundColor: "#E8F5E9",
  },

  counterText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#2E7D32",
  },

  activityTabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
    backgroundColor: "#FFFFFF",
  },

  tab: {
    flex: 1,
    height: 48,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1F3F4",
  },

  activeTab: {
    backgroundColor: "#E8F5E9",
    borderWidth: 1.5,
    borderColor: "#81C784",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#607D8B",
  },

  activeTabText: {
    color: "#2E7D32",
    fontWeight: "800",
  },

  contentWrapper: {
    flex: 1,
    overflow: "hidden",
  },

  background: {
    flex: 1,
  },

  backgroundImage: {
    opacity: 0.65,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(248, 252, 248, 0.48)",
  },

  bottomBar: {
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderTopWidth: 1,
    borderTopColor: "#E0E0E0",
  },

  navigationButton: {
    minWidth: 100,
    height: 42,
    paddingHorizontal: 18,
    borderRadius: 14,
    backgroundColor: "#2E7D32",
    alignItems: "center",
    justifyContent: "center",
  },

  disabledButton: {
    backgroundColor: "#CFD8DC",
  },

  navigationText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  dots: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#CFD8DC",
  },

  activeDot: {
    width: 22,
    backgroundColor: "#43A047",
  },
});