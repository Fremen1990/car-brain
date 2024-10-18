import { waitFor, screen } from '@testing-library/react-native'
import * as React from 'react'

import Vehicles from '@/app/(tabs)/vehicles'
import { renderWithProviders } from '@/test-utils'

test('renders a list of vehicles', async () => {
	renderWithProviders(<Vehicles />)

	// Verify the mocked data is rendered
	await waitFor(() => {
		expect(screen.getByText('Fiat')).toBeTruthy()
		expect(screen.getByText('Tesla')).toBeTruthy()
	})
})
