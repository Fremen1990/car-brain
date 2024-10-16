import { Stack } from 'expo-router'
import React from 'react'

const AddLayout = () => {
	return (
		<Stack>
			<Stack.Screen name="add-vehicle" options={{ headerShown: false }} />
			<Stack.Screen name="add-fuel" options={{ headerShown: false }} />
			<Stack.Screen name="add-service" options={{ headerShown: false }} />
		</Stack>
	)
}

export default AddLayout
