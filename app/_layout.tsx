import React from 'react'

import 'react-native-reanimated'

import AppProviders from '@/contexts/AppProviders'
import useLoadAssets from '@/hooks/useLoadAssets'
import StackNavigator from '@/navigation/StackNavigation'

const RootLayout = () => {
	const { loaded, error } = useLoadAssets()

	if (error) throw error
	if (!loaded) return null

	return (
		<AppProviders>
			<StackNavigator />
		</AppProviders>
	)
}

export default RootLayout
