'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
  const router = useRouter();
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
        <p className="ml-3 text-gray-600">Loading center details...</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="bg-red-100 text-red-700 px-4 py-2 rounded shadow">
          Center not found.
        </div>
      </div>
    );
  }

  const statusLabel = center.is_full ? 'Full' : 'Open';
  const loadPercent = (center.current_load / center.capacity) * 100;

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <div className="px-4 py-6 space-y-6 max-w-3xl mx-auto">
        {/* Back button */}
        <button
          onClick={() => router.push('/CollectionCenters')}
          className="text-sm text-emerald-700 hover:text-emerald-900 mb-4"
        >
          ← Back to Centres
        </button>

        {/* Header */}
        <header className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-emerald-800">{center.name}</h1>
            <span
              className={`px-3 py-1 rounded-full text-xs font-semibold ${
                center.is_full
                  ? 'bg-red-100 text-red-700'
                  : 'bg-emerald-100 text-emerald-700'
              }`}
            >
              {statusLabel}
            </span>
          </div>
          <p className="flex items-center text-gray-700 text-sm">
            <svg
              className="w-4 h-4 mr-1 text-emerald-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 20s6-5.686 6-10A6 6 0 0 0 4 10c0 4.314 6 10 6 10zM10 11a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </svg>
            {center.address}
          </p>
        </header>

        {/* Load / Capacity */}
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-1">
            Load: {center.current_load} / {center.capacity}
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                center.is_full ? 'bg-red-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${loadPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Map */}
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-emerald-700 mb-2">Location</h2>
          <div className="rounded-lg border border-emerald-200 shadow overflow-hidden">
            <MapContainer
              center={[
                center.location.coordinates[1], // latitude
                center.location.coordinates[0], // longitude
              ]}
              zoom={14}
              style={{ height: '300px', width: '100%' }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker
                position={[
                  center.location.coordinates[1],
                  center.location.coordinates[0],
                ]}
              >
                <Popup>
                  <strong>{center.name}</strong>
                  <br />
                  {center.address}
                </Popup>
              </Marker>
            </MapContainer>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Lat: {center.location.coordinates[1]}, Lng: {center.location.coordinates[0]}
          </p>
        </div>
      </div>
    </div>
  );
}
