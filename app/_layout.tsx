import { Stack } from "expo-router";
import { DatabaseProvider } from '../Context/DatabaseContext';
import { MarkersProvider } from '../Context/MarkersContext';

export default function RootLayout() {
  return (
    <DatabaseProvider>
      <MarkersProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerTitle: "Карта" }} />
          <Stack.Screen name="marker/[id]" options={{ headerTitle: "Детали маркера" }} />
        </Stack>
      </MarkersProvider>
    </DatabaseProvider>
  );
}
