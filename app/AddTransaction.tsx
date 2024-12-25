import React, { useState, useRef } from 'react'
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Alert,
	useColorScheme,
	Image,
	Platform,
	TouchableOpacity,
} from 'react-native'
import { useTransactions } from './TransactionContext'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [receiptImage, setReceiptImage] = useState<string | null>(null)
	const { addTransaction } = useTransactions()

	const [cameraPermission, setCameraPermission] = useState<boolean>(false)
	const [webFacingMode, setWebFacingMode] = useState<'user' | 'environment'>(
		'user'
	)
	const videoRef = useRef<HTMLVideoElement>(null)

	// Request camera permissions when the component mounts
	React.useEffect(() => {
		if (Platform.OS === 'web') {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(() => setCameraPermission(true))
				.catch(() => setCameraPermission(false))
		}
	}, [])

	const toggleWebCameraFacing = async () => {
		const newFacingMode = webFacingMode === 'user' ? 'environment' : 'user'
		setWebFacingMode(newFacingMode)

		// Stop the current video stream
		if (videoRef.current?.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
			tracks.forEach(track => track.stop())
		}

		// Restart with the new facing mode
		try {
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode: newFacingMode },
			})
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
		} catch (error) {
			Alert.alert('Error', 'Unable to switch the camera.')
		}
	}

	const capturePhotoWeb = async () => {
		if (!videoRef.current) {
			Alert.alert('Error', 'Video stream is not available.')
			return
		}

		// Create a canvas to capture the current video frame
		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (!context) {
			Alert.alert('Error', 'Unable to capture photo.')
			return
		}

		canvas.width = videoRef.current.videoWidth
		canvas.height = videoRef.current.videoHeight

		// Draw the current video frame onto the canvas
		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

		// Get the image as a data URL
		const dataUrl = canvas.toDataURL('image/jpeg')
		setReceiptImage(dataUrl)
		Alert.alert('Success', 'Photo captured!')
	}

	const handleAddTransaction = async () => {
		if (!title.trim() || !amount.trim()) {
			Alert.alert('Error', 'Please fill in both fields.')
			return
		}

		const transaction = {
			id: Date.now(),
			title,
			amount: parseFloat(amount),
			date: new Date().toISOString(),
			receipt: receiptImage,
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		setReceiptImage(null)
		Alert.alert('Success', 'Transaction added!')
	}

	return (
		<View
			style={[
				styles.container,
				{ backgroundColor: isDarkMode ? '#000' : '#fff' },
			]}
		>
			<Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
				Add Transaction
			</Text>
			<TextInput
				style={[
					styles.input,
					{
						color: isDarkMode ? '#fff' : '#000',
						borderColor: isDarkMode ? '#fff' : '#ccc',
					},
				]}
				placeholder='Title'
				placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={[
					styles.input,
					{
						color: isDarkMode ? '#fff' : '#000',
						borderColor: isDarkMode ? '#fff' : '#ccc',
					},
				]}
				placeholder='Amount'
				placeholderTextColor={isDarkMode ? '#bbb' : '#666'}
				keyboardType='numeric'
				value={amount}
				onChangeText={setAmount}
			/>

			{receiptImage && (
				<Image source={{ uri: receiptImage }} style={styles.receiptImage} />
			)}

			{Platform.OS === 'web'
				? cameraPermission && (
						<View style={styles.webCameraContainer}>
							<video
								id='web-camera'
								ref={videoRef}
								autoPlay
								muted
								width='50%'
								height='100'
							/>
							<Button
								title='Take Photo (Web)'
								onPress={capturePhotoWeb}
								color='#4CAF50'
							/>
							<TouchableOpacity
								style={styles.toggleButton}
								onPress={toggleWebCameraFacing}
							>
								<Text style={styles.toggleButtonText}>Flip Camera</Text>
							</TouchableOpacity>
						</View>
				  )
				: cameraPermission && (
						<View style={styles.nativeCameraContainer}>
							<Text>Native camera functionality goes here.</Text>
						</View>
				  )}

			<Button title='Add' onPress={handleAddTransaction} color='#4CAF50' />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	input: {
		height: 40,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
	},
	receiptImage: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginBottom: 16,
	},
	webCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
	},
	nativeCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
	},
	toggleButton: {
		alignSelf: 'center',
		padding: 10,
		backgroundColor: '#007BFF',
		borderRadius: 5,
		marginTop: 10,
	},
	toggleButtonText: {
		color: 'white',
		fontSize: 16,
	},
})

export default AddTransaction
