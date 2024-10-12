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
import { saveToStorage } from '@/lib/appwrite'
import Ionicons from '@expo/vector-icons/Ionicons'
import { vehicles } from '@/db/vehicles'

export interface FuelFormData {
	vehicleId: string
	date: string
	odometer: string
	liters: string
	price: string
}

const AddFuel = () => {
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
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
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
				{ compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
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

	const onSubmitAddFuel = async (newFuel: FuelFormData) => {
		setIsLoading(true)
		try {
			const uploadedFileUrl = await handleFileUpload()
			const fuelData = {
				...newFuel,
				billImage: uploadedFileUrl || null
			}
			// Send fuelData to database
			console.log('Fuel data:', fuelData)
			// router.push('/fuel-logs') // Redirect after adding fuel log
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
	} = useForm<FuelFormData>({
		defaultValues: {
			vehicleId: '',
			date: '',
			odometer: '',
			liters: '',
			price: ''
		}
	})

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView contentContainerStyle={{ padding: 16 }}>
				<View className="space-y-4">
					<Text className="text-2xl text-white font-bold mb-6">Add Fuel ⛽</Text>
					{/* Form Fields */}
					{/*<FormField*/}
					{/*	title="Vehicle ID"*/}
					{/*	placeholder="Enter vehicle ID"*/}
					{/*	name="vehicleId"*/}
					{/*	control={control}*/}
					{/*	rules={{ required: 'Vehicle ID is required' }}*/}
					{/*	errors={errors}*/}
					{/*/>*/}
					{/* Vehicle ID Picker - Horizontal FlatList with car image, brand, model, and registration plate */}
					<View className="my-4">
						<Text className="text-white text-lg font-bold mb-2">Select Vehicle</Text>
						<FlatList
							data={vehicles} // Assume you have a list of vehicles to display
							horizontal={true}
							// keyExtractor={(item) => item.$id.toString()}
							renderItem={({ item }) => (
								<Pressable
									// onPress={() => handleSelectVehicle(item.$id)}
									onPress={() => {}}
								>
									<View className="relative mr-4">
										<Image
											source={item.image}
											style={{ width: 150, height: 100, borderRadius: 8 }}
										/>
										<View className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
											<Text className="text-white font-bold">
												{item.brand} {item.model}
											</Text>
											<Text className="text-white text-sm">{item.licensePlate}</Text>
										</View>
									</View>
								</Pressable>
							)}
							showsHorizontalScrollIndicator={false}
							contentContainerStyle={{
								paddingHorizontal: 16,
								alignItems: 'center'
							}}
						/>
					</View>
					<FormField
						title="Date"
						placeholder="Enter the date"
						name="date"
						control={control}
						rules={{ required: 'Date is required' }}
						errors={errors}
					/>
					<FormField
						title="Odometer"
						placeholder="Enter current odometer reading"
						name="odometer"
						control={control}
						keyboardType="numeric"
						errors={errors}
					/>
					<FormField
						title="Liters"
						placeholder="Enter the amount of fuel"
						name="liters"
						control={control}
						keyboardType="numeric"
						errors={errors}
					/>
					<FormField
						title="Price"
						placeholder="Enter fuel price"
						name="price"
						control={control}
						keyboardType="numeric"
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

						<Pressable onPress={takePhoto} className="">
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
