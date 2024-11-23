import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function ReportsScreen() {
	return (
		<View style={styles.container}>
			<Text style={styles.title}>Reports</Text>
			<Text style={styles.subtitle}>This is where analytics will go.</Text>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 20,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 20,
	},
	subtitle: {
		fontSize: 18,
		color: '#666',
	},
})
