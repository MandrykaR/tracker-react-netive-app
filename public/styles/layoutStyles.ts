import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
	offlineBanner: {
		backgroundColor: '#FF3B30',
		paddingVertical: 10,
		paddingHorizontal: 20,
		position: 'absolute',
		bottom: 0,
		width: '100%',
		zIndex: 1000,
		alignItems: 'center',
		justifyContent: 'center',
	},
	hiddenBanner: {
		display: 'none',
	},
	offlineText: {
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: 'bold',
	},
})
