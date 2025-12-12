import { Stack } from "expo-router";
import { DatabaseProvider } from '../Context/DatabaseContext';
import { MarkersProvider } from '../Context/MarkersContext';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <MarkersProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerTitle: "Карта", headerStyle: {backgroundColor: "#f4ebebff"}}} />
          <Stack.Screen name="marker/[id]" options={{ headerTitle: "Детали маркера", headerStyle: {backgroundColor: "#f4ebebff"}}} />
        </Stack>
      </MarkersProvider>
    </DatabaseProvider>
  );
}
