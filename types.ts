export interface MarkersData {
    id: string;
    title: string;
    description: string;
    coordinate: { 
        latitude: number; 
        longitude: number };
    // images: ImageData[];
}

export interface ImageData {
    uri: string;
    id: string;
}

export interface MapProps {
  onGoToDetails: () => void;
  markers: MarkersData[]; 
  setMarkers: (markers: MarkersData[]) => void;
}