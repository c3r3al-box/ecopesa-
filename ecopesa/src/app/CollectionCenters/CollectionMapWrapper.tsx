'use client';

import dynamic from 'next/dynamic';
import type { Center } from '@/types'; // or define inline if needed
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;
const CollectionMap = dynamic(() => import('@/components/collection-map'), {
  ssr: false,
});

type Props = {
  centers: Center[];
};

export default function CollectionMapWrapper({ centers }: Props) {
  return (
    <div className="rounded-lg h-64 mb-6 overflow-hidden">
      <CollectionMap centers={centers} />
    </div>
  );
}
