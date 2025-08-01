'use client';

import { useState, useEffect } from 'react';
import { CollectionSchedule } from '@/components/collector components/collection-schedule';
import { RealtimeTrackingMap } from '@/components/collector components/realtime-tracking-map';
import { JobVerification } from '@/components/collector components/job-verification';
import { InformalPickerIntegration } from '@/components/collector components/informal-picker-intergration';
import { PickupRequestList } from '@/components/collector components/pickup-request-list';
import { DashboardHeader } from '@/components/dashboard-header';
import { useUser } from '@supabase/auth-helpers-react';

type Tab = 'schedule' | 'requests' | 'tracking' | 'integration';

export default function CollectorDashboard() {
  const user = useUser();
  const userId = user?.id;

  const [activeTab, setActiveTab] = useState<Tab>('schedule');
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [pickupRequests, setPickupRequests] = useState<any[]>([]);
  const [assignedJobs, setAssignedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 1️⃣ Fetch live data from our API
  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/collector');
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Fetch failed');
        setPickupRequests(json.pickupRequests);
        setAssignedJobs(json.assignedJobs);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [userId]);

  // 2️⃣ Get browser location
  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      pos => setCurrentLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      err => console.error('Location error', err)
    );
  }, []);

  if (loading) return <p>Loading dashboard…</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  const handleJobVerification = async (jobId: string, verificationData: any) => {
  await fetch('/api/jobs/verify-completion', {
    method: 'POST',
    body: JSON.stringify({ jobId, ...verificationData }),
    headers: { 'Content-Type': 'application/json' }
  });
};


  const handleInformalPickerAssignment = (pickerId: string, jobId: number) => {
    // e.g. POST /api/assigned-jobs/assign-picker
  };

  const handleAcceptRequest = (requestId: number) => {
    // e.g. POST /api/pickup-requests/accept
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader title="Collection Dashboard" userType="collector" />

      <div className="flex mb-6 border-b">
        {(['schedule','requests','tracking','integration'] as Tab[]).map(tab => (
          <button
            key={tab}
            className={`py-2 px-4 font-medium ${
              activeTab === tab
                ? 'border-b-2 border-green-500 text-green-600'
                : 'text-gray-500'
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'schedule'
              ? 'Schedule'
              : tab === 'requests'
              ? 'Pickup Requests'
              : tab === 'tracking'
              ? 'Real-time Tracking'
              : 'Picker Integration'}
          </button>
        ))}
      </div>

      {activeTab === 'schedule' && (
        <div className="grid grid-cols-1 gap-6">
          <CollectionSchedule jobs={assignedJobs} currentLocation={currentLocation} />
          <JobVerification
            jobs={assignedJobs.filter(job => job.status === 'assigned')}
            onVerify={handleJobVerification}
          />
        </div>
      )}

      {activeTab === 'requests' && (
        <PickupRequestList
          requests={pickupRequests}
          currentLocation={currentLocation}
          onAcceptRequest={handleAcceptRequest}
        />
      )}

      {activeTab === 'tracking' && (
        <RealtimeTrackingMap
          jobs={assignedJobs}
          currentLocation={currentLocation}
          onLocationUpdate={loc => setCurrentLocation(loc)}
        />
      )}

      {activeTab === 'integration' && (
        <InformalPickerIntegration
          jobs={assignedJobs.filter(job => job.status === 'assigned')}
          onAssignToPicker={handleInformalPickerAssignment}
        />
      )}
    </div>
  );
}
