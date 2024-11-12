import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { useColorScheme } from 'react-native'
import { Link } from 'expo-router' 

export default function HomeScreen() {
	const colorScheme = useColorScheme()

	const backgroundColor = colorScheme === 'dark' ? '#121212' : '#ffffff'
	const textColor = colorScheme === 'dark' ? '#fff' : '#000'
	const buttonColor = colorScheme === 'dark' ? '#4CAF50' : '#007BFF'

	return (
		<View style={[styles.container, { backgroundColor }]}>
			<Text style={[styles.text, { color: textColor }]}>
				Welcome to Home Screen
			</Text>

			<Link
				href='/AddTransactionScreen'
				style={[styles.button, { backgroundColor: buttonColor }]}
			>
				<Text style={styles.buttonText}>Add Transaction</Text>
			</Link>

			<Link
				href='/ReportsScreen'
				style={[styles.button, { backgroundColor: buttonColor }]}
			>
				<Text style={styles.buttonText}>Reports</Text>
			</Link>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 16,
	},
	text: {
		fontSize: 20,
		marginBottom: 20,
	},
	button: {
		width: '80%',
		paddingVertical: 10,
		marginVertical: 8,
		borderRadius: 5,
		alignItems: 'center',
	},
	buttonText: {
		color: '#fff',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
