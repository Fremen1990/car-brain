import React from 'react'
import { FlatList } from 'react-native'

import EmptyState from '@/components/EmptyState/EmptyState'
import Header from '@/components/Header/Header'
import { Loader } from '@/components/Loader/Loader'
import { SafeAreaView } from '@/components/Themed'
import { VehicleCard } from '@/components/VehicleCard/VehicleCard'
import { useVehicles } from '@/hooks/useVehicles'

const Vehicles = () => {
	const { vehicles, isLoading, isDescending, activeItem, viewableItemsChanged, getSortAction } = useVehicles()

	if (isLoading) {
		return <Loader />
	}

	if (!vehicles || vehicles.length === 0) {
		return <EmptyState message="No vehicles found" redirectTo="/add-vehicle" buttonLabel="Add Vehicle" />
	}

	const sortedVehicles = isDescending ? vehicles.slice().reverse() : vehicles

	return (
		<SafeAreaView className="bg-primary h-full">
			<Header title="Vehicles" action={getSortAction()} />
			<FlatList
				data={sortedVehicles}
				horizontal={true}
				keyExtractor={(item) => item.$id.toString()}
				renderItem={({ item }) => <VehicleCard vehicle={item} activeItem={activeItem} />}
				onViewableItemsChanged={viewableItemsChanged}
				contentContainerStyle={{
					padding: 16,
					justifyContent: 'space-around',
					alignItems: 'center',
					flexGrow: 1
				}}
				showsHorizontalScrollIndicator={false}
			/>
		</SafeAreaView>
	)
}

export default Vehicles
