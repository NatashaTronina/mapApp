import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { useMarkers } from '../../Context/MarkerContext';  
import { MarkersData } from '../../types';
import MarkerList from '../../components/MarkerList';  
import ImageList from '../../components/ImageList';  

export default function MarkerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { markers, setMarkers } = useMarkers();
  const marker = markers.find(marker => marker.id === id as string);

  const [title, setTitle] = useState(marker?.title || '');
  const [description, setDescription] = useState(marker?.description || '');
  const [images, setImages] = useState(marker?.images || []);

  useEffect(() => {
    if (marker) {
      setTitle(marker.title);
      setDescription(marker.description);
      setImages(marker.images);
    }
  }, [marker]);

  const saveChanges = () => {
    if (!marker) {
      Alert.alert('Маркер не найден. Невозможно сохранить изменения.');
      return;
    }

    try {
      const updatedMarker: MarkersData = {
        ...marker,
        title,
        description,
        images,
      };

      setMarkers(previous => previous.map(marker => marker.id === id ? updatedMarker : marker));
      Alert.alert('Изменения сохранены!');
      router.back()
    } catch (error) {
      Alert.alert('Не получилось. Попробуйте снова.');
    }
  };

  if (!marker) {
    return (
      <View style={styles.container}>
        <Text>Маркер не найден</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.button}>
          <Text style={styles.buttonText}>Вернуться назад</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <MarkerList
        marker={marker}
        title={title}
        setTitle={setTitle}
        description={description}
        setDescription={setDescription}
      />
      <ImageList images={images} setImages={setImages} />
      <TouchableOpacity onPress={saveChanges} style={styles.saveButton}>
        <Text style={styles.buttonText}>Сохранить</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  button: {
    backgroundColor: '#788cceff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  saveButton: {
    backgroundColor: '#e9b0e1ff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});