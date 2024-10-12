import { Vehicle } from '@/app/(tabs)/vehicles'
import * as Animatable from 'react-native-animatable'
import { Dimensions, Image } from 'react-native'
import { Text, View } from '@/components/Themed'
import Ionicons from '@expo/vector-icons/Ionicons'
import React from 'react'
import { ProgressBar, Button } from 'react-native-paper'

export interface VehicleCardProps {
	vehicle: Vehicle
	activeItem: string | undefined // Ensure activeItem is a string
}

// calculate insuranceStatus based on insuranceRenewal and current date
const calculateInsuranceStatus = (renewalDate: string) => {
	const today = new Date()
	const renewal = new Date(renewalDate)

	if (renewal < today) {
		return 'Expired'
	} else {
		return 'Active'
	}
}

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height
const isLargeScreen = screenWidth > 800 // Adjust based on screen size
const isPortrait = screenHeight > screenWidth

export const VehicleCard = ({ vehicle, activeItem }: VehicleCardProps) => {
	console.log('vehicle', vehicle)

	const zoomIn = {
		from: {
			scale: 0.9
		},
		to: {
			scale: 1.05
		}
	}

	const zoomOut = {
		from: {
			scale: 1.1
		},
		to: {
			scale: 0.9
		}
	}

	const zoomInZoomOutAnimation = activeItem === vehicle.$id ? zoomIn : zoomOut

	console.log('activeItem', activeItem)
	console.log('vehicle.id', vehicle.$id)

	console.log('vehicle image', vehicle.image)

	return (
		<Animatable.View
			className="bg-[#232533] rounded-xl p-4 mb-5 mr-4 shadow-lg shadow-black"
			style={{
				width: !isPortrait ? screenWidth * 0.3 : screenWidth * (isLargeScreen ? 0.6 : 0.8) // Adjust card width based on screen size
			}}
			animation={isPortrait ? zoomInZoomOutAnimation : false} // Use the fixed animations
			duration={500}
			useNativeDriver={true}
		>
			{/* Vehicle Image */}
			<Image
				source={{
					uri: vehicle.image
				}}
				className="w-full h-44 rounded-xl"
				style={{
					height: screenHeight * (isLargeScreen ? 0.2 : 0.4), // Dynamic height based on screen size

					resizeMode: 'cover'
				}}
			/>

			{/* Vehicle Info */}
			<View className="mt-4">
				<Text className="text-[#FFA001] text-xl font-bold">
					{vehicle.brand} {vehicle.model}
				</Text>
				<Text className="text-[#CDCDE0] text-sm mt-1">
					Year: {vehicle.year} | Mileage: {vehicle.mileage} miles
				</Text>
				<Text className="text-[#CDCDE0] text-sm mt-1">VIN: {vehicle.vin}</Text>
				<Text className="text-[#CDCDE0] text-sm mt-1">License Plate: {vehicle.licensePlate}</Text>
			</View>

			{/* Service and Insurance */}
			<View className="mt-4">
				<Text className="text-white text-base font-bold">Next Service: {vehicle.nextService}</Text>
				<ProgressBar progress={0.75} color="#FFA001" className="h-2 mt-2 rounded-lg" />

				<Text className="text-white text-base font-bold mt-4">
					Insurance: {calculateInsuranceStatus(vehicle.insuranceRenewal)} (Renews {vehicle.insuranceRenewal})
				</Text>
				<Ionicons
					name="shield-checkmark"
					size={24}
					color={calculateInsuranceStatus(vehicle.insuranceRenewal) === 'Active' ? 'green' : 'red'}
					className="mt-2"
				/>
			</View>

			{/* Fuel Efficiency */}
			<View className="mt-4">
				<Text className="text-white text-base font-bold">
					Fuel Efficiency: {vehicle.fuelEfficiency} L/100km
				</Text>
				<Button
					mode="outlined"
					onPress={() => {
						/* Navigate to fuel logs */
					}}
					className="mt-2"
				>
					View Fuel Logs
				</Button>
				{/*</View>*/}
			</View>
		</Animatable.View>
	)
}
