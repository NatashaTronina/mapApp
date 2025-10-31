import React, { useState } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';
import { StyleSheet, View, Alert, Text, TextInput, TouchableOpacity, Modal } from 'react-native';
import { MarkersData, MapProps } from '../types';
import uuid from 'react-native-uuid';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'; 

export default function Map({ onGoToDetails, markers, setMarkers }: MapProps) {  
  const [modalVisible, setModalVisible] = useState(false); 
  const [tempCoordinates, setTempCoordinates] = useState<{ latitude: number; longitude: number } | null>(null);
  
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');

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

  const ModalContent = (
    <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
    >
        <View style={styles.modalOverlay}>
            <View style={styles.modalView}>
                
                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                    <Text style={styles.closeButtonText}>✘</Text>
                </TouchableOpacity>

                <TextInput
                    placeholder="Название"
                    value={newTitle}
                    onChangeText={setNewTitle}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Описание"
                    value={newDescription}
                    onChangeText={setNewDescription}
                    style={styles.input}
                />
                
                <TouchableOpacity onPress={handleAddMarker} style={styles.addButtonContainer}>
                    <Text style={styles.textButton}>Добавить маркер</Text>
                </TouchableOpacity>

            </View>
        </View>
    </Modal>
  );

  return (
    <SafeAreaProvider style={{flex: 1}}> 
      <SafeAreaView style={styles.container}> 
        
        {ModalContent}

        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation
          showsMyLocationButton
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
              >
              </Marker>
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
  
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0, 0, 0, 0.5)' 
  },
  modalView: { 
    width: "85%", 
    padding: 25, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#f4ebebff', 
    borderRadius: 15, 
    position: 'relative', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    paddingTop: 60, 
  },
  input: { 
    borderRadius: 8, 
    height: 55, 
    borderColor: '#ccc', 
    borderWidth: 1, 
    marginBottom: 15, 
    width: '100%', 
    paddingHorizontal: 15, 
    backgroundColor: '#ffffffff',
    fontSize: 16,
  },
  textButton: { 
    color: "#fff",
    fontSize: 18, 
    fontWeight: 'bold',
    textAlign: "center" 
  },
  addButtonContainer: { 
    backgroundColor: '#788cceff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 15,
    width: '100%',
  },
  closeButton: { 
    position: 'absolute', 
    top: 15, 
    right: 15, 
    zIndex: 10, 
  },
  closeButtonText: { 
    fontSize: 35, 
    color: '#788cceff'
  },
});