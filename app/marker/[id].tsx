import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Alert } from 'react-native';
import ImageList from '../../components/ImageList';
import MarkerList from '../../components/MarkerList';
import { useDatabaseContext } from "../../Context/DatabaseContext";
import { useMarkersContext } from "../../Context/MarkersContext";
import { MarkersData } from "../../types";

export default function MarkerDetails() {
  const { id } = useLocalSearchParams();
  const { getMarkers, deleteMarker, updateMarker } = useDatabaseContext();
  const { updateMarkerInState, deleteMarkerFromState } = useMarkersContext();

  const [marker, setMarker] = useState<MarkersData | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    const load = async () => {
      const markers = await getMarkers();
      const found = markers.find(m => m.id === id);

      if (!found) return;

      setMarker({
        id: found.id,
        title: found.title || '',
        description: found.description || '',
        latitude: found.latitude,
        longitude: found.longitude,
        images: [],
      });

      setTitle(found.title || '');
      setDescription(found.description || '');
    };

    load();
  }, [id]);

  const handleSave = async () => {
    if (!marker) return;

    await updateMarker(marker.id, title, description);
    updateMarkerInState(marker.id, title, description);

    Alert.alert("Сохранено");
    router.back();
  };

  const handleDelete = () => {
    if (!marker) return;

    Alert.alert(
      "Удалить?",
      "",
      [
        { text: "Отмена", style: "cancel" },
        { text: "Удалить", style: "destructive",
          onPress: async () => {
            await deleteMarker(marker.id);
            deleteMarkerFromState(marker.id);
            router.back();
          }
        }
      ]
    );
  };

  if (!marker) {
    return (
      <View style={styles.container}>
        <Text>Маркер не найден</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scroll}>
        <MarkerList
          marker={marker}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
        />

        <ImageList markerId={marker.id} />
      </ScrollView>

      <TouchableOpacity style={styles.save} onPress={handleSave}>
        <Text style={styles.saveText}>Сохранить</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.delete} onPress={handleDelete}>
        <Text style={styles.deleteText}>Удалить маркер</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { padding: 20 },
  save: {
    backgroundColor: '#788cceff',
    padding: 15,
    marginHorizontal: 20,
    marginBottom: 10,
    borderRadius: 5,
  },
  saveText: { color: '#fff', textAlign: 'center' },
  delete: {
    backgroundColor: '#f87f76ff',
    padding: 15,
    margin: 20,
    borderRadius: 5,
  },
  deleteText: { color: '#fff', textAlign: 'center' },
});
