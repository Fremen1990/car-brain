import { router } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'

import type { Href } from 'expo-router'

import CustomButton from '@/components/CustomButton/CustomButton'

interface EmptyStateProps {
	message: string
	redirectTo: string
	buttonLabel: string
}

const EmptyState: React.FC<EmptyStateProps> = ({ message, redirectTo, buttonLabel }) => {
	return (
		<View className="bg-primary h-full items-center justify-center">
			<Text className="text-white text-center text-xl mb-4">{message}</Text>
			<CustomButton
				handlePress={() => router.push(redirectTo as Href<string>)}
				title={buttonLabel}
				textStyles="p-4"
			/>
		</View>
	)
}

export default EmptyState
