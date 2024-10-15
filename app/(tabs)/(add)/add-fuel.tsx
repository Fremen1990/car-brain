import React, { useState } from 'react'
import FormField from '@/components/FormField'
import { Button } from 'react-native-paper'
import { SafeAreaView, View, Text, Image, ScrollView, Pressable, Alert, FlatList } from 'react-native'
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated'
import { useForm } from 'react-hook-form'
import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'
import { handleAppError } from '@/utils/errorHandler'
import { router } from 'expo-router'
import { addFuelRecord, saveToStorage } from '@/lib/appwrite'
import Ionicons from '@expo/vector-icons/Ionicons'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { Loader } from '@/components/Loader'

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

// TODO: refactor to use one component to upload photos and take photos  and reuse in add-vehicle and add-fuel
// TODO: refactor to use onSubmit custom hook to handle form submission reusable
// TODO: Write integration tests for add-fuel and add-vehicle with MSW and react native testing library
// TODO: refactor add-fuel and add-vehicle to separated reusable components like image picker and form fields

const AddFuel = () => {
	const { user } = useGlobalContext()
	const { vehicles } = useGlobalContext()
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

	// Image Picker function (for bill image or photo)
	const pickImage = async () => {
		const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync()
		if (!permissionResult.granted) {
			Alert.alert('Error', 'Permission to access camera roll is required!')
			return
		}

		const result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.Images,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		if (!result.canceled) {
			const resizedImage = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[{ resize: { width: 300 } }],
				{
					compress: 0.7,
					format: ImageManipulator.SaveFormat.JPEG
				}
			)

			setImageUri(resizedImage.uri)
			setImageFileName(resizedImage.uri.split('/').pop() || 'fuel_bill.jpg')
			setImageMimeType('image/jpeg')
		}
	}

	// Camera function to take a photo
	const takePhoto = async () => {
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync()
		if (!permissionResult.granted) {
			Alert.alert('Error', 'Permission to access camera is required!')
			return
		}

		const result = await ImagePicker.launchCameraAsync({
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
		})

		if (!result.canceled) {
			const resizedImage = await ImageManipulator.manipulateAsync(
				result.assets[0].uri,
				[{ resize: { width: 300 } }],
				{
					compress: 0.7,
					format: ImageManipulator.SaveFormat.JPEG
				}
			)

			setImageUri(resizedImage.uri)
			setImageFileName(resizedImage.uri.split('/').pop() || 'fuel_bill_photo.jpg')
			setImageMimeType('image/jpeg')
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

	console.log('user', user?.$id)

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

	const handleSelectVehicle = (selectedVehicleId: string) => {
		setValue('vehicleId', selectedVehicleId) // Set the selected vehicle ID in form
	}

	const selectedVehicleId = watch('vehicleId') // Use `watch` to track vehicleId in real-time

	if (isLoading) {
		return <Loader />
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="space-y-4">
					<Text className="text-2xl text-white font-bold mb-6">Add Fuel ⛽</Text>

					{/* Vehicle ID Picker */}
					<FlatList
						data={vehicles}
						horizontal={true}
						keyExtractor={(item) => item.$id.toString()}
						renderItem={({ item }) => {
							return (
								<Pressable onPress={() => handleSelectVehicle(item.$id)}>
									<View
										className="relative mr-4"
										style={{
											borderColor: selectedVehicleId === item.$id ? '#FFA001' : 'transparent', // Highlight selected vehicle
											borderWidth: 2,
											borderRadius: 8
										}}
									>
										<Image
											source={{ uri: item.image }}
											style={{ width: 200, height: 150, borderRadius: 8 }}
										/>
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

					{/* Image Picker and Photo Buttons */}
					<View className="flex-row justify-center space-x-3">
						<Pressable onPress={pickImage}>
							<View className="items-center">
								{imageUri ? (
									<Image
										source={{ uri: imageUri }}
										style={{ width: 200, height: 200, borderRadius: 8 }}
									/>
								) : (
									<View className="w-40 h-40 bg-gray-200 rounded-lg items-center justify-center">
										<Ionicons name="cloud-upload-outline" size={32} color="gray" />
										<Text className="text-gray-500">Upload Bill Image</Text>
									</View>
								)}
							</View>
						</Pressable>

						<Pressable onPress={takePhoto}>
							<View className="w-40 h-40 bg-gray-200 rounded-lg items-center justify-center">
								<Ionicons name="camera-outline" size={32} color="gray" />
								<Text className="text-gray-500">Take Photo of Bill</Text>
							</View>
						</Pressable>
					</View>

					{/* Submit Button */}
					<Animated.View style={[animatedStyle]}>
						<Pressable
							onPressIn={handlePressIn}
							onPressOut={handlePressOut}
							onPress={handleSubmit(onSubmitAddFuel)}
						>
							<Button mode="contained" className="bg-[#FFA001] rounded-lg">
								Add Fuel Entry
							</Button>
						</Pressable>
					</Animated.View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default AddFuel
