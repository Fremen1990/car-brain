import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import { Text, View, ScrollView } from 'react-native'

const VehicleDetails = () => {
	const { query } = useLocalSearchParams()

	return (
		<ScrollView contentContainerStyle={{ padding: 16 }}>
			<View>
				<Text style={{ fontSize: 24, fontWeight: 'bold' }}>Vehicle History</Text>
				<Text>Showing history for vehicle ID: {query}</Text>
				{/* You can fetch and display vehicle history data based on the query */}
			</View>
		</ScrollView>
	)
}

export default VehicleDetails
