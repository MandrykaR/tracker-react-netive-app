// TransactionContext.ts
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
   receipt: string | null;
}

interface TransactionContextType {
   transactions: Transaction[]
   addTransaction: (transaction: Transaction) => Promise<void>
   deleteTransaction: (id: number) => Promise<void>
   loadTransactions: () => Promise<void>
}

interface TransactionProviderProps {
   children: ReactNode
}

const TransactionContext = createContext<TransactionContextType | undefined>(
   undefined
)

export const useTransactions = (): TransactionContextType => {
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

   const loadTransactions = async (): Promise<void> => {
      try {
         const storedTransactions = await AsyncStorage.getItem('transactions')
         if (storedTransactions) {
            setTransactions(JSON.parse(storedTransactions))
         }
      } catch (error) {
         console.error('Error loading transactions:', error)
      }
   }

   const addTransaction = async (transaction: Transaction): Promise<void> => {
      try {
         const updatedTransactions = [...transactions, transaction]
         await AsyncStorage.setItem(
            'transactions',
            JSON.stringify(updatedTransactions)
         )
         setTransactions(updatedTransactions)
      } catch (error) {
         console.error('Error adding transaction:', error)
      }
   }

   const deleteTransaction = async (id: number): Promise<void> => {
      try {
         const updatedTransactions = transactions.filter(
            (transaction) => transaction.id !== id
         )
         await AsyncStorage.setItem(
            'transactions',
            JSON.stringify(updatedTransactions)
         )
         setTransactions(updatedTransactions)
      } catch (error) {
         console.error('Error deleting transaction:', error)
      }
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
