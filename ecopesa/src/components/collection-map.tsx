'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Center } from '@/types'; // or define inline if needed

type Props = {
  centers: Center[];
};

const CollectionMap = ({ centers }: Props) => {
  return (
    <MapContainer
      center={[
        centers[0].location.coordinates[1], // latitude
        centers[0].location.coordinates[0], // longitude
      ]}
      zoom={12}
      style={{ height: '100%', width: '100%' }}
   >    

      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap contributors"
      />
      {centers.map(center => (
        <Marker
  key={center.id}
  position={[
    center.location.coordinates[1], // latitude
    center.location.coordinates[0], // longitude
  ]}
>
  <Popup>{center.name}</Popup>
</Marker>

      ))}
    </MapContainer>
  );
};

export default CollectionMap;
