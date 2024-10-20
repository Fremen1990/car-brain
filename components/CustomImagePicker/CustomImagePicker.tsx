import Ionicons from '@expo/vector-icons/Ionicons'
import * as ImageManipulator from 'expo-image-manipulator'
import * as ImagePicker from 'expo-image-picker'
import React, { useState } from 'react'
import { View, Text, Image, Pressable, Alert } from 'react-native'

interface ImagePickerComponentProps {
	onImageSelected: (uri: string, fileName: string, mimeType: string) => void
	containerStyles?: string
}

const CustomImagePicker: React.FC<ImagePickerComponentProps> = ({ onImageSelected, containerStyles }) => {
	const [imageUri, setImageUri] = useState<string | null>(null)

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

			const fileName = resizedImage.uri.split('/').pop() || 'image.jpg'
			const mimeType = 'image/jpeg'

			setImageUri(resizedImage.uri)
			onImageSelected(resizedImage.uri, fileName, mimeType)
		}
	}

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

			const fileName = resizedImage.uri.split('/').pop() || 'photo.jpg'
			const mimeType = 'image/jpeg'

			setImageUri(resizedImage.uri)
			onImageSelected(resizedImage.uri, fileName, mimeType)
		}
	}

	return (
		<View className={`flex-row justify-center space-x-3 ${containerStyles}`}>
			<Pressable onPress={pickImage}>
				<View className="items-center">
					{imageUri ? (
						<Image source={{ uri: imageUri }} style={{ width: 200, height: 200, borderRadius: 8 }} />
					) : (
						<View className="w-40 h-40 bg-gray-200 rounded-lg items-center justify-center">
							<Ionicons name="cloud-upload-outline" size={32} color="gray" />
							<Text className="text-gray-500">Upload Image</Text>
						</View>
					)}
				</View>
			</Pressable>

			<Pressable onPress={takePhoto}>
				<View className="w-40 h-40 bg-gray-200 rounded-lg items-center justify-center">
					<Ionicons name="camera-outline" size={32} color="gray" />
					<Text className="text-gray-500">Take Photo</Text>
				</View>
			</Pressable>
		</View>
	)
}

export default CustomImagePicker
