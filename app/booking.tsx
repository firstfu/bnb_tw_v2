import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, TextInput, Alert, Platform } from "react-native";
import { Stack, useLocalSearchParams, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import Button from "../src/components/Button";
import { colors, typography, spacing, borderRadius, shadows } from "../src/theme";

type BookingParams = {
  roomId: string;
  roomName: string;
  checkIn?: string;
  checkOut?: string;
  guests?: string;
};

export default function BookingScreen() {
  const params = useLocalSearchParams<BookingParams>();
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    specialRequests: "",
  });
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [checkInDate, setCheckInDate] = useState<Date | null>(params.checkIn ? new Date(params.checkIn) : null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(params.checkOut ? new Date(params.checkOut) : null);

  const guests = params.guests ? JSON.parse(params.guests) : { adult: 2, child: 0 };

  const formatDate = (date: Date | null) => {
    if (!date) return "選擇日期";
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleCheckInChange = (event: any, selectedDate?: Date) => {
    setShowCheckIn(Platform.OS === "ios");
    if (selectedDate) {
      setCheckInDate(selectedDate);
      if (checkOutDate && selectedDate > checkOutDate) {
        setCheckOutDate(null);
      }
    }
  };

  const handleCheckOutChange = (event: any, selectedDate?: Date) => {
    setShowCheckOut(Platform.OS === "ios");
    if (selectedDate) {
      setCheckOutDate(selectedDate);
    }
  };

  const handleSubmit = () => {
    if (!checkInDate || !checkOutDate) {
      Alert.alert("提醒", "請選擇入住和退房日期");
      return;
    }

    if (!formData.name || !formData.phone || !formData.email) {
      Alert.alert("提醒", "請填寫完整的訂購人資料");
      return;
    }

    Alert.alert("預訂確認", "您的預訂已送出，我們將盡快處理您的訂單。", [
      {
        text: "確定",
        onPress: () => {
          router.push("/bookings");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Stack.Screen
        options={{
          title: "預訂房間",
          headerTitleStyle: styles.headerTitle,
        }}
      />
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>預訂資訊</Text>
          <Text style={styles.roomName}>{params.roomName}</Text>

          <TouchableOpacity style={styles.datePickerButton} onPress={() => setShowCheckIn(true)}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={styles.datePickerContent}>
              <Text style={styles.datePickerLabel}>入住日期</Text>
              <Text style={styles.datePickerValue}>{formatDate(checkInDate)}</Text>
            </View>
          </TouchableOpacity>

          {showCheckIn && (
            <DateTimePicker
              value={checkInDate || new Date()}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleCheckInChange}
              minimumDate={new Date()}
            />
          )}

          <TouchableOpacity style={[styles.datePickerButton, !checkInDate && styles.datePickerButtonDisabled]} onPress={() => checkInDate && setShowCheckOut(true)}>
            <Ionicons name="calendar-outline" size={24} color={colors.primary} />
            <View style={styles.datePickerContent}>
              <Text style={styles.datePickerLabel}>退房日期</Text>
              <Text style={styles.datePickerValue}>{formatDate(checkOutDate)}</Text>
            </View>
          </TouchableOpacity>

          {showCheckOut && checkInDate && (
            <DateTimePicker
              value={checkOutDate || checkInDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleCheckOutChange}
              minimumDate={new Date(checkInDate.getTime() + 24 * 60 * 60 * 1000)}
            />
          )}

          <TouchableOpacity style={styles.guestPickerButton}>
            <Ionicons name="people-outline" size={24} color={colors.primary} />
            <View style={styles.guestPickerContent}>
              <Text style={styles.guestPickerLabel}>住客人數</Text>
              <Text style={styles.guestPickerValue}>
                大人 {guests.adult} 人{guests.child > 0 ? ` • 兒童 ${guests.child} 人` : ""}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>訂購人資料</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>姓名</Text>
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={text => setFormData(prev => ({ ...prev, name: text }))}
              placeholder="請輸入姓名"
              placeholderTextColor={colors.textLight}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>聯絡電話</Text>
            <TextInput
              style={styles.input}
              value={formData.phone}
              onChangeText={text => setFormData(prev => ({ ...prev, phone: text }))}
              placeholder="請輸入聯絡電話"
              placeholderTextColor={colors.textLight}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>電子信箱</Text>
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={text => setFormData(prev => ({ ...prev, email: text }))}
              placeholder="請輸入電子信箱"
              placeholderTextColor={colors.textLight}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>特殊需求（選填）</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={formData.specialRequests}
              onChangeText={text => setFormData(prev => ({ ...prev, specialRequests: text }))}
              placeholder="如有特殊需求請在此說明"
              placeholderTextColor={colors.textLight}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>取消政策</Text>
          <Text style={styles.policyText}>
            • 入住前3天免費取消{"\n"}• 入住前2天取消將收取首晚房費{"\n"}• 入住當天取消或未到將收取全額房費
          </Text>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button title="確認預訂" onPress={handleSubmit} />
      </View>
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
  section: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  sectionTitle: {
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
    color: colors.text,
    marginBottom: spacing.md,
  },
  roomName: {
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: spacing.md,
  },
  datePickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.sm,
  },
  datePickerButtonDisabled: {
    opacity: 0.5,
  },
  datePickerContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  datePickerLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: 2,
  },
  datePickerValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  guestPickerButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
  },
  guestPickerContent: {
    marginLeft: spacing.sm,
    flex: 1,
  },
  guestPickerLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.textLight,
    marginBottom: 2,
  },
  guestPickerValue: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: typography.caption.fontSize,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  input: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  policyText: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    lineHeight: 24,
  },
  footer: {
    padding: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
