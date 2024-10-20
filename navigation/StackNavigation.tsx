import { Stack } from 'expo-router'
import React from 'react'

const StackNavigator = () => (
	<Stack>
		<Stack.Screen name="index" options={{ headerShown: false }} />
		<Stack.Screen name="(auth)" options={{ headerShown: false }} />
		<Stack.Screen name="(tabs)" options={{ headerShown: false }} />
	</Stack>
)

export default StackNavigator
