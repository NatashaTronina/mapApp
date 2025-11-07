import { router } from "expo-router";
import { Alert, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Map from '../components/Map';
import { useMarkersContext } from '../Context/MarkersContext';
import { MarkersData } from '../types';

export default function Index() {
  const { markers, setMarkers } = useMarkersContext();

  const onGoToDetails = (marker: MarkersData) => {
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
          onGoToDetails={onGoToDetails} 
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