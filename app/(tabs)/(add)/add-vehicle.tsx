import React from 'react'
import FormField from '@/components/FormField'
import { SafeAreaView, View, Text } from '@/components/Themed'
import { ScrollView } from 'react-native'
import { useForm } from 'react-hook-form'
import { createVehicle } from '@/lib/appwrite'
import { router } from 'expo-router'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Loader } from '@/components/Loader'
import CustomImagePicker from '@/components/CustomImagePicker'
import CustomButton from '@/components/CustomButton'
import { DEFAULT_VEHICLE_FORM_VALUES } from '@/constants'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { DEFAULT_VEHICLE_IMAGE_URL } from '@/constants/formConstants'
import { VehicleFormData } from '@/types/VehicleTypes'

const AddVehicle = () => {
	const { user } = useGlobalContext()

	const {
		control,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<VehicleFormData>({
		defaultValues: DEFAULT_VEHICLE_FORM_VALUES
	})

	const { submitForm, isLoading, handleImageSelected } = useFormSubmit<VehicleFormData>({
		onSubmit: async (newVehicle: VehicleFormData) => {
			if (user?.$id) {
				const vehicleData = {
					...newVehicle,
					users: user.$id
				}
				await createVehicle(vehicleData)
				reset()
				router.push('/vehicles')
			} else {
				throw new Error('User ID is missing')
			}
		},
		defaultImageUrl: DEFAULT_VEHICLE_IMAGE_URL
	})

	if (isLoading) {
		return <Loader />
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="space-y-4">
					<Text className="text-2xl text-white font-bold mb-6">Add New Vehicle</Text>

					{/* Image Picker and Photo Buttons */}
					<CustomImagePicker onImageSelected={handleImageSelected} />

					{/* Form Fields */}
					<FormField
						title="Brand"
						placeholder="Enter vehicle brand"
						name="brand"
						control={control}
						rules={{ required: 'Brand is required' }}
						errors={errors}
					/>
					<FormField
						title="Model"
						placeholder="Enter vehicle model"
						name="model"
						control={control}
						rules={{ required: 'Model is required' }}
						errors={errors}
					/>
					<FormField
						title="Year"
						placeholder="Enter year of manufacture"
						keyboardType="numeric"
						name="year"
						control={control}
						rules={{ required: 'Year is required' }}
						errors={errors}
					/>
					<FormField
						title="License Plate"
						placeholder="Enter license plate"
						name="licensePlate"
						control={control}
						rules={{ required: 'License Plate is required' }}
						errors={errors}
					/>
					<FormField
						title="VIN"
						placeholder="Enter VIN number"
						name="vin"
						control={control}
						// rules={{
						//   // add custom message "VIN need to be 17 characters long"
						//   minLength: {
						//     required: false,
						//     value: 17,
						//     message: "VIN need to be 17 characters long",
						//   },
						// }}
						errors={errors}
					/>
					<FormField
						title="Mileage"
						placeholder="Enter current mileage"
						keyboardType="numeric"
						name="mileage"
						control={control}
						errors={errors}
					/>
					<FormField
						title="Next Service"
						placeholder="Enter next service (e.g., 95,000 miles)"
						name="nextService"
						control={control}
						errors={errors}
					/>

					<FormField
						title="Insurance Provider"
						placeholder="Enter insurance provider"
						name="insuranceProvider"
						control={control}
						errors={errors}
					/>

					<FormField
						title="Insurance Renewal Date"
						placeholder="Enter insurance renewal date (YYYY-MM-DD)"
						name="insuranceRenewal"
						control={control}
						errors={errors}
					/>

					<CustomButton title="Add Vehicle" handlePress={handleSubmit(submitForm)} containerStyles="my-6" />
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddVehicle
