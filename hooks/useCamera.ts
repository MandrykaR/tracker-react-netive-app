import { useState, useRef, useEffect } from 'react'
import { Platform, Alert } from 'react-native'

export const useCamera = () => {
	const [cameraPermission, setCameraPermission] = useState<boolean>(false)
	const [receiptImage, setReceiptImage] = useState<string | null>(null)
	const [webFacingMode, setWebFacingMode] = useState<'user' | 'environment'>(
		'user'
	)
	const videoRef = useRef<HTMLVideoElement | null>(null)

	useEffect(() => {
		if (Platform.OS === 'web') {
			navigator.mediaDevices
				.getUserMedia({ video: true })
				.then(() => setCameraPermission(true))
				.catch(() => setCameraPermission(false))
		} else {
			setCameraPermission(true)
		}
	}, [])

	const toggleWebCameraFacing = async () => {
		const newFacingMode = webFacingMode === 'user' ? 'environment' : 'user'
		setWebFacingMode(newFacingMode)

		if (videoRef.current?.srcObject) {
			const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
			tracks.forEach(track => track.stop())
		}

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

	const capturePhotoWeb = async () => {
		if (!videoRef.current) {
			Alert.alert('Error', 'Video stream is not available.')
			return
		}

		const canvas = document.createElement('canvas')
		const context = canvas.getContext('2d')
		if (!context) {
			Alert.alert('Error', 'Unable to capture photo.')
			return
		}

		canvas.width = videoRef.current.videoWidth
		canvas.height = videoRef.current.videoHeight

		context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)

		const dataUrl = canvas.toDataURL('image/jpeg')
		setReceiptImage(dataUrl)
	}

	const capturePhotoNative = () => {
		setReceiptImage('native-photo-url')
	}

	return {
		cameraPermission,
		receiptImage,
		videoRef,
		capturePhotoWeb,
		capturePhotoNative,
		toggleWebCameraFacing,
	}
}
