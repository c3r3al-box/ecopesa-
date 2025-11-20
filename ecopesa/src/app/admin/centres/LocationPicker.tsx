'use client';

import { MapContainer, TileLayer } from 'react-leaflet';
import { useState } from 'react';
import DraggableMarker from './DraggableMarker';

export default function LocationPicker({ onSelect }: { onSelect: (coords: { lat: number; lng: number }) => void }) {
  const [center] = useState({ lat: 1.2921, lng: 36.8219 });

  return (
    <MapContainer center={center} zoom={6} style={{ height: '300px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <DraggableMarker onSelect={onSelect} />
    </MapContainer>
  );
}
