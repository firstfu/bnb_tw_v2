import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Ionicons } from "@expo/vector-icons";

export default function BookingScreen() {
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>入住資訊</Text>

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowCheckIn(true)}>
          <Ionicons name="calendar" size={24} color="#666" />
          <Text style={styles.dateText}>入住日期：{formatDate(checkIn)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.dateInput} onPress={() => setShowCheckOut(true)}>
          <Ionicons name="calendar" size={24} color="#666" />
          <Text style={styles.dateText}>退房日期：{formatDate(checkOut)}</Text>
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
          <Text style={styles.label}>入住人數</Text>
          <TextInput style={styles.input} value={guests} onChangeText={setGuests} keyboardType="number-pad" maxLength={1} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>訂房人資料</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>姓名</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="請輸入姓名" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>電話</Text>
          <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="請輸入電話" keyboardType="phone-pad" />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="請輸入Email" keyboardType="email-address" autoCapitalize="none" />
        </View>
      </View>

      <View style={styles.summary}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>住宿天數</Text>
          <Text style={styles.summaryValue}>{calculateTotalNights()}晚</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>總金額</Text>
          <Text style={styles.summaryValue}>NT$ {calculateTotalPrice()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitButtonText}>確認預訂</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  dateInput: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
  },
  dateText: {
    marginLeft: 8,
    fontSize: 16,
    color: "#333",
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: "#666",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  summary: {
    backgroundColor: "#f5f5f5",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: "#666",
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  submitButton: {
    backgroundColor: "#e53935",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 32,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});
