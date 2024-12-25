import { useState, useEffect, useRef } from 'react'
import { Alert, Platform } from 'react-native'

let Camera: any = null
if (Platform.OS !== 'web') {
	Camera = require('react-native-vision-camera').Camera
}

export const useCamera = () => {
	const [cameraPermission, setCameraPermission] = useState<boolean>(false)
	const [receiptImage, setReceiptImage] = useState<string | null>(null)
	const [availableDevices, setAvailableDevices] = useState<any[]>([])
	const cameraRef = useRef<typeof Camera | null>(null)

	useEffect(() => {
		const requestCameraPermission = async () => {
			if (Platform.OS === 'web') {
				try {
					const stream = await navigator.mediaDevices.getUserMedia({
						video: true,
					})
					stream.getTracks().forEach(track => track.stop()) // Close the stream
					setCameraPermission(true)
				} catch (error) {
					setCameraPermission(false)
					console.error('Web camera permission error:', error)
				}
			} else {
				try {
					const permission = await Camera.requestCameraPermission()
					setCameraPermission(permission === 'authorized')

					if (permission === 'authorized') {
						const devices = await Camera.getAvailableCameraDevices()
						setAvailableDevices(devices)
					}
				} catch (error) {
					setCameraPermission(false)
					console.error('Native camera permission error:', error)
				}
			}
		}

		requestCameraPermission()
	}, [])

	const capturePhotoWeb = async () => {
		if (!cameraPermission) {
			Alert.alert('Camera Permission', 'Camera permission is required.')
			return
		}

		try {
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

			// Stop the video stream after capturing the image
			stream.getTracks().forEach(track => track.stop())
		} catch (error) {
			console.error('Error capturing photo on web:', error)
			Alert.alert('Error', 'Failed to capture photo on web.')
		}
	}

	const capturePhotoNative = async () => {
		if (!cameraPermission) {
			Alert.alert('Camera Permission', 'Camera permission is required.')
			return
		}

		try {
			if (cameraRef.current) {
				const photo = await cameraRef.current.takePhoto()
				setReceiptImage(photo.path)
			}
		} catch (error) {
			console.error('Error capturing photo on native:', error)
			Alert.alert('Error', 'Failed to take photo.')
		}
	}

	return {
		cameraPermission,
		receiptImage,
		cameraRef,
		availableDevices, // Expose available devices to be used in your component
		capturePhotoWeb,
		capturePhotoNative,
	}
}
