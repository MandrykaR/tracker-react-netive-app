import React, {
	createContext,
	useReducer,
	useContext,
	useEffect,
	useState,
} from 'react'
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

const TransactionProvider: React.FC<TransactionProviderProps> = ({
	children,
}) => {
	const [transactions, dispatch] = useReducer(transactionReducer, [])
	const [errorMessage, setErrorMessage] = useState<string | null>(null)

	const loadTransactions = async (
		page: number,
		limit: number
	): Promise<Transaction[]> => {
		try {
			const storedTransactions = await AsyncStorage.getItem('transactions')
			if (storedTransactions) {
				const transactionsList: Transaction[] = JSON.parse(storedTransactions)
				const start = (page - 1) * limit
				const end = start + limit
				const paginatedTransactions = transactionsList.slice(start, end)
				dispatch({
					type: 'SET_TRANSACTIONS',
					transactions: paginatedTransactions,
				})
				return paginatedTransactions
			}
			return []
		} catch (error) {
			setErrorMessage('Error loading transactions')
			console.error('Error loading transactions:', error)
			return []
		}
	}

	const addTransaction = async (transaction: Transaction): Promise<void> => {
		try {
			const storedTransactions = await AsyncStorage.getItem('transactions')
			let updatedTransactions: Transaction[] = []

			if (storedTransactions) {
				updatedTransactions = [...JSON.parse(storedTransactions), transaction]
			} else {
				updatedTransactions = [transaction]
			}

			await AsyncStorage.setItem(
				'transactions',
				JSON.stringify(updatedTransactions)
			)
			dispatch({ type: 'ADD_TRANSACTION', transaction })
		} catch (error) {
			setErrorMessage('Error adding transaction')
			console.error('Error adding transaction:', error)
		}
	}

	const deleteTransaction = async (id: number): Promise<void> => {
		try {
			const storedTransactions = await AsyncStorage.getItem('transactions')
			if (storedTransactions) {
				const updatedTransactions = JSON.parse(storedTransactions).filter(
					(transaction: Transaction) => transaction.id !== id
				)

				await AsyncStorage.setItem(
					'transactions',
					JSON.stringify(updatedTransactions)
				)
				dispatch({ type: 'DELETE_TRANSACTION', id })
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
					loadTransactions,
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
