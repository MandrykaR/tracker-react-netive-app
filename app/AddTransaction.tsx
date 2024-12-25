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
import { useCamera } from '../hooks/useCamera'
import { CameraView } from 'expo-camera'
import { useTransactions } from './TransactionContext'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const { addTransaction } = useTransactions()

	const {
		cameraPermission,
		receiptImage,
		availableDevices,
		capturePhotoWeb,
		capturePhotoNative,
	} = useCamera()

	const device = availableDevices?.[0]

	const [webFacingMode, setWebFacingMode] = useState<'user' | 'environment'>(
		'user'
	)
	const videoRef = useRef<HTMLVideoElement>(null)

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
				: cameraPermission &&
				  device && (
						<View style={styles.cameraContainer}>
							<CameraView style={styles.camera} facing='back'>
								<TouchableOpacity
									style={styles.toggleButton}
									onPress={() =>
										Alert.alert('Switch Camera is unavailable for native yet.')
									}
								>
									<Text style={styles.toggleButtonText}>Flip Camera</Text>
								</TouchableOpacity>
								<Button
									title='Take Photo (React Native)'
									onPress={capturePhotoNative}
									color='#4CAF50'
								/>
							</CameraView>
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
	cameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
	},
	webCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
	},
	camera: {
		width: '50%',
		height: 300,
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
