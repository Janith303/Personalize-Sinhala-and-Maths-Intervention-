import React from "react";
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useRouter } from "expo-router";

const assessmentModules = [
  {
    id: "agayuma-1",
    number: "1",
    title: "සිංහල ඇගයුම 1",
    subtitle: "සිංහල ලිවීම",
    emoji: "📝",
  },
  {
    id: "agayuma-2",
    number: "2",
    title: "සිංහල ඇගයුම 2",
    subtitle: "ලිවීමේ කුසලතා",
    emoji: "📖",
  },
];

const learningModules = [
  {
    id: "mahaprana",
    number: "1",
    title: "මහාප්‍රාණ අකුරු",
    subtitle: "හඳුනා ගනිමු",
    emoji: "🔊",
  },
  {
    id: "letter-size",
    number: "2",
    title: "අකුරු ප්‍රමාණය",
    subtitle: "ලස්සනට ගනිමු",
    emoji: "✏️",
  },
  {
    id: "sentence-building",
    number: "3",
    title: "වාක්‍ය ගොඩනගමු",
    subtitle: "වාක්‍ය ලියමු",
    emoji: "🧩",
  },
];

export default function SinhalaWritingHome() {
  const router = useRouter();

  const openModule = (id: string) => {
    router.push(`/sinhala-writing/${id}` as any);
  };

  return (
    <ImageBackground
      source={require("../../assets/images/sinhala-writing/homebackground.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <View style={styles.backgroundOverlay}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* ================= HEADER ================= */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.logoCircle}>
                <Text style={styles.logoEmoji}>📚</Text>
              </View>

              <View>
                <Text style={styles.appTitle}>සිංහල ලිවීම</Text>
                <Text style={styles.appSubtitle}>
                  අපි එකට ඉගෙන ගනිමු!
                </Text>
              </View>
            </View>

            <View style={styles.headerRight}>
              <View style={styles.progressContainer}>
                <Text style={styles.progressLabel}>ඔබේ ප්‍රගතිය</Text>

                <View style={styles.progressBarBackground}>
                  <View style={styles.progressBarFill} />
                </View>

                <Text style={styles.progressText}>0%</Text>
              </View>

              <View style={styles.profileCircle}>
                <Text style={styles.profileEmoji}>👦</Text>
              </View>
            </View>
          </View>

          {/* ================= WELCOME CARD ================= */}
          <View style={styles.welcomeCard}>
            <View style={styles.welcomeTextContainer}>
              <Text style={styles.welcomeTitle}>ආයුබෝවන්! 👋</Text>

              <Text style={styles.welcomeDescription}>
                සිංහල ලිවීමේ හැකියාව වැඩි දියුණු කරගනිමු.
              </Text>

              <Text style={styles.welcomeSmallText}>
                ඔබට අවශ්‍ය පාඩමක් තෝරාගෙන ඉගෙනීම ආරම්භ කරන්න.
              </Text>
            </View>

            <View style={styles.welcomeIconContainer}>
              <Text style={styles.welcomeEmoji}>✍️</Text>
            </View>
          </View>

          {/* ================= ASSESSMENT SECTION ================= */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>සිංහල ඇගයීම්</Text>
              <Text style={styles.sectionSubtitle}>
                ඔබේ ලිවීමේ හැකියාව පරීක්ෂා කරමු
              </Text>
            </View>

            <View style={styles.sectionBadge}>
              <Text style={styles.sectionBadgeText}>ඇගයීම් 2</Text>
            </View>
          </View>

          <View style={styles.assessmentRow}>
            {assessmentModules.map((module) => (
              <TouchableOpacity
                key={module.id}
                activeOpacity={0.85}
                style={styles.assessmentCard}
                onPress={() => openModule(module.id)}
              >
                <View style={styles.cardNumberCircle}>
                  <Text style={styles.cardNumber}>{module.number}</Text>
                </View>

                <View style={styles.cardEmojiContainer}>
                  <Text style={styles.cardEmoji}>{module.emoji}</Text>
                </View>

                <View style={styles.cardTextContainer}>
                  <Text style={styles.cardTitle}>{module.title}</Text>
                  <Text style={styles.cardSubtitle}>{module.subtitle}</Text>
                </View>

                <View style={styles.arrowCircle}>
                  <Text style={styles.arrowText}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ================= LEARNING SECTION ================= */}
          <View style={[styles.sectionHeader, styles.learningHeader]}>
            <View>
              <Text style={styles.sectionTitle}>ඉගෙන ගනිමු</Text>
              <Text style={styles.sectionSubtitle}>
                සිංහල ලිවීමේ කුසලතා වර්ධනය කරමු
              </Text>
            </View>

            <View style={styles.sectionBadgeLearning}>
              <Text style={styles.sectionBadgeText}>පාඩම් 3</Text>
            </View>
          </View>

          <View style={styles.learningRow}>
            {learningModules.map((module) => (
              <TouchableOpacity
                key={module.id}
                activeOpacity={0.85}
                style={styles.learningCard}
                onPress={() => openModule(module.id)}
              >
                <View style={styles.learningCardTop}>
                  <View style={styles.learningNumberCircle}>
                    <Text style={styles.learningNumber}>
                      {module.number}
                    </Text>
                  </View>

                  <Text style={styles.learningEmoji}>{module.emoji}</Text>
                </View>

                <Text style={styles.learningTitle}>{module.title}</Text>

                <Text style={styles.learningSubtitle}>
                  {module.subtitle}
                </Text>

                <View style={styles.startButton}>
                  <Text style={styles.startButtonText}>ආරම්භ කරන්න</Text>
                  <Text style={styles.startArrow}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* ================= FOOTER ================= */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              🌟 දිනපතා පුහුණුවීමෙන් ඔබේ ලිවීම තවත් ලස්සන වේ!
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  // ============================================================
  // MAIN CONTAINER
  // ============================================================

  container: {
    flex: 1,
  },

  backgroundOverlay: {
    flex: 1,
    backgroundColor: "rgba(245, 250, 255, 0.12)",
  },

  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 28,
  },

  // ============================================================
  // HEADER
  // ============================================================

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 5,
    elevation: 4,
  },

  logoEmoji: {
    fontSize: 29,
  },

  appTitle: {
    fontSize: 25,
    fontWeight: "800",
    color: "#35205F",
  },

  appSubtitle: {
    fontSize: 13,
    color: "#66577C",
    marginTop: 2,
    fontWeight: "500",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  progressContainer: {
    marginRight: 18,
    alignItems: "flex-end",
  },

  progressLabel: {
    fontSize: 12,
    color: "#5C4B72",
    fontWeight: "600",
    marginBottom: 4,
  },

  progressBarBackground: {
    width: 120,
    height: 8,
    backgroundColor: "rgba(255,255,255,0.75)",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBarFill: {
    width: "0%",
    height: "100%",
    backgroundColor: "#7B5CC4",
    borderRadius: 10,
  },

  progressText: {
    fontSize: 10,
    color: "#6A5882",
    fontWeight: "700",
    marginTop: 3,
  },

  profileCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  profileEmoji: {
    fontSize: 25,
  },

  // ============================================================
  // WELCOME CARD
  // ============================================================

  welcomeCard: {
    minHeight: 105,
    borderRadius: 22,
    backgroundColor: "rgba(255, 255, 255, 0.91)",
    paddingHorizontal: 24,
    paddingVertical: 17,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    marginBottom: 20,

    shadowColor: "#4C3570",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 4,
  },

  welcomeTextContainer: {
    flex: 1,
    paddingRight: 20,
  },

  welcomeTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#35205F",
    marginBottom: 5,
  },

  welcomeDescription: {
    fontSize: 15,
    color: "#4E4260",
    fontWeight: "600",
    marginBottom: 3,
  },

  welcomeSmallText: {
    fontSize: 12,
    color: "#756A82",
  },

  welcomeIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#F0E8FF",
    justifyContent: "center",
    alignItems: "center",
  },

  welcomeEmoji: {
    fontSize: 38,
  },

  // ============================================================
  // SECTION HEADER
  // ============================================================

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 11,
  },

  learningHeader: {
    marginTop: 20,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#35205F",
  },

  sectionSubtitle: {
    fontSize: 11,
    color: "#716580",
    marginTop: 2,
  },

  sectionBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#E8DEFA",
  },

  sectionBadgeLearning: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#FFF0C7",
  },

  sectionBadgeText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#5A3A8A",
  },

  // ============================================================
  // ASSESSMENT CARDS
  // ============================================================

  assessmentRow: {
    flexDirection: "row",
    gap: 15,
  },

  assessmentCard: {
    flex: 1,
    minHeight: 112,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 20,

    paddingHorizontal: 16,
    paddingVertical: 14,

    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#4C3570",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.11,
    shadowRadius: 7,
    elevation: 3,
  },

  cardNumberCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#7B5CC4",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  cardNumber: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  cardEmojiContainer: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#F0E8FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  cardEmoji: {
    fontSize: 25,
  },

  cardTextContainer: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#35205F",
  },

  cardSubtitle: {
    fontSize: 11,
    color: "#746780",
    marginTop: 3,
  },

  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4EEFF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 8,
  },

  arrowText: {
    fontSize: 18,
    color: "#704DB0",
    fontWeight: "800",
  },

  // ============================================================
  // LEARNING CARDS
  // ============================================================

  learningRow: {
    flexDirection: "row",
    gap: 15,
  },

  learningCard: {
    flex: 1,
    minHeight: 165,
    backgroundColor: "rgba(255, 255, 255, 0.94)",
    borderRadius: 20,

    paddingHorizontal: 16,
    paddingVertical: 14,

    shadowColor: "#4C3570",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.11,
    shadowRadius: 7,
    elevation: 3,
  },

  learningCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  learningNumberCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F4C95D",
    justifyContent: "center",
    alignItems: "center",
  },

  learningNumber: {
    fontSize: 14,
    fontWeight: "800",
    color: "#5D4612",
  },

  learningEmoji: {
    fontSize: 30,
  },

  learningTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#35205F",
    marginBottom: 3,
  },

  learningSubtitle: {
    fontSize: 11,
    color: "#746780",
    marginBottom: 12,
  },

  startButton: {
    height: 34,
    borderRadius: 17,
    backgroundColor: "#F1E9FF",

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    paddingHorizontal: 12,
  },

  startButtonText: {
    fontSize: 11,
    color: "#63439A",
    fontWeight: "700",
    marginRight: 5,
  },

  startArrow: {
    fontSize: 15,
    color: "#63439A",
    fontWeight: "800",
  },

  // ============================================================
  // FOOTER
  // ============================================================

  footer: {
    alignItems: "center",
    marginTop: 18,
  },

  footerText: {
    fontSize: 11,
    color: "#6D5D7D",
    fontWeight: "600",
  },
});