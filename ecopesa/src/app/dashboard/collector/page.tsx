'use client';

import { useUser } from '@supabase/auth-helpers-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { CollectionSchedule } from '@/components/collector components/collection-schedule';
import { PickupRequestList } from '@/components/collector components/pickup-request-list';
import { RealtimeTrackingMap } from '@/components/collector components/realtime-tracking-map';
import { Job } from '@/types';

export default function CollectorDashboard() {
  const user = useUser();
  const [assignedJobs, setAssignedJobs] = useState<Job[]>([]);
  const [pendingJobs, setPendingJobs] = useState<Job[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (!user) return;

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

  if (!user) return <p>Loading user…</p>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-6">
      <h1 className="text-2xl font-bold">Hello, {user.email}</h1>

      {currentLocation ? (
        <>
          <RealtimeTrackingMap
            jobs={assignedJobs}
            currentLocation={currentLocation}
            onLocationUpdate={handleLocationUpdate}
          />

          <PickupRequestList
            requests={pendingJobs}
            currentLocation={currentLocation}
          />

          <CollectionSchedule
            jobs={assignedJobs}
            currentLocation={currentLocation}
          />
        </>
      ) : (
        <p>Getting your location…</p>
      )}
    </div>
  );
}
