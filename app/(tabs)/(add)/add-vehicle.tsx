import React, { useState } from "react";
import FormField from "@/components/FormField";
import { Button } from "react-native-paper";
import { SafeAreaView, View, Text } from "@/components/Themed";
import { ScrollView, Pressable, Alert } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useForm } from "react-hook-form";
import { createVehicle } from "@/lib/appwrite";
import { router } from "expo-router";

export interface VehicleFormData {
  brand: string;
  model: string;
  year: string;
  licensePlate: string;
  vin: string;
  mileage: string;
  nextService: string;
  technicalInspectionDate: string;
  insuranceProvider: string;
  insuranceRenewal: string;
  image: any;
}

// TODO Refactor!!

const AddVehicle = () => {
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

  const onSubmitAddVehicle = async (newVehicle: VehicleFormData) => {
    try {
      await createVehicle(newVehicle);
      router.push("/vehicles"); // Navigate to payments screen in (add) folder
    } catch (error) {
      Alert.alert("Error", `Failed to add vehicle! \n ${error}`);
      console.log("Error", error);
    }

    //TODO:  implement functionality to add vehicle image and save it to the storage
    // add the image url to the vehicle collection
  };

  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<VehicleFormData>({
    defaultValues: {
      brand: "",
      model: "",
      year: "",
      licensePlate: "",
      vin: "",
      mileage: "",
      nextService: "",
      technicalInspectionDate: "",
      insuranceProvider: "",
      insuranceRenewal: "",
      image:
        "https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    },
  });

  console.log("errors", errors);

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
            placeholder="Enter vehicle brand"
            name="brand"
            control={control}
            rules={{ required: "Brand is required" }}
            errors={errors}
          />
          <FormField
            title="Model"
            placeholder="Enter vehicle model"
            name="model"
            control={control}
            rules={{ required: "Model is required" }}
            errors={errors}
          />
          <FormField
            title="Year"
            placeholder="Enter year of manufacture"
            keyboardType="numeric"
            name="year"
            control={control}
            rules={{ required: "Year is required" }}
            errors={errors}
          />
          <FormField
            title="License Plate"
            placeholder="Enter license plate"
            name="licensePlate"
            control={control}
            rules={{ required: "License Plate is required" }}
            errors={errors}
          />
          <FormField
            title="VIN"
            placeholder="Enter VIN number"
            name="vin"
            control={control}
            // rules={{
            //   // add custom message "VIN need to be 17 characters long"
            //   minLength: {
            //     required: false,
            //     value: 17,
            //     message: "VIN need to be 17 characters long",
            //   },
            // }}
            errors={errors}
          />
          <FormField
            title="Mileage"
            placeholder="Enter current mileage"
            keyboardType="numeric"
            name="mileage"
            control={control}
            errors={errors}
          />
          <FormField
            title="Next Service"
            placeholder="Enter next service (e.g., 95,000 miles)"
            name="nextService"
            control={control}
            errors={errors}
          />

          <FormField
            title="Insurance Provider"
            placeholder="Enter insurance provider"
            name="insuranceProvider"
            control={control}
            errors={errors}
          />

          <FormField
            title="Insurance Renewal Date"
            placeholder="Enter insurance renewal date (YYYY-MM-DD)"
            name="insuranceRenewal"
            control={control}
            errors={errors}
          />

          {/* Submit Button */}
          {/* TODO: Create animated Pressable button (make params to animate or not) */}
          <Animated.View style={[animatedStyle]}>
            <Pressable
              onPressIn={handlePressIn}
              onPressOut={handlePressOut}
              onPress={handleSubmit(onSubmitAddVehicle)}
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
