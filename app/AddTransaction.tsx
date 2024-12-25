import React, { useState } from 'react'
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
} from 'react-native'
import { useCamera } from '../hooks/useCamera' // Import the custom hook
import { CameraView } from 'expo-camera'
import { useTransactions } from './TransactionContext'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const { addTransaction } = useTransactions()

	// Get the camera data from the custom hook
	const {
		cameraPermission,
		receiptImage,
		cameraRef,
		availableDevices,
		capturePhotoWeb,
		capturePhotoNative,
	} = useCamera()

	// Select the first available camera device (back or front)
	const device = availableDevices?.[0] // You can modify this to choose a specific camera if needed (e.g., [1] for front)

	// Handle adding the transaction
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
							<video id='web-camera' autoPlay muted width='50%' height='100' />
							<Button
								title='Take Photo (Web)'
								onPress={capturePhotoWeb}
								color='#4CAF50'
							/>
						</View>
				  )
				: cameraPermission &&
				  device && (
						<View style={styles.cameraContainer}>
							<CameraView
								style={styles.camera}
								facing='back' // Assuming you want the back camera, can toggle if needed
							>
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
})

export default AddTransaction
