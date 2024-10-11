import { View, Text, SafeAreaView } from '@/components/Themed'
import { Switch, Image, Pressable } from 'react-native'

import { useTheme } from '@/contexts/ThemeContext'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import Ionicons from '@expo/vector-icons/Ionicons'
import moment from 'moment'
import { images } from '@/constants'
import React from 'react' // Library to calculate the time since profile creation

const Settings = () => {
	const { user } = useGlobalContext()
	const { isDarkMode, toggleTheme } = useTheme()

	// Calculate how long the profile exists
	const profileAge = user?.$createdAt ? moment(user.$createdAt).fromNow() : 'Unknown'

	return (
		<SafeAreaView className="h-full flex-1 bg-primary items-center p-6">
			{/* Settings Header */}
			<View className="flex-row items-center justify-between w-full">
				<Text className="text-4xl text-[#FFA001] font-bold">Settings</Text>
				<Pressable
					onPress={() => {
						// Optional: You could add functionality for logging out or other actions here
					}}
				>
					<Ionicons name="log-out-outline" size={28} color="#FFA001" />
				</Pressable>
			</View>

			{/* User Info */}
			<View className="flex-row items-center bg-gradient-to-r from-[#1E1E2C] to-[#232533] rounded-xl p-4 mt-6 w-full">
				<Image
					source={images.driverAvatar}
					className="w-16 h-16 rounded-full border-2 border-[#FFA001] mr-4"
					resizeMode="contain"
					tintColor={'#FFA001'}
				/>

				<View>
					<Text className="text-2xl text-[#FFA001] font-bold">{user?.username}</Text>
					<Text className="text-base text-[#CDCDE0]">{user?.email}</Text>
					<Text className="text-sm text-[#7B7B8B]">Joined {profileAge}</Text>
				</View>
			</View>

			{/* Dark Mode Toggle */}
			<View className="w-full mt-8 flex-row items-center justify-between bg-[#232533] p-4 rounded-lg">
				<Text className="text-lg text-[#CDCDE0]">Dark Mode</Text>
				<Switch value={isDarkMode} onValueChange={toggleTheme} />
			</View>

			{/* Profile Settings */}
			<View className="w-full mt-8 space-y-4">
				{/* Notifications Settings */}
				<View className="flex-row items-center justify-between bg-[#232533] p-4 rounded-lg">
					<Text className="text-lg text-[#CDCDE0]">Notifications</Text>
					<Ionicons name="notifications-outline" size={24} color="#FFA001" />
				</View>

				{/* Change Password */}
				<View className="flex-row items-center justify-between bg-[#232533] p-4 rounded-lg">
					<Text className="text-lg text-[#CDCDE0]">Change Password</Text>
					<Ionicons name="lock-closed-outline" size={24} color="#FFA001" />
				</View>

				{/* Account Privacy */}
				<View className="flex-row items-center justify-between bg-[#232533] p-4 rounded-lg">
					<Text className="text-lg text-[#CDCDE0]">Account Privacy</Text>
					<Ionicons name="shield-outline" size={24} color="#FFA001" />
				</View>
			</View>

			{/* Additional Settings (optional) */}
			<View className="w-full mt-8 space-y-4">
				{/* Subscription Plan */}
				<View className="flex-row items-center justify-between bg-[#232533] p-4 rounded-lg">
					<Text className="text-lg text-[#CDCDE0]">Subscription Plan</Text>
					<Ionicons name="card-outline" size={24} color="#FFA001" />
				</View>

				{/* Log Out Button */}
				<Pressable className="flex-row items-center justify-center bg-[#FF6666] py-3 px-6 rounded-lg mt-4">
					<Text className="text-white text-lg font-bold mr-2">Log Out</Text>
					<Ionicons name="log-out-outline" size={24} color="white" />
				</Pressable>
			</View>
		</SafeAreaView>
	)
}

export default Settings
