import { Text, SafeAreaView, View } from '@/components/Themed'
import { FlatList, ViewToken, Dimensions } from 'react-native'

import React, { useEffect, useState } from 'react'
import { VehicleCard } from '@/components/VehicleCard'
import { VehicleFormData } from '@/app/(tabs)/(add)/add-vehicle'
import { Models } from 'react-native-appwrite'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getAllVehicles } from '@/lib/appwrite'

export interface Vehicle extends VehicleFormData, Models.Document {
	accountId: string
	image: string
	fuelEfficiency: number
}

const screenWidth = Dimensions.get('window').width
// TODO: get the vehicle data from the database
const Vehicles = () => {
	const { user } = useGlobalContext()
	// console.log('USER', user.$id)

	const [vehicles, setVehicles] = useState<Vehicle[]>([])

	const [activeItem, setActiveItem] = useState<string | undefined>() // Initialize as null

	const viewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].item.$id) // Update with correct vehicle ID
		}
	}

	useEffect(() => {
		const fetchVehicles = async () => {
			if (!user || !user.$id) {
				return
			}
			const fetchedVehicles = await getAllVehicles(user.$id)
			setVehicles(fetchedVehicles)
			if (fetchedVehicles.length > 0) {
				setActiveItem(fetchedVehicles[0].$id) // Set the first vehicle as active by default
			}
		}

		fetchVehicles()
	}, [user])

	// Log for debugging purposes
	console.log('VEHICLES', vehicles)
	console.log('ACTIVE ITEM', activeItem)
	return (
		<SafeAreaView className="bg-primary h-full">
			<View className="flex-row items-center justify-between w-full p-6">
				<Text className="text-4xl text-[#FFA001] font-bold">Vehicles</Text>
			</View>
			<FlatList
				data={vehicles}
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
					paddingLeft: screenWidth * 0.2, // Adjust to allow items to be centered
					paddingRight: screenWidth * 0.2 // Add padding to center the last item
				}}
				showsHorizontalScrollIndicator={false}
				snapToAlignment="center"
			/>
		</SafeAreaView>
	)
}

export default Vehicles
