import React, { useState } from 'react'
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	useColorScheme,
} from 'react-native'
import { NativeStackScreenProps } from '@react-navigation/native-stack'

type RootStackParamList = {
	Home: undefined
	AddTransaction: undefined
	Reports: undefined
}

type AddTransactionScreenProps = NativeStackScreenProps<
	RootStackParamList,
	'AddTransaction'
>

export default function AddTransactionScreen({
	navigation,
}: AddTransactionScreenProps) {
	const colorScheme = useColorScheme() // Defining the current topic
	const isDarkMode = colorScheme === 'dark' // Determining whether a dark theme is used

	const [title, setTitle] = useState('')
	const [amount, setAmount] = useState('')

	const handleAddTransaction = () => {
		navigation.goBack()
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
