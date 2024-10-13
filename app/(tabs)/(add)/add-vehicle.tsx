import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { Button } from 'react-native-paper'
import { SafeAreaView, View, Text } from '@/components/Themed'
import { ScrollView, Pressable, Alert, Image } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useForm } from 'react-hook-form'
import { createVehicle, saveToStorage } from '@/lib/appwrite'
import { router } from 'expo-router'
import * as ImagePicker from 'expo-image-picker'
import { handleAppError } from '@/utils/errorHandler'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import * as ImageManipulator from 'expo-image-manipulator'
import { Loader } from '@/components/Loader'

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

	const [isLoading, setIsLoading] = useState(false)

	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ scale: scale.value }]
		}
	})

	const handlePressIn = () => {
		scale.value = withSpring(1.1)
	}

	const handlePressOut = () => {
		scale.value = withSpring(1)
	}

	// Image Picker function
	const pickImage = async () => {
		// Ask for media library permissions
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permissionResult.granted) {
			Alert.alert('Error', 'Permission to access camera roll is required!')
			return
		}

		// Pick an image from the device's library
		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		if (!result.canceled) {
			// Resize and compress the image
			const resizedImage = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[{ resize: { width: 300 } }], // Resize the image to a maximum width of 300px
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG } // Compress to JPEG with 70% quality
			)

			setImageUri(resizedImage.uri)
			setImageFileName(resizedImage.uri.split('/').pop() || 'vehicle_photo.jpg') // Get file name
			setImageMimeType('image/jpeg') // Since we're converting to JPEG
		}
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

					{/* Image Picker */}
					<Pressable onPress={pickImage}>
						<View className="items-center">
							{imageUri ? (
								<Image
									source={{ uri: imageUri }}
									style={{ width: 200, height: 200, borderRadius: 8 }}
								/>
							) : (
								<View className="w-48 h-48 bg-gray-200 rounded-lg items-center justify-center">
									<Text className="text-gray-500">Pick an Image</Text>
								</View>
							)}
						</View>
					</Pressable>

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

					{/* Submit Button */}
					{/* TODO: Create animated Pressable button (make params to animate or not) */}
					<Animated.View style={[animatedStyle]}>
						<Pressable
							onPressIn={handlePressIn}
							onPressOut={handlePressOut}
							onPress={handleSubmit(onSubmitAddVehicle)}
						>
							<Button mode="contained" className="bg-[#FFA001] rounded-lg">
								Add Vehicle
							</Button>
						</Pressable>
					</Animated.View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddVehicle
