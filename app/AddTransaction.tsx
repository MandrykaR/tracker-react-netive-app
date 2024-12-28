import React, { useState, useEffect, useRef } from 'react'
import {
	View,
	Text,
	TextInput,
	Button,
	StyleSheet,
	Image,
	Platform,
	useColorScheme,
	TouchableOpacity,
	Alert,
} from 'react-native'
import { CameraView } from 'expo-camera'

import { useCamera } from '../hooks/useCamera'
import { useTransactions } from './TransactionContext'
import CustomModal from '../components/CustomModal'
import { Colors } from '../constants/Colors'
import { Transaction, UseCameraReturn } from '../types/types'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [modalMessage, setModalMessage] = useState<string>('')
	const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back') // Toggle state
	const { addTransaction } = useTransactions()

	const {
		cameraPermission: nativeCameraPermission,
		receiptImage,
		availableDevices,
		capturePhotoWeb,
		capturePhotoNative,
	}: UseCameraReturn = useCamera()

	const [cameraPermission, setCameraPermission] = useState<boolean>(false)
	const [webFacingMode, setWebFacingMode] = useState<'user' | 'environment'>(
		'environment' // Start with back camera
	)
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		if (Platform.OS === 'web') {
			startWebCamera(webFacingMode)
		}
	}, [webFacingMode])

	const startWebCamera = async (facingMode: 'user' | 'environment') => {
		try {
			// Stop existing video stream
			if (videoRef.current?.srcObject) {
				const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
				tracks.forEach(track => track.stop())
			}

			// Start new video stream with the specified facing mode
			const stream = await navigator.mediaDevices.getUserMedia({
				video: { facingMode },
			})
			if (videoRef.current) {
				videoRef.current.srcObject = stream
			}
		} catch (error) {
			Alert.alert('Error', 'Unable to access the camera.')
		}
	}

	const toggleCameraFacing = () => {
		if (Platform.OS === 'web') {
			setWebFacingMode(webFacingMode === 'user' ? 'environment' : 'user')
		} else {
			setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')
		}
	}

	const handleAmountChange = (value: string): void => {
		const numericValue = parseFloat(value)
		if (!isNaN(numericValue)) {
			setAmount(numericValue)
		} else {
			setAmount('')
		}
	}

	const showModal = (message: string): void => {
		setModalMessage(message)
		setModalVisible(true)
	}

	const handleAddTransaction = async (): Promise<void> => {
		if (!title.trim() || amount === '') {
			showModal('Please fill in both fields.')
			return
		}

		const transaction: Transaction = {
			id: Date.now(),
			title,
			amount,
			date: new Date().toISOString(),
			receipt: receiptImage,
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		showModal('Transaction added!')
	}

	const buttonColor = colorScheme === 'dark' ? '#32CD32' : currentColors.tint

	return (
		<View
			style={[styles.container, { backgroundColor: currentColors.background }]}
		>
			<CustomModal
				visible={modalVisible}
				message={modalMessage}
				onClose={() => setModalVisible(false)}
			/>
			<Text style={[styles.title, { color: currentColors.text }]}>
				Add Transaction
			</Text>
			<TextInput
				style={[
					styles.input,
					{ color: currentColors.text, borderColor: currentColors.text },
				]}
				placeholder='Title'
				placeholderTextColor={colorScheme === 'dark' ? '#bbb' : '#666'}
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={[
					styles.input,
					{ color: currentColors.text, borderColor: currentColors.text },
				]}
				placeholder='Amount'
				placeholderTextColor={colorScheme === 'dark' ? '#bbb' : '#666'}
				keyboardType='numeric'
				value={amount === '' ? '' : amount.toString()}
				onChangeText={handleAmountChange}
			/>
			{receiptImage && (
				<Image source={{ uri: receiptImage }} style={styles.receiptImage} />
			)}

			{Platform.OS === 'web' ? (
				cameraPermission && (
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
							color={buttonColor}
						/>
						<TouchableOpacity
							style={styles.toggleButton}
							onPress={toggleCameraFacing}
						>
							<Text style={styles.toggleButtonText}>
								Flip to {webFacingMode === 'user' ? 'Back' : 'Front'} Camera
							</Text>
						</TouchableOpacity>
					</View>
				)
			) : nativeCameraPermission ? (
				<View style={styles.cameraContainer}>
					<CameraView style={styles.camera} facing={cameraFacing}>
						<Button
							title='Take Photo (React Native)'
							onPress={capturePhotoNative}
							color={buttonColor}
						/>
					</CameraView>
					<TouchableOpacity
						style={styles.toggleButton}
						onPress={toggleCameraFacing}
					>
						<Text style={styles.toggleButtonText}>
							Flip to {cameraFacing === 'back' ? 'Front' : 'Back'} Camera
						</Text>
					</TouchableOpacity>
				</View>
			) : null}

			<Button
				title='Add Transaction'
				onPress={handleAddTransaction}
				color={buttonColor}
			/>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		padding: 16,
		alignItems: 'center',
	},
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	input: {
		height: 40,
		borderWidth: 1,
		marginBottom: 16,
		paddingHorizontal: 8,
		width: '100%',
		maxWidth: 700,
	},
	receiptImage: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginBottom: 16,
	},
	cameraContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	webCameraContainer: {
		width: '100%',
		justifyContent: 'center',
		alignItems: 'center',
		marginBottom: 16,
	},
	camera: {
		width: '100%',
		maxWidth: 400,
		height: 300,
		marginBottom: 16,
	},
	toggleButton: {
		marginTop: 10,
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
	},
	toggleButtonText: {
		color: '#fff',
		textAlign: 'center',
	},
})

export default AddTransaction
