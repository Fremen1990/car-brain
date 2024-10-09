import React, { useState } from "react";
import FormField from "@/components/FormField";
import { Button } from "react-native-paper";
import { SafeAreaView, View, Text } from "@/components/Themed";
import { ScrollView, Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import BouncyCheckbox from "react-native-bouncy-checkbox/lib";

export interface Vehicle {
  brand: string;
  model: string;
  year: number;
  mileage: number;
  vin: string;
  licensePlate: string;
  nextService: string;
  technicalInspectionDate: string;
  insuranceProvider: string;
  insuranceRenewal: string;
  image: string;
}

const AddVehicle = () => {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    vin: "",
    licensePlate: "",
    nextService: "",
    technicalInspectionDate: "",
    insuranceProvider: "",
    insuranceRenewal: "",
    image: "",
  });

  const scale = useSharedValue(1); // Shared value for the animation

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });

  const handlePressIn = () => {
    scale.value = withSpring(1.1);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const handleAddVehicle = () => {
    const newVehicle = {
      id: Math.random().toString(), // Generate random ID for simplicity // TODO use here apwrite uuid
      brand: form.brand,
      model: form.model,
      year: parseInt(form.year),
      mileage: parseInt(form.mileage),
      vin: form.vin,
      licensePlate: form.licensePlate,
      nextService: form.nextService,
      technicalInspectionDate: form.technicalInspectionDate,
      insuranceProvider: form.insuranceProvider,
      insuranceRenewal: form.insuranceRenewal,
    };

    console.log("New Vehicle:", newVehicle);
    // Here you can send the newVehicle data to the backend or Firestore
  };

  //TODO: add validation with react-hook-form

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="space-y-4">
          <Text className="text-2xl text-white font-bold mb-6">
            Add New Vehicle
          </Text>

          {/* Form Fields */}
          <FormField
            title="Brand"
            value={form.brand}
            placeholder="Enter vehicle brand"
            handleChangeText={(value) => handleChange("brand", value)}
          />
          <FormField
            title="Model"
            value={form.model}
            placeholder="Enter vehicle model"
            handleChangeText={(value) => handleChange("model", value)}
          />
          <FormField
            title="Year"
            value={form.year}
            placeholder="Enter year of manufacture"
            keyboardType="numeric"
            handleChangeText={(value) => handleChange("year", value)}
          />
          <FormField
            title="Mileage"
            value={form.mileage}
            placeholder="Enter current mileage"
            keyboardType="numeric"
            handleChangeText={(value) => handleChange("mileage", value)}
          />
          <FormField
            title="VIN"
            value={form.vin}
            placeholder="Enter VIN number"
            handleChangeText={(value) => handleChange("vin", value)}
          />
          <FormField
            title="License Plate"
            value={form.licensePlate}
            placeholder="Enter license plate"
            handleChangeText={(value) => handleChange("licensePlate", value)}
          />
          <FormField
            title="Next Service"
            value={form.nextService}
            placeholder="Enter next service (e.g., 95,000 miles)"
            handleChangeText={(value) => handleChange("nextService", value)}
          />

          <FormField
            title="Insurance Provider"
            value={form.insuranceProvider}
            placeholder="Enter insurance provider"
            handleChangeText={(value) =>
              handleChange("insuranceProvider", value)
            }
          />

          <FormField
            title="Insurance Renewal Date"
            value={form.insuranceRenewal}
            placeholder="Enter insurance renewal date (YYYY-MM-DD)"
            handleChangeText={(value) =>
              handleChange("insuranceRenewal", value)
            }
          />

          {/* Submit Button */}
          <Animated.View style={[animatedStyle]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleAddVehicle}
            >
              <Button mode="contained" className="bg-[#FFA001] rounded-lg">
                Add Vehicle
              </Button>
            </Pressable>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddVehicle;
