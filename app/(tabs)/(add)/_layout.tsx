import React from 'react'
import { Stack } from 'expo-router'

const AddLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="add-vehicle" options={{ headerShown: false }} />
			<Stack.Screen name="fuel" options={{ headerShown: false }} />
			<Stack.Screen name="service" options={{ headerShown: false }} />
		</Stack>
	)
}

export default AddLayout
