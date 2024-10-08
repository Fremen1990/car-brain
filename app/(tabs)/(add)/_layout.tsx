import { Stack } from "expo-router";

const AddLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="fuel" options={{ title: "Fuel" }} />
      <Stack.Screen name="service" options={{ title: "Service" }} />
      <Stack.Screen name="payments" options={{ title: "Payments" }} />
    </Stack>
  );
};

export default AddLayout;
