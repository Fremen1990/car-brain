import React from 'react'

import { ScrollView, Text, View, Image, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

import { images } from '../../constants'
import FormField from '@/components/FormField'
import CustomButton from '@/components/CustomButton'
import { Link, router } from 'expo-router'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getCurrentUser, signIn } from '@/lib/appwrite'

const SignIn = () => {
	const [form, setForm] = React.useState({
		email: '',
		password: ''
	})

	const { setUser, setIsLogged } = useGlobalContext()

	const [isSubmitting, setIsSubmitting] = React.useState(false)

	const submit = async () => {
		if (form.email === '' || form.password === '') {
			Alert.alert('Error', 'Please fill in all fields')
		}
		setIsSubmitting(true)
		try {
			await signIn(form.email, form.password)
			const result = await getCurrentUser()
			setUser(result)
			setIsLogged(true)

			router.replace('/dashboard')
		} catch (error: any) {
			// TODO: Handle error
			// 1. Check if error is due to invalid credentials
			// 2. Check if error is due to not beeing in the database
			// 2. Check if error is due to network error
			// 3. Check if error is due to other reasons
			// Alert.alert("Error", error.message);
			// Alert.alert(
			//   "Error",
			//   "Incorrect login/password or you do not have an account yet. Please sign up.",
			// );
			Alert.alert('Error', error.message)
		} finally {
			setIsSubmitting(false)
		}
	}

	return (
		<SafeAreaView className="bg-primary h-full">
			<ScrollView>
				<View className="w-full justify-center min-h-[50vh] px-4">
					<Image source={images.carBrainLogo} resizeMode="contain" className="w-[115px] h-[60px]" />
					<Text className="text-2xl text-white text-semibold mt-4 font-psemibold">
						Log in to <Text className="text-2xl text-secondary font-bold text-center">Car Brain</Text>
					</Text>

					<FormField
						title={'Email'}
						value={form.email}
						handleChangeText={(text: string) => setForm({ ...form, email: text })}
						otherStyles="mt-7"
						keyboardType="email-address"
					/>
					<FormField
						title={'Password'}
						value={form.password}
						handleChangeText={(text: string) => setForm({ ...form, password: text })}
						otherStyles="mt-7"
					/>

					<CustomButton
						title="Sign In"
						handlePress={submit}
						containerStyles="mt-7"
						isLoading={form.password.length < 8 || isSubmitting}
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
