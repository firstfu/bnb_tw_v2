import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../../src/hooks/useTranslation";
import { colors, typography, borderRadius } from "../../src/theme";
import { useAppSettings } from "../../src/contexts/AppSettingsContext";

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { language, setLanguage } = useAppSettings();

  const menuItems = [
    {
      icon: "calendar-outline",
      title: t("profile.bookingHistory"),
      onPress: () => {},
    },
    {
      icon: "heart-outline",
      title: t("profile.favorites"),
      onPress: () => {},
    },
    {
      icon: "language",
      title: t("profile.language"),
      onPress: () => {},
      value: language.toUpperCase(),
    },
    {
      icon: "notifications-outline",
      title: t("profile.notifications"),
      onPress: () => {},
    },
    {
      icon: "information-circle-outline",
      title: t("profile.about"),
      onPress: () => {},
    },
    {
      icon: "mail-outline",
      title: t("profile.contact"),
      onPress: () => {},
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t("profile.title")}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuItemLeft}>
              <Ionicons name={item.icon as any} size={24} color={colors.text} style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.title}</Text>
            </View>
            <View style={styles.menuItemRight}>
              {item.value && <Text style={styles.menuValue}>{item.value}</Text>}
              <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: "bold",
    color: colors.text,
  },
  menuContainer: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginHorizontal: 16,
    marginTop: 16,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuIcon: {
    marginRight: 12,
  },
  menuText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  menuItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuValue: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    marginRight: 8,
  },
});
