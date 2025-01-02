import React, { useState } from 'react'
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

const screenWidth = Dimensions.get('window').width
const screenHeight = Dimensions.get('window').height

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light']

	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')
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

	const isSmallScreen = screenHeight < 830

	return (
		<View
			style={[styles.container, { backgroundColor: themeColors.background }]}
		>
			<Text style={[styles.title, { color: themeColors.text }]}>
				Add Transaction
			</Text>
			<TextInput
				style={[
					styles.input,
					{
						color: '#000',
						borderColor: themeColors.icon,
					},
				]}
				placeholder='Title'
				placeholderTextColor={themeColors.icon}
				value={title}
				onChangeText={setTitle}
			/>
			<TextInput
				style={[
					styles.input,
					{
						color: '#000',
						borderColor: themeColors.icon,
					},
				]}
				placeholder='Amount'
				placeholderTextColor={themeColors.icon}
				keyboardType='numeric'
				value={amount === '' ? '' : String(amount)}
				onChangeText={text => setAmount(validateAmountInput(text))}
			/>

			{receiptImage && (
				<Image source={{ uri: receiptImage }} style={styles.receiptImage} />
			)}

			{isMobile && cameraPermission && (
				<View
					style={
						isSmallScreen
							? styles.smallCameraContainer
							: styles.nativeCameraContainer
					}
				>
					<TouchableOpacity
						style={isSmallScreen ? styles.smallButton : styles.button}
						onPress={capturePhotoNative}
					>
						<Text style={styles.buttonText}>Capture Photo (Mobile)</Text>
					</TouchableOpacity>
				</View>
			)}

			{!isMobile && cameraPermission && (
				<View
					style={
						isSmallScreen
							? styles.smallCameraContainer
							: styles.webCameraContainer
					}
				>
					<video
						id='web-camera'
						ref={videoRef}
						autoPlay
						muted
						width='50%'
						height='100'
					/>
					<TouchableOpacity
						style={isSmallScreen ? styles.smallButton : styles.button}
						onPress={capturePhotoWeb}
					>
						<Text style={styles.buttonText}>Take Photo</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={isSmallScreen ? styles.smallButton : styles.toggleButton}
						onPress={toggleWebCameraFacing}
					>
						<Text style={styles.toggleButtonText}>Flip Camera</Text>
					</TouchableOpacity>
				</View>
			)}

			<TouchableOpacity
				style={isSmallScreen ? styles.smallButton : styles.button}
				onPress={handleAddTransaction}
			>
				<Text style={styles.buttonText}>Add Transaction</Text>
			</TouchableOpacity>

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
	toggleButtonText: {
		color: 'white',
		fontSize: 16,
		fontWeight: '600',
		textAlign: 'center',
	},
	receiptImage: {
		width: 200,
		height: 200,
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
	smallCameraContainer: {
		flex: 1,
		justifyContent: 'center',
		marginBottom: 8,
		alignItems: 'center',
	},
	toggleButton: {
		alignSelf: 'center',
		paddingVertical: 12,
		width: screenWidth * 0.7,
		backgroundColor: '#007BFF',
		borderRadius: 10,
		marginTop: 10,
	},
	smallButton: {
		backgroundColor: '#4CAF50',
		paddingVertical: 10,
		width: screenWidth * 0.6,
		borderRadius: 8,
		alignItems: 'center',
		alignSelf: 'center',
		marginBottom: 12,
	},
	button: {
		backgroundColor: '#4CAF50',
		paddingVertical: 14,
		width: screenWidth * 0.8,
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
})

export default AddTransaction
