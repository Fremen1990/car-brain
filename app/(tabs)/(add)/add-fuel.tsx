import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { SafeAreaView, View, Text, ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { handleAppError } from '@/utils/errorHandler'
import { router } from 'expo-router'
import { addFuelRecord, saveToStorage } from '@/lib/appwrite'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Loader } from '@/components/Loader'
import CustomImagePicker from '@/components/CustomImagePicker'
import VehiclePicker from '@/components/VehiclePicker'
import CustomButton from '@/components/CustomButton'

export interface FuelFormData {
	vehicleId: string
	userId: string
	date: Date
	mileage: number
	fuelAmount: number
	price: number
	cost: number
	fuelType: string
	currency: string
}

// TODO: refactor to use onSubmit custom hook to handle form submission reusable
// TODO: Write integration tests for add-fuel and add-vehicle with MSW and react native testing library

// TODO: when have integration tests with MSW - refactor data fetching to tanstack query
// TODO: when have integration tests with MSW - refactor state management to zustand

const AddFuel = () => {
	const { user } = useGlobalContext()
	const [isLoading, setIsLoading] = useState(false)

	// Image Picker state
	const [imageUri, setImageUri] = useState<string | null>(null)
	const [imageFileName, setImageFileName] = useState<string | null>(null)
	const [imageMimeType, setImageMimeType] = useState<string | null>(null)

	const handleImageSelected = (uri: string, fileName: string, mimeType: string) => {
		setImageUri(uri)
		setImageFileName(fileName)
		setImageMimeType(mimeType)
	}

	// File upload handler
	const handleFileUpload = async () => {
		if (!imageUri || !imageFileName || !imageMimeType) return null
		try {
			return await saveToStorage(imageUri, imageFileName, imageMimeType)
		} catch (error: unknown) {
			handleAppError(error)
			return null
		}
	}

	const onSubmitAddFuel = async (newFuel: FuelFormData) => {
		setIsLoading(true)

		console.log('newFuel SUBMIT OUT OF TRY CATCH', newFuel)
		try {
			const uploadedFileUrl = await handleFileUpload()

			console.log('uploadedFileUrl', uploadedFileUrl)

			if (user?.$id !== undefined) {
				// Explicitly convert string inputs to the correct data types
				const fuelData = {
					...newFuel,
					userId: user?.$id,
					date: new Date(newFuel.date), // Ensure date is in correct format
					price: parseFloat(String(newFuel.price)), // Convert to float
					fuelAmount: parseFloat(String(newFuel.fuelAmount)), // Convert to float
					cost: parseFloat(String(newFuel.cost)), // Convert to float
					mileage: parseInt(String(newFuel.mileage), 10), // Convert to integer
					attachments: uploadedFileUrl || null
				}

				await addFuelRecord(fuelData)
				// Send fuelData to database
				console.log('Fuel data:', fuelData)

				reset() // Reset the form after submission
				router.push('/') // Redirect after adding fuel log

				// router.push('/fuel-logs') // Redirect after adding fuel log}
			} else {
				throw new Error('User ID is missing')
			} // Navigate to payments screen in (add) folder
		} catch (error: unknown) {
			handleAppError(error)
		} finally {
			setIsLoading(false)
		}
	}

	const {
		control,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
		reset
	} = useForm<FuelFormData>({
		defaultValues: {
			vehicleId: '',
			date: new Date(),
			price: 0,
			fuelAmount: 0,
			cost: 0,
			fuelType: 'petrol',
			currency: 'PLN',
			mileage: 0
		}
	})

	// vehicleId state and VehiclePicker
	const { vehicles } = useGlobalContext()
	const handleSelectVehicle = (selectedVehicleId: string) => {
		setValue('vehicleId', selectedVehicleId) // Set the selected vehicle ID in the form
	}
	const selectedVehicleId = watch('vehicleId') // Use `watch` to track vehicleId in real-time

	if (isLoading || !vehicles) {
		return <Loader />
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="space-y-4">
					<Text className="text-2xl text-white font-bold mb-6">Add Fuel ⛽</Text>

					{/* Vehicle ID Picker */}
					<VehiclePicker
						vehicles={vehicles}
						selectedVehicleId={selectedVehicleId}
						onSelectVehicle={handleSelectVehicle}
					/>

					<FormField
						title="Date"
						placeholder="Select date"
						name="date"
						control={control}
						rules={{ required: 'Date is required', valueAsDate: true }}
						errors={errors}
						date // Enable the date picker functionality
					/>

					<FormField
						title="Liters"
						placeholder="Enter the amount of fuel"
						name="fuelAmount"
						control={control}
						keyboardType="numeric"
						rules={{
							required: 'Amount of fuel is required',
							valueAsNumber: true,
							min: { value: 1, message: 'Fuel amount must be greater than 0' }
						}}
						errors={errors}
					/>

					<FormField
						title="Price per Liter"
						placeholder="Enter price per liter"
						name="price"
						control={control}
						keyboardType="numeric"
						rules={{ required: 'Price per liter is required', valueAsNumber: true, min: 0.01 }}
						errors={errors}
					/>

					{/*TODO: implement calculation Total cost from liters and price and setValue to react hook form*/}
					<FormField
						title="Total cost"
						placeholder="Enter total cost"
						name="cost"
						control={control}
						keyboardType="numeric"
						errors={errors}
					/>

					<FormField
						title="Currency"
						name="currency"
						control={control}
						select={true} // Render as a dropdown
						options={[
							{ label: 'USD', value: 'USD' },
							{ label: 'EUR', value: 'EUR' },
							{ label: 'PLN', value: 'PLN' }
						]}
						errors={errors}
					/>

					<FormField
						title="Fuel Type"
						name="fuelType"
						control={control}
						select={true} // Render as a dropdown
						options={[
							{ label: 'Petrol', value: 'petrol' },
							{ label: 'Diesel', value: 'diesel' },
							{ label: 'Electric', value: 'electric' },
							{ label: 'Hybrid', value: 'hybrid' }
						]}
						errors={errors}
					/>

					<FormField
						title="Odometer"
						placeholder="Enter current mileage reading"
						name="mileage"
						control={control}
						keyboardType="numeric"
						rules={{ required: 'Mileage reading is required', valueAsNumber: true, min: 1 }}
						errors={errors}
					/>

					<CustomImagePicker onImageSelected={handleImageSelected} containerStyles="py-6" />

					<CustomButton title="Add fuel record" handlePress={handleSubmit(onSubmitAddFuel)} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddFuel
