import { NavigationContainer } from '@react-navigation/native'
import { render as rtlRender } from '@testing-library/react-native'
import * as React from 'react'

import { GlobalProvider } from '@/contexts/GlobalProvider'
import { ThemeProvider as CustomThemeProvider } from '@/contexts/ThemeContext'

function TestWrapper({ children }: { children: React.ReactNode }) {
	return (
		<GlobalProvider>
			<CustomThemeProvider>
				<NavigationContainer>{children}</NavigationContainer>
			</CustomThemeProvider>
		</GlobalProvider>
	)
}

function renderWithProviders(ui: React.ReactElement, options = {}) {
	return rtlRender(ui, { wrapper: TestWrapper, ...options })
}

export { renderWithProviders }
