import { Redirect, router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import React from 'react'
import { AppRegistry, Image, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { expo } from '../app.json'
import { IMAGES } from '../constants'

import CustomButton from '@/components/CustomButton'
import { Loader } from '@/components/Loader'
import { View, Text } from '@/components/Themed'
import { useGlobalContext } from '@/contexts/GlobalProvider'

async function enableMocking() {
	if (!__DEV__ && process.env.NODE_ENV !== 'test') {
		return
	}

	await import('../msw.polyfills') // Ensure polyfills are loaded
	const { server } = await import('../mocks/server')
	server.listen() // Start MSW server
}

enableMocking().then(() => {
	AppRegistry.registerComponent(expo.name, () => App)
})

export default function App() {
	const { isLoadingGetCurrentUser, isLogged } = useGlobalContext()

	if (isLoadingGetCurrentUser) {
		return <Loader />
	}

	if (!isLoadingGetCurrentUser && isLogged) return <Redirect href="/dashboard" />

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView
				contentContainerStyle={{
					height: '100%'
				}}
			>
				<View className="w-full justify-center items-center min-h-[85vh] px-4">
					<Image source={IMAGES.carBrainLogo} className="max-w-[250px]  h-[250px]" resizeMode="contain" />

					<View className="relative mt-5">
						<Text className="text-3xl text-white font-bold text-center">Welcome to</Text>
						<Text className="text-3xl text-secondary font-bold text-center">Car Brain</Text>
						<Text className="text-3xl text-white font-bold text-center">smart car management app! </Text>
						<CustomButton
							title="Continue"
							handlePress={() => router.push('/sign-in-options')}
							containerStyles="mt-7"
						/>
					</View>
				</View>
			</ScrollView>
			<StatusBar backgroundColor="#161622" style="light" hidden={false} />
		</SafeAreaView>
	)
}
