import { Text, SafeAreaView, View } from "@/components/Themed";
import FloatingButton from "@/components/FloatingButton";

const Fuel = () => {
  return (
    <SafeAreaView className="bg-primary h-full items-center justify-center">
      <View>
        <Text>Fuel ⛽ </Text>
      </View>
    </SafeAreaView>
  );
};

//  Always need to be export default
export default Fuel;
