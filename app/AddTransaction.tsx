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
import { useTransactions } from './TransactionContext'

const AddTransaction = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')
	const { addTransaction } = useTransactions()

	const handleAddTransaction = async () => {
		if (!title.trim() || !amount.trim()) {
			Alert.alert('Error', 'Please fill in both fields.')
			return
		}

		const transaction = {
			id: Date.now(),
			title,
			amount: parseFloat(amount),
			date: new Date().toISOString(),
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		Alert.alert('Success', 'Transaction added!')
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

export default AddTransaction
