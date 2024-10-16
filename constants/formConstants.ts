export const DEFAULT_USER_SIGN_IN_FORM_VALUES = {
	email: '',
	password: ''
}

export const DEFAULT_USER_SIGN_UP_FORM_VALUES = {
	email: '',
	password: '',
	username: ''
}

export const DEFAULT_VEHICLE_IMAGE_URL =
	'https://cloud.appwrite.io/v1/storage/buckets/670318160038fb727c33/files/670af4e600257e1077e0/view?project=67030cef00029545b6e9&project=67030cef00029545b6e9&mode=admin'

export const DEFAULT_VEHICLE_FORM_VALUES = {
	users: '',
	brand: '',
	model: '',
	year: '',
	licensePlate: '',
	vin: '',
	mileage: '',
	nextService: '',
	insuranceProvider: '',
	insuranceRenewal: '',
	image: DEFAULT_VEHICLE_IMAGE_URL
}

export const DEFAULT_FUEL_FORM_VALUES = {
	vehicleId: '',
	date: new Date(),
	price: 0,
	fuelAmount: 0,
	cost: 0,
	fuelType: 'petrol',
	currency: 'PLN',
	mileage: 0
}

export const FUEL_TYPE_OPTIONS = [
	{ label: 'Petrol', value: 'petrol' },
	{ label: 'Diesel', value: 'diesel' },
	{ label: 'Electric', value: 'electric' },
	{ label: 'Hybrid', value: 'hybrid' }
]

export const CURRENCY_OPTIONS = [
	{ label: 'USD', value: 'USD' },
	{ label: 'EUR', value: 'EUR' },
	{ label: 'PLN', value: 'PLN' }
]
