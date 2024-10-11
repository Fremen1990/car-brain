import { Text, SafeAreaView, View } from "@/components/Themed";
import { FlatList, ViewToken, Dimensions } from "react-native";

import { vehicles } from "@/db/vehicles";
import React, { useState } from "react";
import { VehicleFormData } from "@/app/(tabs)/(add)/add-vehicle";
import { VehicleCard } from "@/components/VehicleCard";

export interface VehicleResponse extends VehicleFormData {
  id: number;
  fuelEfficiency: number;
}

const screenWidth = Dimensions.get("window").width;

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
