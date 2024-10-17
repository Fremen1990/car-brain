import type { Models } from 'react-native-appwrite'

export interface SignInFormData {
	email: string
	password: string
}

export interface SignUpFormData extends SignInFormData {
	username: string
}

export interface AppwriteUser extends Models.Document {
	accountId: string
	avatar: string
	email: string
	username: string
}
