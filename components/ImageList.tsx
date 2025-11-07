import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import uuid from 'react-native-uuid';
import { ImageData, ImageListProps } from '../types';


export default function ImageList({ images, setImages }: ImageListProps) {
  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const newImageId = uuid.v4();
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