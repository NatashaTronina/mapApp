export interface MarkersData {
    id: string;
    title: string;
    description: string;
    coordinate: { 
        latitude: number; 
        longitude: number 
    };
    images: ImageData[]; 
}

export interface ImageData {
    uri: string;
    id: string;
}

export interface MapProps {
    onGoToDetails: (marker: MarkersData) => void;
    markers: MarkersData[]; 
    setMarkers: React.Dispatch<React.SetStateAction<MarkersData[]>>; 
}
   
export interface MarkerModalProps {
    visible: boolean;  
    onClose: () => void;  
    onAddMarker: () => void;  
    newTitle: string;  
    setNewTitle: (value: string) => void;  
    newDescription: string;  
    setNewDescription: (value: string) => void;  
}

export interface ImageListProps {
  images: ImageData[];
  setImages: React.Dispatch<React.SetStateAction<ImageData[]>>;
}

export interface MarkerListProps {
  marker: MarkersData;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
}

interface DatabaseContextType {
  // Операции с базой данных
  addMarker: (latitude: number, longitude: number) => Promise<number>;
  deleteMarker: (id: number) => Promise<void>;
  getMarkers: () => Promise<Marker[]>;
  addImage: (markerId: number, uri: string) => Promise<void>;
  deleteImage: (id: number) => Promise<void>;
  getMarkerImages: (markerId: number) => Promise<MarkerImage[]>;

  // Статусы
  isLoading: boolean;
  error: Error | null;
}