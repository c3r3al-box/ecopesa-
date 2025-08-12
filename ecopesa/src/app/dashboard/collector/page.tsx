'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { CollectionSchedule } from '@/components/collector components/collection-schedule';
import { PickupRequestList } from '@/components/collector components/pickup-request-list';
import { Job } from '@/types';

import dynamic from 'next/dynamic';
const RealtimeTrackingMap = dynamic(
  () => import('@/components/collector components/realtime-tracking-map').then(mod => mod.RealtimeTrackingMap),
  { 
    ssr: false,
    loading: () => (
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Real-time Collection Tracking</h2>
        <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
          <p>Loading map...</p>
        </div>
      </div>
    )
  }
);

export default function CollectorDashboard() {
  const user = useUser();
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Could not get your location. Please enable location services.');
          // Set a default location if needed
          // setCurrentLocation({ lat: 0, lng: 0 });
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser.');
    }

    const fetchAssignedJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('assigned_to', user.id)
        .eq('status', 'assigned');

      if (error) {
        console.error('Error fetching assigned jobs:', error.message);
      } else {
        setAssignedJobs(data as Job[]);
      }
    };

    const fetchPendingJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .is('assigned_to', null)
        .eq('status', 'pending');

      if (error) {
        console.error('Error fetching pending jobs:', error.message);
      } else {
        setPendingJobs(data as Job[]);
      }
    };

    fetchAssignedJobs();
    fetchPendingJobs();
  }, [user]);

  const handleLocationUpdate = (location: { lat: number; lng: number }) => {
    setCurrentLocation(location);
  };

  if (!user) return <p>Loading user...</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <h1 className="text-2xl font-bold">Hello, {user.email}</h1>

      {locationError ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {locationError}
        </div>
      ) : !currentLocation ? (
        <p>Getting your location...</p>
      ) : (
        <>
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Real-time Collection Tracking</h2>
            <RealtimeTrackingMap
              jobs={assignedJobs}
              currentLocation={currentLocation}
              onLocationUpdate={handleLocationUpdate}
            />
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

          <PickupRequestList
            requests={pendingJobs}
            currentLocation={currentLocation}
          />

          <CollectionSchedule
            jobs={assignedJobs}
            currentLocation={currentLocation}
          />
        </>
      )}
    </div>
  );
}