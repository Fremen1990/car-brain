import React from 'react'

import { ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { IMAGES } from '../../constants'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'

const SignInOptions = () => {
	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView
				contentContainerStyle={{
					height: '80%'
				}}
			>
				<View className="w-full h-full justify-center items-center">
					<Link href="/">
						<Image source={IMAGES.carBrainLogo} resizeMode="contain" className="w-[200px] h-[75px]" />
					</Link>
					<Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Choose login method:</Text>

					<CustomButton
						title="Sign in with email"
						handlePress={() => router.push('/sign-in')}
						containerStyles="mt-7 px-10"
					/>

					<CustomButton
						title="Sign in with google account"
						handlePress={() => {}}
						containerStyles="mt-7 px-10"
						isLoading={true}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignInOptions
