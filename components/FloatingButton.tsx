import Ionicons from '@expo/vector-icons/Ionicons'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import { router } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Pressable, StyleSheet, Animated, Dimensions } from 'react-native'

import { View } from '@/components/Themed'
// TODO make slight refactor - low priority
export const FloatingButton = () => {
	const [icon_1_vertical] = useState(new Animated.Value(-30)) // Vertical animation for icon 1
	const [icon_2_vertical] = useState(new Animated.Value(-30)) // Vertical animation for icon 2
	const [icon_3_vertical] = useState(new Animated.Value(-30)) // Vertical animation for icon 3

	const [icon_1_horizontal] = useState(new Animated.Value(-80)) // Horizontal animation for icon 1
	const [icon_3_horizontal] = useState(new Animated.Value(0)) // Horizontal animation for icon 3

	const [pop, setPop] = useState(false)

	const [screenWidth, setScreenWidth] = useState(Dimensions.get('window').width) // Initial screen width
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [screenHeight, setScreenHeight] = useState(Dimensions.get('window').height) // Initial screen height

	useEffect(() => {
		const updateDimensions = () => {
			const { width, height } = Dimensions.get('window')
			setScreenWidth(width)
			setScreenHeight(height)
		}

		const dimensionSubscription = Dimensions.addEventListener('change', updateDimensions)

		// Add event listener for dimension changes
		// Dimensions.addEventListener("change", updateDimensions);

		// Clean up listener on unmount
		return () => {
			dimensionSubscription.remove()
		}
	}, [])

	const popIn = () => {
		setPop(true)

		// Animate icon 1 (from the left)
		Animated.parallel([
			Animated.timing(icon_1_vertical, {
				toValue: 50, // Move up
				duration: 400,
				useNativeDriver: false
			}),
			Animated.timing(icon_1_horizontal, {
				toValue: 0, // Move to the left
				duration: 500,
				useNativeDriver: false
			})
		]).start()

		// Animate icon 2 (center)
		Animated.timing(icon_2_vertical, {
			toValue: 80, // Move up
			duration: 600,
			useNativeDriver: false
		}).start()

		// Animate icon 3 (from the right)
		Animated.parallel([
			Animated.timing(icon_3_vertical, {
				toValue: 50, // Move up
				duration: 800,
				useNativeDriver: false
			}),
			Animated.timing(icon_3_horizontal, {
				toValue: 80, // Move to the right
				duration: 700,
				useNativeDriver: false
			})
		]).start()
	}

	const popOut = () => {
		setPop(false)

		// Animate icons back to the initial position (hidden behind the button)
		Animated.parallel([
			Animated.timing(icon_1_vertical, {
				toValue: -30,
				duration: 500,
				useNativeDriver: false
			}),
			Animated.timing(icon_1_horizontal, {
				toValue: -80,
				duration: 500,
				useNativeDriver: false
			})
		]).start()

		Animated.timing(icon_2_vertical, {
			toValue: -30,
			duration: 500,
			useNativeDriver: false
		}).start()

		Animated.parallel([
			Animated.timing(icon_3_vertical, {
				toValue: -30,
				duration: 500,
				useNativeDriver: false
			}),
			Animated.timing(icon_3_horizontal, {
				toValue: 0,
				duration: 500,
				useNativeDriver: false
			})
		]).start()
	}

	const handleNavigateAddToFuel = () => {
		popOut()
		router.push('/fuel/add') // Navigate to fuel screen in (add) folder
	}

	const handleNavigateAddToService = () => {
		popOut()
		router.push('/service/add') // Navigate to service screen in (add) folder
	}

	const handleNavigateToAddVehicle = () => {
		popOut()
		router.push('/vehicles/add') // Navigate to payments screen in (add) folder
	}

	const togglePop = () => {
		if (!pop) {
			popIn()
		} else {
			popOut()
		}
	}
	return (
		<View style={styles.container}>
			{/* Centered Floating Button */}
			<Pressable
				style={[styles.circle, { left: screenWidth / 2 - 30, zIndex: 10 }]} // Center the button horizontally
				onPress={togglePop}
			>
				<Ionicons name="add-circle" size={50} color="#CDCDE0" />
			</Pressable>

			{/* Animated Icon 1 */}
			<Animated.View
				style={[
					styles.circle,
					{
						bottom: icon_1_vertical, // Animate vertical position
						left: icon_1_horizontal.interpolate({
							inputRange: [-80, 0],
							outputRange: [screenWidth / 2 - 30, screenWidth / 2 - 110] // Move left
						}),
						zIndex: 9
					}
				]}
			>
				<Pressable onPress={handleNavigateAddToService}>
					{/*<Link href="/(add)/service">*/}
					<MaterialIcons name="car-repair" size={32} color="#CDCDE0" />
					{/*</Link>*/}
				</Pressable>
			</Animated.View>

			{/* Animated Icon 2 */}
			<Animated.View
				style={[
					styles.circle,
					{
						bottom: icon_2_vertical, // Animate vertical position
						left: screenWidth / 2 - 30, // Keep in the center
						zIndex: 9
					}
				]}
			>
				<Pressable onPress={handleNavigateAddToFuel}>
					{/*<Link href="/(add)/fuel">*/}
					<MaterialCommunityIcons name="fuel" size={32} color="#CDCDE0" />
					{/*</Link>*/}
				</Pressable>
			</Animated.View>

			{/* Animated Icon 3 */}
			<Animated.View
				style={[
					styles.circle,
					{
						bottom: icon_3_vertical, // Animate vertical position
						left: icon_3_horizontal.interpolate({
							inputRange: [0, 80],
							outputRange: [screenWidth / 2 - 30, screenWidth / 2 + 50] // Move right
						}),
						zIndex: 9
					}
				]}
			>
				<Pressable onPress={handleNavigateToAddVehicle}>
					{/*<Link href="/(add)/payments">*/}
					{/*<Feather name="credit-card" size={24} color="#CDCDE0" />*/}

					<Ionicons name="car-sport" size={32} color="#CDCDE0" />

					{/*</Link>*/}
				</Pressable>
			</Animated.View>
		</View>
	)
}

export default FloatingButton

const styles = StyleSheet.create({
	container: {
		position: 'absolute',
		bottom: 80,
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		zIndex: 10
	},
	circle: {
		backgroundColor: 'green',
		width: 60,
		height: 60,
		borderRadius: 30, // Set to half width/height to make a perfect circle
		justifyContent: 'center',
		alignItems: 'center',
		position: 'absolute' // Allow absolute positioning for custom placement
	}
})
