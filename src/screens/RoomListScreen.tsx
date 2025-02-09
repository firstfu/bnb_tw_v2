import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";

interface Room {
  id: string;
  name: string;
  price: number;
  image: string;
  capacity: number;
  description: string;
}

const mockRooms: Room[] = [
  {
    id: "1",
    name: "豪華雙人房",
    price: 2800,
    image: "https://example.com/room1.jpg",
    capacity: 2,
    description: "舒適寬敞的雙人房，備有獨立衛浴及陽台",
  },
  {
    id: "2",
    name: "家庭四人房",
    price: 3800,
    image: "https://example.com/room2.jpg",
    capacity: 4,
    description: "適合全家出遊的溫馨房型，提供加大雙人床與兩張單人床",
  },
];

const RoomCard = ({ room }: { room: Room }) => (
  <TouchableOpacity style={styles.card}>
    <Image source={{ uri: room.image }} style={styles.image} resizeMode="cover" />
    <View style={styles.cardContent}>
      <Text style={styles.roomName}>{room.name}</Text>
      <Text style={styles.price}>NT$ {room.price} / 晚</Text>
      <Text style={styles.capacity}>可住 {room.capacity} 人</Text>
      <Text style={styles.description} numberOfLines={2}>
        {room.description}
      </Text>
    </View>
  </TouchableOpacity>
);

export default function RoomListScreen() {
  const [rooms] = useState<Room[]>(mockRooms);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>奉天宮民宿</Text>
      </View>
      <FlatList data={rooms} renderItem={({ item }) => <RoomCard room={item} />} keyExtractor={item => item.id} contentContainerStyle={styles.listContainer} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  cardContent: {
    padding: 16,
  },
  roomName: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  price: {
    fontSize: 16,
    color: "#e53935",
    fontWeight: "600",
    marginBottom: 4,
  },
  capacity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
