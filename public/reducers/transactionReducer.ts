import { Transaction } from '../types/types'

export type Action =
	| { type: 'SET_TRANSACTIONS'; transactions: Transaction[] }
	| { type: 'ADD_TRANSACTION'; transaction: Transaction }
	| { type: 'DELETE_TRANSACTION'; id: number }

export const transactionReducer = (
	state: Transaction[],
	action: Action
): Transaction[] => {
	switch (action.type) {
		case 'SET_TRANSACTIONS':
			return action.transactions
		case 'ADD_TRANSACTION':
			return [...state, action.transaction]
		case 'DELETE_TRANSACTION':
			return state.filter(transaction => transaction.id !== action.id)
		default:
			return state
	}
}
