import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "../src/hooks/useTranslation";
import { colors, typography, borderRadius } from "../src/theme";

export default function BookingScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [checkIn, setCheckIn] = useState(new Date());
  const [checkOut, setCheckOut] = useState(new Date());
  const [showCheckIn, setShowCheckIn] = useState(false);
  const [showCheckOut, setShowCheckOut] = useState(false);
  const [guests, setGuests] = useState("2");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("zh-TW", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const calculateTotalNights = () => {
    const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateTotalPrice = () => {
    const nights = calculateTotalNights();
    const pricePerNight = 2800;
    return nights * pricePerNight;
  };

  const handleSubmit = () => {
    // TODO: 實作預訂邏輯
    router.back();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("booking.guestInfo")}</Text>

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowCheckIn(true)}>
          <Ionicons name="calendar" size={24} color={colors.text} />
          <Text style={styles.dateText}>
            {t("room.checkIn")}：{formatDate(checkIn)}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowCheckOut(true)}>
          <Ionicons name="calendar" size={24} color={colors.text} />
          <Text style={styles.dateText}>
            {t("room.checkOut")}：{formatDate(checkOut)}
          </Text>
        </TouchableOpacity>

        {showCheckIn && (
          <DateTimePicker
            value={checkIn}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowCheckIn(false);
              if (selectedDate) {
                setCheckIn(selectedDate);
              }
            }}
            minimumDate={new Date()}
          />
        )}

        {showCheckOut && (
          <DateTimePicker
            value={checkOut}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowCheckOut(false);
              if (selectedDate) {
                setCheckOut(selectedDate);
              }
            }}
            minimumDate={checkIn}
          />
        )}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("room.capacity")}</Text>
          <TextInput style={styles.input} value={guests} onChangeText={setGuests} keyboardType="number-pad" maxLength={1} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("booking.name")}</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder={t("booking.name")} />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("booking.phone")}</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder={t("booking.phone")} keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>{t("booking.email")}</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder={t("booking.email")} keyboardType="email-address" autoCapitalize="none" />
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>住宿天數</Text>
          <Text style={styles.summaryValue}>{calculateTotalNights()}晚</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t("booking.total")}</Text>
          <Text style={styles.summaryValue}>NT$ {calculateTotalPrice()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>{t("booking.confirmBooking")}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: typography.h2.fontSize,
    fontWeight: "bold",
    color: colors.text,
    marginBottom: 16,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: typography.body.fontSize,
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    padding: 12,
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  summary: {
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: borderRadius.md,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.border,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: typography.body.fontSize,
    color: colors.text,
  },
  summaryValue: {
    fontSize: typography.body.fontSize,
    fontWeight: "bold",
    color: colors.text,
  },
  submitButton: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: borderRadius.md,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonText: {
    color: colors.background,
    fontSize: typography.h3.fontSize,
    fontWeight: "600",
  },
});
