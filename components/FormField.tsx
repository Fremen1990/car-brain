import React from 'react'

import { Image, Text, TextInput, Pressable, View } from 'react-native'

import { icons } from '../constants'
import { Control } from 'react-hook-form/dist/types/form'
import { Controller, FieldErrors, FieldValues, RegisterOptions, Path } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
	title: string
	placeholder?: string
	otherStyles?: string
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	// react hook form props
	name: Path<T>
	control: Control<T>
	rules?: RegisterOptions<T>
	errors: FieldErrors<T>
}

const FormField = <T extends FieldValues>({
	title,
	placeholder,
	otherStyles,
	keyboardType,
	name,
	control,
	rules,
	errors
}: FormFieldProps<T>) => {
	const [showPassword, setShowPassword] = React.useState(false)

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
