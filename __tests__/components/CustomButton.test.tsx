import { render, screen } from '@testing-library/react-native'
import React from 'react'

import CustomButton from '@/components/CustomButton/CustomButton'

test(`renders correctly`, () => {
	render(<CustomButton handlePress={() => {}} title="Press me" />)

	expect(screen.getByText('Press me')).toBeOnTheScreen()
})
