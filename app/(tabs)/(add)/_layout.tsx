import { Stack } from "expo-router";

const AddLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="add-vehicle" options={{ title: "Add Vehicle" }} />
      <Stack.Screen name="fuel" options={{ title: "Fuel" }} />
      <Stack.Screen name="service" options={{ title: "Service" }} />
    </Stack>
  );
};

export default AddLayout;
