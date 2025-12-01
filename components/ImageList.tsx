import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ImageData } from '../types';
import { useDatabase } from "../Context/DatabaseContext";

export default function ImageList({ markerId }: { markerId: string }) {
  const { addImage, deleteImage, getMarkerImages, isLoading, error } = useDatabase();
  const [images, setImages] = useState<ImageData[]>([]);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const dbImages = await getMarkerImages(markerId);
        const adaptedImages: ImageData[] = dbImages.map(img => ({
          id: img.id,
          uri: img.uri,
        }));
        setImages(adaptedImages);
      } catch (err) {
        Alert.alert('Ошибка загрузки изображений');
      }
    };
    loadImages();
  }, [markerId, getMarkerImages]);

  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  }, [error]);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const id = await addImage(markerId, uri);
        setImages(previous => [...previous, { id, uri }]);
      }
    } catch (err) {
      Alert.alert('Не удалось выбрать изображение. Попробуйте снова.');
    }
  };

  const removeImage = async (imageId: string) => {
    try {
      await deleteImage(imageId);
      setImages(previous => previous.filter(img => img.id !== imageId));
    } catch (err) {
      Alert.alert('Ошибка удаления изображения');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
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
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#788cceff',
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
