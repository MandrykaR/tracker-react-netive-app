import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	modalText: {
		fontSize: 16,
		marginBottom: 10,
		textAlign: 'center',
	},
	modalButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
	},
	modalButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
})
export default styles
