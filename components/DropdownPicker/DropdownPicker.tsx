import { Picker } from '@react-native-picker/picker'
import React from 'react'

interface DropdownPickerProps {
	value: string
	onChange: (value: string) => void
	options: { label: string; value: string }[]
}

const DropdownPicker: React.FC<DropdownPickerProps> = ({ value, onChange, options }) => {
	return (
		<Picker selectedValue={value} onValueChange={onChange} style={{ flex: 1, color: 'white' }}>
			{options.map((option) => (
				<Picker.Item key={option.value} label={option.label} value={option.value} />
			))}
		</Picker>
	)
}

export default DropdownPicker
