import { useState } from 'react'
import { handleAppError } from '@/utils/errorHandler'
import { saveToStorage } from '@/lib/appwrite'

interface UseFormSubmitProps<T> {
	onSubmit: (data: T) => Promise<void>
	defaultImageUrl?: string
}

export const useFormSubmit = <T>({ onSubmit, defaultImageUrl }: UseFormSubmitProps<T>) => {
	const [imageUri, setImageUri] = useState<string | null>(null)
	const [imageFileName, setImageFileName] = useState<string | null>(null)
	const [imageMimeType, setImageMimeType] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleImageSelected = (uri: string, fileName: string, mimeType: string) => {
		setImageUri(uri)
		setImageFileName(fileName)
		setImageMimeType(mimeType)
	}

	const handleFileUpload = async () => {
		if (!imageUri || !imageFileName || !imageMimeType) return null
		try {
			return await saveToStorage(imageUri, imageFileName, imageMimeType)
		} catch (error: unknown) {
			handleAppError(error)
			return null
		}
	}

	const submitForm = async (data: T) => {
		setIsLoading(true)
		try {
			let uploadedFileUrl: URL | string | null = await handleFileUpload()

			if (!uploadedFileUrl && defaultImageUrl) {
				uploadedFileUrl = defaultImageUrl
			}

			await onSubmit({ ...data, image: uploadedFileUrl })
		} catch (error: unknown) {
			handleAppError(error)
		} finally {
			setIsLoading(false)
		}
	}

	return {
		isLoading,
		handleImageSelected,
		submitForm,
		imageUri
	}
}
