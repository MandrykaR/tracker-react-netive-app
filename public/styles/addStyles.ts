import { StyleSheet } from 'react-native'

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
	},
	containerInput: {
		display: 'flex',
		alignItems: 'center',
	},

	containerButtons: {},
	title: {
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},

	input: {
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 16,
		paddingHorizontal: 12,
		backgroundColor: '#fff',
		color: '#000',
	},
	inputLandscape: {
		width: '70%',
		alignSelf: 'center',
	},
	receiptImage: {
		width: 85,
		height: 85,
		resizeMode: 'contain',
		marginBottom: 16,
		alignSelf: 'center',
	},
	webCameraContainer: {
		flexDirection: 'column',
		alignItems: 'center',
	},
	buttonText: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: '#380ac2',
		paddingHorizontal: 45,
		paddingVertical: 15,
	},
	buttonTextAdd: {
		color: 'white',
		fontWeight: 'bold',
		fontSize: 16,
		backgroundColor: '#a6342e',
		paddingHorizontal: 26,
		paddingVertical: 15,
	},
	nativeCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
		alignItems: 'center',
	},
	iosCameraContainer: {
		width: '50%',
		height: 100,
		marginBottom: 12,
	},
})

export default styles
