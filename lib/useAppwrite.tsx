import { useEffect, useState } from 'react'
import { Alert } from 'react-native'

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

	const fetchData = async () => {
		setLoading(true)
		try {
			const response = await fn()
			setData(response)
		} catch (error: any) {
			Alert.alert('Error', error.message)
			console.error('Error fetching data: ', error)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchData()
	}, [fetchData])

	const refetch = async () => fetchData()

	// console.log("posts data", data);

	return { data, refetch, loading }
}

export default useAppwrite
