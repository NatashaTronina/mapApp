import React, { useState } from 'react';
import { View, StyleSheet, } from 'react-native';
import Map from '../components/Map';
import MarkerDetails from '../components/MarkerDetails'; 
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { MarkersData } from '../types'; 

export default function Index() {
  const [currentView, setCurrentView] = useState<'map' | 'details'>('map');
  const [markers, setMarkers] = useState<MarkersData[]>([]);

  const handleGoToDetails = () => {
    setCurrentView('details');
  };

  const handleGoBackToMap = () => {
    setCurrentView('map');
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      {currentView === 'map' ? (
        <View style={styles.container}>
          <Map 
            onGoToDetails={handleGoToDetails} 
            markers={markers}
            setMarkers={setMarkers}
          />
        </View>
      ) : (
        <View style={styles.container}>
          <MarkerDetails onBack={handleGoBackToMap} /> 
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});