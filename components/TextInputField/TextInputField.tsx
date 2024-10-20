import React, { useState } from 'react'
import { TextInput, Pressable, Image } from 'react-native'

import { ICONS } from '../../constants'

import type { ControllerRenderProps } from 'react-hook-form'

interface TextInputFieldProps {
	title: string
	placeholder?: string
	value: string
	onChange: ControllerRenderProps['onChange']
	keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad'
	showPasswordToggle?: boolean
	errors?: boolean
}

const TextInputField: React.FC<TextInputFieldProps> = ({
	title,
	placeholder,
	value,
	onChange,
	keyboardType,
	showPasswordToggle,
	errors
}) => {
	const [showPassword, setShowPassword] = useState(false)

	return (
		<>
			<TextInput
				className="flex-1 text-white font-psemibold text-base"
				value={value}
				placeholder={placeholder}
				placeholderTextColor={errors ? '#FF6347' : '#7b7b8b'}
				onChangeText={onChange}
				secureTextEntry={title === 'Password' && !showPassword}
				keyboardType={keyboardType}
			/>
			{showPasswordToggle && (
				<Pressable onPress={() => setShowPassword(!showPassword)}>
					<Image
						source={!showPassword ? ICONS.eye : ICONS.eyeHide}
						className="w-6 h-6"
						resizeMode="contain"
					/>
				</Pressable>
			)}
		</>
	)
}

export default TextInputField
