import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import Toast from 'react-native-toast-message'

import type { PropsWithChildren } from 'react'

import { GlobalProvider } from '@/contexts/GlobalProvider'
import { ThemeProvider as CustomThemeProvider, useTheme } from '@/contexts/ThemeContext'

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			staleTime: 1000 * 60 * 5 // Cache for 5 minutes
		}
	}
})

const AppProviders: React.FC<PropsWithChildren> = ({ children }) => {
	useReactQueryDevTools(queryClient)
	const { isDarkMode } = useTheme()

	return (
		<>
			<QueryClientProvider client={queryClient}>
				<GlobalProvider>
					<ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
						<CustomThemeProvider>{children}</CustomThemeProvider>
					</ThemeProvider>
				</GlobalProvider>
			</QueryClientProvider>
			<Toast />
		</>
	)
}

export default AppProviders
