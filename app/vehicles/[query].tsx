import Ionicons from '@expo/vector-icons/Ionicons'
import { router, useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, View, ScrollView, Image, Pressable, Alert, Modal, TouchableOpacity } from 'react-native'

import type { FuelRecord } from '@/types'

import { Loader } from '@/components/Loader/Loader'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { deleteFuelRecord, getFuelRecords } from '@/lib/appwrite'
import { formatDate } from '@/utils/formatDate'

// TODO: add CREATE for service, tireChange, insurance
// TODO add UPDATE and DELETE for fuel  service, tireChange, insurance
// TODO: use one common template for all history pages (fuel, service, tireChange, insurance) and CRUD operations

// Dummy Data (You should fetch real data in your actual implementation)
const vehicleHistoryData = {
	// fuel: [
	// 	// date in UTC format, fuelAmount number, const number
	// 	{ date: '2024-01-15', amount: '50 liters', cost: '$60' },
	// 	{ date: '2023-12-20', amount: '45 liters', cost: '$55' },
	// 	{ date: '2023-12-10', amount: '42 liters', cost: '$52' },
	// 	{ date: '2023-11-15', amount: '48 liters', cost: '$58' }
	// ],
	service: [
		{ date: '2024-02-01', description: 'Oil Change', cost: 80 },
		{ date: '2023-08-10', description: 'Brake Pad Replacement', cost: 150 },
		{ date: '2023-04-10', description: 'Air Filter Replacement', cost: 30 }
	],
	tireChange: [
		{ date: '2024-03-01', description: 'Winter Tires Installed', cost: 200 },
		{ date: '2023-10-15', description: 'Tire Rotation', cost: 50 }
	],
	insurance: [{ renewalDate: '2024-05-01', provider: 'Insurance Co.', policyNumber: 'AB123456' }]
}

const VehicleDetails = () => {
	const { query } = useLocalSearchParams()
	const { vehicles } = useGlobalContext()

	const [showFullFuelHistory, setShowFullFuelHistory] = useState(false)
	const [showFullServiceHistory, setShowFullServiceHistory] = useState(false)
	const [showFullTireHistory, setShowFullTireHistory] = useState(false)
	const [fuelRecords, setFuelRecords] = useState<FuelRecord[] | null>(null)

	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)
	const [selectedFuelId, setSelectedFuelId] = useState<string | null>(null)

	// Assuming you have a function to find the vehicle by its ID from the context
	const vehicle = vehicles?.find((v) => v.$id === query)

	useEffect(() => {
		// Fetch fuel records
		getFuelRecords(query)
			.then((records) => {
				setFuelRecords(records)
			})
			.catch((error) => {
				console.error(error)
			})
	}, [query])

	if (!vehicle || !fuelRecords) {
		return <Loader />
	}

	const confirmDelete = async () => {
		if (selectedFuelId) {
			try {
				await deleteFuelRecord(selectedFuelId) // Perform the delete operation
				setFuelRecords((prevRecords) => prevRecords?.filter((record) => record.$id !== selectedFuelId) || null)
				setDeleteModalVisible(false) // Close the modal after deletion
			} catch (error) {
				Alert.alert(
					'Error',
					`Failed to delete the fuel record: my current fuel id: ${selectedFuelId} and error is:!!!` +
						error.message
				)
			}
		}
	}

	const openDeleteModal = (fuelId: string) => {
		setSelectedFuelId(fuelId)
		setDeleteModalVisible(true)
	}

	const closeDeleteModal = () => {
		setDeleteModalVisible(false)
		setSelectedFuelId(null)
	}

	const handleUpdate = (fuelId: string) => {
		router.push(`/fuel/${fuelId}`) // Navigate to fuel update route
	}

	const renderHistorySection = (
		title: string,
		data: {
			date: Date
			description?: string
			fuelAmount?: number
			fuelUnits?: string
			cost?: number
			currency?: string
		}[],
		showMore: boolean,
		toggleShowMore: () => void,
		limit: number = 3
	) => {
		const displayedData = showMore ? data : data.slice(0, limit)

		return (
			<View className="mb-6">
				<Text className="text-xl font-semibold mb-3 text-[#FFA001]">{title}</Text>
				{displayedData.map((record, index) => (
					<View key={index} className="py-2 border-b border-gray-700 flex-row justify-between items-center">
						<View>
							<Text className="text-white font-semibold">{formatDate(record.date)}</Text>
							{record.description && <Text className="text-[#7b7b8b]">{record.description}</Text>}
							{record.fuelAmount && (
								<Text className="text-[#7b7b8b]">
									{record.fuelAmount} {record.fuelUnits}
								</Text>
							)}
							{record.cost && (
								<Text className="text-[#7b7b8b]">
									{record.cost} {record.currency}
								</Text>
							)}
						</View>

						{/* Update and Delete Icons */}
						<View className="flex-row gap-4">
							<Pressable onPress={() => handleUpdate(record.$id)}>
								<Ionicons name="pencil" size={20} color="#FFA001" />
							</Pressable>

							<Pressable onPress={() => openDeleteModal(record.$id)}>
								<Ionicons name="trash" size={20} color="#FF6347" />
							</Pressable>
						</View>
					</View>
				))}
				{data.length > limit && (
					<Pressable onPress={toggleShowMore}>
						<Text className="text-[#FFA001] text-base">{showMore ? 'Show Less' : 'Show More'}</Text>
					</Pressable>
				)}
			</View>
		)
	}

	return (
		<>
			<ScrollView contentContainerStyle={{ paddingBottom: 24 }} className="p-4 bg-[#161622]">
				{/* Vehicle Main Information */}
				<View className="mb-6">
					<Image
						source={{ uri: vehicle.image }} // Vehicle image
						className="w-full h-52 rounded-xl mb-4"
						resizeMode="cover"
					/>

					<Text className="text-2xl font-bold text-[#FFA001]">
						{vehicle.brand} {vehicle.model}
						{/*{JSON.stringify(fuelRecords)}*/}
					</Text>
					<Text className="text-lg text-[#7b7b8b]">License Plate: {vehicle.licensePlate}</Text>
					<Text className="text-lg text-[#7b7b8b]">VIN: {vehicle.vin}</Text>
					<Text className="text-lg text-[#7b7b8b]">Mileage: {vehicle.mileage} km</Text>
					<Text className="text-lg text-[#7b7b8b]">Next Service: {formatDate(vehicle.nextService)}</Text>
					<Text className="text-lg text-[#7b7b8b]">
						Technical Inspection: {formatDate(vehicle.technicalInspectionDate)}
					</Text>
					<Text className="text-lg text-[#7b7b8b]">Fuel Efficiency: {vehicle.fuelEfficiency} km/l</Text>

					{/* Insurance Details */}
					<View className="mt-4 p-4 bg-[#232533] rounded-lg">
						<Text className="text-xl font-bold text-[#FFA001] mb-2">Insurance Details</Text>
						{vehicleHistoryData.insurance.map((record, index) => (
							<View key={index}>
								<Text className="text-lg text-white">Provider: {record.provider}</Text>
								<Text className="text-lg text-[#7b7b8b]">
									Renewal Date: {formatDate(record.renewalDate)}
								</Text>
								<Text className="text-lg text-[#7b7b8b]">Policy Number: {record.policyNumber}</Text>
							</View>
						))}
					</View>
				</View>

				{/* Vehicle History */}
				<View>
					<Text className="text-2xl font-bold text-[#FFA001] mb-4">Vehicle History</Text>

					{/* Fuel History */}
					{renderHistorySection('Fuel History', fuelRecords, showFullFuelHistory, () =>
						setShowFullFuelHistory(!showFullFuelHistory)
					)}

					{/* Service History */}
					{renderHistorySection('Service History', vehicleHistoryData.service, showFullServiceHistory, () =>
						setShowFullServiceHistory(!showFullServiceHistory)
					)}

					{/* Tire Change History */}
					{renderHistorySection(
						'Tire Change History',
						vehicleHistoryData.tireChange,
						showFullTireHistory,
						() => setShowFullTireHistory(!showFullTireHistory)
					)}
				</View>
			</ScrollView>

			{/*TODO: try to find some cool library with modals and snackbards*/}
			<Modal transparent={true} visible={isDeleteModalVisible} animationType="slide">
				<View className="flex-1 justify-center items-center bg-black bg-opacity-50">
					<View className="bg-white rounded-lg p-6 w-4/5">
						<Text className="text-lg font-bold mb-4 text-black">Confirm Delete</Text>
						<Text className="text-black mb-6">Are you sure you want to delete this fuel record?</Text>
						<View className="flex-row justify-end space-x-4">
							<TouchableOpacity onPress={closeDeleteModal}>
								<Text className="text-[#FFA001] font-bold">Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={confirmDelete}>
								<Text className="text-[#FF6347] font-bold">Delete</Text>
							</TouchableOpacity>
						</View>
					</View>
				</View>
			</Modal>
		</>
	)
}

export default VehicleDetails
