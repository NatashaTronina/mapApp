import React from 'react';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { View, StyleSheet } from 'react-native';
import { MarkersData } from '../types';

export default function Map({ onGoToDetails, onLongPress, markers }: {
  onGoToDetails: (m: MarkersData) => void;
  onLongPress: (coordinate: { latitude: number; longitude: number }) => void;
  markers: MarkersData[];
}) {
  return (
    <View style={styles.container}>
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        showsMyLocationButton
        showsUserLocation
        onLongPress={(e) => onLongPress(e.nativeEvent.coordinate)}
        initialRegion={{
          latitude: 58.007438,
          longitude: 56.224394,
          latitudeDelta: 0.055,
          longitudeDelta: 0.055
        }}
      >
        {markers.map((m) => (
          <Marker
            key={m.id}
            coordinate={{ latitude: m.latitude, longitude: m.longitude }}
            title={m.title}
            description={m.description}
            pinColor="#788cceff"
            onPress={() => onGoToDetails(m)}
          />
        ))}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});
