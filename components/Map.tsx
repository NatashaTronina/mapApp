import React, { useEffect } from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { StyleSheet, Alert, ActivityIndicator, View, Text } from 'react-native'; 
import { MarkersData, MapProps } from '../types';
import { useDatabaseContext } from '../Context/DatabaseContext';

interface ExtendedMapProps extends MapProps {
  onLongPress: (coordinates: { latitude: number; longitude: number }) => void;
  markers: MarkersData[];
  setMarkers: React.Dispatch<React.SetStateAction<MarkersData[]>>;
}

export default function Map({ onGoToDetails, onLongPress, markers, setMarkers }: ExtendedMapProps) { 
  const { getMarkers, isLoading, error } = useDatabaseContext();

  const loadMarkers = async () => {
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
      console.log('Markers reloaded in Map on focus:', adaptedMarkers.length);
      console.log('Marker IDs in Map:', adaptedMarkers.map(m => m.id));
    } catch (err) {
      Alert.alert('Ошибка загрузки маркеров');
    }
  };

  useEffect(() => {
    loadMarkers();
  }, [getMarkers, setMarkers]);

  useEffect(() => {
    if (error) {
      Alert.alert('Ошибка', error.message);
    }
  }, [error]);

  const handleMapLongPress = (e: any) => {
    if (e.nativeEvent && e.nativeEvent.coordinate) {
      const coordinate = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      };
      onLongPress(coordinate);
    } else {
      Alert.alert("Не удалось получить координаты для добавления маркера");
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
        <Text>Загрузка карты...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Ошибка загрузки карты: {error.message}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsMyLocationButton={true}
        initialRegion={{
          latitude: 58.007438,
          longitude: 56.224394,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055
        }}
        onLongPress={handleMapLongPress}
        key={markers.length}
      >
        {markers.map((marker) => {
          console.log('Rendering marker:', marker.id, marker.title);
          return (
            <Marker
              key={`${marker.id}-${Date.now()}`}
              coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
              title={marker.title}
              description={marker.description}
              pinColor="#788cceff"
              onPress={() => onGoToDetails(marker)}
            />
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});