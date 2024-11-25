import React from 'react'
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	useColorScheme,
} from 'react-native'
import { BarChart } from 'react-native-chart-kit'
import { useTransactions, Transaction } from './TransactionContext'

const AnalyticsScreen: React.FC = () => {
	const { transactions } = useTransactions()
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	const categories = transactions.reduce(
		(acc: Record<string, number>, transaction: Transaction) => {
			acc[transaction.title] =
				(acc[transaction.title] || 0) + transaction.amount
			return acc
		},
		{}
	)

	const categoryLabels = Object.keys(categories)
	const categoryData = Object.values(categories)

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? '#000' : '#fff' },
			]}
		>
			<Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
				Expenses by Category
			</Text>

			<BarChart
				data={{
					labels: categoryLabels,
					datasets: [{ data: categoryData }],
				}}
				width={Dimensions.get('window').width - 40}
				height={220}
				chartConfig={{
					backgroundGradientFrom: isDarkMode ? '#1E2923' : '#fff',
					backgroundGradientTo: isDarkMode ? '#08130D' : '#fff',
					color: (opacity = 1) =>
						isDarkMode
							? `rgba(255, 255, 255, ${opacity})`
							: `rgba(0, 0, 0, ${opacity})`,
					barPercentage: 0.5,
				}}
				yAxisLabel='$'
				yAxisSuffix=''
				style={styles.chart}
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
	chart: {
		marginVertical: 16,
		borderRadius: 16,
	},
})

export default AnalyticsScreen
