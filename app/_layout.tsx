import { Stack } from "expo-router";
import { MarkersProvider } from "../components/MarkerContext";
import { Alert } from 'react-native';

export default function RootLayout() {
  try {
    return (
      <MarkersProvider>
        <Stack>
          <Stack.Screen name="index" options={{
            headerTitle: "Карта",
            headerStyle: {
              backgroundColor: "#f4ebebff"
            }
          }}/>
          <Stack.Screen name="marker/[id]" options={{
            headerTitle: "Детали маркера",
            headerStyle: {
              backgroundColor: "#f4ebebff"
            }
          }}/>
        </Stack>
      </MarkersProvider>
    );
  } catch (error) {
    Alert.alert('Не удалось загрузить приложение. Перезапустите его.');
    return null; 
  }
}