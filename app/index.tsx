import React, { useEffect, useState } from 'react'
import {
	View,
	Text,
	FlatList,
	StyleSheet,
	useColorScheme,
	Button,
	Image,
	Alert,
} from 'react-native'

import { RenderItemProps } from '../types/types'
import { useTransactions } from './TransactionContext'
import { Colors } from '../constants/Colors'
import { getCurrentLocation, Coordinates } from '../scripts/locationHandler'

const HomeScreen: React.FC = () => {
	const colorScheme = useColorScheme()
	const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light
	const { transactions, loadTransactions, deleteTransaction } =
		useTransactions()

	const [location, setLocation] = useState<Coordinates | null>(null)
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const initializeLocation = async () => {
			setIsLoading(true)
			const currentLocation = await getCurrentLocation()
			if (!currentLocation) {
				Alert.alert('Error', 'Could not fetch location.')
			} else {
				setLocation(currentLocation)
				console.log('Location:', currentLocation)
			}
			setIsLoading(false)
		}

		initializeLocation()
	}, [])

	useEffect(() => {
		loadTransactions(1, 1000)
	}, [])

	const handleDeleteTransaction = (id: number): void => {
		deleteTransaction(id)
	}

	const renderItem = ({ item }: RenderItemProps) => (
		<View style={[styles.transaction, { borderColor: currentColors.text }]}>
			<View style={styles.transactionContent}>
				<Text style={[styles.text, { color: currentColors.text }]}>
					{item.title} - $
					{item.amount != null ? item.amount.toFixed(2) : '0.00'}
				</Text>

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

			{location && (
				<Text style={{ color: currentColors.text }}>
					Location: {location.latitude}, {location.longitude}
				</Text>
			)}
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
