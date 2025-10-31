import { router } from "expo-router";
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from '../components/Map';
import { useMarkers } from '../components/MarkerContext';
import { MarkersData } from '../types';

export default function Index() {
  const { markers, setMarkers } = useMarkers();

  const handleGoToDetails = (marker: MarkersData) => {
    try {
      router.push({
        pathname: '/marker/[id]',
        params: { id: marker.id }
      });
    } catch (error) {
      Alert.alert('Не удалось перейти к деталям маркера. Попробуйте снова.');
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <View style={styles.container}>
        <Map 
          onGoToDetails={handleGoToDetails} 
          markers={markers}
          setMarkers={setMarkers}
        />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});