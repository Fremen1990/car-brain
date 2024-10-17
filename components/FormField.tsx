import React from 'react'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'

import DatePickerField from './DatePickerField'
import DropdownPicker from './DropdownPicker'
import TextInputField from './TextInputField'

import type { FieldErrors, FieldValues, RegisterOptions, Path, Control } from 'react-hook-form'

interface FormFieldProps<T extends FieldValues> {
	title: string
	placeholder?: string
	otherStyles?: string
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	name: Path<T>
	control: Control<T>
	rules?: RegisterOptions<T>
	errors: FieldErrors<T>
	select?: boolean
	options?: { label: string; value: string }[]
	date?: boolean
}

const renderFieldComponent = ({
	select,
	date,
	value,
	onChange,
	placeholder,
	keyboardType,
	title,
	options,
	errors
}: {
	select: boolean
	date: boolean
	value: string
	onChange: (value: string) => void
	placeholder?: string
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	title: string
	options?: { label: string; value: string }[]
	errors: boolean
}) => {
	const fieldComponents = {
		select: <DropdownPicker value={value} onChange={onChange} options={options || []} />,
		date: <DatePickerField placeholder={placeholder} value={value} onChange={onChange} errors={errors} />,
		default: (
			<TextInputField
				title={title}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				keyboardType={keyboardType}
				showPasswordToggle={title === 'Password'}
				errors={errors}
			/>
		)
	}

	return select ? fieldComponents.select : date ? fieldComponents.date : fieldComponents.default
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
	select = false,
	options = [],
	date = false
}: FormFieldProps<T>) => {
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
					render={({ field: { onChange, value } }) =>
						renderFieldComponent({
							select,
							date,
							value,
							onChange,
							placeholder,
							keyboardType,
							title,
							options,
							errors: !!errors[name]
						})
					}
				/>
				{errors[name] && <Text className="text-amber-900">{title} is required.</Text>}
			</View>
		</View>
	)
}

export default FormField
