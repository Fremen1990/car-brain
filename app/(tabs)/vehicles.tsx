import { Text, SafeAreaView, View } from "@/components/Themed";
import { ProgressBar, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image, FlatList, ViewToken, Dimensions } from "react-native";

import * as Animatable from "react-native-animatable";

import { vehicles } from "@/db/vehicles";
import React, { useState } from "react";

export interface Vehicle {
  id: number;
  brand: string;
  model: string;
  year: number;
  licensePlate: string;
  mileage: number;
  nextService: string;
  vin: string;
  registration: {
    expiryDate: string;
  };
  insurance: {
    status: string;
    provider: string;
    renewalDate: string;
  };
  image: number;
  fuelEfficiency: number;
}

export interface VehicleCardProps {
  vehicle: Vehicle;
  activeItem: number;
}

const screenWidth = Dimensions.get("window").width;
const screenHeight = Dimensions.get("window").height;
const isLargeScreen = screenWidth > 800; // Adjust based on screen size
const isPortrait = screenHeight > screenWidth;

export const VehicleCard = ({ vehicle, activeItem }: VehicleCardProps) => {
  console.log("vehicle", vehicle);

  const zoomIn = {
    from: {
      scale: 0.9,
    },
    to: {
      scale: 1.05,
    },
  };

  const zoomOut = {
    from: {
      scale: 1.1,
    },
    to: {
      scale: 0.9,
    },
  };

  const zoomInZoomOutAnimation = activeItem === vehicle.id ? zoomIn : zoomOut;

  console.log("activeItem", activeItem);
  console.log("vehicle.id", vehicle);

  return (
    <Animatable.View
      className="bg-[#232533] rounded-xl p-4 mb-5 mr-4 shadow-lg shadow-black"
      style={{
        width: !isPortrait
          ? screenWidth * 0.3
          : screenWidth * (isLargeScreen ? 0.6 : 0.8), // Adjust card width based on screen size
      }}
      animation={isPortrait ? zoomInZoomOutAnimation : false} // Use the fixed animations
      duration={500}
      useNativeDriver={true}
    >
      {/* Vehicle Image */}
      <Image
        source={vehicle.image}
        className="w-full h-44 rounded-xl"
        style={{
          height: screenHeight * (isLargeScreen ? 0.2 : 0.4), // Dynamic height based on screen size

          resizeMode: "cover",
        }}
      />

      {/* Vehicle Info */}
      <View className="mt-4">
        <Text className="text-[#FFA001] text-xl font-bold">
          {vehicle.brand} {vehicle.model}
        </Text>
        <Text className="text-[#CDCDE0] text-sm mt-1">
          Year: {vehicle.year} | Mileage: {vehicle.mileage} miles
        </Text>
        <Text className="text-[#CDCDE0] text-sm mt-1">VIN: {vehicle.vin}</Text>
        <Text className="text-[#CDCDE0] text-sm mt-1">
          License Plate: {vehicle.licensePlate}
        </Text>
      </View>

      {/* Service and Insurance */}
      <View className="mt-4">
        <Text className="text-white text-base font-bold">
          Next Service: {vehicle.nextService}
        </Text>
        <ProgressBar
          progress={0.75}
          color="#FFA001"
          className="h-2 mt-2 rounded-lg"
        />

        <Text className="text-white text-base font-bold mt-4">
          Insurance: {vehicle.insurance.status} (Renews{" "}
          {vehicle.insurance.renewalDate})
        </Text>
        <Ionicons
          name="shield-checkmark"
          size={24}
          color={vehicle.insurance.status === "Active" ? "green" : "red"}
          className="mt-2"
        />
      </View>

      {/* Fuel Efficiency */}
      <View className="mt-4">
        <Text className="text-white text-base font-bold">
          Fuel Efficiency: {vehicle.fuelEfficiency} L/100km
        </Text>
        <Button
          mode="outlined"
          onPress={() => {
            /* Navigate to fuel logs */
          }}
          className="mt-2"
        >
          View Fuel Logs
        </Button>
        {/*</View>*/}
      </View>
    </Animatable.View>
  );
};

const Vehicles = () => {
  const [activeItem, setActiveItem] = useState(vehicles[0].id);

  const viewableItemsChanged = ({
    viewableItems,
  }: {
    viewableItems: ViewToken[];
  }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].item.id); // Update with correct vehicle ID
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="flex-row items-center justify-between w-full p-6">
        <Text className="text-4xl text-[#FFA001] font-bold">Vehicles</Text>
      </View>
      <FlatList
        data={vehicles}
        horizontal={true}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <VehicleCard vehicle={item} activeItem={activeItem} />
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 50,
        }}
        contentOffset={{ x: 30, y: 0 }}
        contentContainerStyle={{
          padding: 16,
          justifyContent: "space-around",
          alignItems: "center",
          flexGrow: 1,
          paddingLeft: screenWidth * 0.2, // Adjust to allow items to be centered
          paddingRight: screenWidth * 0.2, // Add padding to center the last item
        }}
        showsHorizontalScrollIndicator={false}
        snapToAlignment="center"
      />
    </SafeAreaView>
  );
};

export default Vehicles;
