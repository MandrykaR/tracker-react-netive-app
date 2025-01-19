import { StyleSheet } from 'react-native'

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

export default styles
