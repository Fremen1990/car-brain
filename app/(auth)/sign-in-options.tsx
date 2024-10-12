import React from 'react'

import { ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
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
						<Image source={images.carBrainLogo} resizeMode="contain" className="w-[200px] h-[75px]" />
					</Link>
					<Text className="text-2xl text-white text-semibold mt-10 font-psemibold">Choose login method:</Text>

					<CustomButton
						title="Sign in with email"
						// handlePress={submit}
						handlePress={() => router.push('/sign-in')}
						containerStyles="mt-7 px-10"
						// isLoading={form.password.length < 8 || isSubmitting}
					/>

					<CustomButton
						title="Sign in with google account"
						// handlePress={submit}
						handlePress={() => {}}
						containerStyles="mt-7 px-10"
						// isLoading={form.password.length < 8 || isSubmitting}
						isLoading={true}
					/>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignInOptions
