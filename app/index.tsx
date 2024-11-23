import React, { useState, useEffect } from 'react'
import { View, Text, FlatList, StyleSheet, useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Transaction {
	id: number
	title: string
	amount: number
	date: string
}

export default function HomeScreen() {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	const [transactions, setTransactions] = useState<Transaction[]>([])

	useEffect(() => {
		const loadTransactions = async () => {
			const storedTransactions = await AsyncStorage.getItem('transactions')
			if (storedTransactions) {
				setTransactions(JSON.parse(storedTransactions))
			}
		}
		loadTransactions()
	}, [])

	const renderItem = ({ item }: { item: Transaction }) => (
		<View style={styles.transaction}>
			<Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
				{item.title} - ${item.amount}
			</Text>
		</View>
	)

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? '#000' : '#fff' },
			]}
		>
			<Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
				Transactions
			</Text>
			<FlatList
				data={transactions}
				renderItem={renderItem}
				keyExtractor={item => item.id.toString()}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	transaction: {
		padding: 10,
		borderBottomWidth: 1,
		marginBottom: 8,
	},
	text: {
		fontSize: 16,
	},
})
