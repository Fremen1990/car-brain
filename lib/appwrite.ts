import * as FileSystem from 'expo-file-system'
import { Account, Avatars, Client, Databases, ID, Permission, Query, Role, Storage } from 'react-native-appwrite'

import type { FuelFormData, FuelRecord } from '@/types/FuelTypes'
import type { AppwriteUser, SignInFormData, SignUpFormData } from '@/types/UserTypes'
import type { Vehicle, VehicleFormData } from '@/types/VehicleTypes'
import type { Models, UploadProgress } from 'react-native-appwrite'

import { appwriteConfig } from '@/appwriteConfig'
import { handleAppError } from '@/utils/errorHandler'

const { endpoint, platform, projectId, userCollectionId, databaseId } = appwriteConfig

const client = new Client()

client
	.setEndpoint(endpoint) // Your Appwrite Endpoint
	.setProject(projectId) // Your project ID
	.setPlatform(platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async ({ username, password, email }: SignUpFormData) => {
	try {
		const newAccount = await account.create(ID.unique(), email, password, username)

		if (!newAccount) throw Error

		const avatarUrl = avatars.getInitials(username)

		await signIn({ email, password })

		const newUser: Models.Document & AppwriteUser = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.userCollectionId,
			ID.unique(),
			{
				accountId: newAccount.$id,
				email: email,
				username: username,
				avatar: avatarUrl
			}
		)

		return newUser
	} catch (error: unknown) {
		handleAppError(error, true)
	}
}

export const signIn = async ({ email, password }: SignInFormData) => {
	try {
		return await account.createEmailPasswordSession(email, password)
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const signOut = async () => {
	try {
		const session = await account.deleteSession('current')
		return session
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const getCurrentUser = async (): Promise<AppwriteUser | null> => {
	try {
		const currentAccount = await account.get()
		if (!currentAccount) throw Error

		const currentUser = await databases.listDocuments<AppwriteUser>(databaseId, userCollectionId, [
			Query.equal('accountId', currentAccount.$id)
		])
		if (!currentUser) throw Error
		return currentUser.documents[0]
	} catch (error: unknown) {
		handleAppError(error)
		return null
	}
}

export const createVehicle = async (vehicleFormData: VehicleFormData) => {
	try {
		return databases.createDocument(appwriteConfig.databaseId, appwriteConfig.vehicleCollectionId, ID.unique(), {
			...vehicleFormData
		})
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const saveToStorage = async (
	fileUri: string,
	fileName: string,
	mimeType: string,
	onProgress?: (progress: UploadProgress) => void
): Promise<URL> => {
	try {
		const fileInfo = await FileSystem.getInfoAsync(fileUri)

		if (!fileInfo.exists) {
			throw new Error('File does not exist.')
		}

		const fileSize = fileInfo.size

		// Prepare the file object
		const file = {
			name: fileName,
			type: mimeType,
			size: fileSize,
			uri: fileUri
		}

		const uploadedFile = await storage.createFile(
			appwriteConfig.bucketId,
			ID.unique(),
			file,
			[Permission.read(Role.any())],
			onProgress || (() => {})
		)

		const fileUrl = getFilePreview(uploadedFile.$id, 'image')

		return fileUrl
	} catch (error: unknown) {
		console.error('Error saving file to storage:', error)
		handleAppError(error)
		return Promise.reject(error)
	}
}

export const getFilePreview = async (fileId: string, type: 'video' | 'image'): Promise<URL> => {
	let fileUrl: URL

	try {
		if (type === 'video') {
			fileUrl = storage.getFileView(appwriteConfig.bucketId, fileId)
		} else if (type === 'image') {
			fileUrl = storage.getFilePreview(appwriteConfig.bucketId, fileId, 400, 300)
		} else {
			throw new Error('Invalid file type')
		}

		if (!fileUrl) throw Error

		return fileUrl
	} catch (error: unknown) {
		handleAppError(error)
		return Promise.reject(error)
	}
}

export const getAllVehicles = async (userId: string): Promise<Vehicle[]> => {
	try {
		const response = await databases.listDocuments<Vehicle>(
			appwriteConfig.databaseId,
			appwriteConfig.vehicleCollectionId,
			[Query.equal('users', userId)]
		)

		return response.documents
	} catch (error: unknown) {
		handleAppError(error, true)
		return []
	}
}

export const addFuelRecord = async (fuelData: FuelFormData) => {
	try {
		const response = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.fuelRecordsCollectionId,
			ID.unique(),
			{
				...fuelData
			}
		)
		return response.documents
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const getFuelRecords = async (vehicleId: string | string[]): Promise<FuelRecord> => {
	try {
		const response = await databases.listDocuments(
			appwriteConfig.databaseId,
			appwriteConfig.fuelRecordsCollectionId,
			[Query.equal('vehicleId', vehicleId)]
		)
		return response.documents
	} catch (error: unknown) {
		handleAppError(error)
		return []
	}
}

export const getFuelRecordById = async (id: string): Promise<FuelRecord | null> => {
	try {
		const response = await databases.getDocument(
			appwriteConfig.databaseId,
			appwriteConfig.fuelRecordsCollectionId,
			id
		)
		return response
	} catch (error: unknown) {
		handleAppError(error)
		return null
	}
}

export const updateFuelRecord = async (id: string, fuelData: FuelFormData) => {
	try {
		const response = await databases.updateDocument(
			appwriteConfig.databaseId,
			appwriteConfig.fuelRecordsCollectionId,
			id,
			{
				...fuelData
			}
		)
		return response
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const deleteFuelRecord = async (id: string) => {
	try {
		const response = await databases.deleteDocument(
			appwriteConfig.databaseId,
			appwriteConfig.fuelRecordsCollectionId,
			id
		)
		return response
	} catch (error: unknown) {
		handleAppError(error)
	}
}
