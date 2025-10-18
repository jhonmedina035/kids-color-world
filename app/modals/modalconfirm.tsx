import React from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';



interface modalProps {
  visible: boolean;
  title:string
  message:string
  onConfirm: () => void;
  onCancel: () => void;
  profileName?: string; // opcional por si no se envía
}
export default function ModalConfirm({ visible, title, message, onConfirm, onCancel, profileName }:modalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>
            {message}
          </Text>

          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={onCancel}>
              <Text style={styles.buttonText}>Descartar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={onConfirm}>
              <Text style={styles.buttonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '80%',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333',
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#9ca3af',
  },
  deleteButton: {
    backgroundColor: '#9376ebff',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
