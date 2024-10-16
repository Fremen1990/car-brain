import { useFocusEffect } from '@react-navigation/core'
import { router } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, Dimensions, Pressable } from 'react-native'

import type { Vehicle } from '@/types/VehicleTypes'
import type { ViewToken } from 'react-native'

import CustomButton from '@/components/CustomButton'
import { Loader } from '@/components/Loader'
import { Text, SafeAreaView, View } from '@/components/Themed'
import { VehicleCard } from '@/components/VehicleCard'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getAllVehicles } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'

const screenWidth = Dimensions.get('window').width
const Vehicles = () => {
	const { user } = useGlobalContext()
	const [activeItem, setActiveItem] = useState<string | undefined>() // Initialize as null
	const [isDescending, setIsDescending] = useState(true) // Toggle state for sorting

	// Use the `useAppwrite` hook to fetch vehicles from Appwrite
	const { data: vehicles, loading, refetch } = useAppwrite<Vehicle[]>(() => getAllVehicles(user?.$id || ''))

	// Refetch vehicles when the screen is focused
	useFocusEffect(
		React.useCallback(() => {
			refetch() // Refetch vehicles whenever this screen is focused
		}, [])
	)

	const viewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].item.$id) // Update with correct vehicle ID
		}
	}

	if (loading) {
		return <Loader />
	}

	if (!vehicles || vehicles.length === 0) {
		return (
			<SafeAreaView className="bg-primary h-full items-center justify-center">
				<Text className="text-white text-center text-xl mb-4">No vehicles found</Text>
				<CustomButton handlePress={() => router.push('/add-vehicle')} title="Add Vehicle" textStyles="p-4" />
			</SafeAreaView>
		)
	}

	// Sort vehicles based on isDescending state
	const sortedVehicles = isDescending ? vehicles.slice().reverse() : vehicles

	return (
		<SafeAreaView className="bg-primary h-full">
			<View className="flex-row items-center justify-between w-full p-6">
				<Text className="text-4xl text-[#FFA001] font-bold">Vehicles</Text>
				{/* Display sort toggle button only if there are more than one vehicle */}
				{vehicles.length > 1 && (
					<Pressable
						onPress={() => setIsDescending((prev) => !prev)} // Toggle sort order
						className="bg-[#FFA001] rounded-lg p-2"
					>
						<Text className="text-white text-base">{isDescending ? 'Oldest First' : 'Newest First'}</Text>
					</Pressable>
				)}
			</View>
			<FlatList
				data={sortedVehicles}
				horizontal={true}
				keyExtractor={(item) => item.$id.toString()}
				renderItem={({ item }) => <VehicleCard vehicle={item} activeItem={activeItem} />}
				onViewableItemsChanged={viewableItemsChanged}
				viewabilityConfig={{
					itemVisiblePercentThreshold: 50
				}}
				contentOffset={{ x: 30, y: 0 }}
				contentContainerStyle={{
					padding: 16,
					justifyContent: 'space-around',
					alignItems: 'center',
					flexGrow: 1,
					paddingLeft: screenWidth * 0.1, // Adjust to allow items to be centered
					paddingRight: screenWidth * 0.1 // Add padding to center the last item
				}}
				showsHorizontalScrollIndicator={false}
				snapToAlignment="center"
			/>
		</SafeAreaView>
	)
}

export default Vehicles
