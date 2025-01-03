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
} from 'react-native'

import { useTransactions } from './TransactionContext.tsx'
import { Colors } from '../constants/Colors'
import styles from '../styles/addStyles.ts'
import CustomModal from '@/components/CustomModal'
import { useCamera } from '@/hooks/useCamera'

const AddTransaction: React.FC = () => {
	const colorScheme = useColorScheme()
	const themeColors = Colors[colorScheme === 'dark' ? 'dark' : 'light']

	const [title, setTitle] = useState<string>('')
	const [amount, setAmount] = useState<number | ''>('')

	const [isLandscape, setIsLandscape] = useState(false)

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

		const transaction = {
			id: Date.now(),
			title,
			amount,
			date: new Date().toISOString(),
			receipt: receiptImage,
			isSynced: false,
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

				{receiptImage && (
					<Image
						source={{ uri: receiptImage }}
						style={[
							styles.receiptImage,
							{ width: imageSize, height: imageSize },
						]}
					/>
				)}

				{isMobile && cameraPermission && (
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
							onPress={capturePhotoNative}
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

				{!isMobile && cameraPermission && (
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
								onPress={capturePhotoWeb}
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
								onPress={toggleWebCameraFacing}
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

export default AddTransaction
