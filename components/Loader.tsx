import React from 'react'
import { SafeAreaView, View } from '@/components/Themed'
import { ActivityIndicator } from 'react-native'

export const Loader = () => {
	return (
		<SafeAreaView className="bg-primary h-full">
			<View className="w-full justify-center items-center min-h-[85vh] px-4">
				<ActivityIndicator size="large" color="#FFA001" />
			</View>
		</SafeAreaView>
	)
}
