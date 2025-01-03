import React, {
	createContext,
	useReducer,
	useContext,
	useState,
	useEffect,
} from 'react'
import axios from 'axios'
import AsyncStorage from '@react-native-async-storage/async-storage'

import { transactionReducer } from '../reducers/transactionReducer'
import CustomModal from '../components/CustomModal'
import {
	Transaction,
	TransactionContextType,
	TransactionProviderProps,
} from '../types/types'

const TransactionContext = createContext<TransactionContextType | undefined>(
	undefined
)

const API_URL = 'https://67135de66c5f5ced66262fd3.mockapi.io/money'

const TransactionProvider: React.FC<TransactionProviderProps> = ({
	children,
}) => {
	const [transactions, dispatch] = useReducer(transactionReducer, [])
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const loadTransactionsFromServer = async (
		page: number,
		limit: number
	): Promise<Transaction[]> => {
		try {
			const response = await axios.get(`${API_URL}?page=${page}&limit=${limit}`)
			const transactionsList: Transaction[] = response.data
			dispatch({
				type: 'SET_TRANSACTIONS',
				transactions: transactionsList,
			})
			await AsyncStorage.setItem(
				'transactions',
				JSON.stringify(transactionsList)
			)
			return transactionsList
		} catch (error) {
			setErrorMessage('Error loading transactions')
			console.error('Error loading transactions:', error)
			return []
		}
	}

	const loadTransactionsFromStorage = async (): Promise<Transaction[]> => {
		const storedTransactions = await AsyncStorage.getItem('transactions')
		if (storedTransactions) {
			return JSON.parse(storedTransactions)
		}
		return []
	}

	useEffect(() => {
		const fetchTransactions = async () => {
			const storedTransactions = await loadTransactionsFromStorage()
			if (storedTransactions.length > 0) {
				dispatch({
					type: 'SET_TRANSACTIONS',
					transactions: storedTransactions,
				})
			} else {
				await loadTransactionsFromServer(1, 10)
			}
		}
		fetchTransactions()
	}, [])

	const addTransaction = async (transaction: Transaction): Promise<void> => {
		try {
			if (navigator.onLine) {
				const response = await axios.post(API_URL, transaction)
				dispatch({ type: 'ADD_TRANSACTION', transaction: response.data })
				const updatedTransactions = [...transactions, response.data]
				await AsyncStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions)
				)
			} else {
				const updatedTransactions = [...transactions, transaction]
				dispatch({ type: 'ADD_TRANSACTION', transaction })
				await AsyncStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions)
				)
			}
		} catch (error) {
			setErrorMessage('Error adding transaction')
			console.error('Error adding transaction:', error)
		}
	}

	const deleteTransaction = async (id: number): Promise<void> => {
		try {
			if (navigator.onLine) {
				await axios.delete(`${API_URL}/${id}`)
				dispatch({ type: 'DELETE_TRANSACTION', id })
				const updatedTransactions = transactions.filter(
					transaction => transaction.id !== id
				)
				await AsyncStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions)
				)
			} else {
				dispatch({ type: 'DELETE_TRANSACTION', id })
				const updatedTransactions = transactions.filter(
					transaction => transaction.id !== id
				)
				await AsyncStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions)
				)
			}
		} catch (error) {
			setErrorMessage('Error deleting transaction')
			console.error('Error deleting transaction:', error)
		}
	}

	const handleCloseModal = () => {
		setErrorMessage(null)
	}

	return (
		<>
			<TransactionContext.Provider
				value={{
					transactions,
					addTransaction,
					deleteTransaction,
					loadTransactions: loadTransactionsFromServer,
				}}
			>
				{children}
			</TransactionContext.Provider>

			{errorMessage && (
				<CustomModal
					visible={true}
					message={errorMessage}
					onClose={handleCloseModal}
				/>
			)}
		</>
	)
}

export const useTransactions = (): TransactionContextType => {
	const context = useContext(TransactionContext)
	if (!context) {
		throw new Error('useTransactions must be used within a TransactionProvider')
	}
	return context
}

export default TransactionProvider
