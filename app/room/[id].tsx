import React from "react";
import { View, Text, Image, ScrollView, StyleSheet, Dimensions, SafeAreaView } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Button from "../../src/components/Button";
import { colors, typography, spacing, borderRadius, shadows } from "../../src/theme";

interface RoomData {
  id: string;
  name: string;
  images: string[];
  price: number;
  description: string;
  amenities: string[];
  maxGuests: number;
  bedType: string;
  roomSize: string;
  rating: {
    overall: number;
    count: number;
  };
}

const mockRoomData: RoomData = {
  id: "1",
  name: "豪華海景套房",
  images: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
    "https://images.unsplash.com/photo-1590490360182-c33d57733427",
    "https://images.unsplash.com/photo-1595576508898-0ad5c879a061",
  ],
  price: 12800,
  description: "我們的豪華海景套房提供寬敞的起居空間和私人陽台，讓您可以欣賞壯麗的海景。房間配備高級寢具、獨立衛浴設施和現代化的娛樂系統，為您打造舒適的度假體驗。",
  amenities: ["免費高速WiFi", "空調", "迷你吧", "保險箱", "平面電視", "咖啡機", "熨斗及熨衣板", "吹風機"],
  maxGuests: 4,
  bedType: "1張特大床 + 1張沙發床",
  roomSize: "45平方米",
  rating: {
    overall: 4.8,
    count: 128,
  },
};

interface Facility {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
  available: "24小時" | "限時" | string;
}

const mockFacilities: Facility[] = [
  {
    id: "1",
    category: "餐飲服務",
    name: "米其林餐廳",
    description: "享受米其林主廚精心料理",
    icon: "restaurant",
    available: "限時",
  },
  {
    id: "2",
    category: "休閒設施",
    name: "無邊際泳池",
    description: "海景泳池，日落美景",
    icon: "water",
    available: "限時",
  },
  {
    id: "3",
    category: "健康設施",
    name: "健身中心",
    description: "專業健身設備",
    icon: "barbell",
    available: "24小時",
  },
  {
    id: "4",
    category: "商務服務",
    name: "商務中心",
    description: "提供會議室及辦公設備",
    icon: "briefcase",
    available: "24小時",
  },
  {
    id: "5",
    category: "交通服務",
    name: "機場接送",
    description: "需提前預約",
    icon: "airplane",
    available: "需預約",
  },
  {
    id: "6",
    category: "休閒設施",
    name: "SPA中心",
    description: "專業按摩紓壓服務",
    icon: "leaf",
    available: "限時",
  },
];

interface Review {
  id: string;
  user: {
    name: string;
    avatar?: string;
    country: string;
  };
  rating: number;
  comment: string;
  date: string;
  images?: string[];
  likes: number;
  stayDuration: string;
  travelType: "商務" | "家庭" | "情侶" | "朋友" | "獨旅";
}

const mockReviews: Review[] = [
  {
    id: "1",
    user: {
      name: "陳小姐",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330",
      country: "台灣",
    },
    rating: 4.8,
    comment: "房間寬敞舒適，海景視野絕佳！服務人員親切專業，設施完善。早餐種類豐富，品質優良。是一次完美的住宿體驗！",
    date: "2024-02-15",
    images: ["https://images.unsplash.com/photo-1582719478250-c89cae4dc85b", "https://images.unsplash.com/photo-1590490360182-c33d57733427"],
    likes: 45,
    stayDuration: "2晚",
    travelType: "情侶",
  },
  {
    id: "2",
    user: {
      name: "林先生",
      country: "台灣",
    },
    rating: 4.6,
    comment: "非常適合帶小孩入住，遊戲區的設計很貼心，孩子玩得很開心。房間空間充足，可以讓小孩自由活動。",
    date: "2024-02-10",
    likes: 32,
    stayDuration: "3晚",
    travelType: "家庭",
  },
];

const FacilityItem = ({ facility }: { facility: Facility }) => (
  <View style={styles.facilityCard}>
    <View style={styles.facilityIconContainer}>
      <Ionicons name={facility.icon} size={24} color={colors.primary} />
    </View>
    <View style={styles.facilityContent}>
      <Text style={styles.facilityName}>{facility.name}</Text>
      <Text style={styles.facilityDescription}>{facility.description}</Text>
      <View style={styles.facilityAvailability}>
        <Ionicons name="time-outline" size={12} color={colors.textLight} />
        <Text style={styles.facilityAvailabilityText}>{facility.available}</Text>
      </View>
    </View>
  </View>
);

const ReviewCard = ({ review }: { review: Review }) => (
  <View style={styles.reviewCard}>
    <View style={styles.reviewHeader}>
      <View style={styles.reviewUser}>
        {review.user.avatar ? (
          <Image source={{ uri: review.user.avatar }} style={styles.userAvatar} />
        ) : (
          <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
            <Text style={styles.userAvatarText}>{review.user.name[0]}</Text>
          </View>
        )}
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{review.user.name}</Text>
          <Text style={styles.userMeta}>
            {review.travelType} • {review.stayDuration}
          </Text>
        </View>
      </View>
      <View style={styles.reviewRating}>
        <Ionicons name="star" size={16} color={colors.primary} />
        <Text style={styles.reviewRatingText}>{review.rating}</Text>
      </View>
    </View>

    <Text style={styles.reviewComment}>{review.comment}</Text>

    {review.images && review.images.length > 0 && (
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImages}>
        {review.images.map((image, index) => (
          <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
        ))}
      </ScrollView>
    )}

    <View style={styles.reviewFooter}>
      <Text style={styles.reviewDate}>{review.date}</Text>
      <View style={styles.likeButton}>
        <Ionicons name="heart-outline" size={16} color={colors.textLight} />
        <Text style={styles.likeCount}>{review.likes}</Text>
      </View>
    </View>
  </View>
);

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

            <View style={styles.facilitiesContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>飯店設施</Text>
                <View style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>查看全部</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </View>
              <View style={styles.facilitiesGrid}>
                {mockFacilities.map(facility => (
                  <FacilityItem key={facility.id} facility={facility} />
                ))}
              </View>
            </View>

            <View style={styles.reviewsContainer}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>住客評價</Text>
                <View style={styles.viewAllButton}>
                  <Text style={styles.viewAllText}>查看全部</Text>
                  <Ionicons name="chevron-forward" size={20} color={colors.primary} />
                </View>
              </View>
              <View style={styles.overallRating}>
                <Text style={styles.ratingScore}>{room.rating.overall}</Text>
                <View style={styles.ratingInfo}>
                  <Text style={styles.ratingText}>極致體驗</Text>
                  <Text style={styles.reviewCount}>{room.rating.count} 則評價</Text>
                </View>
              </View>
              {mockReviews.map(review => (
                <ReviewCard key={review.id} review={review} />
              ))}
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
  facilitiesContainer: {
    marginTop: spacing.lg,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  facilitiesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  facilityCard: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  facilityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.full,
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  facilityContent: {
    flex: 1,
  },
  facilityName: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  facilityDescription: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  facilityAvailability: {
    flexDirection: "row",
    alignItems: "center",
  },
  facilityAvailabilityText: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginLeft: spacing.xs,
  },
  reviewsContainer: {
    marginTop: spacing.lg,
  },
  overallRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.text,
    marginRight: spacing.md,
  },
  ratingInfo: {
    flex: 1,
  },
  ratingText: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  reviewCount: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  reviewCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  reviewUser: {
    flexDirection: "row",
    alignItems: "center",
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  userAvatarPlaceholder: {
    backgroundColor: colors.backgroundLight,
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatarText: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.primary,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 2,
  },
  userMeta: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  reviewRating: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  reviewRatingText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginLeft: 4,
  },
  reviewComment: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
    marginBottom: spacing.sm,
  },
  reviewImages: {
    marginBottom: spacing.sm,
  },
  reviewImage: {
    width: 120,
    height: 80,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  reviewFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewDate: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  likeCount: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginLeft: 4,
  },
});
