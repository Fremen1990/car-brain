import React from 'react'
import { render, screen } from '@testing-library/react-native'
import CustomButton from '../CustomButton'

test(`renders correctly`, () => {
	render(<CustomButton handlePress={() => {}} title="Press me" />)

	expect(screen.getByText('Press me')).toBeOnTheScreen()
})
