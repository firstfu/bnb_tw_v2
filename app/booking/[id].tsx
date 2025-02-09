import React from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { colors, typography, spacing, borderRadius, shadows } from "../../src/theme";

// 模擬訂單詳情資料
const mockBookingDetails = {
  id: "1",
  orderNumber: "BK20240310001",
  roomName: "豪華海景套房",
  roomImage: "https://images.unsplash.com/photo-1566665797739-1674de7a421a",
  checkIn: "2024-04-15",
  checkOut: "2024-04-17",
  guests: {
    adult: 2,
    child: 0,
  },
  status: "upcoming",
  totalPrice: 11600,
  bookingDate: "2024-03-10",
  paymentMethod: "信用卡",
  cardInfo: "**** **** **** 1234",
  contactInfo: {
    name: "王小明",
    phone: "0912-345-678",
    email: "wang@example.com",
  },
  specialRequests: "希望能安排高樓層房間，謝謝。",
  cancellationPolicy: "入住前3天免費取消，之後將收取首晚房費作為取消費用。",
};

const InfoItem = ({ icon, label, value }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoItem}>
    <Ionicons name={icon} size={20} color={colors.textLight} />
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

export default function BookingDetailsScreen() {
  const params = useLocalSearchParams();
  const booking = mockBookingDetails; // 實際應用中應該根據 params.id 獲取對應訂單資料

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "訂單詳情",
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.orderNumber}>訂單編號：{booking.orderNumber}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>即將入住</Text>
          </View>
        </View>

        <View style={styles.roomInfo}>
          <Image source={{ uri: booking.roomImage }} style={styles.roomImage} />
          <View style={styles.roomDetails}>
            <Text style={styles.roomName}>{booking.roomName}</Text>
            <Text style={styles.price}>NT$ {booking.totalPrice.toLocaleString()}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>入住資訊</Text>
          <InfoItem icon="calendar-outline" label="入住日期" value={formatDate(booking.checkIn)} />
          <InfoItem icon="calendar-outline" label="退房日期" value={formatDate(booking.checkOut)} />
          <InfoItem icon="people-outline" label="入住人數" value={`大人 ${booking.guests.adult} 人${booking.guests.child ? ` • 兒童 ${booking.guests.child} 人` : ""}`} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>訂購人資訊</Text>
          <InfoItem icon="person-outline" label="姓名" value={booking.contactInfo.name} />
          <InfoItem icon="call-outline" label="聯絡電話" value={booking.contactInfo.phone} />
          <InfoItem icon="mail-outline" label="電子信箱" value={booking.contactInfo.email} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>付款資訊</Text>
          <InfoItem icon="card-outline" label="付款方式" value={`${booking.paymentMethod} (${booking.cardInfo})`} />
          <InfoItem icon="calendar-outline" label="訂購日期" value={formatDate(booking.bookingDate)} />
        </View>

        {booking.specialRequests && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>特殊需求</Text>
            <Text style={styles.specialRequests}>{booking.specialRequests}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取消政策</Text>
          <Text style={styles.cancellationPolicy}>{booking.cancellationPolicy}</Text>
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
  headerTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  orderNumber: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  statusBadge: {
    backgroundColor: `${colors.primary}20`,
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.caption.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
  roomInfo: {
    padding: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.backgroundLight,
  },
  roomImage: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.md,
  },
  roomDetails: {
    flex: 1,
    marginLeft: spacing.md,
  },
  roomName: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  infoItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  infoContent: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  infoLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  specialRequests: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
  },
  cancellationPolicy: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
  },
});
