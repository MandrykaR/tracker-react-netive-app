import { StyleSheet } from 'react-native'

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

export default styles
