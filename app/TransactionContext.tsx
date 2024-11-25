import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	ReactNode,
} from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export interface Transaction {
	id: number
	title: string
	amount: number
	date: string
}

interface TransactionContextType {
	transactions: Transaction[]
	addTransaction: (transaction: Transaction) => void
	deleteTransaction: (id: number) => void
	loadTransactions: () => void
}

interface TransactionProviderProps {
	children: ReactNode
}

const TransactionContext = createContext<TransactionContextType | undefined>(
	undefined
)

export const useTransactions = () => {
	const context = useContext(TransactionContext)
	if (!context) {
		throw new Error('useTransactions must be used within a TransactionProvider')
	}
	return context
}

export const TransactionProvider: React.FC<TransactionProviderProps> = ({
	children,
}) => {
	const [transactions, setTransactions] = useState<Transaction[]>([])

	const loadTransactions = async () => {
		const storedTransactions = await AsyncStorage.getItem('transactions')
		if (storedTransactions) {
			setTransactions(JSON.parse(storedTransactions))
		}
	}

	const addTransaction = async (transaction: Transaction) => {
		const updatedTransactions = [...transactions, transaction]
		await AsyncStorage.setItem(
			'transactions',
			JSON.stringify(updatedTransactions)
		)
		setTransactions(updatedTransactions)
	}

	const deleteTransaction = async (id: number) => {
		const updatedTransactions = transactions.filter(t => t.id !== id)
		await AsyncStorage.setItem(
			'transactions',
			JSON.stringify(updatedTransactions)
		)
		setTransactions(updatedTransactions)
	}

	useEffect(() => {
		loadTransactions()
	}, [])

	return (
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
	)
}
