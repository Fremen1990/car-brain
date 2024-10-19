import { http, HttpResponse } from 'msw'

import type { Vehicle } from '@/types'

const vehicles: Vehicle[] = [
	{
		$id: '1',
		accountId: 'account123',
		image: 'https://example.com/vehicle1.jpg',
		brand: 'Fiat',
		model: '500',
		licensePlate: 'ABC-1234',
		fuelEfficiency: 15.6,
		$createdAt: '2023-01-01T00:00:00.000Z',
		$updatedAt: '2023-01-01T00:00:00.000Z',
		$permissions: [],
		$collectionId: 'vehicles',
		$databaseId: 'carbrain'
	},
	{
		$id: '2',
		accountId: 'account456',
		image: 'https://example.com/vehicle2.jpg',
		brand: 'Tesla',
		model: 'Model 3',
		licensePlate: 'XYZ-5678',
		fuelEfficiency: 5.2,
		$createdAt: '2023-01-01T00:00:00.000Z',
		$updatedAt: '2023-01-01T00:00:00.000Z',
		$permissions: [],
		$collectionId: 'vehicles',
		$databaseId: 'carbrain'
	}
]

export const handlers = [
	http.get('/vehicles', () => {
		return HttpResponse.json(vehicles)
	})
]
