import { Models } from 'react-native-appwrite'

export interface VehicleFormData {
	users: string
	brand: string
	model: string
	year: string
	licensePlate: string
	vin: string
	mileage: string
	nextService: string
	technicalInspectionDate: string
	insuranceProvider: string
	insuranceRenewal: string
	image: URL | string
}

export interface Vehicle extends VehicleFormData, Models.Document {
	accountId: string
	image: string
	fuelEfficiency: number
}
