import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import { StyleSheet, Alert } from 'react-native'; 
import { MarkersData, MapProps } from '../types';
import uuid from 'react-native-uuid';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import MarkerModal from './MarkerModal';  

export default function Map({ onGoToDetails, markers, setMarkers }: MapProps) {  
  const [modalVisible, setModalVisible] = useState(false); 
  const [tempCoordinates, setTempCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

  const handleMapLongPress = (e: any) => {
    if (e.nativeEvent && e.nativeEvent.coordinate) {
      const coordinate = {
        latitude: e.nativeEvent.coordinate.latitude,
        longitude: e.nativeEvent.coordinate.longitude
      };
      
      setTempCoordinates(coordinate); 
      setModalVisible(true);          
      
    } else {
      Alert.alert("Не удалось получить координаты для добавления маркера.");
    }
  };

  const handleAddMarker = () => {
    if (!tempCoordinates) {
      Alert.alert("Координаты не определены.");
      return;
    }
    // if (newTitle.trim() === '') {
    //     Alert.alert("Пожалуйста, введите название маркера.");
    //     return;
    // }

    const newId = uuid.v4(); 
    const newMarker: MarkersData = {
      id: newId,
      title: newTitle.trim(), 
      description: newDescription.trim(), 
      coordinate: tempCoordinates,
      images: [], 
    };

    setMarkers(prevMarkers => [...prevMarkers, newMarker]); 

    setModalVisible(false);
    setTempCoordinates(null);
    setNewTitle('');
    setNewDescription('');
  };

  return (
    <SafeAreaProvider style={{flex: 1}}> 
      <SafeAreaView style={styles.container}> 
        
        <MarkerModal  
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onAddMarker={handleAddMarker}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
          newDescription={newDescription}
          setNewDescription={setNewDescription}
        />

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
        >
          {markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              description={marker.description}
              pinColor="#788cceff" 
              onPress={() => onGoToDetails(marker)} 
            />
          ))}
        </MapView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});