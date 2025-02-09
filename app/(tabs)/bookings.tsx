import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { colors, typography, spacing, borderRadius, shadows } from "../../src/theme";

interface Booking {
  id: string;
  roomName: string;
  roomImage: string;
  checkIn: string;
  checkOut: string;
  guests: {
    adult: number;
    child: number;
  };
  status: "upcoming" | "completed" | "cancelled";
  totalPrice: number;
  bookingDate: string;
  orderNumber: string;
}

const mockBookings: Booking[] = [
  {
    id: "1",
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
    orderNumber: "BK20240310001",
  },
  {
    id: "2",
    roomName: "溫馨家庭房",
    roomImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461",
    checkIn: "2024-03-01",
    checkOut: "2024-03-03",
    guests: {
      adult: 2,
      child: 2,
    },
    status: "completed",
    totalPrice: 8400,
    bookingDate: "2024-02-15",
    orderNumber: "BK20240215003",
  },
  {
    id: "3",
    roomName: "精緻雙人房",
    roomImage: "https://images.unsplash.com/photo-1590490359683-658d3d23f972",
    checkIn: "2024-02-14",
    checkOut: "2024-02-15",
    guests: {
      adult: 2,
      child: 0,
    },
    status: "cancelled",
    totalPrice: 3500,
    bookingDate: "2024-01-20",
    orderNumber: "BK20240120002",
  },
];

const BookingStatusBadge = ({ status }: { status: Booking["status"] }) => {
  const getStatusInfo = () => {
    switch (status) {
      case "upcoming":
        return {
          label: "即將入住",
          color: colors.primary,
          bgColor: `${colors.primary}20`,
        };
      case "completed":
        return {
          label: "已完成",
          color: colors.success,
          bgColor: `${colors.success}20`,
        };
      case "cancelled":
        return {
          label: "已取消",
          color: colors.error,
          bgColor: `${colors.error}20`,
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <View style={[styles.statusBadge, { backgroundColor: statusInfo.bgColor }]}>
      <Text style={[styles.statusText, { color: statusInfo.color }]}>{statusInfo.label}</Text>
    </View>
  );
};

const BookingCard = ({ booking }: { booking: Booking }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleViewDetails = () => {
    router.push({
      pathname: "/booking/[id]",
      params: {
        id: booking.id,
        orderNumber: booking.orderNumber,
      },
    });
  };

  const handleCancelBooking = () => {
    Alert.alert(
      "取消訂房",
      "確定要取消此筆訂房嗎？取消後將依取消政策進行退款。",
      [
        {
          text: "再想想",
          style: "cancel",
        },
        {
          text: "確定取消",
          style: "destructive",
          onPress: () => {
            // 這裡處理取消訂房的邏輯
            Alert.alert("訂房已取消", "我們將依取消政策進行退款處理，退款將於 3-5 個工作天內完成。");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Image source={{ uri: booking.roomImage }} style={styles.roomImage} />
        <View style={styles.headerInfo}>
          <Text style={styles.roomName}>{booking.roomName}</Text>
          <Text style={styles.orderNumber}>訂單編號：{booking.orderNumber}</Text>
        </View>
        <BookingStatusBadge status={booking.status} />
      </View>

      <View style={styles.cardContent}>
        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoLabel}>入住日期</Text>
            <Text style={styles.infoValue}>{formatDate(booking.checkIn)}</Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="calendar-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoLabel}>退房日期</Text>
            <Text style={styles.infoValue}>{formatDate(booking.checkOut)}</Text>
          </View>
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Ionicons name="people-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoLabel}>入住人數</Text>
            <Text style={styles.infoValue}>
              大人 {booking.guests.adult} 人{booking.guests.child > 0 ? ` • 兒童 ${booking.guests.child} 人` : ""}
            </Text>
          </View>
          <View style={styles.infoItem}>
            <Ionicons name="cash-outline" size={16} color={colors.textLight} />
            <Text style={styles.infoLabel}>總金額</Text>
            <Text style={styles.infoValue}>NT$ {booking.totalPrice.toLocaleString()}</Text>
          </View>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <TouchableOpacity style={styles.actionButton} onPress={handleViewDetails}>
          <Text style={styles.actionButtonText}>查看詳情</Text>
        </TouchableOpacity>
        {booking.status === "upcoming" && (
          <TouchableOpacity style={[styles.actionButton, styles.cancelButton]} onPress={handleCancelBooking}>
            <Text style={[styles.actionButtonText, styles.cancelButtonText]}>取消訂房</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default function BookingsScreen() {
  const [bookings] = useState<Booking[]>(mockBookings);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>訂房記錄</Text>
      </View>

      <FlatList
        data={bookings}
        renderItem={({ item }) => <BookingCard booking={item} />}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  title: {
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    color: colors.text,
  },
  listContainer: {
    padding: spacing.md,
  },
  card: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  roomImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
  },
  headerInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },
  roomName: {
    fontSize: typography.body.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: 4,
  },
  orderNumber: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
  },
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: borderRadius.full,
  },
  statusText: {
    fontSize: typography.caption.fontSize,
    fontWeight: "600",
  },
  cardContent: {
    padding: spacing.md,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginTop: 4,
    marginBottom: 2,
  },
  infoValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  cardFooter: {
    flexDirection: "row",
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  actionButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: typography.body.fontSize,
    color: colors.primary,
    fontWeight: "600",
  },
  cancelButton: {
    borderLeftWidth: 1,
    borderLeftColor: colors.border,
  },
  cancelButtonText: {
    color: colors.error,
  },
});
