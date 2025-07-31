// components/realtime-tracking-map.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { Job } from '@/types/index';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet
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

interface MapControllerProps {
  currentLocation: { lat: number; lng: number };
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

function MapController({ currentLocation, onLocationUpdate }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([currentLocation.lat, currentLocation.lng], 14);
  }, [currentLocation, map]);

  // Set up location tracking
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          onLocationUpdate(newLocation);
        },
        (error) => console.error('Error tracking location:', error),
        { enableHighAccuracy: true }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [onLocationUpdate]);

  return null;
}

interface RealtimeTrackingMapProps {
  jobs: Job[];
  currentLocation: { lat: number; lng: number } | null;
  onLocationUpdate: (location: { lat: number; lng: number }) => void;
}

export function RealtimeTrackingMap({ 
  jobs, 
  currentLocation, 
  onLocationUpdate 
}: RealtimeTrackingMapProps) {
  const [mapReady, setMapReady] = useState(false);

  useEffect(() => {
    setMapReady(true);
  }, []);

  if (!mapReady || !currentLocation) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Real-time Collection Tracking</h2>
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Real-time Collection Tracking</h2>
      <div className="w-full h-96 rounded-lg">
        <MapContainer
          center={[currentLocation.lat, currentLocation.lng]}
          zoom={14}
          style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* Current location marker */}
          <Marker position={[currentLocation.lat, currentLocation.lng]}>
            <Popup>Your Location</Popup>
          </Marker>
          
          {/* Job markers */}
          {jobs.map((job) => (
            <Marker 
              key={job.id} 
              position={[job.location.lat, job.location.lng]}
              icon={L.icon({
                iconUrl: job.status === 'completed' 
                  ? 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png'
                  : 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
              })}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold">{job.address}</h3>
                  <p>{job.wasteType}</p>
                  <p>{new Date(job.scheduledTime).toLocaleString()}</p>
                  <p>Status: {job.status}</p>
                </div>
              </Popup>
            </Marker>
          ))}
          
          <MapController 
            currentLocation={currentLocation} 
            onLocationUpdate={onLocationUpdate} 
          />
        </MapContainer>
      </div>
      <div className="mt-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <img 
            src="https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" 
            alt="Location icon" 
            className="w-4 h-4 mr-2"
          />
          <span>Your Location</span>
        </div>
        <div className="flex items-center">
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" 
            alt="Pending icon" 
            className="w-4 h-4 mr-2"
          />
          <span>Pending Collection</span>
        </div>
        <div className="flex items-center">
          <img 
            src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" 
            alt="Completed icon" 
            className="w-4 h-4 mr-2"
          />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}