'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabase/client';
import type { Center } from '@/types';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});


export default function CentreDetailsPage() {
  const { id } = useParams();
  const [center, setCenter] = useState<Center | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCenter = async () => {
      const { data, error } = await supabase
        .from('collection_centres')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching center:', error.message);
      } else {
        setCenter(data);
      }

      setLoading(false);
    };

    if (id) fetchCenter();
  }, [id]);

  if (loading) return <p className="p-6 text-gray-600">Loading center details...</p>;
  if (!center) return <p className="p-6 text-red-600">Center not found.</p>;

  const statusLabel = center.is_full ? 'Full' : 'Open';

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="px-4 py-6 space-y-6">
        <header className="space-y-1">
         <h1 className="text-2xl font-bold text-emerald-800">{center.name}</h1>
          <p className="text-gray-700">{center.address}</p>
          <p className="text-sm text-gray-500">Hours: {center.hours}</p>
          <p className="text-sm text-gray-500">Created: {new Date(center.created_at).toLocaleString()}</p>
        </header>

        <div className="flex justify-between items-center text-sm text-gray-600 border-t pt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
            center.is_full ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'
          }`}>
            {statusLabel}
          </span>
          <p className="text-gray-600 text-sm">
            Load: {center.current_load} / {center.capacity}
          </p>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">Location</h2>
          <div className="w-full h-72 rounded border border-emerald-200 overflow-hidden">
            <div className="w-full h-72 rounded-lg border border-emerald-200 overflow-hidden">
  <MapContainer
    center={[
      center.location.coordinates[1], // latitude
      center.location.coordinates[0], // longitude
    ]}
    zoom={14}
    style={{ height: '100%', width: '100%' }}
  >
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[
      center.location.coordinates[1],
      center.location.coordinates[0],
    ]}>
      <Popup>
        {center.name}<br />{center.address}
      </Popup>
    </Marker>
  </MapContainer>
</div>

          
          </div>
        </div>
      </div>
    </div>
  );
}
