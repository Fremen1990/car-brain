import { StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import {useTheme} from "@/contexts/ThemeContext";

export default function TabOneScreen() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <View style={styles.container} className={`${isDarkMode? "bg-primary" : "bg-secondary"}`}>
      <Text style={styles.title}>Tab One</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
