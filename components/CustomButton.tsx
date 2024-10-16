import React from 'react'

import { Text, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'

interface CustomButtonProps {
	title: string
	handlePress: () => void
	containerStyles?: string
	textStyles?: string
	isLoading?: boolean
}
// TODO refactor this cutton to be animated and to have disabled instead of isLoading

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading }: CustomButtonProps) => {
	const scale = useSharedValue(1) // Shared value for the animation

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		}
	})

	const handlePressIn = () => {
		scale.value = withSpring(1.01)
	}

	const handlePressOut = () => {
		scale.value = withSpring(0.99)
	}

	return (
		<Animated.View style={[animatedStyle]}>
			<Pressable
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={handlePress}
				className={`bg-secondary rounded-xl min-h-[62px] flex flex-row justify-center items-center ${containerStyles} ${
					isLoading ? 'opacity-30' : ''
				}
      `}
				disabled={isLoading}
			>
				<Text className={`text-primary font-psemibold text-lg ${textStyles}`}>{title}</Text>
			</Pressable>
		</Animated.View>
	)
}

export default CustomButton
