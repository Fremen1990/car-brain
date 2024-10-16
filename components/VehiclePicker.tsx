import React from 'react'
import { View, Text, Image, Pressable, FlatList } from 'react-native'

import type { FC } from 'react'

interface Vehicle {
	$id: string
	brand: string
	model: string
	licensePlate: string
	image: string
}

interface VehiclePickerProps {
	vehicles: Vehicle[]
	selectedVehicleId: string | null
	onSelectVehicle: (vehicleId: string) => void
}

const VehiclePicker: FC<VehiclePickerProps> = ({ vehicles, selectedVehicleId, onSelectVehicle }) => {
	return (
		<FlatList
			data={vehicles}
			horizontal={true}
			keyExtractor={(item) => item.$id}
			renderItem={({ item }) => {
				return (
					<Pressable onPress={() => onSelectVehicle(item.$id)}>
						<View
							className="relative mr-4"
							style={{
								borderColor: selectedVehicleId === item.$id ? '#FFA001' : 'transparent',
								borderWidth: 2,
								borderRadius: 8
							}}
						>
							<Image source={{ uri: item.image }} style={{ width: 200, height: 150, borderRadius: 8 }} />
							<View className="absolute bottom-0 left-0 right-0 bg-black opacity-70 p-2">
								<Text className="text-white font-bold">
									{item.brand} {item.model}
								</Text>
								<Text className="text-white text-sm">{item.licensePlate}</Text>
							</View>
						</View>
					</Pressable>
				)
			}}
			showsHorizontalScrollIndicator={false}
			contentContainerStyle={{
				paddingHorizontal: 16,
				alignItems: 'center'
			}}
		/>
	)
}

export default VehiclePicker
