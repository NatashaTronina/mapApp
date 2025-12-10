import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { MarkersData } from '../types';
import { useDatabaseContext } from '../Context/DatabaseContext';

interface MarkerListProps {
  marker: MarkersData;
  title: string; 
  setTitle: (value: string) => void;  
  description: string;  
  setDescription: (value: string) => void;  
}

export default function MarkerList({ marker, title, setTitle, description, setDescription }: MarkerListProps) {
  const { isLoading, error } = useDatabaseContext();

  // показываем ошибку
  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  }, [error]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#788cceff"/>;
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
    deleteButton: {
    backgroundColor: '#f87f76ff',
    padding: 15,
    alignItems: 'center',
    margin: 20,
    borderRadius: 5,
  },
  deleteText: {
    color: '#fff',
    fontSize: 16,
  },
});