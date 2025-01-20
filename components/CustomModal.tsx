import React from 'react'
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native'

interface CustomModalProps {
	visible: boolean
	message: string
	onClose: () => void
}

const CustomModal: React.FC<CustomModalProps> = ({
	visible,
	message,
	onClose,
}) => {
	return (
		<Modal
			transparent
			visible={visible}
			animationType='fade'
			onRequestClose={onClose}
		>
			<View style={styles.modalContainer}>
				<View style={styles.modalContent}>
					<Text style={styles.modalText}>{message}</Text>
					<TouchableOpacity style={styles.modalButton} onPress={onClose}>
						<Text style={styles.modalButtonText}>Close</Text>
					</TouchableOpacity>
				</View>
			</View>
		</Modal>
	)
}

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
	},
	modalContent: {
		backgroundColor: 'white',
		padding: 20,
		borderRadius: 10,
		alignItems: 'center',
	},
	modalText: {
		fontSize: 16,
		marginBottom: 10,
		textAlign: 'center',
	},
	modalButton: {
		backgroundColor: '#4CAF50',
		padding: 10,
		borderRadius: 5,
	},
	modalButtonText: {
		color: 'white',
		fontWeight: 'bold',
	},
})

export default CustomModal
