import { useState } from 'react'

import type { ViewToken } from 'react-native'

import { useGetVehiclesQuery } from '@/api/vehiclesService'
import { useGlobalContext } from '@/contexts/GlobalProvider'

export const useVehicles = () => {
	const { user } = useGlobalContext()
	const [activeItem, setActiveItem] = useState<string | undefined>(undefined)
	const [isDescending, setIsDescending] = useState(true)

	const { data: vehicles, isLoading, isSuccess } = useGetVehiclesQuery(user?.$id)

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

	return {
		vehicles,
		isLoading,
		isSuccess,
		isDescending,
		setIsDescending,
		activeItem,
		viewableItemsChanged,
		getSortAction
	}
}
