import React, { useState } from 'react'

import { Image, Text, TextInput, Pressable, View } from 'react-native'

import { ICONS } from '../constants'
import { Control } from 'react-hook-form/dist/types/form'
import { Controller, FieldErrors, FieldValues, RegisterOptions, Path } from 'react-hook-form'
import { Picker } from '@react-native-picker/picker'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

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
	// select options
	select?: boolean // New prop to define if it's a dropdown/select
	options?: { label: string; value: string }[] // Options for dropdown
	// date picker
	date?: boolean // New prop for date picker
}
const FormField = <T extends FieldValues>({
	title,
	placeholder,
	otherStyles,
	keyboardType,
	name,
	control,
	rules,
	errors,
	select = false, // default is not a select
	options = [], // empty by default
	date = false // default is not a date
}: FormFieldProps<T>) => {
	const [showPassword, setShowPassword] = React.useState(false)
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

	// Handle Date Selection
	const handleConfirm = (date: Date, onChange: any) => {
		setDatePickerVisibility(false)
		onChange(date.toISOString().split('T')[0]) // Format date to YYYY-MM-DD
	}

	// Toggle the Date Picker visibility
	const showDatePicker = () => setDatePickerVisibility(true)
	const hideDatePicker = () => setDatePickerVisibility(false)

	return (
		<View className={`space-y-2 ${otherStyles}`}>
			<Text className="text-base text-gray-100 font-pmedium">{title}</Text>
			<View
				className={`border-2 border-black-200 w-full ${
					select ? 'h-auto' : 'h-16'
				} px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row`}
			>
				<Controller
					name={name}
					control={control}
					rules={rules}
					render={({ field: { onChange, value } }) => {
						if (select) {
							// Render Dropdown for `select` types
							return (
								<Picker
									selectedValue={value}
									onValueChange={(itemValue) => onChange(itemValue)}
									style={{ flex: 1, color: 'white' }} // Add color for dropdown
								>
									{options.map((option) => (
										<Picker.Item key={option.value} label={option.label} value={option.value} />
									))}
								</Picker>
							)
						} else if (date) {
							// Render Date Picker for `date` types
							return (
								<>
									<Pressable onPress={showDatePicker} className="w-full h-full">
										<TextInput
											editable={false} // Make it non-editable
											className="text-white font-psemibold text-base"
											placeholder={placeholder}
											value={value ? value : ''}
											placeholderTextColor={errors[name] ? '#FF6347' : '#7b7b8b'}
										/>
									</Pressable>
									<DateTimePickerModal
										isVisible={isDatePickerVisible}
										mode="date"
										onConfirm={(date) => handleConfirm(date, onChange)}
										onCancel={hideDatePicker}
										style={{ zIndex: 9999 }}
									/>
								</>
							)
						} else {
							return (
								<TextInput
									className="flex-1 text-white font-psemibold text-base"
									value={value}
									placeholder={placeholder}
									placeholderTextColor={errors[name] ? '#FF6347' : '#7b7b8b'}
									onChangeText={onChange}
									secureTextEntry={title === 'Password' && !showPassword}
									keyboardType={keyboardType}
								/>
							)
						}
					}}
				/>

				{errors[name] && <Text className="text-amber-900">{title} is required.</Text>}

				{title === 'Password' && (
					<Pressable onPress={() => setShowPassword(!showPassword)}>
						<Image
							source={!showPassword ? ICONS.eye : ICONS.eyeHide}
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
