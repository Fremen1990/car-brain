import { useCallback, useEffect, useState } from 'react'
import { handleAppError } from '@/utils/errorHandler'

interface FetchFunction<T> {
	(): Promise<T>
}

interface UseAppwriteReturn<T> {
	data: T | null
	loading: boolean
	refetch: () => void
}
const useAppwrite = <T,>(fn: FetchFunction<T>): UseAppwriteReturn<T> => {
	const [data, setData] = useState<T | null>(null)
	const [loading, setLoading] = useState(false)

	const fetchData = useCallback(async () => {
		setLoading(true)
		try {
			const response = await fn()
			setData(response)
		} catch (error: unknown) {
			handleAppError(error, true)
		} finally {
			setLoading(false)
		}
	}, [fn])

	useEffect(() => {
		fetchData()
	}, [])

	const refetch = async () => fetchData()

	// console.log("posts data", data);

	return { data, refetch, loading }
}

export default useAppwrite
