import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, ViewStyle, StyleProp } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, borderRadius, shadows } from "../theme";

interface AttractionCardProps {
  name: string;
  image: string;
  distance: string;
  category: string;
  rating: number;
  address: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function AttractionCard({ name, image, distance, category, rating, address, onPress, style }: AttractionCardProps) {
  return (
    <TouchableOpacity style={[styles.container, style]} onPress={onPress} activeOpacity={0.8}>
      <Image source={{ uri: image }} style={styles.image} />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name} numberOfLines={1}>
              {name}
            </Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.warning} />
              <Text style={styles.rating}>{rating.toFixed(1)}</Text>
            </View>
          </View>
          <View style={styles.infoContainer}>
            <View style={styles.categoryContainer}>
              <Ionicons name="location" size={14} color={colors.primary} />
              <Text style={styles.category}>{category}</Text>
            </View>
            <Text style={styles.distance}>{distance}</Text>
          </View>
        </View>
        <Text style={styles.address} numberOfLines={2}>
          {address}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: 16,
    ...shadows.sm,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 150,
  },
  content: {
    padding: 12,
  },
  header: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginRight: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.text,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  categoryContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  category: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
  distance: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  address: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    lineHeight: 18,
  },
});
