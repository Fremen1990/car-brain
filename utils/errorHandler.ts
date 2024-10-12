import { Alert } from 'react-native'

export const handleAppError = (error: unknown, withAlert = false): never => {
	let errorMessage = 'An unknown error occurred'

	if (error instanceof Error) {
		errorMessage = error.message
	}

	if (withAlert) {
		Alert.alert('Error', errorMessage)
	}

	throw new Error(errorMessage)
}
