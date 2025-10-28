import React, { useState } from 'react';
import { Button, Image, View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ArrowBackIcon = require('../assets/icons/arrow-back.png'); 

interface MarkerDetailsProps {
    onBack: () => void;
}

export default function MarkerDetails({ onBack }: MarkerDetailsProps) {
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Детали Маркера</Text>
      <TouchableOpacity onPress={pickImage} style={styles.button}>
        <Text style={styles.buttonText}>Выбрать изображение</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      
      <TouchableOpacity onPress={onBack} style={styles.backButtonContainer}>
        <Image source={ArrowBackIcon} style={styles.arrowIcon} /> 
      </TouchableOpacity>
  </View>
  );
}

const styles = StyleSheet.create({
  container: {
    
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginTop: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  backButtonContainer: {
    marginTop: 30,
    alignItems: 'center', 
    flexDirection: 'row', 
  },
  arrowIcon: {
    width: 50, 
    height: 50,
    marginRight: 10, 
  },
  button: {
    backgroundColor: '#8ab2ddff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
  },

});