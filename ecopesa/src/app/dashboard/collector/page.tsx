// app/dashboard/collector/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { CollectionSchedule } from '@/components/collector components/collection-schedule';
import { RealtimeTrackingMap } from '@/components/collector components/realtime-tracking-map';
import { JobVerification } from '@/components/collector components/job-verification';
import { InformalPickerIntegration } from '@/components/collector components/informal-picker-intergration';
import { PickupRequestList } from '@/components/collector components/pickup-request-list';
import { DashboardHeader } from '@/components/dashboard-header';
imp
export default function CollectorDashboard() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [pickupRequests, setPickupRequests] = useState([]);
  const [assignedJobs, setAssignedJobs] = useState([]);

  // Load current location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  }, []);

  // Fetch pickup requests (mock implementation)
  useEffect(() => {
    // In a real app, this would be an API call
    const mockRequests = [
      {
        id: 1,
        address: "123 Green St, Eco City",
        scheduledTime: "2023-11-15T09:00:00",
        wasteType: "Recyclables",
        status: "pending",
        location: { lat: 12.3456, lng: 98.7654 }
      },
      // More requests...
    ];
    setPickupRequests(mockRequests);
  }, []);

  // Fetch assigned jobs (mock implementation)
  useEffect(() => {
    // In a real app, this would be an API call
    const mockJobs = [
      {
        id: 101,
        address: "456 Eco Ave, Green Town",
        scheduledTime: "2023-11-15T10:30:00",
        wasteType: "Organic",
        status: "assigned",
        location: { lat: 12.3567, lng: 98.7777 }
      },
      // More jobs...
    ];
    setAssignedJobs(mockJobs);
  }, []);

  const handleJobVerification = (jobId: number, verificationData: any) => {
    // Handle job verification logic
    console.log(`Verified job ${jobId} with data:`, verificationData);
    // Update job status in the UI
    setAssignedJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'completed' } : job
      )
    );
  };

  const handleInformalPickerAssignment = (pickerId: string, jobId: number) => {
    // Handle assignment to informal picker
    console.log(`Assigned job ${jobId} to informal picker ${pickerId}`);
    // Update job status in the UI
    setAssignedJobs(prevJobs => 
      prevJobs.map(job => 
        job.id === jobId ? { ...job, status: 'assigned_to_picker' } : job
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <DashboardHeader 
        title="Collection Dashboard" 
        userType="collector" 
      />
      
      <div className="flex mb-6 border-b">
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'schedule' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'requests' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('requests')}
        >
          Pickup Requests
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'tracking' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('tracking')}
        >
          Real-time Tracking
        </button>
        <button
          className={`py-2 px-4 font-medium ${activeTab === 'integration' ? 'border-b-2 border-green-500 text-green-600' : 'text-gray-500'}`}
          onClick={() => setActiveTab('integration')}
        >
          Picker Integration
        </button>
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
          onAcceptRequest={(requestId) => {
            // Handle request acceptance
            const request = pickupRequests.find(req => req.id === requestId);
            if (request) {
              setAssignedJobs(prev => [...prev, {...request, status: 'assigned'}]);
              setPickupRequests(prev => prev.filter(req => req.id !== requestId));
            }
          }}
        />
      )}

      {activeTab === 'tracking' && (
        <RealtimeTrackingMap 
          jobs={assignedJobs} 
          currentLocation={currentLocation} 
          onLocationUpdate={(newLocation) => setCurrentLocation(newLocation)}
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