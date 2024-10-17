import { Tabs } from 'expo-router'
import React from 'react'
import { Image } from 'react-native'

import { ICONS } from '../../constants'

import type { ImageProps } from 'react-native'

import FloatingButton from '@/components/FloatingButton'
import { View, Text } from '@/components/Themed'

interface TabIconProps {
	icon: ImageProps
	color: string
	name: string
	focused: boolean
}

const TabIcon = ({ icon, color, name, focused }: TabIconProps) => {
	return (
		<View className="items-center justify-center gap-2">
			<Image source={icon} resizeMode="contain" tintColor={color} className={'w-6 h-6'} />
			<Text
				className={`${focused ? 'font-psemibold' : 'font-pregular'} text-xs w-20 text-center`}
				style={{ color }}
			>
				{name}
			</Text>
		</View>
	)
}

const TabsLayout = () => {
	return (
		<>
			<Tabs
				screenOptions={{
					tabBarShowLabel: false,
					tabBarActiveTintColor: '#FFA001',
					tabBarInactiveTintColor: '#CDCDE0',
					tabBarStyle: {
						backgroundColor: '#161622',
						borderTopWidth: 1,
						borderTopColor: '#232533',
						height: 84
					}
				}}
			>
				<Tabs.Screen
					name="dashboard"
					options={{
						title: 'Dashboard',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon icon={ICONS.dashboard} color={color} name="dashboard" focused={focused} />
						)
					}}
				/>

				<Tabs.Screen
					name="history"
					options={{
						title: 'History',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon icon={ICONS.history} color={color} name="history" focused={focused} />
						)
					}}
				/>

				<Tabs.Screen
					name="spacer"
					options={{
						tabBarButton: () => <View style={{ flex: 1 }} />,
						tabBarIcon: () => null
					}}
				/>

				<Tabs.Screen
					name="vehicles"
					options={{
						title: 'Vehicles',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon icon={ICONS.vehicle} color={color} name="vehicles" focused={focused} />
						)
					}}
				/>

				<Tabs.Screen
					name="settings"
					options={{
						title: 'Settings',
						headerShown: false,
						tabBarIcon: ({ color, focused }) => (
							<TabIcon icon={ICONS.settings} color={color} name="settings" focused={focused} />
						)
					}}
				/>
			</Tabs>
			{/* Floating Button Positioned in the Center */}
			<FloatingButton />
		</>
	)
}

export default TabsLayout
