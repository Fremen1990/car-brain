import { Account, Avatars, Client, Databases, ID, Models, Query } from 'react-native-appwrite'
import { appwriteConfig } from '@/appwriteConfig'
import { VehicleFormData } from '@/app/(tabs)/(add)/add-vehicle'
import { handleAppError } from '@/utils/errorHandler'
import { SignUpFormData } from '@/app/(auth)/sign-up'
import { SignInFormData } from '@/app/(auth)/sign-in'
import { AppwriteUser } from '@/contexts/GlobalProvider'

const { endpoint, platform, projectId, userCollectionId, databaseId } = appwriteConfig

const client = new Client()

client
	.setEndpoint(endpoint) // Your Appwrite Endpoint
	.setProject(projectId) // Your project ID
	.setPlatform(platform) // Your application ID or bundle ID.

const account = new Account(client)
const avatars = new Avatars(client)
const databases = new Databases(client)
// const storage = new Storage(client)

export const createUser = async ({ username, password, email }: SignUpFormData): Promise<AppwriteUser | undefined> => {
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
		const session = await account.createEmailPasswordSession(email, password)

		return session
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const signOut = async () => {
	try {
		const session = await account.deleteSession('current')
		console.log('CURRENT SESSION', session)
		return session
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const getCurrentUser = async (): Promise<AppwriteUser | undefined> => {
	console.log('GET CURRENT ACCOUNT ')
	try {
		const currentAccount = await account.get()
		console.log('CURRENT ACCOUNT', currentAccount.$id)

		if (!currentAccount) throw Error

		const currentUser = await databases.listDocuments<AppwriteUser>(databaseId, userCollectionId, [
			Query.equal('accountId', currentAccount.$id)
		])
		if (!currentUser) throw Error

		console.log('CURRENT USER', currentUser)

		return currentUser.documents[0]
	} catch (error: unknown) {
		handleAppError(error)
	}
}

export const createVehicle = async (vehicleFormData: VehicleFormData) => {
	try {
		const newVehicle = await databases.createDocument(
			appwriteConfig.databaseId,
			appwriteConfig.vehicleCollectionId,
			ID.unique(),
			{
				...vehicleFormData
			}
		)
		return newVehicle
	} catch (error: unknown) {
		handleAppError(error)
	}
}
