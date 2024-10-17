import React, { useState } from 'react'
import { Pressable, TextInput } from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'

import type { ControllerRenderProps } from 'react-hook-form'

interface DatePickerFieldProps {
	placeholder?: string
	value: string
	onChange: ControllerRenderProps['onChange']
	errors?: boolean
}

const DatePickerField: React.FC<DatePickerFieldProps> = ({ placeholder, value, onChange, errors }) => {
	const [isDatePickerVisible, setDatePickerVisibility] = useState(false)

	const handleConfirm = (date: Date) => {
		setDatePickerVisibility(false)
		onChange(date.toISOString().split('T')[0])
	}

	return (
		<>
			<Pressable onPress={() => setDatePickerVisibility(true)} className="w-full h-full">
				<TextInput
					editable={false}
					className="text-white font-psemibold text-base"
					placeholder={placeholder}
					value={value || ''}
					placeholderTextColor={errors ? '#FF6347' : '#7b7b8b'}
				/>
			</Pressable>
			<DateTimePickerModal
				isVisible={isDatePickerVisible}
				mode="date"
				onConfirm={handleConfirm}
				onCancel={() => setDatePickerVisibility(false)}
				style={{ zIndex: 9999 }}
			/>
		</>
	)
}

export default DatePickerField
