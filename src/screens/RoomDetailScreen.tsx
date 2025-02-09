import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Image, TouchableOpacity, Dimensions, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

interface Facility {
  id: string;
  name: string;
  icon: string;
}

const facilities: Facility[] = [
  { id: "1", name: "WiFi", icon: "wifi" },
  { id: "2", name: "冷氣", icon: "snow" },
  { id: "3", name: "電視", icon: "tv" },
  { id: "4", name: "熱水器", icon: "water" },
  { id: "5", name: "停車場", icon: "car" },
];

const roomImages = ["https://example.com/room1.jpg", "https://example.com/room2.jpg", "https://example.com/room3.jpg"];

export default function RoomDetailScreen() {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const renderImageIndicator = () => (
    <View style={styles.indicatorContainer}>
      {roomImages.map((_, index) => (
        <View key={index} style={[styles.indicator, index === activeImageIndex && styles.activeIndicator]} />
      ))}
    </View>
  );

  const renderFacility = ({ item }: { item: Facility }) => (
    <View style={styles.facilityItem}>
      <Ionicons name={item.icon as any} size={24} color="#666" />
      <Text style={styles.facilityName}>{item.name}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.imageContainer}>
        <FlatList
          data={roomImages}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={e => {
            const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
            setActiveImageIndex(newIndex);
          }}
          renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} resizeMode="cover" />}
          keyExtractor={(_, index) => index.toString()}
        />
        {renderImageIndicator()}
      </View>

      <View style={styles.content}>
        <Text style={styles.title}>豪華雙人房</Text>
        <Text style={styles.price}>NT$ 2,800 / 晚</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>房間介紹</Text>
          <Text style={styles.description}>舒適寬敞的雙人房，備有獨立衛浴及陽台，讓您享受愜意的住宿體驗。房間面積25平方公尺，提供您舒適的休息空間。</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>房間設施</Text>
          <FlatList data={facilities} renderItem={renderFacility} keyExtractor={item => item.id} numColumns={3} columnWrapperStyle={styles.facilitiesRow} />
        </View>

        <TouchableOpacity style={styles.bookButton}>
          <Text style={styles.bookButtonText}>立即預訂</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    height: 300,
    position: "relative",
  },
  image: {
    width,
    height: 300,
  },
  indicatorContainer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: "#fff",
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: "#e53935",
    fontWeight: "600",
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: "#666",
    lineHeight: 24,
  },
  facilitiesRow: {
    justifyContent: "flex-start",
    marginBottom: 12,
  },
  facilityItem: {
    alignItems: "center",
    width: (width - 32) / 3,
    marginBottom: 16,
  },
  facilityName: {
    marginTop: 4,
    fontSize: 14,
    color: "#666",
  },
  bookButton: {
    backgroundColor: "#e53935",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  bookButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
