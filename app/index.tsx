import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	FlatList,
	useColorScheme,
	Button,
	Image,
	StyleSheet,
} from 'react-native'

import { useTransactions } from './TransactionContext'
import { RenderItemProps } from '../public/types/types'
import { Colors } from '../constants/Colors'

const HomeScreen: React.FC = () => {
	const colorScheme = useColorScheme()
	const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light
	const { transactions, loadTransactions, deleteTransaction } =
		useTransactions()

	const reloadOnce = () => {
		const hasReloaded = localStorage.getItem('hasReloaded')

		if (!hasReloaded) {
			localStorage.setItem('hasReloaded', 'true')
			window.location.reload()
		}
	}

	useEffect(() => {
		reloadOnce()
		loadTransactions(1, 1000)
	}, [])

	const handleDeleteTransaction = (id: number): void => {
		deleteTransaction(id)
	}

	const renderItem = ({ item }: RenderItemProps) => (
		<View style={[styles.transaction, { borderColor: currentColors.text }]}>
			<View style={styles.transactionContent}>
				<Text style={[styles.text, { color: currentColors.text }]}>
					{item.title} - ${' '}
					{item.amount != null ? item.amount.toFixed(2) : '0.00'}
				</Text>
				{item.location && (
					<Text
						style={[styles.text, { color: currentColors.text, marginTop: 5 }]}
					>
						📍 Location: Latitude {item.location.latitude.toFixed(2)}, Longitude{' '}
						{item.location.longitude.toFixed(2)}
					</Text>
				)}
				{item.receipt && (
					<Image source={{ uri: item.receipt }} style={styles.receiptImage} />
				)}
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
			style={[styles.container, { backgroundColor: currentColors.background }]}
		>
			<Text style={[styles.title, { color: currentColors.text }]}>
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
	transactionContent: {
		flexDirection: 'column',
	},
	text: {
		fontSize: 16,
	},
	receiptImage: {
		width: 100,
		height: 100,
		aspectRatio: 1,
		resizeMode: 'contain',
		marginTop: 8,
	},
})

export default HomeScreen
