import React, { useState } from "react";
import FormField from "@/components/FormField";
import { Button } from "react-native-paper";
import { SafeAreaView, View, Text } from "@/components/Themed";
import { ScrollView } from "react-native";

const AddVehicle = () => {
  const [form, setForm] = useState({
    brand: "",
    model: "",
    year: "",
    mileage: "",
    vin: "",
    licensePlate: "",
    nextService: "",
    insuranceProvider: "",
    insuranceRenewal: "",
    registrationExpiry: "",
    fuelEfficiency: "",
  });

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prevForm) => ({
      ...prevForm,
      [key]: value,
    }));
  };
  const handleAddVehicle = () => {
    const newVehicle = {
      id: Math.random().toString(), // Generate random ID for simplicity
      brand: form.brand,
      model: form.model,
      year: parseInt(form.year),
      mileage: parseInt(form.mileage),
      vin: form.vin,
      licensePlate: form.licensePlate,
      nextService: form.nextService,
      insurance: {
        provider: form.insuranceProvider,
        renewalDate: form.insuranceRenewal,
        status: "Active",
      },
      registration: { expiryDate: form.registrationExpiry },
      fuelEfficiency: parseFloat(form.fuelEfficiency),
    };

    console.log("New Vehicle:", newVehicle);
    // Here you can send the newVehicle data to the backend or Firestore
  };

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
          <FormField
            title="Registration Expiry"
            value={form.registrationExpiry}
            placeholder="Enter registration expiry date (YYYY-MM-DD)"
            handleChangeText={(value) =>
              handleChange("registrationExpiry", value)
            }
          />
          <FormField
            title="Fuel Efficiency"
            value={form.fuelEfficiency}
            placeholder="Enter fuel efficiency (liters per 100km)"
            keyboardType="numeric"
            handleChangeText={(value) => handleChange("fuelEfficiency", value)}
          />

          {/* Submit Button */}
          <Button
            mode="contained"
            onPress={handleAddVehicle}
            className="mt-4 bg-[#FFA001] rounded-lg"
          >
            Add Vehicle
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddVehicle;
