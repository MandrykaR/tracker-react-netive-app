import * as Location from 'expo-location'

export interface Coordinates {
	latitude: number
	longitude: number
}

export const requestLocationPermission = async (): Promise<boolean> => {
	try {
		const { status } = await Location.requestForegroundPermissionsAsync()
		return status === 'granted'
	} catch (error) {
		console.error('Error requesting location permission:', error)
		return false
	}
}

export const getCurrentLocation = async (): Promise<Coordinates | null> => {
	try {
		const permissionGranted = await requestLocationPermission()
		if (!permissionGranted) {
			console.warn('Location permission not granted.')
			return null
		}

		const { coords } = await Location.getCurrentPositionAsync({})
		return { latitude: coords.latitude, longitude: coords.longitude }
	} catch (error) {
		console.error('Error getting current location:', error)
		return null
	}
}
