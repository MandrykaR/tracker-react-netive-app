import React from 'react'
import { View, Text, Button, StyleSheet, useColorScheme } from 'react-native'
import { Colors } from '../constants/Colors'

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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
	},
	text: {
		fontSize: 24,
		marginBottom: 20,
	},
})

export default OfflineScreen
