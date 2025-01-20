import React, { useState, useEffect } from 'react'
import {
	View,
	Text,
	TextInput,
	TouchableOpacity,
	Platform,
	Image,
	useColorScheme,
	Dimensions,
	ScrollView,
	StyleSheet,
} from 'react-native'

import { Colors } from '../constants/Colors'
import { useTransactions } from './TransactionContext.tsx'
import { useCamera } from '@/hooks/useCamera'
import CustomModal from '@/components/CustomModal'

import { Transaction } from '@/public/types/types.ts'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light']

	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')

	const [isLandscape, setIsLandscape] = useState(false)

	const { addTransaction } = useTransactions()
	const [isModalVisible, setIsModalVisible] = useState(false)
	const [modalMessage, setModalMessage] = useState('')
	const [location, setLocation] = useState<{
		latitude: number
		longitude: number
	} | null>(null)

	const {
		cameraPermission,
		receiptImage,
		videoRef,
		capturePhotoWeb,
		capturePhotoNative,
		toggleWebCameraFacing,
	} = useCamera()

	useEffect(() => {
		const getCurrentLocation = async () => {
			try {
				navigator.geolocation.getCurrentPosition(
					position => {
						const { latitude, longitude } = position.coords
						setLocation({ latitude, longitude })
					},
					error => {
						console.error('Error fetching location:', error)
					}
				)
			} catch (err) {
				console.error('Location error:', err)
			}
		}

		getCurrentLocation()
	}, [])

	useEffect(() => {
		const updateOrientation = () => {
			const { width, height } = Dimensions.get('window')
			setIsLandscape(width > height)
		}

		const dimensionListener = Dimensions.addEventListener(
			'change',
			updateOrientation
		)

		updateOrientation()

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

		const transaction: Transaction = {
			id: Date.now(),
			title,
			amount,
			date: new Date().toISOString(),
			receipt: receiptImage,
			isSynced: false,
			location: location || { latitude: 0, longitude: 0 },
		}

		await addTransaction(transaction)

		setTitle('')
		setAmount('')
		setModalMessage('Transaction added!')
		setIsModalVisible(true)
	}

	const isMobile = Platform.OS === 'ios' || Platform.OS === 'android'

	const isSmallScreen = Dimensions.get('window').width < 430

	const titleFontSize = isSmallScreen ? 14 : 28
	const inputHeight = isSmallScreen ? 40 : 50
	const inputFontSize = isSmallScreen ? 14 : 16

	const inputLandscapeWidth = isLandscape ? '70%' : '100%'

	const { width } = Dimensions.get('window')
	const imageSize = width * 0.2

	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1 }}>
			<View
				style={[styles.container, { backgroundColor: themeColors.background }]}
			>
				<View style={styles.container}>
					<Text
						style={[
							styles.title,
							{ color: themeColors.text, fontSize: titleFontSize },
						]}
					>
						Add Transaction
					</Text>
					<View style={styles.containerInput}>
						<TextInput
							style={[
								styles.input,
								{
									borderColor: themeColors.icon,
									fontSize: inputFontSize,
									height: inputHeight,
									width: inputLandscapeWidth,
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
									borderColor: themeColors.icon,
									fontSize: inputFontSize,
									height: inputHeight,
									width: inputLandscapeWidth,
								},
							]}
							placeholder='Amount'
							placeholderTextColor={themeColors.icon}
							keyboardType='numeric'
							value={amount === '' ? '' : String(amount)}
							onChangeText={text => setAmount(validateAmountInput(text))}
						/>
					</View>
				</View>

				{location && (
					<Text
						style={{
							color: themeColors.text,
							marginVertical: 10,
							textAlign: 'center',
						}}
					>
						Location: Lat {location.latitude.toFixed(2)}, Lon{' '}
						{location.longitude.toFixed(2)}
					</Text>
				)}

				{receiptImage && (
					<Image
						source={{ uri: receiptImage }}
						style={[
							styles.receiptImage,
							{ width: imageSize, height: imageSize },
						]}
					/>
				)}

				{isMobile && (
					<View
						style={[
							styles.nativeCameraContainer,
							Platform.OS === 'ios' && styles.iosCameraContainer,
							{
								width: Dimensions.get('window').width < 430 ? '90%' : '60%',
								marginHorizontal: '5%',
								paddingVertical: Dimensions.get('window').width < 430 ? 10 : 20,
							},
						]}
					>
						<TouchableOpacity
							onPress={
								cameraPermission
									? capturePhotoNative
									: () => setModalMessage('Camera permission is required')
							}
							style={{ width: '100%' }}
						>
							<Text
								style={{
									fontSize: Dimensions.get('window').width < 430 ? 14 : 18,
									textAlign: 'center',
								}}
							>
								Capture Photo
							</Text>
						</TouchableOpacity>
					</View>
				)}

				{!isMobile && (
					<View
						style={[
							styles.webCameraContainer,
							{
								paddingVertical: Dimensions.get('window').width < 430 ? 10 : 20,
								marginHorizontal: '5%',
							},
						]}
					>
						<video
							id='web-camera'
							ref={videoRef}
							autoPlay
							muted
							width={Dimensions.get('window').width < 430 ? '70%' : '30%'}
							height={Dimensions.get('window').width < 430 ? '70%' : '30%'}
						/>

						<View>
							<TouchableOpacity
								onPress={
									cameraPermission
										? toggleWebCameraFacing
										: () => setModalMessage('Camera permission is required')
								}
								style={{
									width: '100%',
									marginVertical: 10,
									alignItems: 'center',
								}}
							>
								<Text
									style={[
										styles.buttonText,
										{
											fontSize: Dimensions.get('window').width < 430 ? 14 : 18,
											textAlign: 'center',
										},
									]}
								>
									Flip Camera
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={
									cameraPermission
										? capturePhotoWeb
										: () => setModalMessage('Camera permission is required')
								}
								style={{
									width: '100%',
									marginVertical: 10,
									alignItems: 'center',
								}}
							>
								<Text
									style={[
										styles.buttonText,
										{
											fontSize: Dimensions.get('window').width < 430 ? 14 : 18,
											textAlign: 'center',
										},
									]}
								>
									Take Photo
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={handleAddTransaction}
								style={{
									width: '100%',
									marginVertical: 10,
									alignItems: 'center',
								}}
							>
								<Text
									style={[
										styles.buttonTextAdd,
										{
											fontSize: Dimensions.get('window').width < 430 ? 14 : 18,
											textAlign: 'center',
										},
									]}
								>
									Add Transaction
								</Text>
							</TouchableOpacity>
						</View>
					</View>
				)}

				<CustomModal
					visible={isModalVisible}
					message={modalMessage}
					onClose={() => setIsModalVisible(false)}
				/>
			</View>
		</ScrollView>
	)
}

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

export default AddTransaction
