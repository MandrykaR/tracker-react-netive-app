import React, { useEffect } from 'react'
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	useColorScheme,
	Button,
} from 'react-native'
import { Transaction } from './TransactionContext'
import { useTransactions } from './TransactionContext'

const HomeScreen = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const { transactions, loadTransactions, deleteTransaction } =
		useTransactions()

	useEffect(() => {
		loadTransactions()
	}, [])

	const handleDeleteTransaction = (id: number) => {
		deleteTransaction(id)
	}

	const renderItem = ({ item }: { item: Transaction }) => (
		<View
			style={[
				styles.transaction,
				{ borderColor: isDarkMode ? '#fff' : '#ccc' },
			]}
		>
			<View>
				<Text style={[styles.text, { color: isDarkMode ? '#fff' : '#000' }]}>
					{item.title} - ${item.amount.toFixed(2)}
				</Text>
			</View>
			<Button
				title='Delete'
				onPress={() => handleDeleteTransaction(item.id)}
				color='#F44336'
			/>
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
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	text: {
		fontSize: 16,
	},
})

export default HomeScreen
