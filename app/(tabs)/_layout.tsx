import { Tabs } from "expo-router";

import { icons } from "../../constants";
import { ImageProps, Image } from "react-native";
import { View, Text } from "@/components/Themed";
import FloatingButton from "@/components/FloatingButton";

interface TabIconProps {
  icon: ImageProps;
  color: string;
  name: string;
  focused: boolean;
}

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
  return (
    <View className="items-center justify-center gap-2">
      <Image
        source={icon}
        resizeMode="contain"
        tintColor={color}
        className={"w-6 h-6"}
      />
      <Text
        className={`${focused ? "font-psemibold" : "font-pregular"} text-xs w-20 text-center`}
        style={{ color }}
      >
        {name}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: "#FFA001",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#161622",
            borderTopWidth: 1,
            borderTopColor: "#232533",
            height: 84,
          },
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: "Dashboard",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.dashboard}
                color={color}
                name="dashboard"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="history"
          options={{
            title: "History",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.history}
                color={color}
                name="history"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="service"
          options={{
            title: "Service",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => null,
          }}
        />

        <Tabs.Screen
          name="(add)"
          options={{
            title: "Fuel",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => null,
          }}
        />

        <Tabs.Screen
          name="vehicles"
          options={{
            title: "Vehicles",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.vehicle}
                color={color}
                name="vehicles"
                focused={focused}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                icon={icons.settings}
                color={color}
                name="settings"
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      {/* Floating Button Positioned in the Center */}
      <FloatingButton />
    </>
  );
};

export default TabsLayout;
