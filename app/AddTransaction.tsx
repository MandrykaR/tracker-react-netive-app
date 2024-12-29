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
} from 'react-native'
import { CameraView } from 'expo-camera'

import { useTransactions } from './TransactionContext'
import CustomModal from '../components/CustomModal'
import { Colors } from '../constants/Colors'
import { Transaction } from '../types/types'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const currentColors = colorScheme === 'dark' ? Colors.dark : Colors.light
	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')
	const [modalVisible, setModalVisible] = useState<boolean>(false)
	const [modalMessage, setModalMessage] = useState<string>('')
	const [cameraFacing, setCameraFacing] = useState<'front' | 'back'>('back')
	const [photoUri, setPhotoUri] = useState<string | null>(null)

	const { addTransaction } = useTransactions()
	const videoRef = useRef<HTMLVideoElement | null>(null)

	const [cameraPermission, setCameraPermission] = useState<boolean>(false)

	useEffect(() => {
		;(async () => {
			if (Platform.OS === 'web') {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: { facingMode: cameraFacing },
					})
					if (videoRef.current) {
						videoRef.current.srcObject = stream
					}
					setCameraPermission(true)
				} catch (err) {
					console.error('Camera permission error (web):', err)
					setCameraPermission(false)
				}
			} else {
				setCameraPermission(true)
			}
		})()
	}, [cameraFacing])

	const toggleCameraFacing = () => {
		setCameraFacing(prev => (prev === 'back' ? 'front' : 'back'))
	}

	const capturePhotoNative = async () => {
		if (Platform.OS !== 'web') {
			const photoUri = `captured_photo_${Date.now()}.jpg`
			setPhotoUri(photoUri)
		}
	}

	const capturePhotoWeb = async () => {
		if (videoRef.current) {
			const canvas = document.createElement('canvas')
			const context = canvas.getContext('2d')
			canvas.width = videoRef.current.videoWidth
			canvas.height = videoRef.current.videoHeight

			if (context && videoRef.current) {
				context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
				const photo = canvas.toDataURL('image/png')
				setPhotoUri(photo)
			}
		}
	}

	const handleAddTransaction = async () => {
		if (!title.trim() || amount === '') {
			setModalMessage('Please fill in both fields.')
			setModalVisible(true)
			return
		}

		const transaction: Transaction = {
			id: Date.now(),
			title,
			amount,
			date: new Date().toISOString(),
			receipt: photoUri || '',
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		setPhotoUri(null)
		setModalMessage('Transaction added!')
		setModalVisible(true)
	}

	const handleAmountChange = (value: string) => {
		const numericValue = parseFloat(value)
		if (!isNaN(numericValue)) {
			setAmount(numericValue)
		} else {
			setAmount('')
		}
	}

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

			{photoUri && (
				<Image source={{ uri: photoUri }} style={styles.photoPreview} />
			)}

			{Platform.OS === 'web'
				? cameraPermission && (
						<View style={styles.cameraContainer}>
							<video ref={videoRef} autoPlay muted style={styles.video} />
							<Button title='Take Photo (Web)' onPress={capturePhotoWeb} />
						</View>
				  )
				: cameraPermission && (
						<View style={styles.cameraContainer}>
							<CameraView
								style={styles.camera}
								facing={cameraFacing}
							></CameraView>
							<Button
								title='Take Photo (Native)'
								onPress={capturePhotoNative}
							/>
						</View>
				  )}

			<TouchableOpacity
				style={styles.toggleButton}
				onPress={toggleCameraFacing}
			>
				<Text style={styles.toggleButtonText}>Flip Camera</Text>
			</TouchableOpacity>

			<Button title='Add Transaction' onPress={handleAddTransaction} />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
		width: '100%',
		maxWidth: 400,
	},
	cameraContainer: {
		marginBottom: 16,
		width: '100%',
		alignItems: 'center',
	},
	camera: {
		width: '100%',
		height: 300,
	},
	video: {
		width: '100%',
		maxWidth: 400,
		height: 300,
	},
	photoPreview: {
		width: 200,
		height: 200,
		resizeMode: 'contain',
		marginBottom: 16,
	},
	toggleButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		marginTop: 10,
		borderRadius: 5,
	},
	toggleButtonText: {
		color: '#fff',
		fontSize: 14,
	},
})

export default AddTransaction
