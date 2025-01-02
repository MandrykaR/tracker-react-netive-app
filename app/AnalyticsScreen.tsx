import React, { useMemo } from 'react'
import {
	View,
	Text,
	Dimensions,
	StyleSheet,
	useColorScheme,
	ScrollView,
} from 'react-native'

import { BarChart } from 'react-native-chart-kit'
import { useTransactions } from './TransactionContext'
import { Colors } from '../constants/Colors'
import { BarChartData, Transaction } from '../types/types'

const MAX_CATEGORIES = 20
const screenWidth = Dimensions.get('window').width
const chartWidth = screenWidth - 40

const AnalyticsScreen: React.FC = () => {
	const { transactions } = useTransactions()

	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'

	const totalExpenses = transactions.reduce(
		(sum, transaction) => sum + transaction.amount,
		0
	)
	const calculateLabelProps = (labels: string[]) => {
		const fontSize = labels.length > 7 ? 8 : 12
		const rotation = labels.length > 7 ? 45 : 0

		return { fontSize, rotation }
	}
	const categories = useMemo<Record<string, number>>(() => {
		const allCategories = transactions.reduce(
			(acc: Record<string, number>, transaction: Transaction) => {
				acc[transaction.title] =
					(acc[transaction.title] || 0) + transaction.amount
				return acc
			},
			{}
		)

		return Object.entries(allCategories)
			.sort((a, b) => b[1] - a[1])
			.slice(0, MAX_CATEGORIES)
			.reduce((acc, [key, value]) => {
				acc[key] = value
				return acc
			}, {} as Record<string, number>)
	}, [transactions])

	const categoryLabels = Object.keys(categories)
	const categoryData = Object.values(categories)

	const barChartData: BarChartData = {
		labels: categoryLabels,
		datasets: [{ data: categoryData }],
	}

	const currentColors = isDarkMode ? Colors.dark : Colors.light

	return (
		<View
			style={[styles.container, { backgroundColor: currentColors.background }]}
		>
			<View
				style={[
					styles.totalExpensesContainer,
					{ backgroundColor: 'rgb(14, 23, 67)' },
				]}
			>
				<Text style={[styles.totalExpenses, { color: currentColors.text }]}>
					Total Expenses: ${totalExpenses.toFixed(2)}
				</Text>
			</View>

			<Text style={[styles.title, { color: currentColors.text }]}>
				Expenses by Category
			</Text>

			<ScrollView
				horizontal
				contentContainerStyle={{ flexGrow: 1 }}
				showsHorizontalScrollIndicator={false}
			>
				<BarChart
					data={barChartData}
					width={chartWidth}
					height={300}
					chartConfig={{
						backgroundGradientFrom: isDarkMode
							? Colors.dark.background
							: Colors.light.background,
						backgroundGradientTo: isDarkMode
							? Colors.dark.background
							: Colors.light.background,
						color: (opacity = 1) =>
							isDarkMode
								? `rgba(255, 255, 255, ${opacity})`
								: `rgba(0, 0, 0, ${opacity})`,
						barPercentage: 0.5,
						propsForLabels: calculateLabelProps(categoryLabels),
					}}
					yAxisLabel='$'
					yAxisSuffix=''
					style={styles.chart}
				/>
			</ScrollView>

			{categoryLabels.length > MAX_CATEGORIES && (
				<Text style={[styles.info, { color: currentColors.text }]}>
					Showing top {MAX_CATEGORIES} categories. Consider grouping smaller
					categories.
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
	totalExpensesContainer: {
		padding: 16,
		marginBottom: 20,
		borderRadius: 8,
		alignItems: 'center',
		justifyContent: 'center',
		elevation: 5,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.1,
		shadowRadius: 5,
	},
	totalExpenses: {
		fontSize: 20,
		fontWeight: 'bold',
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
	info: {
		fontSize: 12,
		marginTop: 8,
		textAlign: 'center',
	},
})

export default AnalyticsScreen
