import { useReactQueryDevTools } from '@dev-plugins/react-query'
import FontAwesome from '@expo/vector-icons/FontAwesome'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect } from 'react'

import PoppinsBlack from '../assets/fonts/Poppins-Black.ttf'
import PoppinsBold from '../assets/fonts/Poppins-Bold.ttf'
import PoppinsExtraBold from '../assets/fonts/Poppins-ExtraBold.ttf'
import PoppinsExtraLight from '../assets/fonts/Poppins-ExtraLight.ttf'
import PoppinsLight from '../assets/fonts/Poppins-Light.ttf'
import PoppinsMedium from '../assets/fonts/Poppins-Medium.ttf'
import PoppinsRegular from '../assets/fonts/Poppins-Regular.ttf'
import PoppinsSemiBold from '../assets/fonts/Poppins-SemiBold.ttf'
import PoppinsThin from '../assets/fonts/Poppins-Thin.ttf'
import SpaceMono from '../assets/fonts/SpaceMono-Regular.ttf'

import 'react-native-reanimated'

import { GlobalProvider } from '@/contexts/GlobalProvider'
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/ThemeContext'

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary
} from 'expo-router'

export const unstable_settings = {
	// Ensure that reloading on `/modal` keeps a back button present.
	initialRouteName: '(tabs)'
}

const queryClient = new QueryClient()

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

const RootLayout = () => {
	const [loaded, error] = useFonts({
		'Poppins-Black': PoppinsBlack,
		'Poppins-Bold': PoppinsBold,
		'Poppins-ExtraBold': PoppinsExtraBold,
		'Poppins-ExtraLight': PoppinsExtraLight,
		'Poppins-Light': PoppinsLight,
		'Poppins-Medium': PoppinsMedium,
		'Poppins-Regular': PoppinsRegular,
		'Poppins-SemiBold': PoppinsSemiBold,
		'Poppins-Thin': PoppinsThin,
		SpaceMono: SpaceMono,
		...FontAwesome.font
	})

	useReactQueryDevTools(queryClient)

	const { isDarkMode } = useTheme()

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	useEffect(() => {
		if (error) throw error
	}, [error])

	useEffect(() => {
		if (loaded) {
			SplashScreen.hideAsync()
		}
	}, [loaded])

	if (!loaded && !error) {
		return null
	}

	return (
		<QueryClientProvider client={queryClient}>
			<GlobalProvider>
				<CustomThemeProvider>
					<ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
						{/*<Stack screenOptions={{ headerShown: false }}>*/}
						<Stack>
							<Stack.Screen name="index" options={{ headerShown: false }} />
							<Stack.Screen name="(auth)" options={{ headerShown: false }} />
							<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
						</Stack>
					</ThemeProvider>
				</CustomThemeProvider>
			</GlobalProvider>
		</QueryClientProvider>
	)
}

export default RootLayout
