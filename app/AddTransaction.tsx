import React, { useState, useEffect, useRef } from 'react'
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

let Camera: any = null
if (Platform.OS !== 'web') {
	Camera = require('react-native-vision-camera').Camera
}

import { useTransactions } from './TransactionContext'

const isWeb = Platform.OS === 'web'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const isDarkMode = colorScheme === 'dark'
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<string>('')
	const [receiptImage, setReceiptImage] = useState<string | null>(null)
	const [cameraPermission, setCameraPermission] = useState<boolean>(false)
	const cameraRef = useRef<any>(null)
	const { addTransaction } = useTransactions()

	useEffect(() => {
		if (isWeb) {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(() => setCameraPermission(true))
				.catch(() => setCameraPermission(false))
		} else {
			const requestCameraPermission = async () => {
				const {
					Camera,
					CameraPermissionStatus,
				} = require('react-native-vision-camera')
				const permission = await Camera.requestCameraPermission()
				setCameraPermission(permission === CameraPermissionStatus.AUTHORIZED)
			}

			requestCameraPermission()
		}
	}, [])

	const capturePhotoWeb = async () => {
		if (!cameraPermission) {
			Alert.alert('Camera Permission', 'Camera permission is required.')
			return
		}

		const stream = await navigator.mediaDevices.getUserMedia({ video: true })
		const video = document.createElement('video')
		video.srcObject = stream
		await new Promise(resolve => {
			video.onloadedmetadata = () => {
				resolve(video.play())
			}
		})

		const canvas = document.createElement('canvas')
		canvas.width = video.videoWidth
		canvas.height = video.videoHeight
		const context = canvas.getContext('2d')
		context?.drawImage(video, 0, 0)

		const dataUrl = canvas.toDataURL()
		setReceiptImage(dataUrl)
		stream.getTracks().forEach(track => track.stop())
	}

	const capturePhotoNative = async () => {
		if (!cameraPermission) {
			Alert.alert('Camera Permission', 'Camera permission is required.')
			return
		}

		try {
			const photo = await cameraRef.current.takePhoto({
				qualityPrioritization: 'quality',
				skipMetadata: true,
			})
			setReceiptImage(photo.uri)
		} catch (error) {
			Alert.alert('Error', 'Failed to take photo.')
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

			{isWeb
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
				: cameraPermission && (
						<View style={styles.cameraContainer}>
							<Camera
								ref={cameraRef}
								style={styles.camera}
								device={Camera.getAvailableCameraDevices().back}
								isActive={true}
							/>
							<Button
								title='Take Photo (React Native)'
								onPress={capturePhotoNative}
								color='#4CAF50'
							/>
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
