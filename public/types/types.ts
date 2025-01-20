export interface BarChartData {
	labels: string[]
	datasets: { data: number[] }[]
}

export type RenderItemProps = { item: Transaction }

export interface Transaction {
	id: number
	title: string
	amount: number
	date: string
	receipt: string | null
	isSynced: boolean
	location: {
		latitude: number
		longitude: number
	}
}


export interface TransactionProviderProps {
	children: React.ReactNode
}

export interface TransactionsContext {
	transactions: Transaction[]
	loadTransactions: (page: number, limit: number) => Promise<void>
	deleteTransaction: (id: number) => void
}

export interface TransactionContextType {
	transactions: Transaction[]
	addTransaction: (transaction: Transaction) => Promise<void>
	deleteTransaction: (id: number) => Promise<void>
	loadTransactions: (page: number, limit: number) => Promise<Transaction[]>
}

export interface CustomModalProps {
	visible: boolean
	message: string
	onClose: () => void
}

export interface UseCameraReturn {
	cameraPermission: boolean
	receiptImage: string | null
	availableDevices: any[]
	capturePhotoWeb: () => void
	capturePhotoNative: () => void
}
