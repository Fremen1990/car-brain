import { View, Image, ScrollView, Text } from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";

import { images } from "../constants";
import CustomButton from "@/components/CustomButton";
import { StatusBar } from "expo-status-bar";

import { Redirect, router } from "expo-router";
import { useGlobalContext } from "@/contexts/GlobalProvider";

export default function App() {
  const { isLoading, isLogged } = useGlobalContext();

  if (!isLoading && isLogged) return <Redirect href="/home" />;

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full justify-center items-center min-h-[85vh] px-4">
          <Image
            source={images.carBrainLogo}
            className="max-w-[250px]  h-[250px]"
            resizeMode="contain"
          />

          <View className="relative mt-5">
            <Text className="text-3xl text-white font-bold text-center">
              Welcome to
            </Text>
            <Text className="text-3xl text-secondary font-bold text-center">
              Car Brain
            </Text>
            <Text className="text-3xl text-white font-bold text-center">
              smart car management app!{" "}
            </Text>
            <CustomButton
              title="Continue"
              handlePress={() => router.push("/sign-in-options")}
              containerStyles="mt-7"
            />
          </View>
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" hidden={false} />
    </SafeAreaView>
  );
}
