import { router } from "expo-router";
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Map from '../components/Map';
import MarkerModal from '../components/MarkerModal';
import { MarkersData } from '../types';
import { useState, useCallback } from 'react';
import { useDatabaseContext } from '../Context/DatabaseContext';
import { useFocusEffect } from '@react-navigation/native';

export default function Index() {
  const { addMarker, getMarkers } = useDatabaseContext();
  const [tempCoordinates, setTempCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  const [markers, setMarkers] = useState<MarkersData[]>([]);

  const loadMarkers = useCallback(async () => {
    try {
      const dbMarkers = await getMarkers();
      const adaptedMarkers: MarkersData[] = dbMarkers.map(m => ({
        id: m.id,
        title: m.title || '',
        description: m.description || '',
        latitude: m.latitude,
        longitude: m.longitude,
        images: [],
      }));
      setMarkers(adaptedMarkers);
      console.log('Markers reloaded on focus:', adaptedMarkers.length);
      console.log('Marker IDs:', adaptedMarkers.map(m => m.id));
    } catch (err) {
      Alert.alert('Ошибка загрузки маркеров');
    }
  }, [getMarkers]);

  useFocusEffect(
    useCallback(() => {
      loadMarkers();
    }, [loadMarkers])
  );

  const onGoToDetails = useCallback((marker: MarkersData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: { id: marker.id }
      });
    } catch (error) {
      Alert.alert('Не удалось перейти к деталям маркера. Попробуйте снова.');
    }
  }, []);

  const handleMapLongPress = useCallback((coordinates: { latitude: number; longitude: number }) => {
    setTempCoordinates(coordinates);
  }, []);

  const handleAddMarker = useCallback(async (title: string, description: string) => {
    if (!tempCoordinates) {
      Alert.alert("Координаты не определены");
      return;
    }
    if (title.trim() === '') {
      Alert.alert("Введите название маркера!");
      return;
    }

    try {
      const id = await addMarker(tempCoordinates.latitude, tempCoordinates.longitude, title.trim(), description.trim());
      const newMarker: MarkersData = {
        id,
        title: title.trim(), 
        description: description.trim(), 
        latitude: tempCoordinates.latitude,
        longitude: tempCoordinates.longitude,
        images: [], 
      };
      setMarkers(previous => [...previous, newMarker]);
      setTempCoordinates(null);
    } catch (err) {
      Alert.alert('Ошибка добавления маркера');
    }
  }, [tempCoordinates, addMarker]);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.container}>
        <Map onGoToDetails={onGoToDetails} onLongPress={handleMapLongPress} markers={markers} setMarkers={setMarkers} />
        <MarkerModal  
          visible={!!tempCoordinates}
          onClose={() => setTempCoordinates(null)}
          onAddMarker={handleAddMarker}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
