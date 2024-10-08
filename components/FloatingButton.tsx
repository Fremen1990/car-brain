import React, { useEffect, useState } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { router, Link } from "expo-router";

export const FloatingButton = () => {
  const [icon_1_vertical] = useState(new Animated.Value(-30)); // Vertical animation for icon 1
  const [icon_2_vertical] = useState(new Animated.Value(-30)); // Vertical animation for icon 2
  const [icon_3_vertical] = useState(new Animated.Value(-30)); // Vertical animation for icon 3

  const [icon_1_horizontal] = useState(new Animated.Value(-80)); // Horizontal animation for icon 1
  const [icon_3_horizontal] = useState(new Animated.Value(0)); // Horizontal animation for icon 3

  const [pop, setPop] = useState(false);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width,
  ); // Initial screen width
  const [screenHeight, setScreenHeight] = useState(
    Dimensions.get("window").height,
  ); // Initial screen height

  useEffect(() => {
    const updateDimensions = () => {
      const { width, height } = Dimensions.get("window");
      setScreenWidth(width);
      setScreenHeight(height);
    };

    const dimensionSubscription = Dimensions.addEventListener(
      "change",
      updateDimensions,
    );

    // Add event listener for dimension changes
    // Dimensions.addEventListener("change", updateDimensions);

    // Clean up listener on unmount
    return () => {
      dimensionSubscription.remove();
    };
  }, []);

  const popIn = () => {
    setPop(true);

    // Animate icon 1 (from the left)
    Animated.parallel([
      Animated.timing(icon_1_vertical, {
        toValue: 50, // Move up
        duration: 400,
        useNativeDriver: false,
      }),
      Animated.timing(icon_1_horizontal, {
        toValue: 0, // Move to the left
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    // Animate icon 2 (center)
    Animated.timing(icon_2_vertical, {
      toValue: 80, // Move up
      duration: 600,
      useNativeDriver: false,
    }).start();

    // Animate icon 3 (from the right)
    Animated.parallel([
      Animated.timing(icon_3_vertical, {
        toValue: 50, // Move up
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(icon_3_horizontal, {
        toValue: 80, // Move to the right
        duration: 700,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const popOut = () => {
    setPop(false);

    // Animate icons back to the initial position (hidden behind the button)
    Animated.parallel([
      Animated.timing(icon_1_vertical, {
        toValue: -30,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_1_horizontal, {
        toValue: -80,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();

    Animated.timing(icon_2_vertical, {
      toValue: -30,
      duration: 500,
      useNativeDriver: false,
    }).start();

    Animated.parallel([
      Animated.timing(icon_3_vertical, {
        toValue: -30,
        duration: 500,
        useNativeDriver: false,
      }),
      Animated.timing(icon_3_horizontal, {
        toValue: 0,
        duration: 500,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const handleNavigateToFuel = () => {
    router.push("/(add)/fuel"); // Navigate to fuel screen in (add) folder
  };

  const handleNavigateToService = () => {
    router.push("/(add)/service"); // Navigate to service screen in (add) folder
  };

  const handleNavigateToPayments = () => {
    router.push("/(add)/payments"); // Navigate to payments screen in (add) folder
  };

  return (
    <View style={styles.container}>
      {/* Centered Floating Button */}
      <TouchableOpacity
        style={[styles.circle, { left: screenWidth / 2 - 30, zIndex: 10 }]} // Center the button horizontally
        onPress={() => {
          pop === false ? popIn() : popOut();
        }}
      >
        <Ionicons name="add-circle" size={50} color="#CDCDE0" />
      </TouchableOpacity>

      {/* Animated Icon 1 */}
      <Animated.View
        style={[
          styles.circle,
          {
            bottom: icon_1_vertical, // Animate vertical position
            left: icon_1_horizontal.interpolate({
              inputRange: [-80, 0],
              outputRange: [screenWidth / 2 - 30, screenWidth / 2 - 110], // Move left
            }),
            zIndex: 9,
          },
        ]}
      >
        <TouchableOpacity onPress={handleNavigateToService}>
          {/*<Link href="/(add)/service">*/}
          <MaterialIcons name="car-repair" size={24} color="#CDCDE0" />
          {/*</Link>*/}
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Icon 2 */}
      <Animated.View
        style={[
          styles.circle,
          {
            bottom: icon_2_vertical, // Animate vertical position
            left: screenWidth / 2 - 30, // Keep in the center
            zIndex: 9,
          },
        ]}
      >
        <TouchableOpacity onPress={handleNavigateToFuel}>
          {/*<Link href="/(add)/fuel">*/}
          <MaterialCommunityIcons name="fuel" size={24} color="#CDCDE0" />
          {/*</Link>*/}
        </TouchableOpacity>
      </Animated.View>

      {/* Animated Icon 3 */}
      <Animated.View
        style={[
          styles.circle,
          {
            bottom: icon_3_vertical, // Animate vertical position
            left: icon_3_horizontal.interpolate({
              inputRange: [0, 80],
              outputRange: [screenWidth / 2 - 30, screenWidth / 2 + 50], // Move right
            }),
            zIndex: 9,
          },
        ]}
      >
        <TouchableOpacity onPress={handleNavigateToPayments}>
          {/*<Link href="/(add)/payments">*/}
          <Feather name="credit-card" size={24} color="#CDCDE0" />
          {/*</Link>*/}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

export default FloatingButton;

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 80,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  circle: {
    backgroundColor: "green",
    width: 60,
    height: 60,
    borderRadius: 30, // Set to half width/height to make a perfect circle
    justifyContent: "center",
    alignItems: "center",
    position: "absolute", // Allow absolute positioning for custom placement
  },
});
