import { router } from "expo-router";
import { Alert, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from '../components/Map';
import MarkerModal from '../components/MarkerModal';
import { useState, useCallback } from 'react';
import { useDatabaseContext } from '../Context/DatabaseContext';
import { useMarkersContext } from '../Context/MarkersContext';
import { useFocusEffect } from '@react-navigation/native';

export default function Index() {
  const { addMarker, getMarkers } = useDatabaseContext();
  const { markers, setMarkers, addMarkerToState } = useMarkersContext();
  const [tempCoordinates, setTempCoordinates] = useState<{
  latitude: number;
  longitude: number;
} | null>(null);


  const loadMarkers = useCallback(async () => {
    try {
      const dbMarkers = await getMarkers();
      const adapted = dbMarkers.map(m => ({
        id: m.id,
        title: m.title || '',
        description: m.description || '',
        latitude: m.latitude,
        longitude: m.longitude,
        images: [],
      }));
      setMarkers(adapted);
    } catch {
      Alert.alert("Ошибка загрузки");
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadMarkers();
    }, [loadMarkers])
  );

  const handleAddMarker = async (title: string, description: string) => {
    if (!tempCoordinates) return;

    const id = await addMarker(
      tempCoordinates.latitude,
      tempCoordinates.longitude,
      title,
      description
    );

    addMarkerToState({
      id,
      title,
      description,
      latitude: tempCoordinates.latitude,
      longitude: tempCoordinates.longitude,
      images: [],
    });

    setTempCoordinates(null);
  };

  return (
    <SafeAreaProvider style={styles.container}>
      <Map
        onLongPress={setTempCoordinates}
        onGoToDetails={(m) => router.push(`/marker/${m.id}`)}
        markers={markers}
      />

      <MarkerModal
        visible={!!tempCoordinates}
        onClose={() => setTempCoordinates(null)}
        onAddMarker={handleAddMarker}
      />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
