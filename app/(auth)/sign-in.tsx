import React from 'react'

import { ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getCurrentUser, signIn } from '@/lib/appwrite'
import { handleAppError } from '@/utils/errorHandler'
import { useForm } from 'react-hook-form'

export interface SignInFormData {
	email: string
	password: string
}

const SignIn = () => {
	const { setUser, setIsLogged } = useGlobalContext()

	const {
		control,
		handleSubmit,
		formState: { isValid, errors, isSubmitting }
	} = useForm<SignInFormData>({
		defaultValues: {
			email: '',
			password: ''
		}
	})

	console.log('isValid', isValid)

	const submit = async (user: SignInFormData) => {
		try {
			await signIn(user)
			const result = await getCurrentUser()
			setUser(result)
			setIsLogged(true)
			router.replace('/dashboard')
		} catch (error: unknown) {
			handleAppError(error, true)
		}
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View className="w-full justify-center min-h-[50vh] px-4">
					<Link href="/">
						<Image source={images.carBrainLogo} resizeMode="contain" className="w-[115px] h-[60px]" />
					</Link>
					<Text className="text-2xl text-white text-semibold mt-4 font-psemibold">
						Log in to <Text className="text-2xl text-secondary font-bold text-center">Car Brain</Text>
					</Text>

					<FormField
						title={'Email'}
						name="email"
						control={control}
						rules={{
							// required: 'Email is required',
							pattern: {
								value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
								message: 'Email required in proper format'
							}
						}}
						errors={errors}
						otherStyles="mt-7"
						keyboardType="email-address"
					/>
					<FormField
						title={'Password'}
						name="password"
						control={control}
						rules={{
							required: 'Password is required',
							minLength: { value: 8, message: 'Password is too short' }
						}}
						errors={errors}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign In"
						handlePress={handleSubmit(submit)}
						containerStyles="mt-7"
						isLoading={isSubmitting || !isValid}
					/>

					<View className="justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">Dont have account?</Text>

						<Link href="/sign-up" className="text-lg font-psemibold text-secondary">
							Sign Up
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignIn
