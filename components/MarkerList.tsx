import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { MarkerListProps } from '../types';

export default function MarkerList({ marker, title, setTitle, description, setDescription }: MarkerListProps) {
  return (
    <View>
      <Text style={styles.placeholderText}>Название:</Text>
      <TextInput
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
      <Text style={styles.placeholderText}>Описание:</Text>
      <TextInput
        placeholder="Описание"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
        multiline
      />
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          Широта: {marker.coordinate.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Долгота: {marker.coordinate.longitude.toFixed(6)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  coordinatesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  coordinatesText: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  placeholderText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});