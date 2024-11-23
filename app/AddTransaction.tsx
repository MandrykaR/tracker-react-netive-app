import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	useColorScheme,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface Transaction {
	id: number
	title: string
	amount: number
	date: string
}

export default function AddTransaction() {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	const handleAddTransaction = async () => {
		if (!title.trim() || !amount.trim()) {
			Alert.alert('Error', 'Please fill in both fields.')
			return
		}

		const transaction: Transaction = {
			id: Date.now(),
			title,
			amount: parseFloat(amount),
			date: new Date().toISOString(),
		}

		try {
			const storedTransactions = await AsyncStorage.getItem('transactions')
			const transactions = storedTransactions
				? JSON.parse(storedTransactions)
				: []
			const updatedTransactions = [...transactions, transaction]
			await AsyncStorage.setItem(
				'transactions',
				JSON.stringify(updatedTransactions)
			)

			setTitle('')
			setAmount('')
			Alert.alert('Success', 'Transaction added!')
		} catch (error) {
			console.error('Error saving transaction:', error)
			Alert.alert('Error', 'Failed to save the transaction.')
		}
	}

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? '#000' : '#fff' },
			]}
		>
			<Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
				Add Transaction
			</Text>
			<TextInput
				style={[
					styles.input,
					{
						color: isDarkMode ? '#fff' : '#000',
						borderColor: isDarkMode ? '#fff' : '#ccc',
					},
				]}
				placeholder='Title'
				placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={[
					styles.input,
					{
						color: isDarkMode ? '#fff' : '#000',
						borderColor: isDarkMode ? '#fff' : '#ccc',
					},
				]}
				placeholder='Amount'
				placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
				keyboardType='numeric'
				value={amount}
				onChangeText={setAmount}
			/>
			<Button title='Add' onPress={handleAddTransaction} color='#4CAF50' />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	input: {
		height: 40,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
	},
})
