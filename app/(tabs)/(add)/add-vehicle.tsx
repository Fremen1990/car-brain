import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { Button } from 'react-native-paper'
import { SafeAreaView, View, Text } from '@/components/Themed'
import { ScrollView, Pressable } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useForm } from 'react-hook-form'
import { createVehicle, saveToStorage } from '@/lib/appwrite'
import { router } from 'expo-router'
import { handleAppError } from '@/utils/errorHandler'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Loader } from '@/components/Loader'
import CustomImagePicker from '@/components/CustomImagePicker'
import CustomButton from '@/components/CustomButton'

const imageCarPlaceholder =
	'https://cloud.appwrite.io/v1/storage/buckets/670318160038fb727c33/files/670af4e600257e1077e0/view?project=67030cef00029545b6e9&project=67030cef00029545b6e9&mode=admin'

export interface VehicleFormData {
	brand: string
	model: string
	year: string
	licensePlate: string
	vin: string
	mileage: string
	nextService: string
	technicalInspectionDate: string
	insuranceProvider: string
	insuranceRenewal: string
}

export interface VehicleRequestPayload extends VehicleFormData {
	image: URL | string
	users: string
}

export interface ImageData {
	uri: string
	name: string
	type: string
}

const AddVehicle = () => {
	const { user } = useGlobalContext()
	const scale = useSharedValue(1) // Shared value for the animation
	const [imageUri, setImageUri] = useState<string | null>(null)
	const [imageFileName, setImageFileName] = useState<string | null>(null)
	const [imageMimeType, setImageMimeType] = useState<string | null>(null)

	const handleImageSelected = (uri: string, fileName: string, mimeType: string) => {
		setImageUri(uri)
		setImageFileName(fileName)
		setImageMimeType(mimeType)
	}

	const [isLoading, setIsLoading] = useState(false)

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

	const onSubmitAddVehicle = async (newVehicle: VehicleFormData) => {
		setIsLoading(true)
		try {
			const uploadedFileUrl = await handleFileUpload()
			if (user?.$id !== undefined) {
				const vehicleData = {
					...newVehicle,
					users: user?.$id,
					image: uploadedFileUrl || imageCarPlaceholder
				}
				await createVehicle(vehicleData)
				router.push('/vehicles')
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
		formState: { errors }
	} = useForm<VehicleFormData>({
		defaultValues: {
			brand: '',
			model: '',
			year: '',
			licensePlate: '',
			vin: '',
			mileage: '',
			nextService: '',
			technicalInspectionDate: '',
			insuranceProvider: '',
			insuranceRenewal: ''
		}
	})

	if (isLoading) {
		return <Loader />
	}

	console.log('errors', errors)

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

					<CustomButton
						title="Add Vehicle"
						handlePress={handleSubmit(onSubmitAddVehicle)}
						containerStyles="my-6"
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddVehicle
