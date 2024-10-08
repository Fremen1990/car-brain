import { Text, SafeAreaView, View } from "@/components/Themed";

import { Image } from "react-native";
import { images } from "@/constants";

const Dashboard = () => {
  return (
    <SafeAreaView className="bg-primary h-full items-center justify-center">
      <View>
        <Image source={images.dashboard} />
      </View>
    </SafeAreaView>
  );
};

//  Always need to be export default
export default Dashboard;
