import { Text, SafeAreaView, View } from "@/components/Themed";
import FloatingButton from "@/components/FloatingButton";

const Service = () => {
  return (
    <SafeAreaView className="bg-primary h-full items-center justify-center">
      <View>
        <Text>Service 🚗 </Text>
        <FloatingButton />
      </View>
    </SafeAreaView>
  );
};

//  Always need to be export default
export default Service;
