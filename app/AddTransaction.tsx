import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Platform,
	Image,
	useColorScheme,
	Dimensions,
} from 'react-native'

import { useTransactions } from './TransactionContext'
import { Colors } from '../constants/Colors'
import CustomModal from '@/components/CustomModal'
import { useCamera } from '@/hooks/useCamera'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light']

	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')

	const [isLandscape, setIsLandscape] = useState(false)
	const [isSmallScreen, setIsSmallScreen] = useState(false)

	const { addTransaction } = useTransactions()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [modalMessage, setModalMessage] = useState('')

	const {
		cameraPermission,
		receiptImage,
		videoRef,
		capturePhotoWeb,
		capturePhotoNative,
		toggleWebCameraFacing,
	} = useCamera()

	useEffect(() => {
		const updateScreenInfo = () => {
			const { width, height } = Dimensions.get('window')
			setIsLandscape(width > height)
			setIsSmallScreen(width < 490)
		}

		const dimensionListener = Dimensions.addEventListener(
			'change',
			updateScreenInfo
		)

		updateScreenInfo()

		return () => {
			if (dimensionListener && dimensionListener.remove) {
				dimensionListener.remove()
			}
		}
	}, [])

	const validateAmountInput = (input: string): number | '' => {
		const sanitized = input.replace(/[^0-9.]/g, '')
		return sanitized === '' ? '' : parseFloat(sanitized)
	}

	const handleAddTransaction = async () => {
		if (!title.trim() || amount === '' || amount <= 0) {
			setModalMessage('Please fill in both fields with valid values.')
			setIsModalVisible(true)
			return
		}

		const transaction = {
			id: Date.now(),
			title,
			amount,
			date: new Date().toISOString(),
			receipt: receiptImage,
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		setModalMessage('Transaction added!')
		setIsModalVisible(true)
	}

	const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'

	return (
		<View
			style={[styles.container, { backgroundColor: themeColors.background }]}
		>
			<Text
				style={[
					styles.title,
					{ color: themeColors.text },
					isSmallScreen && styles.titleSmall,
				]}
			>
				Add Transaction
			</Text>
			<View style={styles.inputContainer}>
				<TextInput
					style={[
						styles.input,
						{ borderColor: themeColors.icon },
						isSmallScreen && styles.inputSmall,
					]}
					placeholder='Title'
					placeholderTextColor={themeColors.icon}
					value={title}
					onChangeText={setTitle}
				/>
				<TextInput
					style={[
						styles.input,
						{ borderColor: themeColors.icon },
						isSmallScreen && styles.inputSmall,
					]}
					placeholder='Amount'
					placeholderTextColor={themeColors.icon}
					keyboardType='numeric'
					value={amount === '' ? '' : String(amount)}
					onChangeText={text => setAmount(validateAmountInput(text))}
				/>
			</View>

			{receiptImage && (
				<Image source={{ uri: receiptImage }} style={styles.receiptImage} />
			)}

			{isMobile && cameraPermission && (
				<View
					style={[
						styles.nativeCameraContainer,
						Platform.OS === 'ios' && styles.iosCameraContainer,
					]}
				>
					<TouchableOpacity
						style={[isLandscape ? styles.largeButton : styles.button]}
						onPress={capturePhotoNative}
					>
						<Text
							style={[
								isSmallScreen ? styles.buttonTextSmall : styles.buttonText,
							]}
						>
							Capture Photo
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{!isMobile && cameraPermission && (
				<View style={styles.webCameraContainer}>
					<video
						id='web-camera'
						ref={videoRef}
						autoPlay
						muted
						width='30%'
						height='30%'
					/>
					<TouchableOpacity
						style={[isLandscape ? styles.largeButton : styles.button]}
						onPress={capturePhotoWeb}
					>
						<Text
							style={[
								isSmallScreen ? styles.buttonTextSmall : styles.buttonText,
							]}
						>
							Take Photo
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							isLandscape ? styles.largeButton : styles.toggleButton,
							{ marginBottom: 0 },
						]}
						onPress={toggleWebCameraFacing}
					>
						<Text
							style={[
								isSmallScreen ? styles.buttonTextSmall : styles.buttonText,
							]}
						>
							Flip Camera
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							isLandscape ? styles.largeButton : styles.button,
							{ marginBottom: 0 },
						]}
						onPress={handleAddTransaction}
					>
						<Text
							style={[
								isSmallScreen ? styles.buttonTextSmall : styles.buttonText,
							]}
						>
							Add Transaction
						</Text>
					</TouchableOpacity>
				</View>
			)}

			<CustomModal
				visible={isModalVisible}
				message={modalMessage}
				onClose={() => setIsModalVisible(false)}
			/>
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
		fontSize: 28,
		fontWeight: 'bold',
		marginBottom: 16,
		textAlign: 'center',
	},
	titleSmall: {
		fontSize: 22,
		marginBottom: 12,
	},
	inputContainer: {
		marginHorizontal: 'auto',
		marginVertical: 0,
		alignItems: 'center',
	},
	input: {
		height: 50,
		borderWidth: 1,
		borderRadius: 10,
		marginBottom: 16,
		paddingHorizontal: 12,
		fontSize: 16,
		backgroundColor: '#fff',
		color: '#000',
	},

	inputSmall: {
		height: 30,
		fontSize: 14,
		width: '100%',
		marginBottom: 9,
	},
	receiptImage: {
		width: 85,
		height: 85,
		resizeMode: 'contain',
		marginBottom: 16,
		alignSelf: 'center',
		borderRadius: 10,
		borderWidth: 1,
		borderColor: '#ddd',
	},
	webCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 16,
		alignItems: 'center',
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
	toggleButton: {
		alignSelf: 'center',
		paddingVertical: 12,
		width: '60%',
		backgroundColor: '#007BFF',
		borderRadius: 10,
		marginTop: 10,
		marginBottom: 10,
	},
	largeButton: {
		backgroundColor: '#4CAF50',
		paddingVertical: 8,
		width: '30%',
		borderRadius: 10,
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 10,
		fontSize: 10,
	},
	button: {
		backgroundColor: '#4CAF50',
		paddingVertical: 14,
		width: '60%',
		borderRadius: 10,
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 16,
	},
	buttonText: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		textAlign: 'center',
	},
	buttonTextSmall: {
		fontSize: 10,
	},
})

export default AddTransaction
