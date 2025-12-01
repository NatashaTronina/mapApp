export interface Marker { 
  id: string;
  latitude: number;
  longitude: number;
  title?: string;
  description?: string;
  created_at: string;
}

export interface MarkerImage { 
  id: string;
  marker_id: string;
  uri: string;
  created_at: string;
}

export interface MarkersData { 
  id: string;
  title: string;
  description: string;
  latitude: number;
  longitude: number;
  images: ImageData[];
}

export interface ImageData {
  uri: string;
  id: string;
}

export interface MapProps {
  onGoToDetails: (marker: MarkersData) => void;
}

export interface MarkerListProps {
  marker: MarkersData;
}