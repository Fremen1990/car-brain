import { router } from 'expo-router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, View, Text, ScrollView } from 'react-native'

import type { FuelFormData } from '@/types/FuelTypes'

import CustomButton from '@/components/CustomButton'
import CustomImagePicker from '@/components/CustomImagePicker'
import FormField from '@/components/FormField'
import { Loader } from '@/components/Loader'
import VehiclePicker from '@/components/VehiclePicker'
import { DEFAULT_FUEL_FORM_VALUES } from '@/constants'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { addFuelRecord } from '@/lib/appwrite'

// TODO: Write integration tests for add-fuel and add-vehicle with MSW and react native testing library
// TODO: when have integration tests with MSW - refactor data fetching to tanstack query
// TODO: when have integration tests with MSW - refactor state management to zustand

const AddFuel = () => {
	const { user } = useGlobalContext()

	const {
		handleSubmit,
		control,
		formState: { errors },
		setValue,
		watch,
		reset
	} = useForm<FuelFormData>({
		defaultValues: DEFAULT_FUEL_FORM_VALUES
	})

	const { submitForm, isLoading, handleImageSelected } = useFormSubmit<FuelFormData>({
		onSubmit: async (newFuel: FuelFormData) => {
			if (user?.$id) {
				const fuelData = {
					...newFuel,
					userId: user?.$id,
					date: new Date(newFuel.date), // Ensure date is in correct format
					price: parseFloat(String(newFuel.price)), // Convert to float
					fuelAmount: parseFloat(String(newFuel.fuelAmount)), // Convert to float
					cost: parseFloat(String(newFuel.cost)), // Convert to float
					mileage: parseInt(String(newFuel.mileage), 10) // Convert to integer
				}
				await addFuelRecord(fuelData)
				reset()
				router.push('/')
			} else {
				throw new Error('User ID is missing')
			}
		}
	})

	const { vehicles } = useGlobalContext()
	const handleSelectVehicle = (selectedVehicleId: string) => {
		setValue('vehicleId', selectedVehicleId)
	}
	const selectedVehicleId = watch('vehicleId')

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

					<CustomButton title="Add fuel record" handlePress={handleSubmit(submitForm)} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddFuel
