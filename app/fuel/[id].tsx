import { useLocalSearchParams, router } from 'expo-router'
import React from 'react'

import type { FuelFormData } from '@/types/FuelTypes'
import type { Href } from 'expo-router'

import FuelForm from '@/components/FuelForm/FuelForm'
import { Loader } from '@/components/Loader/Loader'
import { useGlobalContext } from '@/contexts/GlobalProvider'
import { useFormSubmit } from '@/hooks/useFormSubmit'
import { getFuelRecordById, updateFuelRecord } from '@/lib/appwrite'
import useAppwrite from '@/lib/useAppwrite'

const UpdateFuel = () => {
	const { user } = useGlobalContext()
	const { id } = useLocalSearchParams()

	const { data: fuelData, loading } = useAppwrite(() => getFuelRecordById(id))

	const { submitForm, isLoading, handleImageSelected } = useFormSubmit<FuelFormData>({
		onSubmit: async (updatedFuel) => {
			if (user?.$id) {
				const fuelDataToUpdate = {
					vehicleId: updatedFuel.vehicleId,
					userId: user?.$id,
					date: new Date(updatedFuel.date), // Ensure the date is properly formatted
					price: parseFloat(String(updatedFuel.price)),
					fuelAmount: parseFloat(String(updatedFuel.fuelAmount)),
					cost: parseFloat(String(updatedFuel.cost)),
					mileage: parseInt(String(updatedFuel.mileage), 10)
				}
				await updateFuelRecord(id, fuelDataToUpdate) // Update the fuel record in Appwrite
				router.push(`/vehicles/${fuelDataToUpdate.vehicleId}`) // Redirect back to vehicle details
			} else {
				throw new Error('User ID is missing')
			}
		}
	})

	if (loading || !fuelData) {
		return <Loader />
	}

	return (
		<>
			{/*<Text>{JSON.stringify(fuelData)}</Text>*/}
			{fuelData && (
				<FuelForm
					title="Update Fuel Record"
					defaultValues={fuelData} // Pre-fill the form with the fetched fuel data
					onSubmit={submitForm}
					isLoading={isLoading}
					handleImageSelected={handleImageSelected}
				/>
			)}
		</>
	)
}

export default UpdateFuel
