import React from "react";
import { Text as DefaultText, View as DefaultView } from "react-native";
import { SafeAreaView as DefaultSafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "@/contexts/ThemeContext";

// Types for component props
export type TextProps = DefaultText["props"];
export type ViewProps = DefaultView["props"];
export type SafeAreaViewProps = DefaultSafeAreaView["props"];

// Helper to switch between dark and light theme colors
function getThemeColor(
  isDarkMode: boolean,
  lightColor: string,
  darkColor: string,
) {
  return isDarkMode ? darkColor : lightColor;
}

// Themed Text component
export function Text(props: TextProps) {
  const { style, ...otherProps } = props;
  const { isDarkMode } = useTheme();

  // Determine the text color based on the theme
  const textColor = getThemeColor(isDarkMode, "#161622", "#CDCDE0"); // Dark theme uses light gray text

  return <DefaultText style={[{ color: textColor }, style]} {...otherProps} />;
}

// Themed View component
export function View(props: ViewProps) {
  const { style, ...otherProps } = props;
  const { isDarkMode } = useTheme();

  // Determine the background color based on the theme
  const backgroundColor = getThemeColor(isDarkMode, "#F0F0F5", "#161622"); // Light mode: Light gray, Dark mode: #161622

  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

// Themed SafeAreaView component
export function SafeAreaView(props: SafeAreaViewProps) {
  const { style, ...otherProps } = props;
  const { isDarkMode } = useTheme();

  // Determine the background color based on the theme
  const backgroundColor = getThemeColor(isDarkMode, "#F0F0F5", "#161622"); // Same as View

  return (
    <DefaultSafeAreaView style={[{ backgroundColor }, style]} {...otherProps} />
  );
}
