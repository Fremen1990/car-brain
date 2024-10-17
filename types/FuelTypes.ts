import type { Models } from 'react-native-appwrite'

export interface FuelFormData {
	vehicleId: string
	userId: string
	date: Date
	mileage: number
	fuelAmount: number
	price: number
	cost: number
	fuelType: string
	currency: string
}

export interface FuelRecord extends Models.Document {
	accountId: string
	vehicleId: string
	userId: string
	date: Date
	mileage: number
	fuelAmount: number
	price: number
	cost: number
	fuelType: string
	currency: string
}
