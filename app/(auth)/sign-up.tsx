import { Link, router } from 'expo-router'
import React from 'react'
import { useForm } from 'react-hook-form'
import { ScrollView, Text, View, Image } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { DEFAULT_USER_SIGN_UP_FORM_VALUES, IMAGES } from '../../constants'

import type { SignUpFormData } from '@/types/UserTypes'

import CustomButton from '@/components/CustomButton'
import FormField from '@/components/FormField'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { createUser } from '@/lib/appwrite'
import { handleAppError } from '@/utils/errorHandler'

const SignUp = () => {
	const { setUser, setIsLogged } = useGlobalContext()

	const {
		control,
		handleSubmit,
		formState: { isValid, errors, isSubmitting }
	} = useForm<SignUpFormData>({
		defaultValues: DEFAULT_USER_SIGN_UP_FORM_VALUES
	})

	const submit = async (newUser: SignUpFormData) => {
		try {
			const result = await createUser(newUser)
			if (!result) throw Error('User not created')
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
						<Image source={IMAGES.carBrainLogo} resizeMode="contain" className="w-[115px] h-[60px]" />
					</Link>
					<Text className="text-2xl text-white text-semibold mt-4 font-psemibold">
						Sign up to <Text className="text-2xl text-secondary font-bold text-center">Car Brain</Text>
					</Text>
					<FormField
						title={'Username'}
						name="username"
						control={control}
						rules={{ required: 'Username is required' }}
						errors={errors}
						otherStyles="mt-10"
					/>
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
						title="Sign Up"
						handlePress={handleSubmit(submit)}
						containerStyles="mt-7"
						isLoading={isSubmitting || !isValid}
					/>

					<View className="justify-center pt-5 flex-row gap-2">
						<Text className="text-lg text-gray-100 font-pregular">Have an account already?</Text>

						<Link href="/sign-in" className="text-lg font-psemibold text-secondary">
							Sign In
						</Link>
					</View>
				</View>
			</ScrollView>
		</SafeAreaView>
	)
}

export default SignUp
