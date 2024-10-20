import { router } from 'expo-router'
import React from 'react'

import type { FuelFormData } from '@/types/FuelTypes'

import FuelForm from '@/components/FuelForm/FuelForm'
import { Loader } from '@/components/Loader/Loader'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { addFuelRecord } from '@/lib/appwrite'

// TODO: !!!! When add fuel record redirect to history page with new record highlighted and show snackbar with success message !!!!

// TODO: Write integration tests for add-fuel and add-vehicle with MSW and react native testing library
// TODO: when have integration tests with MSW - refactor data fetching to tanstack query
// TODO: when have integration tests with MSW - refactor state management to zustand

const Add = () => {
	const { user } = useGlobalContext()

	const { submitForm, isLoading, handleImageSelected } = useFormSubmit<FuelFormData>({
		onSubmit: async (newFuel) => {
			if (user?.$id) {
				const fuelData = {
					...newFuel,
					userId: user?.$id,
					date: new Date(newFuel.date),
					price: parseFloat(String(newFuel.price)),
					fuelAmount: parseFloat(String(newFuel.fuelAmount)),
					fuelUnits: 'liters',
					cost: parseFloat(String(newFuel.cost)),
					mileage: parseInt(String(newFuel.mileage), 10)
				}
				await addFuelRecord(fuelData)
				router.push(`/vehicles/${fuelData.vehicleId}`)
			} else {
				throw new Error('User ID is missing')
			}
		}
	})

	if (isLoading) {
		return <Loader />
	}

	return (
		<FuelForm
			title="Add fuel records"
			onSubmit={submitForm}
			isLoading={isLoading}
			handleImageSelected={handleImageSelected}
		/>
	)
}

export default Add
