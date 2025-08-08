'use client';

import { Job } from '@/types/index';
import { useState } from 'react';

interface PickupRequestListProps {
  requests: Job[];
  currentLocation: { lat: number; lng: number } | null;
}

export function PickupRequestList({
  requests,
  currentLocation
}: PickupRequestListProps) {
  const [acceptingId, setAcceptingId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [confirmedRequests, setConfirmedRequests] = useState<number[]>([]);

  const haversineDistance = (
    loc1: { lat: number; lng: number },
    loc2: { lat: number; lng: number }
  ) => {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(loc2.lat - loc1.lat);
    const dLng = toRad(loc2.lng - loc1.lng);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(loc1.lat)) * Math.cos(toRad(loc2.lat)) * Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return `${(R * c).toFixed(2)} km`;
  };

  const handleAcceptRequest = async (jobId: number) => {
    setAcceptingId(jobId);
    const res = await fetch('/api/jobs/accept', {
      method: 'POST',
      body: JSON.stringify({ jobId }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    setAcceptingId(null);

    if (res.ok) {
      setConfirmedRequests((prev) => [...prev, jobId]);
    } else {
      console.error('Accept failed:', data.error);
    }
  };

  const handleRejectRequest = async (jobId: number) => {
    setRejectingId(jobId);
    const res = await fetch('/api/jobs/reject', {
      method: 'POST',
      body: JSON.stringify({ jobId, reason: 'Not suitable' }),
      headers: { 'Content-Type': 'application/json' }
    });

    const data = await res.json();
    setRejectingId(null);

    if (res.ok) {
      setConfirmedRequests((prev) => [...prev, jobId]);
    } else {
      console.error('Reject failed:', data.error);
    }
  };

  const visibleRequests = requests.filter((r) => !confirmedRequests.includes(Number(r.id)));

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">New Pickup Requests</h2>
      {visibleRequests.length === 0 ? (
        <p className="text-gray-500">No new pickup requests</p>
      ) : (
        <div className="space-y-4">
          {visibleRequests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{request.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(request.scheduledTime).toLocaleTimeString()} - {request.wasteType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">
                    Distance:{' '}
                    {currentLocation
                      ? haversineDistance(currentLocation, request.location)
                      : 'N/A'}
                  </p>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <button
                  className="px-3 py-1 border rounded text-sm"
                  disabled={rejectingId === Number(request.id)}
                  onClick={() => handleRejectRequest(Number(request.id))}
                >
                  {rejectingId === Number(request.id) ? 'Rejecting...' : 'Reject'}
                </button>
                <button
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  disabled={acceptingId === Number(request.id)}
                  onClick={() => handleAcceptRequest(Number(request.id))}
                >
                  {acceptingId === Number(request.id) ? 'Accepting...' : 'Accept'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
