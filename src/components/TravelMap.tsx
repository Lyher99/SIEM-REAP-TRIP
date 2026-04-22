import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Place } from '../types';
import { motion, AnimatePresence } from 'motion/react';

// Fix for default marker icon in Leaflet + React
const createCustomIcon = (category: string) => {
  let color = '#C5A059'; // Gold default
  if (category === 'Temple') color = '#C5A059';
  if (category === 'Hotel') color = '#60A5FA'; // blue-400
  if (category === 'Restaurant' || category === 'Cafe') color = '#FB923C'; // orange-400
  if (category === 'Activity') color = '#22C55E'; // green-500

  return L.divIcon({
    html: `<div style="background-color: ${color}; width: 32px; height: 32px; border-radius: 50%; border: 4px solid white; box-shadow: 0 4px 6px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center;">
             <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
           </div>`,
    className: 'custom-div-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

interface MapProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  selectedPlace: Place | null;
  userLocation: { lat: number; lng: number } | null;
  onNearMe: () => void;
}

// Sub-component to handle map flying
function ChangeView({ center, zoom = 16 }: { center: [number, number], zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.5 });
  }, [center, zoom, map]);
  return null;
}

// Sub-component for custom controls
function MapControls({ onNearMe, userLocation }: { onNearMe: () => void, userLocation: { lat: number, lng: number } | null }) {
  const map = useMap();

  const handleZoomIn = () => map.zoomIn();
  const handleZoomOut = () => map.zoomOut();
  const handleLocate = () => {
    if (userLocation) {
      map.flyTo([userLocation.lat, userLocation.lng], 15, { duration: 1.5 });
    } else {
      onNearMe();
    }
  };

  return (
    <div className="absolute right-6 bottom-6 flex flex-col gap-3 z-[1000] pointer-events-auto">
      <button
        onClick={handleLocate}
        className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center hover:bg-[#F9F7F2] transition-colors border border-border"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D2926" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></svg>
      </button>
      <div className="flex flex-col bg-white rounded-2xl shadow-xl border border-border overflow-hidden">
        <button 
          onClick={handleZoomIn}
          className="w-12 h-12 flex items-center justify-center border-b border-gray-100 font-bold text-lg hover:bg-surface transition-all text-ink"
        >
          +
        </button>
        <button 
          onClick={handleZoomOut}
          className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-surface transition-all text-ink"
        >
          -
        </button>
      </div>
    </div>
  );
}

export const TravelMap: React.FC<MapProps> = ({ places, onSelectPlace, selectedPlace, userLocation, onNearMe }) => {
  const siemReapCenter: [number, number] = [13.3633, 103.8564];

  return (
    <div className="relative w-full h-full bg-[#E5E0D5] overflow-hidden">
      {/* Geometric background pattern mock */}
      <div className="absolute inset-0 opacity-40 pointer-events-none bg-[radial-gradient(#C5A059_1px,transparent_1px)] [background-size:20px_20px]"></div>

      <MapContainer
        center={siemReapCenter}
        zoom={13}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        <MapControls onNearMe={onNearMe} userLocation={userLocation} />

        {places.map((place) => (
          <Marker
            key={place.id}
            position={[place.lat, place.lng]}
            icon={createCustomIcon(place.category)}
            eventHandlers={{
              click: () => onSelectPlace(place),
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-neutral-900 text-sm whitespace-nowrap">{place.name}</h3>
                <p className="text-[10px] text-neutral-600 font-serif italic uppercase tracking-wider">{place.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}

        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={L.divIcon({
              html: `<div class="animate-pulse" style="background-color: #3B82F6; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);"></div>`,
              className: 'user-location-icon',
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            })}
          />
        )}

        {selectedPlace && <ChangeView center={[selectedPlace.lat, selectedPlace.lng]} zoom={16} />}
      </MapContainer>
    </div>
  );
};
