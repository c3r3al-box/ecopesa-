'use client';

import { useEffect, useState } from 'react';
import { Job } from '@/types';
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
interface LocalizedDateProps {
  date: string | number | Date;
}

 function LocalizedDate({ date }: LocalizedDateProps) {
  const [formatted, setFormatted] = useState('');

  useEffect(() => {
    setFormatted(new Date(date).toLocaleString());
  }, [date]);

  return <p>{formatted}</p>;
}

function MapController({ currentLocation, onLocationUpdate }: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    map.setView([currentLocation.lat, currentLocation.lng], 14);
  }, [currentLocation, map]);

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
  currentLocation: { lat: number; lng: number };
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

  if (!mapReady) {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <p>Initializing map...</p>
      </div>
    );
  }

 


  return (
    <div className="w-full h-124 rounded-lg mb-6">

      <MapContainer
        center={[currentLocation.lat, currentLocation.lng]}
        zoom={14}
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
      >
        <TileLayer
         url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
         attribution="© OpenStreetMap contributors"
        />       

        
        <Marker position={[currentLocation.lat, currentLocation.lng]}>
          <Popup>Your Location</Popup>
        </Marker>
        
        {jobs.filter(job => job.location?.lat && job.location?.lng).map((job) => (
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
                <LocalizedDate date={job.scheduledTime} />

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
  );
}