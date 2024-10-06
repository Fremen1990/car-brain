import React from "react";
import { View, Text, SafeAreaView } from "@/components/Themed";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch } from "react-native";

export default function TabOneScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="h-full flex-1 items-center justify-center">
      <View className="w-full h-64 items-center justify-center">
        <Text>{isDarkMode ? "Dark Mode Active" : "Light Mode Active"}</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </SafeAreaView>
  );
}
