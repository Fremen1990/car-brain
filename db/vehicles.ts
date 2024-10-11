import { images } from '@/constants'

export const vehicles = [
	{
		id: 1,
		brand: 'Tesla',
		model: 'Model S Performance',
		year: '2020',
		mileage: '15000',
		vin: '5YJSA1E26HF000337',
		licensePlate: 'XYZ 1234',
		image: images.tesla, // Tesla image assumed to be defined in images
		nextService: '20,000 miles',
		insuranceProvider: 'Tesla Insurance',
		insuranceRenewal: '2024-08-01',
		fuelEfficiency: 3.5 // liters per 100km
	},
	{
		id: 2,
		brand: 'BMW',
		model: '320D E91',
		year: '2015',
		mileage: '90000',
		vin: 'WBAUT72030A232023',
		licensePlate: 'BMW 5678',
		image: images.bmw, // BMW image assumed to be defined in images
		nextService: '95,000 miles',
		insuranceProvider: 'BMW Insurance',
		insuranceRenewal: '2025-02-15',
		fuelEfficiency: 5.8 // liters per 100km
	},
	{
		id: 3,
		brand: 'Fiat',
		model: 'Croma',
		year: '2008',
		mileage: '120000',
		vin: 'ZFA19400002039183',
		licensePlate: 'FIAT 9876',
		image: images.croma, // Fiat image assumed to be defined in images
		nextService: '125,000 miles',
		insuranceProvider: 'Fiat Insurance',
		insuranceRenewal: '2024-11-20',
		fuelEfficiency: 6.5 // liters per 100km
	}
]
