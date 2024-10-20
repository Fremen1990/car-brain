import { useQuery } from '@tanstack/react-query'

import { queryKeys } from '@/api/queryKeys'
import { getAllVehicles } from '@/lib/appwrite'

export const useGetVehiclesQuery = (userId: string | undefined) => {
	return useQuery({
		queryKey: queryKeys.vehicles(userId || ''),
		queryFn: () => {
			if (!userId) throw new Error('User ID is required to fetch vehicles')
			return getAllVehicles(userId)
		},
		enabled: !!userId
	})
}
