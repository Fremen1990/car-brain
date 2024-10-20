import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'

import type { ViewToken } from 'react-native'

import { useGlobalContext } from '@/contexts/GlobalProvider'
import { getAllVehicles } from '@/lib/appwrite'

export const useVehicles = () => {
	const { user } = useGlobalContext()
	const [activeItem, setActiveItem] = useState<string | undefined>(undefined)
	const [isDescending, setIsDescending] = useState(true)

	const getVehicles = async () => {
		if (user?.$id) {
			return await getAllVehicles(user.$id)
		}
	}

	const { data: vehicles, isLoading } = useQuery({ queryKey: ['vehicles'], queryFn: getVehicles })

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

	return { vehicles, isLoading, isDescending, setIsDescending, activeItem, viewableItemsChanged, getSortAction }
}
