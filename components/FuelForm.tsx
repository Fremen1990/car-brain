import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { SafeAreaView, ScrollView, Text, View } from 'react-native'

import type { FuelFormData } from '@/types/FuelTypes'

import CustomButton from '@/components/CustomButton'
import CustomImagePicker from '@/components/CustomImagePicker'
import FormField from '@/components/FormField'
import { Loader } from '@/components/Loader'
import VehiclePicker from '@/components/VehiclePicker'
import { CURRENCY_OPTIONS, DEFAULT_FUEL_FORM_VALUES, FUEL_TYPE_OPTIONS } from '@/constants'
import { useGlobalContext } from '@/contexts/GlobalProvider'

interface FuelFormProps {
	title: string
	defaultValues?: FuelFormData
	onSubmit: (data: FuelFormData, reset: () => void) => Promise<void>
	isLoading: boolean
	handleImageSelected: (uri: string, fileName: string, mimeType: string) => void
}

const prepareDefaultValues = (data: any) => {
	return {
		...data,
		userId: typeof data.userId === 'object' ? data.userId.$id : data.userId,
		vehicleId: typeof data.vehicleId === 'object' ? data.vehicleId.$id : data.vehicleId,
		date: new Date(data.date), // Convert to a Date object
		price: String(data.price), // Convert numbers to strings
		fuelAmount: String(data.fuelAmount), // Convert numbers to strings
		cost: String(data.cost), // Convert numbers to strings
		mileage: String(data.mileage) // Convert numbers to strings
	}
}

const FuelForm = ({
	title,
	defaultValues = DEFAULT_FUEL_FORM_VALUES,
	onSubmit,
	isLoading,
	handleImageSelected
}: FuelFormProps) => {
	console.log('defaultValues', defaultValues)
	const {
		control,
		handleSubmit,
		formState: { errors, defaultValues: preFilledValues },
		setValue,
		watch,
		reset
	} = useForm<FuelFormData>({
		defaultValues: prepareDefaultValues(defaultValues)
	})
	const { vehicles } = useGlobalContext()

	const selectedVehicleId = watch('vehicleId')

	const handleSelectVehicle = (selectedVehicleId: string) => {
		setValue('vehicleId', selectedVehicleId)
	}

	if (isLoading || !vehicles) {
		return <Loader />
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="space-y-4">
					<Text className="text-2xl text-white font-bold mb-6">{title}</Text>

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
						date
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
						select
						options={CURRENCY_OPTIONS}
						errors={errors}
					/>

					<FormField
						title="Fuel Type"
						name="fuelType"
						control={control}
						select
						options={FUEL_TYPE_OPTIONS}
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

					<CustomButton title="Submit" handlePress={handleSubmit((data) => onSubmit(data, reset))} />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default FuelForm
