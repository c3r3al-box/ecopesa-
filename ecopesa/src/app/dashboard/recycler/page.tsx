'use client';

import { useState, useEffect, use } from 'react';
import { supabase } from '@/utils/supabase-browser';
import { RealtimeTrackingMap } from '@/components/collector components/realtime-tracking-map';
import { DashboardHeader } from '@/components/dashboard-header';
import { Job } from '@/types';
import { useUser } from '@supabase/auth-helpers-react';


export default function RecyclerDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number }>({
    lat: -1.0,
    lng: 36.0,
  });

  const user = useUser();

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);

      if (!user?.id) {
        console.error('User not authenticated or missing ID');
        setLoading(false);
        return;
      }

     const { data: jobsData, error: jobsError } = await supabase
       .from('jobs')
       .select('id, address, scheduled_time, waste_type, description, status, assigned_to, picker_id, geo_location, weight_verified, created_by');
     
     if (jobsError) {
       console.error('Error fetching jobs:', jobsError.message);
     } else {
       const normalizedJobs: Job[] = jobsData.map((job: any) => ({
         id: job.id,
         address: job.address,
         scheduledTime: job.scheduled_time,
         wasteType: job.waste_type,
         description: job.description,
         status: job.status,
         assigned_to: job.assigned_to,
         picker_id: job.picker_id,
         location: job.geo_location, // assuming geo_location is already { lat, lng }
         weight_verified: job.weight_verified,
         created_by: job.created_by,
       }));
     
       setJobs(normalizedJobs);
   }


      setLoading(false);
    };

    fetchJobs();
  }, [user]);

  

  const markComplete = async (jobId: string) => {
    const { error } = await supabase
      .from('jobs')
      .update({ status: 'completed' })
      .eq('id', jobId);

    if (!error) {
      setJobs(prev =>
        prev.map(job =>
          job.id === jobId ? { ...job, status: 'completed' } : job
        )
      );
    }
  };

  return (
    <div className="p-6 bg-white shadow rounded">
  <DashboardHeader title="Recycler Dashboard" userType="recycler" />
  <h1 className="text-2xl font-bold mb-4">Hello, {user ? user.email : 'Guest'}</h1>

  {/* 🗺️ Compact Map */}
  <div className="mb-6">
    <h2 className="text-lg font-semibold mb-2">Your Location & Job Map</h2>
    <div className="rounded-lg overflow-hidden border shadow-sm h-64">
      <RealtimeTrackingMap
        jobs={jobs}
        currentLocation={currentLocation}
        onLocationUpdate={setCurrentLocation}
      />
    </div>
  </div>

  {/* 📋 Assigned Jobs */}
  <div>
    <h2 className="text-lg font-semibold mb-4">Assigned Jobs</h2>
    {loading ? (
      <p>Loading jobs...</p>
    ) : jobs.length === 0 ? (
      <p>No assigned jobs for you right now.</p>
    ) : (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map(job => (
          <div key={job.id} className="border p-4 rounded-lg shadow-sm bg-gray-50">
            <p><strong>📍 Address:</strong> {job.address}</p>
            <p><strong>🕒 Scheduled:</strong> {new Date(job.scheduledTime).toLocaleString()}</p>
            <p><strong>♻️ Waste Type:</strong> {job.wasteType}</p>
            {job.description && <p><strong>📝 Description:</strong> {job.description}</p>}
            <p><strong>Status:</strong> {job.status}</p>

            <button
              onClick={() => markComplete(job.id)}
              disabled={job.status === 'completed'}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
            >
              {job.status === 'completed' ? '✅ Completed' : 'Mark as Complete'}
            </button>
          </div>
        ))}
      </div>
    )}
  </div>
</div>

  );
}
