import React from "react";
import { View, Text, StyleSheet, Image, ViewStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../theme";

interface ReviewCardProps {
  author: string;
  avatar?: string;
  rating: number;
  date: string;
  comment: string;
  style?: StyleProp<ViewStyle>;
}

export default function ReviewCard({ author, avatar, rating, date, comment, style }: ReviewCardProps) {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(<Ionicons key={i} name={i <= rating ? "star" : "star-outline"} size={16} color={i <= rating ? colors.warning : colors.textLight} style={styles.star} />);
    }
    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.authorContainer}>
          {avatar ? (
            <Image source={{ uri: avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarText}>{author.charAt(0).toUpperCase()}</Text>
            </View>
          )}
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>{author}</Text>
            <Text style={styles.date}>{date}</Text>
          </View>
        </View>
        <View style={styles.rating}>{renderStars()}</View>
      </View>
      <Text style={styles.comment}>{comment}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 16,
    ...shadows.sm,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  authorContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: colors.background,
    fontSize: typography.h3.fontSize,
    fontWeight: "bold",
  },
  authorInfo: {
    marginLeft: 12,
  },
  authorName: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  date: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  rating: {
    flexDirection: "row",
  },
  star: {
    marginLeft: 2,
  },
  comment: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 20,
  },
});
