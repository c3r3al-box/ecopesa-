'use client';

import { Marker, useMapEvents } from 'react-leaflet';
import { useState } from 'react';

export default function DraggableMarker({ onSelect }: { onSelect: (coords: { lat: number; lng: number }) => void }) {
  const [position, setPosition] = useState({ lat: 1.2921, lng: 36.8219 });

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onSelect(e.latlng);
    },
  });

  return <Marker position={position} />;
}
