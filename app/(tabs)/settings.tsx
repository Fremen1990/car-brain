import { View, Text, SafeAreaView } from "@/components/Themed";
import { useTheme } from "@/contexts/ThemeContext";
import { Switch, Image } from "react-native";
import { useGlobalContext } from "@/contexts/GlobalProvider";

const Settings = () => {
  const { user } = useGlobalContext();

  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <SafeAreaView className="h-full flex-1 items-center justify-center">
      <Text className="text-4xl">Settings</Text>
      <View className="my-10">
        <Image
          source={user?.avatar}
          className="w-20 border h-20 bg-secondary"
        />
        <Text>{user?.username}</Text>
        <Text>{user?.email}</Text>
        <Text>{user?.$createdAt}</Text>

        {/*<Text>{JSON.stringify(user)}</Text>*/}
      </View>
      <View className="w-full h-64 items-center justify-center">
        <Text>{isDarkMode ? "Dark Mode Active" : "Light Mode Active"}</Text>
        <Switch value={isDarkMode} onValueChange={toggleTheme} />
      </View>
    </SafeAreaView>
  );
};
//  Always need to be export default
export default Settings;
