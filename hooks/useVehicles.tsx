import { useFocusEffect } from '@react-navigation/core'
import { useState, useCallback } from 'react'

import type { Vehicle } from '@/types/VehicleTypes'
import type { ViewToken } from 'react-native'

import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getAllVehicles } from '@/lib/appwrite'

export const useVehicles = () => {
	const { user } = useGlobalContext()
	const [activeItem, setActiveItem] = useState<string | undefined>(undefined)
	const [isDescending, setIsDescending] = useState(true)
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
	const [loading, setLoading] = useState(true)

	const fetchVehicles = async () => {
		setLoading(true)
		try {
			const fetchedVehicles = await getAllVehicles(user?.$id || '')
			setVehicles(fetchedVehicles)
		} finally {
			setLoading(false)
		}
	}

	const viewableItemsChanged = ({ viewableItems }: { viewableItems: ViewToken[] }) => {
		if (viewableItems.length > 0) {
			setActiveItem(viewableItems[0].item.$id)
		}
	}

	const getSortAction = () => {
		return vehicles && vehicles.length > 1
			? {
					label: isDescending ? 'Oldest First' : 'Newest First',
					onPress: () => setIsDescending((prev) => !prev)
				}
			: undefined
	}

	useFocusEffect(
		useCallback(() => {
			fetchVehicles()
		}, [user])
	)

	return { vehicles, loading, isDescending, setIsDescending, activeItem, viewableItemsChanged, getSortAction }
}
