import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Stack } from "expo-router";
import Button from "../../src/components/Button";

// 模擬房間資料
const mockRoomData = {
  id: "1",
  name: "豪華海景套房",
  images: [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427",
  ],
  price: 5800,
  description: "寬敞的豪華套房，配備獨立陽台，可欣賞無敵海景。房間配有特大號床、高級寢具、獨立衛浴設施，以及迷你吧檯。",
  amenities: ["免費WiFi", "空調", "迷你吧", "陽台", "海景", "客廳區", "衛星電視", "咖啡機"],
  maxGuests: 2,
  bedType: "特大號床",
  roomSize: "45平方米",
};

export default function RoomDetail() {
  const { id } = useLocalSearchParams();
  const room = mockRoomData; // 在實際應用中，這裡應該根據id獲取對應的房間資料

  const handleBooking = () => {
    router.push({
      pathname: "/booking",
      params: {
        roomId: id,
        roomName: room.name,
        checkIn: "",
        checkOut: "",
        guests: JSON.stringify({ adult: 2, child: 0 }),
      },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Stack.Screen
        options={{
          title: room.name,
          headerTransparent: true,
        }}
      />
      <View style={styles.container}>
        <ScrollView style={styles.scrollView}>
          <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} style={styles.imageContainer}>
            {room.images.map((image, index) => (
              <Image key={index} source={{ uri: image }} style={styles.image} resizeMode="cover" />
            ))}
          </ScrollView>

          <View style={styles.content}>
            <Text style={styles.title}>{room.name}</Text>
            <Text style={styles.price}>NT$ {room.price} / 晚</Text>

            <View style={styles.infoContainer}>
              <Text style={styles.infoTitle}>房間資訊</Text>
              <Text style={styles.info}>最多入住: {room.maxGuests} 人</Text>
              <Text style={styles.info}>床型: {room.bedType}</Text>
              <Text style={styles.info}>房間大小: {room.roomSize}</Text>
            </View>

            <View style={styles.descriptionContainer}>
              <Text style={styles.infoTitle}>房間描述</Text>
              <Text style={styles.description}>{room.description}</Text>
            </View>

            <View style={styles.amenitiesContainer}>
              <Text style={styles.infoTitle}>設施與服務</Text>
              <View style={styles.amenitiesList}>
                {room.amenities.map((amenity, index) => (
                  <Text key={index} style={styles.amenity}>
                    • {amenity}
                  </Text>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomContainer}>
          <Button title="立即預訂" onPress={handleBooking} style={styles.bookButton} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
  },
  image: {
    width: Dimensions.get("window").width,
    height: 300,
  },
  content: {
    padding: 20,
    paddingBottom: 100, // 為底部按鈕預留空間
  },
  bottomContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    color: "#FF385C",
    marginBottom: 20,
  },
  infoContainer: {
    marginBottom: 20,
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  amenitiesContainer: {
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666",
  },
  amenitiesList: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  amenity: {
    fontSize: 16,
    color: "#666",
    width: "50%",
    marginBottom: 8,
  },
  bookButton: {
    marginTop: 20,
  },
});
