'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

type Center = {
  id: number;
  name: string;
  position: [number, number];
};

type Props = {
  centers: Center[];
};

const CollectionMap = ({ centers }: Props) => {
  return (
    <MapContainer
      center={centers[0].position}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {centers.map(center => (
        <Marker key={center.id} position={center.position}>
          <Popup>{center.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default CollectionMap;
