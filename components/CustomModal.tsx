import React from 'react'

import { View, Text, Modal, TouchableOpacity } from 'react-native'

import styles from '../public/styles/customModalStyles'

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

export default CustomModal
