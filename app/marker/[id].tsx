import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import uuid from 'react-native-uuid';
import { useMarkers } from '../../components/MarkerContext';
import { ImageData, MarkersData } from '../../types';

export default function MarkerDetailsScreen() {
  const { id } = useLocalSearchParams();
  const { markers, setMarkers } = useMarkers();
  const marker = markers.find(marker => marker.id === id as string);

  const [title, setTitle] = useState(marker?.title || '');
  const [description, setDescription] = useState(marker?.description || '');
  const [images, setImages] = useState<ImageData[]>(marker?.images || []);

  useEffect(() => {
    if (marker) {
      setTitle(marker.title);
      setDescription(marker.description);
      setImages(marker.images);
    }
  }, [marker]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const newImageId = uuid.v4();
        if (!newImageId) {
          throw new Error('Не удалось сгенерировать ID для изображения');
        }
        const newImage: ImageData = {
          id: newImageId,
          uri: result.assets[0].uri,
        };
        setImages(prev => [...prev, newImage]);
      } 
    } catch (error) {
      Alert.alert('Не удалось выбрать изображение. Попробуйте снова.');
    }
  };

  const removeImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
  };

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

      setMarkers(prev => prev.map(marker => marker.id === id ? updatedMarker : marker));
      Alert.alert('Изменения сохранены!');
      router.back();
    } catch (error) {
      Alert.alert('Ошибка', 'Не удалось сохранить изменения. Попробуйте снова.');
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
      
      <TextInput
        placeholder="Название"
        value={title}
        onChangeText={setTitle}
        style={styles.input}
      />
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

      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Добавить фото</Text>
      </TouchableOpacity>
      
      <View style={styles.imagesContainer}>
        {images.map((img) => (
          <View key={img.id} style={styles.imageWrapper}>
            <Image source={{ uri: img.uri }} style={styles.image} />
            <TouchableOpacity onPress={() => removeImage(img.id)} style={styles.removeButton}>
              <Text style={styles.removeText}>Удалить</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
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
    textAlign: 'center'
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
 imagesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', 
    marginBottom: 20,
  },
  imageWrapper: {
    flexDirection: 'row',
    alignItems: 'center',  
    marginBottom: 10,  
    marginRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 5,
    marginRight: 10, 
  },
  removeButton: {
    backgroundColor: '#f87f76ff', 
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});