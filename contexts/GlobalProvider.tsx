import React, { useCallback, createContext, useContext, useEffect, useState } from 'react'

import type { AppwriteUser, Vehicle } from '@/types'
import type { FC, PropsWithChildren } from 'react'

import { getAllVehicles, getCurrentUser } from '@/lib/appwrite'
import { handleAppError } from '@/utils/errorHandler'

interface GlobalContextType {
	user: AppwriteUser | null // Update this to just AppwriteUser, not Models.User
	setUser: (value: AppwriteUser | null) => void // Update this type
	isLogged: boolean
	setIsLogged: (value: boolean) => void
	isLoadingGetCurrentUser: boolean
	vehicles: Vehicle[] | null
	isLoadingVehicles: boolean
	refetchVehicles: () => void
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
	const [isLoadingGetCurrentUser, setIsLoadingGetCurrentUser] = useState(true)

	// Vehicles state
	const [vehicles, setVehicles] = useState<Vehicle[] | null>(null)
	const [isLoadingVehicles, setIsLoadingVehicles] = useState(false)

	// Function to fetch vehicles for the current user
	const fetchVehicles = useCallback(async () => {
		if (user) {
			setIsLoadingVehicles(true)
			try {
				const fetchedVehicles = await getAllVehicles(user.$id)
				setVehicles(fetchedVehicles)
			} catch (error: unknown) {
				handleAppError(error)
			} finally {
				setIsLoadingVehicles(false)
			}
		}
	}, [user])

	// Refetch vehicles
	const refetchVehicles = useCallback(() => {
		fetchVehicles()
	}, [fetchVehicles])

	// Fetch current user on mount
	useEffect(() => {
		;(async () => {
			try {
				const response = await getCurrentUser()
				if (response) {
					setUser(response)
					setIsLogged(true)
				} else {
					setIsLogged(false)
					setUser(null)
				}
			} catch (error: unknown) {
				handleAppError(error, true)
			} finally {
				setIsLoadingGetCurrentUser(false)
			}
		})()
	}, [])

	// Fetch vehicles when user changes
	useEffect(() => {
		if (user) {
			fetchVehicles()
		}
	}, [fetchVehicles, user])

	return (
		<GlobalContext.Provider
			value={{
				isLogged,
				setIsLogged,
				user,
				setUser,
				isLoadingGetCurrentUser,
				vehicles,
				isLoadingVehicles,
				refetchVehicles
			}}
		>
			{children}
		</GlobalContext.Provider>
	)
}
