export interface Place {
  id: string;
  name: string;
  category: 'Temple' | 'Hotel' | 'Restaurant' | 'Cafe' | 'Activity';
  description: string;
  lat: number;
  lng: number;
  image: string;
  gallery?: string[];
  rating: number;
  priceRange?: string;
  openHours?: string;
  address?: string;
  userId?: string;
  bookingUrl?: string;
  visitDuration?: number; // Estimated hours for suggestions
}

export type AppTab = 'explore' | 'saved' | 'suggestions';

export interface AppState {
  places: Place[];
  selectedPlace: Place | null;
  userLocation: { lat: number; lng: number } | null;
  filter: string;
  searchQuery: string;
  loading: boolean;
  fullViewPlace: Place | null;
  savedPlaceIds: string[];
  activeTab: AppTab;
}
