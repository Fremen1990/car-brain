import React from "react";
import { ScrollView, Dimensions, Image, Pressable } from "react-native";
import { SafeAreaView, View, Text } from "@/components/Themed";

import { LineChart, PieChart } from "react-native-chart-kit";
import { ProgressBar } from "react-native-paper";
import { StatusBar } from "expo-status-bar";
import Ionicons from "@expo/vector-icons/Ionicons";

import { images } from "../../constants";
import { router } from "expo-router";

// Example of user data (you can fetch it from Firestore or any backend)
const user = {
  username: "JohnDoe",
  avatar: images.driverAvatar, // Path to user avatar image
};

const screenWidth = Dimensions.get("window").width;

const Dashboard = () => {
  // Example data (this would typically come from a backend or Firestore)
  const vehicle = {
    brand: "BMW",
    model: "320D E91",
    year: 2015,
    mileage: 90000,
    vin: "WBAUT72030A232023",
    fuelEfficiency: [6.5, 5.8, 5.9, 5.7, 6.0], // Fuel efficiency over time
    avgFuelConsumption: 5.8, // Average fuel consumption
    nextService: "95,000 miles",
    insurance: {
      renewalDate: "2025-02-15",
      status: "Active",
    },
    recentActivities: [
      { id: 1, activity: "Refueled 50 liters", date: "2024-10-01" },
      { id: 2, activity: "Service completed", date: "2024-09-20" },
      { id: 3, activity: "Insurance renewal reminder", date: "2024-09-15" },
    ],
  };

  // Data for the fuel efficiency line chart
  const fuelEfficiencyData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May"],
    datasets: [
      {
        data: vehicle.fuelEfficiency,
        color: (opacity = 1) => `rgba(255, 160, 1, ${opacity})`, // Line color
        strokeWidth: 2,
      },
    ],
  };

  // Data for service and maintenance pie chart
  const maintenanceData = [
    {
      name: "Service",
      population: 45,
      color: "#FFA001",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Tires",
      population: 30,
      color: "#3366FF",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Repairs",
      population: 25,
      color: "#FF6666",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <StatusBar style="light" />

        {/* User Avatar and Greeting */}
        <View className="flex-row items-center bg-gradient-to-r from-[#1E1E2C] to-[#232533] rounded-xl p-4 mb-6 shadow-lg w-full justify-center">
          {/* User Avatar */}
          <Image
            source={images.driverAvatar}
            className="w-16 h-16 rounded-full border-2 border-[#FFA001] mr-4"
            resizeMode="contain"
            tintColor={"#FFA001"}
          />

          {/* Hello Message */}
          <View className="p-3 rounded-xl bg-[#2A2A3D]">
            <Text className="text-[#FFA001] text-2xl font-bold">
              Hi, {user.username}!
            </Text>
            <Text className="text-[#CDCDE0] text-base">
              Welcome back to Car Brain.
            </Text>
          </View>
        </View>

        {/* Average Fuel Consumption and Mileage Overview */}
        <View className="bg-[#232533] rounded-xl p-4 mb-6">
          <Text className="text-[#FFA001] text-2xl font-bold">
            Your Vehicles
          </Text>
          <Text className="text-[#CDCDE0] text-base mt-2">
            Current average fuel consumption: {vehicle.avgFuelConsumption}{" "}
            L/100km
          </Text>
          <Text className="text-[#CDCDE0] text-base mt-2">
            Total mileage: {vehicle.mileage} miles
          </Text>

          {/* Link to Vehicles Route */}
          <View className="mt-4">
            <Pressable
              onPress={() => {
                router.push("/(tabs)/vehicles");
              }}
              className="flex-row items-center justify-center bg-[#FFA001] py-2 px-4 rounded-lg shadow-md"
            >
              <Text className="text-black text-lg font-semibold mr-2">
                View All Vehicles
              </Text>
              <Ionicons name="arrow-forward-circle" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Fuel Efficiency Line Chart */}
        <View className="bg-[#232533] rounded-xl p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Fuel Efficiency
          </Text>
          <LineChart
            data={fuelEfficiencyData}
            width={screenWidth - 40} // Width based on screen size
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#161622",
              backgroundGradientTo: "#161622",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              strokeWidth: 2,
            }}
            bezier
            style={{
              borderRadius: 16,
            }}
          />
        </View>

        {/* Recent Activities Section */}
        <View className="bg-[#232533] rounded-xl p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Recent Activities
          </Text>
          {vehicle.recentActivities.map((activity) => (
            <View key={activity.id} className="mb-2 p-3 rounded-xl">
              <Text className="text-[#FFA001] text-base">
                {activity.activity} - {activity.date}
              </Text>
            </View>
          ))}

          {/* Link to History Route */}
          <View className="mt-4">
            <Pressable
              onPress={() => {
                router.push("/(tabs)/history");
              }}
              className="flex-row items-center justify-center bg-[#FFA001] py-2 px-4 rounded-lg shadow-md"
            >
              <Text className="text-black text-lg font-semibold mr-2">
                View Full History
              </Text>
              <Ionicons name="arrow-forward-circle" size={24} color="black" />
            </Pressable>
          </View>
        </View>

        {/* Service & Maintenance Pie Chart */}
        <View className="bg-[#232533] rounded-xl p-4 mb-6">
          <Text className="text-white text-lg font-bold mb-4">
            Maintenance Breakdown
          </Text>
          <PieChart
            data={maintenanceData}
            width={screenWidth - 40} // Width based on screen size
            height={220}
            chartConfig={{
              backgroundGradientFrom: "#161622",
              backgroundGradientTo: "#161622",
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            }}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            absolute
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
