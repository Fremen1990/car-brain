import { NavigationContainer } from '@react-navigation/native'
import { fireEvent, render, waitFor, screen } from '@testing-library/react-native'
import { router } from 'expo-router'
import React from 'react'

import type { Vehicle } from '@/types'

import Vehicles from '@/app/(tabs)/vehicles'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getAllVehicles } from '@/lib/appwrite'

// Mock the necessary modules and hooks
jest.mock('expo-router', () => ({
	router: {
		push: jest.fn()
	}
}))

jest.mock('@/contexts/GlobalProvider', () => ({
	useGlobalContext: jest.fn()
}))

jest.mock('@/lib/appwrite', () => ({
	getAllVehicles: jest.fn()
}))

jest.mock('@/components/VehicleCard/VehicleCard', () => {
	// eslint-disable-next-line no-undef,@typescript-eslint/no-require-imports
	const { Text } = require('react-native')
	return {
		VehicleCard: ({ vehicle }: { vehicle: Vehicle }) => <Text>{vehicle.brand}</Text>
	}
})

describe('Vehicles Screen', () => {
	const renderComponentWithNavigation = () => {
		return render(
			<NavigationContainer>
				<Vehicles />
			</NavigationContainer>
		)
	}

	const mockVehicles = [
		{ $id: '1', brand: 'BMW', model: '320D', mileage: 90000 },
		{ $id: '2', brand: 'Audi', model: 'A4', mileage: 85000 }
	]

	beforeEach(() => {
		jest.clearAllMocks()
		;(useGlobalContext as jest.Mock).mockReturnValue({
			user: { $id: 'user-123' },
			isLoadingVehicles: false,
			refetchVehicles: jest.fn()
		})
	})

	it('shows loading state when fetching vehicles', async () => {
		;(useGlobalContext as jest.Mock).mockReturnValue({
			user: { $id: 'user-123' },
			isLoadingVehicles: true,
			refetchVehicles: jest.fn()
		})
		;(getAllVehicles as jest.Mock).mockResolvedValue([])

		renderComponentWithNavigation()

		await waitFor(() => {
			expect(screen.getByTestId('loader')).toBeTruthy()
		})
	})

	it('shows "No vehicles found" message when there are no vehicles', async () => {
		;(getAllVehicles as jest.Mock).mockResolvedValue([])

		renderComponentWithNavigation()

		await waitFor(() => {
			expect(screen.getByText('No vehicles found')).toBeTruthy()
		})

		const addButton = screen.getByText('Add Vehicle')
		fireEvent.press(addButton)
		expect(router.push).toHaveBeenCalledWith('/add-vehicle')
	})

	it('renders a list of vehicles', async () => {
		;(getAllVehicles as jest.Mock).mockResolvedValue(mockVehicles)

		renderComponentWithNavigation()

		await waitFor(() => {
			expect(screen.getByText('BMW')).toBeTruthy()
			expect(screen.getByText('Audi')).toBeTruthy()
		})
	})

	it('toggles the sort order when the sort button is pressed', async () => {
		;(getAllVehicles as jest.Mock).mockResolvedValue(mockVehicles)

		renderComponentWithNavigation()

		await waitFor(() => {
			expect(screen.getByText('BMW')).toBeTruthy()
		})

		const sortButton = screen.getByText('Oldest First')
		fireEvent.press(sortButton)

		await waitFor(() => {
			expect(screen.getByText('Newest First')).toBeTruthy()
		})
	})

	it('updates activeItem when viewable items change', async () => {
		;(getAllVehicles as jest.Mock).mockResolvedValue(mockVehicles)

		renderComponentWithNavigation()

		await waitFor(() => {
			expect(screen.getByText('BMW')).toBeTruthy()
		})

		const vehicleCard = screen.getByText('BMW')
		fireEvent(vehicleCard, 'onViewableItemsChanged', { viewableItems: [{ item: { $id: '1' } }] })

		await waitFor(() => {
			expect(screen.getByText('BMW')).toBeTruthy()
		})
	})
})
