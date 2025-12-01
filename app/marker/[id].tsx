import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import ImageList from '../../components/ImageList';
import MarkerList from '../../components/MarkerList';
import { useDatabase } from '../../Context/DatabaseContext';
import { MarkersData } from '../../types';

export default function MarkerDetails() {
  const { id } = useLocalSearchParams();
  if (!id || Array.isArray(id)) {
    return <View><Text>Неверный ID маркера</Text></View>;
  }

  const { getMarkers, deleteMarker } = useDatabase();
  const [marker, setMarker] = useState<MarkersData | null>(null);

  useEffect(() => {
    const loadMarker = async () => {
      try {
        const markers = await getMarkers();
        const foundMarker = markers.find(m => m.id === id as string);
        if (foundMarker) {
          setMarker({
            id: foundMarker.id,
            title: foundMarker.title || '',
            description: foundMarker.description || '',
            latitude: foundMarker.latitude,
            longitude: foundMarker.longitude,
            images: [], 
          });
        }
      } catch (err) {
        Alert.alert('Ошибка загрузки маркера');
      }
    };
    loadMarker();
  }, [id, getMarkers]);

  const handleDelete = async () => {
    if (!marker) return;
    Alert.alert(
      'Удалить маркер?',
      'Это действие нельзя отменить.',
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Удалить',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteMarker(marker.id);
              Alert.alert('Маркер удален');
              router.back();  // Возврат на карту
            } catch (err) {
              Alert.alert('Ошибка удаления');
            }
          },
        },
      ]
    );
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
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <MarkerList marker={marker} />
        <ImageList markerId={marker.id} />
      </ScrollView>
      <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
        <Text style={styles.deleteText}>Удалить маркер</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 20,
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
});