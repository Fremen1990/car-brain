import React from 'react'

import { Image, Text, TextInput, Pressable, View, Animated } from 'react-native'

import { icons } from '../constants'
import { Control } from 'react-hook-form/dist/types/form'
import { Controller } from 'react-hook-form'
import { VehicleFormData } from '@/app/(tabs)/(add)/add-vehicle'

interface FormFieldProps {
	title: string
	value?: string
	placeholder?: string
	handleChangeText?: (text: string) => void
	otherStyles?: string
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	// react hook form props
	name: string
	control?: Control<VehicleFormData, any>
	rules?: any
	errors?: any
}

//  TODO refactor this formfield, make it the same reusable in sigh-in and sign-up, remove value and handleChange, use proper type - no ANY

const FormField = ({
	title,
	value,
	placeholder,
	handleChangeText,
	otherStyles,
	keyboardType,
	name,
	control,
	rules,
	errors
}: FormFieldProps) => {
	const [showPassword, setShowPassword] = React.useState(false)
	const fadeAnim = React.useRef(new Animated.Value(0)).current // Animation value for error

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-base text-gray-100 font-pmedium">{title}</Text>
			<View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
				<Controller
					name={name}
					control={control}
					rules={rules}
					render={({ field: { onChange, value } }) => (
						<TextInput
							className="flex-1 text-white font-psemibold text-base"
							value={value}
							// placeholder={errors[name] ? errors[name]?.message : placeholder} // Display error inside the input field
							placeholder={placeholder} // Display error inside the input field
							placeholderTextColor={errors[name] ? '#FF6347' : '#7b7b8b'} // Red text for error placeholder              placeholderTextColor="#7b7b8b"
							onChangeText={onChange}
							secureTextEntry={title === 'Password' && !showPassword}
							keyboardType={keyboardType}
						/>
					)}
				/>

				{errors[name] && <Text className="text-amber-900">{title} is required.</Text>}

				{title === 'Password' && (
					<Pressable onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={!showPassword ? icons.eye : icons.eyeHide}
							className="w-6 h-6"
							resizeMode="contain"
						/>
					</Pressable>
				)}
			</View>
		</View>
	)
}

export default FormField
