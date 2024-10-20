import React from 'react'
import { View, Text, Pressable } from 'react-native'

interface HeaderProps {
	title: string
	action?: {
		label: string
		onPress: () => void
	}
}

const Header: React.FC<HeaderProps> = ({ title, action }) => {
	return (
		<View className="flex-row items-center justify-between w-full p-6">
			<Text className="text-4xl text-[#FFA001] font-bold">{title}</Text>
			{action && (
				<Pressable onPress={action.onPress} className="bg-[#FFA001] rounded-lg p-2">
					<Text className="text-white text-base">{action.label}</Text>
				</Pressable>
			)}
		</View>
	)
}

export default Header
