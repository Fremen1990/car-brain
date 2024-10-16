import Entypo from '@expo/vector-icons/Entypo'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import MaterialIcons from '@expo/vector-icons/MaterialIcons'
import moment from 'moment'
import React from 'react'
import { View, Text, SafeAreaView, Dimensions } from 'react-native'
import Timeline from 'react-native-timeline-flatlist'

import { useGlobalContext } from '@/contexts/GlobalProvider'

const screenWidth = Dimensions.get('window').width // Get screen width for responsive design

const History = () => {
	const { user } = useGlobalContext()

	// TODO maybe on small screens display the same like on bigger but less information and on click down drawer will show

	const isSmallScreen = screenWidth < 600 // Set threshold for small screens

	const timelineData = [
		{
			time: moment(user?.$createdAt).format('MMMM Do YYYY'),
			title: 'Joined Car Brain',
			description: 'Welcome! You signed up and added your first vehicle.',
			icon: <Entypo name="add-user" size={24} color="#FFA001" />,
			position: 'right'
		},
		{
			time: '2024-10-01',
			title: 'Fuel',
			description: 'Refueled 50 liters',
			icon: <MaterialCommunityIcons name="fuel" size={24} color="#FFA001" />,
			position: 'left'
		},
		{
			time: '2024-09-20',
			title: 'Service',
			description: 'Oil change and filter replacement',
			icon: <MaterialIcons name="car-repair" size={24} color="#FFA001" />,
			position: 'right'
		},
		{
			time: '2024-09-05',
			title: 'Tire Change',
			description: 'Replaced front tires',
			icon: <MaterialCommunityIcons name="tire" size={24} color="#FFA001" />,
			position: 'left'
		},
		{
			time: '2024-08-15',
			title: 'Insurance',
			description: 'Insurance renewal',
			icon: <MaterialIcons name="health-and-safety" size={24} color="#FFA001" />,
			position: 'right'
		}
	]

	return (
		<SafeAreaView className="h-full flex-1 bg-primary p-6">
			{/* Header */}
			<View className="flex-row items-center justify-between w-full p-6">
				<Text className="text-4xl text-[#FFA001] font-bold">History</Text>
			</View>

			{/* Timeline */}
			<Timeline
				data={timelineData}
				circleSize={20}
				circleColor="rgb(45,156,219)"
				lineColor="#FFA001"
				timeStyle={{
					textAlign: 'center',
					backgroundColor: '#FFA001',
					color: 'white',
					padding: 5,
					borderRadius: 13
				}}
				descriptionStyle={{ color: '#CDCDE0' }}
				columnFormat={isSmallScreen ? 'single-column-left' : 'two-column'} // Switch layout based on screen size
				isUsingFlatlist={true} // Use FlatList for better performance
				renderDetail={(rowData) => (
					<View
						style={{
							backgroundColor: '#232533',
							borderRadius: 12,
							padding: 16,
							marginVertical: 8,
							marginLeft: isSmallScreen ? 40 : rowData.position === 'left' ? screenWidth * 0.2 : 0, // Adjust margin based on screen size
							marginRight: isSmallScreen ? 20 : rowData.position === 'right' ? screenWidth * 0.2 : 0,
							shadowColor: '#000',
							shadowOpacity: 0.3,
							shadowRadius: 5,
							shadowOffset: { width: 0, height: 2 }
						}}
					>
						{/* Icon and Title */}
						<View className="flex-row items-center mb-2">
							{rowData.icon}
							<Text
								style={{
									color: '#FFA001',
									fontWeight: 'bold',
									marginLeft: 10
								}}
							>
								{rowData.title}
							</Text>
						</View>

						{/* Description */}
						<Text style={{ color: '#CDCDE0', marginBottom: 8 }}>{rowData.description}</Text>

						{/* Time */}
						<Text style={{ color: '#7B7B8B', fontSize: 12 }}>
							{moment(rowData.time).format('MMMM Do YYYY')}
						</Text>
					</View>
				)}
			/>
		</SafeAreaView>
	)
}

export default History
