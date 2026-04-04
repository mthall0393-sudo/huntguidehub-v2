import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-defaulticon-compatibility'; // Import the default icon fix

interface OutfitterMapProps {
  lat: number;
  lng: number;
  name: string;
}

const OutfitterMap: React.FC<OutfitterMapProps> = ({ lat, lng, name }) => {
  // Custom icon for markers
  const customIcon = L.icon({
    iconUrl: '/marker-icon.png', // Assuming you have a marker icon in your public folder
    shadowUrl: '/marker-shadow.png', // Assuming you have a shadow icon
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={13}
      className="h-64 w-full rounded-lg shadow-md"
      // You might need to set `preferCanvas={true}` depending on performance needs
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat, lng]} icon={customIcon}>
        <Popup>
          <span className="font-bold text-bark">{name}</span><br />Your Outfitter Location.
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default OutfitterMap;
