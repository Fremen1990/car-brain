import { Text, SafeAreaView, View } from "@/components/Themed";
import { ProgressBar, Button } from "react-native-paper";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView, Image } from "react-native";

import { vehicles } from "@/db/vehicles";

const Vehicles = () => {
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        horizontal={true}
        contentContainerStyle={[
          { padding: 16 },
          // vehicles.length === 1
          //   ? { justifyContent: "center", alignItems: "center", flexGrow: 1 }
          //   : {}, // Center the vehicle if only one

          {
            justifyContent: "space-around",
            alignItems: "center",

            flexGrow: 1,
          },
        ]}
        showsHorizontalScrollIndicator={false} // Hide scroll indicator for cleaner look
      >
        {vehicles.map((vehicle) => (
          <View
            key={vehicle.id}
            className="bg-[#232533] rounded-xl p-4 mb-5 mr-4 shadow-lg shadow-black"
            style={{ width: 300 }} // Set a fixed width for each card
          >
            {/* Vehicle Image */}
            <Image source={vehicle.image} className="w-full h-44 rounded-xl" />

            {/* Vehicle Info */}
            <View className="mt-4">
              <Text className="text-[#FFA001] text-xl font-bold">
                {vehicle.brand} {vehicle.model}
              </Text>
              <Text className="text-[#CDCDE0] text-sm mt-1">
                Year: {vehicle.year} | Mileage: {vehicle.mileage} miles
              </Text>
              <Text className="text-[#CDCDE0] text-sm mt-1">
                VIN: {vehicle.vin}
              </Text>
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
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Vehicles;
