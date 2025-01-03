import React from 'react'

import { View, Text, Button, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

import styles from '../styles/offlineScreenStyles'

interface OfflineScreenProps {
	onRetry: () => void
}

const OfflineScreen: React.FC<OfflineScreenProps> = ({ onRetry }) => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	return (
		<View
			style={[
				styles.container,
				{
					backgroundColor: isDarkMode
						? Colors.dark.background
						: Colors.light.background,
				},
			]}
		>
			<Text
				style={[
					styles.text,
					{ color: isDarkMode ? Colors.dark.text : Colors.light.text },
				]}
			>
				You are offline
			</Text>
			<Button
				title='Retry'
				onPress={onRetry}
				color={isDarkMode ? Colors.light.tint : Colors.dark.tint}
			/>
		</View>
	)
}

export default OfflineScreen
