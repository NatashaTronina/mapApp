import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from 'react-native';
import { MarkerModalProps } from '../types';


export default function MarkerModal({visible, onClose, onAddMarker, newTitle, setNewTitle, newDescription, setNewDescription,}: MarkerModalProps) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalView}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>✘</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="Название"
            value={newTitle}
            onChangeText={setNewTitle}
            style={styles.input}
          />
          <TextInput
            placeholder="Описание"
            value={newDescription}
            onChangeText={setNewDescription}
            style={styles.input}
          />

          <TouchableOpacity onPress={onAddMarker} style={styles.addButtonContainer}>
            <Text style={styles.textButton}>Добавить маркер</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalView: { 
    width: "85%", 
    padding: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f4ebebff', 
    borderRadius: 15, 
    position: 'relative', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 60, 
  },
  input: { 
    borderRadius: 8, 
    height: 55, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 15, 
    width: '100%', 
    paddingHorizontal: 15, 
    backgroundColor: '#ffffffff',
    fontSize: 16,
  },
  textButton: { 
    color: "#fff",
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: "center" 
  },
  addButtonContainer: { 
    backgroundColor: '#788cceff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
  },
  closeButton: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    zIndex: 10, 
  },
  closeButtonText: { 
    fontSize: 35, 
    color: '#788cceff'
  },
});