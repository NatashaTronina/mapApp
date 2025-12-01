import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MarkersData } from '../types';
import { useDatabase } from '../Context/DatabaseContext';

interface MarkerListProps {
  marker: MarkersData;
}

export default function MarkerList({ marker }: MarkerListProps) {
  const { updateMarker, isLoading, error } = useDatabase();
  const [title, setTitle] = useState(marker.title);
  const [description, setDescription] = useState(marker.description);

  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  }, [error]);

  const handleSave = async () => {
    try {
      await updateMarker(marker.id, title, description);
      Alert.alert('Сохранено');
    } catch (err) {
      Alert.alert('Ошибка сохранения');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

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
      <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
        <Text style={styles.saveText}>Сохранить</Text>
      </TouchableOpacity>
      <View style={styles.coordinatesContainer}>
        <Text style={styles.coordinatesText}>
          Широта: {marker.latitude.toFixed(6)}
        </Text>
        <Text style={styles.coordinatesText}>
          Долгота: {marker.longitude.toFixed(6)}
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
  saveButton: {
    backgroundColor: '#788cceff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveText: {
    color: '#fff',
    fontSize: 16,
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