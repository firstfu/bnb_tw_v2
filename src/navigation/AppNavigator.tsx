import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import RoomListScreen from "../screens/RoomListScreen";
import RoomDetailScreen from "../screens/RoomDetailScreen";
import BookingScreen from "../screens/BookingScreen";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const RoomStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#fff",
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      },
      headerTitleStyle: {
        fontSize: 18,
        fontWeight: "600",
      },
    }}
  >
    <Stack.Screen name="RoomList" component={RoomListScreen} options={{ title: "房型列表" }} />
    <Stack.Screen name="RoomDetail" component={RoomDetailScreen} options={{ title: "房型詳情" }} />
    <Stack.Screen name="Booking" component={BookingScreen} options={{ title: "預訂房間" }} />
  </Stack.Navigator>
);

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Bookings") {
              iconName = focused ? "calendar" : "calendar-outline";
            } else if (route.name === "Profile") {
              iconName = focused ? "person" : "person-outline";
            }

            return <Ionicons name={iconName as any} size={size} color={color} />;
          },
          tabBarActiveTintColor: "#e53935",
          tabBarInactiveTintColor: "gray",
          headerShown: false,
        })}
      >
        <Tab.Screen name="Home" component={RoomStack} options={{ title: "首頁" }} />
        <Tab.Screen name="Bookings" component={BookingScreen} options={{ title: "我的訂單" }} />
        <Tab.Screen name="Profile" component={RoomListScreen} options={{ title: "個人資料" }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
