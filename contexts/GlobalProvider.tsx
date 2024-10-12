import React from 'react'
import { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from 'react'
import { getCurrentUser } from '@/lib/appwrite'
import { Models } from 'react-native-appwrite'
import { handleAppError } from '@/utils/errorHandler'

export interface AppwriteUser extends Models.Document {
	accountId: string
	avatar: string
	email: string
	username: string
}

interface GlobalContextType {
	user: AppwriteUser | null // Update this to just AppwriteUser, not Models.User
	setUser: (value: AppwriteUser | null) => void // Update this type
	isLogged: boolean
	setIsLogged: (value: boolean) => void
	isLoading: boolean
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined)

export const useGlobalContext = () => {
	const context = useContext(GlobalContext)
	if (context === undefined) {
		throw new Error('useGlobalContext must be used within a GlobalProvider')
	}
	return context
}

export const GlobalProvider: FC<PropsWithChildren> = ({ children }) => {
	const [isLogged, setIsLogged] = useState(false)
	const [user, setUser] = useState<AppwriteUser | null>(null) // Start with null for no user
	const [isLoading, setIsLoading] = useState(true)

	console.log('USER', user)

	useEffect(() => {
		;(async () => {
			try {
				const response = await getCurrentUser()
				if (response) {
					setUser(response)
					console.log(' GET USER', response)
					setIsLogged(true)
				} else {
					setIsLogged(false)
					setUser(null)
				}
			} catch (error: unknown) {
				handleAppError(error, true)
			} finally {
				setIsLoading(false)
			}
		})() // IIFE to handle async code in useEffect
	}, [])

	return (
		<GlobalContext.Provider value={{ isLogged, setIsLogged, user, setUser, isLoading }}>
			{children}
		</GlobalContext.Provider>
	)
}
