import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from "react-native";
import { Link } from "expo-router";
import { useTranslation } from "../../src/hooks/useTranslation";
import { colors, typography, shadows, borderRadius, spacing } from "../../src/theme";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

interface Room {
  id: string;
  name: string;
  type: string;
  status: "available" | "booked" | "maintenance";
  floor: number;

  price: number;
  originalPrice?: number;
  promotion?: {
    type: "discount" | "package" | "seasonal";
    description: string;
    endDate: string;
  };

  capacity: {
    adult: number;
    child: number;
  };
  size: {
    value: number;
    unit: "坪" | "平方公尺";
  };

  beds: Array<{
    type: "單人床" | "雙人床" | "加大雙人床" | "特大雙人床";
    quantity: number;
    size: string;
  }>;

  view: string[];
  location: {
    floor: number;
    building?: string;
    direction: "東" | "西" | "南" | "北";
  };

  amenities: Array<{
    category: "基礎設施" | "衛浴設施" | "娛樂設施" | "其他";
    items: string[];
  }>;

  images: Array<{
    url: string;
    type: "主圖" | "衛浴" | "景觀" | "設施";
    description: string;
  }>;

  rating: {
    overall: number;
    cleanliness: number;
    service: number;
    comfort: number;
    location: number;
    count: number;
  };

  description: string;
  highlights: string[];
  policies: {
    checkIn: string;
    checkOut: string;
    cancellation: string;
    extraBed: {
      available: boolean;
      price?: number;
    };
  };
}

interface Banner {
  id: string;
  type: "promotion" | "event" | "news" | "seasonal";
  title: string;
  subtitle?: string;
  imageUrl: string;
  linkTo: string;
  startDate: string;
  endDate?: string;
  priority: number;
}

// 新增篩選標籤定義
interface FilterTag {
  id: string;
  label: string;
  icon: string;
}

const filterTags: FilterTag[] = [
  { id: "promotion", label: "優惠中", icon: "label" },
  { id: "sea_view", label: "海景房", icon: "beach-access" },
  { id: "family", label: "親子房", icon: "family-restroom" },
  { id: "business", label: "商務房", icon: "business-center" },
];

const mockRooms: Room[] = [
  {
    id: "1",
    name: "豪華海景套房",
    type: "套房",
    status: "available",
    floor: 18,

    price: 5800,
    originalPrice: 6800,
    promotion: {
      type: "discount",
      description: "早鳥優惠85折",
      endDate: "2024-05-31",
    },

    capacity: {
      adult: 2,
      child: 1,
    },
    size: {
      value: 45,
      unit: "平方公尺",
    },

    beds: [
      {
        type: "特大雙人床",
        quantity: 1,
        size: "200x200cm",
      },
    ],

    view: ["海景", "市景"],
    location: {
      floor: 18,
      building: "主樓",
      direction: "東",
    },

    amenities: [
      {
        category: "基礎設施",
        items: ["免費WiFi", "空調", "冰箱", "保險箱", "熱水壺"],
      },
      {
        category: "衛浴設施",
        items: ["乾濕分離", "浴缸", "淋浴間", "吹風機", "浴袍"],
      },
      {
        category: "娛樂設施",
        items: ["55吋智慧電視", "藍芽音響"],
      },
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
        type: "主圖",
        description: "寬敞明亮的臥室空間",
      },
      {
        url: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b",
        type: "衛浴",
        description: "豪華衛浴設備",
      },
      {
        url: "https://images.unsplash.com/photo-1590490360182-c33d57733427",
        type: "景觀",
        description: "無敵海景視野",
      },
    ],

    rating: {
      overall: 4.8,
      cleanliness: 4.9,
      service: 4.8,
      comfort: 4.7,
      location: 4.9,
      count: 128,
    },

    description: "寬敞的豪華套房，配備獨立陽台，可欣賞無敵海景。房間配有特大號床、高級寢具、獨立衛浴設施。",
    highlights: ["270度無敵海景", "獨立陽台", "高樓層地標景觀", "精緻歐式裝潢", "進口寢具組"],
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "入住前3天免費取消",
      extraBed: {
        available: true,
        price: 1000,
      },
    },
  },
  {
    id: "2",
    name: "溫馨家庭房",
    type: "家庭房",
    status: "available",
    floor: 12,

    price: 4200,

    capacity: {
      adult: 2,
      child: 2,
    },
    size: {
      value: 38,
      unit: "平方公尺",
    },

    beds: [
      {
        type: "雙人床",
        quantity: 1,
        size: "180x200cm",
      },
      {
        type: "單人床",
        quantity: 2,
        size: "100x200cm",
      },
    ],

    view: ["市景"],
    location: {
      floor: 12,
      building: "主樓",
      direction: "南",
    },

    amenities: [
      {
        category: "基礎設施",
        items: ["免費WiFi", "空調", "冰箱", "保險箱"],
      },
      {
        category: "衛浴設施",
        items: ["淋浴間", "吹風機"],
      },
      {
        category: "娛樂設施",
        items: ["43吋智慧電視", "兒童遊戲區"],
      },
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
        type: "主圖",
        description: "溫馨的家庭房空間",
      },
    ],

    rating: {
      overall: 4.6,
      cleanliness: 4.7,
      service: 4.6,
      comfort: 4.5,
      location: 4.6,
      count: 85,
    },

    description: "舒適的家庭房型，配備一張大床和兩張單人床，適合全家出遊。提供兒童遊戲區和加大的衛浴空間。",
    highlights: ["適合家庭入住", "兒童遊戲空間", "近電梯區域", "寬敞衛浴"],
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "入住前3天免費取消",
      extraBed: {
        available: false,
      },
    },
  },
  {
    id: "3",
    name: "精緻雙人房",
    type: "標準房",
    status: "available",
    floor: 8,

    price: 3500,

    capacity: {
      adult: 2,
      child: 0,
    },
    size: {
      value: 28,
      unit: "平方公尺",
    },

    beds: [
      {
        type: "雙人床",
        quantity: 1,
        size: "180x200cm",
      },
    ],

    view: ["市景"],
    location: {
      floor: 8,
      building: "主樓",
      direction: "西",
    },

    amenities: [
      {
        category: "基礎設施",
        items: ["免費WiFi", "空調", "冰箱"],
      },
      {
        category: "衛浴設施",
        items: ["淋浴間", "吹風機"],
      },
      {
        category: "娛樂設施",
        items: ["43吋智慧電視"],
      },
    ],

    images: [
      {
        url: "https://images.unsplash.com/photo-1590490359683-658d3d23f972",
        type: "主圖",
        description: "現代風格雙人房",
      },
    ],

    rating: {
      overall: 4.5,
      cleanliness: 4.6,
      service: 4.5,
      comfort: 4.4,
      location: 4.5,
      count: 96,
    },

    description: "現代風格的雙人房，提供舒適的住宿體驗。配備高級寢具和獨立衛浴。",
    highlights: ["簡約現代風格", "高性價比", "適合商務出差"],
    policies: {
      checkIn: "15:00",
      checkOut: "11:00",
      cancellation: "入住前3天免費取消",
      extraBed: {
        available: false,
      },
    },
  },
];

const mockBanners: Banner[] = [
  {
    id: "1",
    type: "promotion",
    title: "夏季旅遊專案",
    subtitle: "入住豪華房型享85折優惠",
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d",
    linkTo: "/promotions/summer",
    startDate: "2024-05-01",
    endDate: "2024-08-31",
    priority: 1,
  },
  {
    id: "2",
    type: "event",
    title: "週年慶典活動",
    subtitle: "訂房即送米其林晚餐",
    imageUrl: "https://images.unsplash.com/photo-1551918120-9739cb430c6d",
    linkTo: "/events/anniversary",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    priority: 2,
  },
  {
    id: "3",
    type: "seasonal",
    title: "浪漫七夕住宿方案",
    subtitle: "情人節限定套裝",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4",
    linkTo: "/promotions/valentine",
    startDate: "2024-07-15",
    endDate: "2024-08-15",
    priority: 3,
  },
];

interface ThemeCategory {
  id: string;
  title: string;
  subtitle: string;
  rooms: Room[];
}

interface Facility {
  id: string;
  category: string;
  name: string;
  description: string;
  icon: keyof typeof MaterialIcons.glyphMap;
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
    icon: "pool",
    available: "限時",
  },
  {
    id: "3",
    category: "健康設施",
    name: "健身中心",
    description: "專業健身設備",
    icon: "fitness-center",
    available: "24小時",
  },
  {
    id: "4",
    category: "商務服務",
    name: "商務中心",
    description: "提供會議室及辦公設備",
    icon: "business-center",
    available: "24小時",
  },
  {
    id: "5",
    category: "交通服務",
    name: "機場接送",
    description: "需提前預約",
    icon: "airport-shuttle",
    available: "需預約",
  },
  {
    id: "6",
    category: "休閒設施",
    name: "SPA中心",
    description: "專業按摩紓壓服務",
    icon: "spa",
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
  roomType: string;
  rating: {
    overall: number;
    cleanliness: number;
    service: number;
    comfort: number;
    location: number;
  };
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
    roomType: "豪華海景套房",
    rating: {
      overall: 4.8,
      cleanliness: 5.0,
      service: 4.8,
      comfort: 4.7,
      location: 4.9,
    },
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
    roomType: "溫馨家庭房",
    rating: {
      overall: 4.6,
      cleanliness: 4.7,
      service: 4.8,
      comfort: 4.5,
      location: 4.4,
    },
    comment: "非常適合帶小孩入住，遊戲區的設計很貼心，孩子玩得很開心。房間空間充足，可以讓小孩自由活動。",
    date: "2024-02-10",
    likes: 32,
    stayDuration: "3晚",
    travelType: "家庭",
  },
];

const RoomCard = ({ room }: { room: Room }) => (
  <Link href={`/room/${room.id}`} asChild>
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: room.images[0].url }} style={styles.image} resizeMode="cover" />
        {room.promotion && (
          <View style={styles.promotionBadge}>
            <Text style={styles.promotionText}>{room.promotion.description}</Text>
          </View>
        )}
        {room.status === "booked" && (
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>已預訂</Text>
          </View>
        )}
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <Text style={styles.roomName}>{room.name}</Text>
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color={colors.primary} />
              <Text style={styles.rating}>{room.rating.overall}</Text>
              <Text style={styles.ratingCount}>({room.rating.count})</Text>
            </View>
          </View>
          <View style={styles.typeAndFloorContainer}>
            <View style={styles.typeContainer}>
              <Ionicons name="home-outline" size={16} color={colors.textLight} />
              <Text style={styles.type}>{room.type}</Text>
            </View>
            <Text style={styles.floor}>{room.floor}F</Text>
          </View>
        </View>

        <View style={styles.priceContainer}>
          {room.originalPrice && <Text style={styles.originalPrice}>NT$ {room.originalPrice.toLocaleString()}</Text>}
          <Text style={styles.price}>NT$ {room.price.toLocaleString()} / 晚</Text>
        </View>

        <View style={styles.infoContainer}>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoText}>
              大人 {room.capacity.adult} 人{room.capacity.child > 0 ? ` + 兒童 ${room.capacity.child} 人` : ""}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="bed-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoText}>{room.beds.map(bed => `${bed.type} x${bed.quantity}`).join(", ")}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="resize-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoText}>
              {room.size.value} {room.size.unit}
            </Text>
          </View>
        </View>

        <View style={styles.highlightsContainer}>
          {room.highlights.slice(0, 3).map((highlight, index) => (
            <View key={index} style={styles.highlightBadge}>
              <Text style={styles.highlightText}>{highlight}</Text>
            </View>
          ))}
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {room.description}
        </Text>
      </View>
    </TouchableOpacity>
  </Link>
);

const BannerCarousel = ({ banners }: { banners: Banner[] }) => {
  const scrollX = useRef(new Animated.Value(0)).current;
  const [currentIndex, setCurrentIndex] = useState(0);
  const screenWidth = Dimensions.get("window").width;
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      if (currentIndex < banners.length - 1) {
        flatListRef.current?.scrollToIndex({
          index: currentIndex + 1,
          animated: true,
        });
      } else {
        flatListRef.current?.scrollToIndex({
          index: 0,
          animated: true,
        });
      }
    }, 5000);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const renderBanner = ({ item }: { item: Banner }) => (
    <TouchableOpacity
      style={[styles.bannerContainer, { width: screenWidth }]}
      onPress={() => {
        // 處理 Banner 點擊
      }}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.bannerImage} resizeMode="cover" />
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>{item.title}</Text>
        {item.subtitle && <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>}
      </View>
    </TouchableOpacity>
  );

  const renderDotIndicator = () => {
    return (
      <View style={styles.dotContainer}>
        {banners.map((_, index) => {
          const inputRange = [(index - 1) * screenWidth, index * screenWidth, (index + 1) * screenWidth];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.2, 0.8],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.4, 1, 0.4],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index}
              style={[
                styles.dot,
                {
                  transform: [{ scale }],
                  opacity,
                },
              ]}
            />
          );
        })}
      </View>
    );
  };

  return (
    <View>
      <Animated.FlatList
        ref={flatListRef}
        data={banners}
        renderItem={renderBanner}
        keyExtractor={(item: Banner) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: true })}
        onMomentumScrollEnd={(event: NativeSyntheticEvent<NativeScrollEvent>) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
          setCurrentIndex(newIndex);
        }}
      />
      {renderDotIndicator()}
    </View>
  );
};

// 快速篩選區組件
const QuickFilter = () => {
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [guestCount, setGuestCount] = useState({ adult: 2, child: 0 });

  return (
    <View style={styles.filterContainer}>
      {/* 日期選擇 */}
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => {
          /* 處理日期選擇 */
        }}
      >
        <Ionicons name="calendar-outline" size={24} color={colors.primary} />
        <View style={styles.filterItemContent}>
          <Text style={styles.filterLabel}>入住日期</Text>
          <Text style={styles.filterValue}>{selectedDate || "選擇日期"}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </TouchableOpacity>

      {/* 人數選擇 */}
      <TouchableOpacity
        style={styles.filterItem}
        onPress={() => {
          /* 處理人數選擇 */
        }}
      >
        <Ionicons name="people-outline" size={24} color={colors.primary} />
        <View style={styles.filterItemContent}>
          <Text style={styles.filterLabel}>住客人數</Text>
          <Text style={styles.filterValue}>
            大人 {guestCount.adult} 人{guestCount.child > 0 ? ` • 兒童 ${guestCount.child} 人` : ""}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color={colors.textLight} />
      </TouchableOpacity>

      {/* 熱門篩選標籤 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagScrollContainer}>
        {filterTags.map(tag => (
          <TouchableOpacity
            key={tag.id}
            style={[styles.filterTag, selectedTags.includes(tag.id) && styles.filterTagSelected]}
            onPress={() => {
              setSelectedTags(prev => (prev.includes(tag.id) ? prev.filter(id => id !== tag.id) : [...prev, tag.id]));
            }}
          >
            <MaterialIcons name={tag.icon as any} size={16} color={selectedTags.includes(tag.id) ? colors.background : colors.primary} />
            <Text style={[styles.filterTagText, selectedTags.includes(tag.id) && styles.filterTagTextSelected]}>{tag.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// 主題推薦區塊組件
const ThemeRecommendation = () => {
  const themeCategories: ThemeCategory[] = [
    {
      id: "luxury",
      title: "奢華享受",
      subtitle: "頂級套房，尊榮體驗",
      rooms: mockRooms.filter(room => room.price >= 5000),
    },
    {
      id: "family",
      title: "親子同樂",
      subtitle: "適合家庭入住的溫馨房型",
      rooms: mockRooms.filter(room => room.capacity.child > 0),
    },
    {
      id: "business",
      title: "商務精選",
      subtitle: "便捷舒適的商務房型",
      rooms: mockRooms.filter(room => room.type === "標準房"),
    },
  ];

  const renderThemeCard = ({ item: category }: { item: ThemeCategory }) => (
    <View style={styles.themeCard}>
      <Text style={styles.themeTitle}>{category.title}</Text>
      <Text style={styles.themeSubtitle}>{category.subtitle}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {category.rooms.map((room: Room) => (
          <TouchableOpacity
            key={room.id}
            style={styles.themeRoomCard}
            onPress={() => {
              // 導航到房間詳情
            }}
          >
            <Image source={{ uri: room.images[0].url }} style={styles.themeRoomImage} />
            <View style={styles.themeRoomInfo}>
              <Text style={styles.themeRoomName} numberOfLines={1}>
                {room.name}
              </Text>
              <Text style={styles.themeRoomPrice}>NT$ {room.price.toLocaleString()} 起</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  return (
    <View style={styles.themeContainer}>
      <Text style={styles.sectionTitle}>主題推薦</Text>
      <FlatList data={themeCategories} renderItem={renderThemeCard} keyExtractor={item => item.id} scrollEnabled={false} />
    </View>
  );
};

// 設施服務預覽組件
const FacilitiesPreview = () => {
  const renderFacilityItem = ({ item }: { item: Facility }) => (
    <View style={styles.facilityCard}>
      <View style={styles.facilityIconContainer}>
        <MaterialIcons name={item.icon} size={24} color={colors.primary} />
      </View>
      <View style={styles.facilityContent}>
        <Text style={styles.facilityName}>{item.name}</Text>
        <Text style={styles.facilityDescription}>{item.description}</Text>
        <View style={styles.facilityAvailability}>
          <MaterialIcons name="access-time" size={12} color={colors.textLight} />
          <Text style={styles.facilityAvailabilityText}>{item.available}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.facilitiesContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>設施服務</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>查看全部</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
      <FlatList
        data={mockFacilities}
        renderItem={renderFacilityItem}
        keyExtractor={item => item.id}
        numColumns={2}
        scrollEnabled={false}
        columnWrapperStyle={styles.facilitiesRow}
      />
    </View>
  );
};

// 評價區塊組件
const ReviewsSection = () => {
  // 計算總體評分統計
  const calculateOverallStats = () => {
    const totalRooms = mockRooms.length;
    const stats = {
      overall: 0,
      cleanliness: 0,
      service: 0,
      comfort: 0,
      location: 0,
      totalReviews: 0,
    };

    mockRooms.forEach(room => {
      stats.overall += room.rating.overall;
      stats.cleanliness += room.rating.cleanliness;
      stats.service += room.rating.service;
      stats.comfort += room.rating.comfort;
      stats.location += room.rating.location;
      stats.totalReviews += room.rating.count;
    });

    return {
      overall: (stats.overall / totalRooms).toFixed(1),
      cleanliness: (stats.cleanliness / totalRooms).toFixed(1),
      service: (stats.service / totalRooms).toFixed(1),
      comfort: (stats.comfort / totalRooms).toFixed(1),
      location: (stats.location / totalRooms).toFixed(1),
      totalReviews: stats.totalReviews,
    };
  };

  const stats = calculateOverallStats();

  const renderRatingBar = (label: string, value: string) => (
    <View style={styles.ratingBarContainer}>
      <Text style={styles.ratingLabel}>{label}</Text>
      <View style={styles.ratingBarWrapper}>
        <View style={[styles.ratingBar, { width: `${(Number(value) / 5) * 100}%` }]} />
      </View>
      <Text style={styles.ratingValue}>{value}</Text>
    </View>
  );

  const renderReviewCard = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <View style={styles.reviewUser}>
          {item.user.avatar ? (
            <Image source={{ uri: item.user.avatar }} style={styles.userAvatar} />
          ) : (
            <View style={[styles.userAvatar, styles.userAvatarPlaceholder]}>
              <Text style={styles.userAvatarText}>{item.user.name[0]}</Text>
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{item.user.name}</Text>
            <Text style={styles.userMeta}>
              {item.travelType} • {item.stayDuration}
            </Text>
          </View>
        </View>
        <View style={styles.reviewRating}>
          <Ionicons name="star" size={16} color={colors.primary} />
          <Text style={styles.reviewRatingText}>{item.rating.overall}</Text>
        </View>
      </View>

      <Text style={styles.roomType}>{item.roomType}</Text>
      <Text style={styles.reviewComment}>{item.comment}</Text>

      {item.images && item.images.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewImages}>
          {item.images.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.reviewImage} />
          ))}
        </ScrollView>
      )}

      <View style={styles.reviewFooter}>
        <Text style={styles.reviewDate}>{item.date}</Text>
        <TouchableOpacity style={styles.likeButton}>
          <Ionicons name="heart-outline" size={16} color={colors.textLight} />
          <Text style={styles.likeCount}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.reviewsContainer}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>住客評價</Text>
        <TouchableOpacity style={styles.viewAllButton}>
          <Text style={styles.viewAllText}>查看全部</Text>
          <MaterialIcons name="chevron-right" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.overallRating}>
        <View style={styles.ratingHeader}>
          <Text style={styles.ratingScore}>{stats.overall}</Text>
          <View style={styles.ratingMeta}>
            <Text style={styles.ratingText}>極致體驗</Text>
            <Text style={styles.reviewCount}>{stats.totalReviews} 則評價</Text>
          </View>
        </View>

        {renderRatingBar("清潔度", stats.cleanliness)}
        {renderRatingBar("服務", stats.service)}
        {renderRatingBar("舒適度", stats.comfort)}
        {renderRatingBar("位置", stats.location)}
      </View>

      <FlatList
        data={mockReviews}
        renderItem={renderReviewCard}
        keyExtractor={item => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={styles.reviewSeparator} />}
      />
    </View>
  );
};

export default function RoomListScreen() {
  const [rooms] = useState<Room[]>(mockRooms);
  const [searchQuery, setSearchQuery] = useState("");
  const { t } = useTranslation();

  const filteredRooms = rooms.filter(
    room =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.header}>
          <Text style={styles.title}>{t("home.title")}</Text>
          <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
          <View style={styles.searchContainer}>
            <Ionicons name="search-outline" size={20} color={colors.textLight} style={styles.searchIcon} />
            <TextInput
              style={styles.searchInput}
              placeholder={t("home.searchPlaceholder") || "搜尋房型..."}
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor={colors.textLight}
            />
          </View>
        </View>

        <BannerCarousel banners={mockBanners} />
        <QuickFilter />
        <ThemeRecommendation />
        <FacilitiesPreview />
        <ReviewsSection />

        <View style={styles.listContainer}>
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.h1.fontSize,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    paddingHorizontal: 12,
    marginTop: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    color: colors.text,
    fontSize: typography.body.fontSize,
  },
  listContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: 16,
    ...shadows.md,
  },
  imageContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  promotionBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  promotionText: {
    color: colors.background,
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
  },
  statusBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
  },
  statusText: {
    color: colors.background,
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
  },
  cardContent: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  roomName: {
    fontSize: typography.h3.fontSize,
    fontWeight: "bold",
    color: colors.text,
    flex: 1,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
    padding: 4,
    borderRadius: borderRadius.sm,
  },
  rating: {
    marginLeft: 4,
    color: colors.text,
    fontWeight: "600",
  },
  ratingCount: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginLeft: 4,
  },
  typeAndFloorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  typeContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  type: {
    marginLeft: 4,
    color: colors.textLight,
    fontSize: typography.caption.fontSize,
  },
  floor: {
    marginLeft: 8,
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },
  originalPrice: {
    fontSize: typography.body.fontSize,
    color: colors.textLight,
    textDecorationLine: "line-through",
    marginRight: 8,
  },
  price: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: "600",
    marginBottom: 8,
  },
  infoContainer: {
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  infoText: {
    marginLeft: 8,
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  highlightsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },
  highlightBadge: {
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: borderRadius.sm,
    marginRight: 8,
    marginBottom: 8,
  },
  highlightText: {
    fontSize: typography.caption.fontSize,
    color: colors.text,
  },
  description: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    lineHeight: 20,
  },
  titleContainer: {
    flex: 1,
  },
  bannerContainer: {
    height: 200,
    position: "relative",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
  },
  bannerContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  bannerTitle: {
    color: colors.background,
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    marginBottom: 4,
  },
  bannerSubtitle: {
    color: colors.background,
    fontSize: typography.body.fontSize,
  },
  dotContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.background,
    marginHorizontal: 4,
  },
  filterContainer: {
    padding: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  filterItemContent: {
    flex: 1,
    marginLeft: 12,
  },
  filterLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: 2,
  },
  filterValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  tagScrollContainer: {
    marginTop: 12,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
  },
  filterTagSelected: {
    backgroundColor: colors.primary,
  },
  filterTagText: {
    marginLeft: 4,
    fontSize: typography.caption.fontSize,
    color: colors.primary,
  },
  filterTagTextSelected: {
    color: colors.background,
  },
  themeContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  themeCard: {
    marginBottom: spacing.xl,
  },
  themeTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  themeSubtitle: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: spacing.md,
  },
  themeRoomCard: {
    width: 200,
    marginRight: spacing.md,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background,
    ...shadows.sm,
  },
  themeRoomImage: {
    width: "100%",
    height: 120,
    borderTopLeftRadius: borderRadius.lg,
    borderTopRightRadius: borderRadius.lg,
  },
  themeRoomInfo: {
    padding: spacing.sm,
  },
  themeRoomName: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.xs,
  },
  themeRoomPrice: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
  facilitiesContainer: {
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  viewAllText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    marginRight: spacing.xs,
  },
  facilitiesRow: {
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  facilityCard: {
    width: "48%",
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
    marginBottom: spacing.md,
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
    padding: spacing.md,
    backgroundColor: colors.background,
  },
  overallRating: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  ratingHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  ratingScore: {
    fontSize: 48,
    fontWeight: "bold",
    color: colors.text,
    marginRight: spacing.md,
  },
  ratingMeta: {
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
  ratingBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  ratingLabel: {
    width: 60,
    fontSize: typography.caption.fontSize,
    color: colors.text,
  },
  ratingBarWrapper: {
    flex: 1,
    height: 4,
    backgroundColor: colors.border,
    borderRadius: borderRadius.full,
    marginHorizontal: spacing.sm,
  },
  ratingBar: {
    height: "100%",
    backgroundColor: colors.primary,
    borderRadius: borderRadius.full,
  },
  ratingValue: {
    width: 30,
    fontSize: typography.caption.fontSize,
    color: colors.text,
    textAlign: "right",
  },
  reviewCard: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
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
  roomType: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: spacing.xs,
  },
  reviewComment: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 20,
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
  reviewSeparator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
});
