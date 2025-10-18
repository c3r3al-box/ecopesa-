'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { CollectionSchedule } from '@/components/collector components/collection-schedule';
import { PickupRequestList } from '@/components/collector components/pickup-request-list';
import { Job } from '@/types';
import { JobVerification } from '@/components/collector components/job-verification';
import { DashboardHeader } from '@/components/dashboard-header';
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
    
    <div className="min-h-screen bg-emerald-50 py-6 px-4 sm:px-6 lg:px-8 space-y-8">
  <DashboardHeader title="Collector Dashboard" userType="collector" />

  <section className="space-y-2">
    <h1 className="text-2xl font-bold text-emerald-800">Welcome, {user.email}</h1>
    {locationError && (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        {locationError}
      </div>
    )}
    {!currentLocation && !locationError && (
      <p className="text-gray-600">Getting your location...</p>
    )}
  </section>

  {currentLocation && (
    <section className="bg-white rounded-xl shadow-md p-6 space-y-4">
      <h2 className="text-xl font-semibold text-emerald-700">📍 Real-time Collection Tracking</h2>
      <div className="h-64 rounded-lg overflow-hidden border border-emerald-200">
        <RealtimeTrackingMap
          jobs={assignedJobs}
          currentLocation={currentLocation}
          onLocationUpdate={handleLocationUpdate}
        />
      </div>
      <div className="flex gap-6 text-sm text-gray-700 mt-2">
        <div className="flex items-center gap-2">
          <img src="https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png" className="w-4 h-4" />
          <span>Your Location</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" className="w-4 h-4" />
          <span>Pending Collection</span>
        </div>
        <div className="flex items-center gap-2">
          <img src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" className="w-4 h-4" />
          <span>Completed</span>
        </div>
      </div>
    </section>
  )}

  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-emerald-700">📦 Pending Pickup Requests</h2>
    <PickupRequestList requests={pendingJobs} currentLocation={currentLocation} />
  </section>

  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-emerald-700">🗓️ My Collection Schedule</h2>
    {currentLocation && (
      <CollectionSchedule jobs={assignedJobs} currentLocation={currentLocation} />
    )}
    {!currentLocation && (
      <p className="text-gray-600">Getting your location for schedule...</p>
    )}
  </section>

  <section className="space-y-4">
    <h2 className="text-xl font-semibold text-emerald-700">✅ Job Verification</h2>
    <JobVerification
      jobs={assignedJobs}
      currentLocation={currentLocation}
      onVerify={(jobId: string) => {
        console.log(`Job ${jobId} verified`);
      }}
    />
  </section>
</div>

  );
}