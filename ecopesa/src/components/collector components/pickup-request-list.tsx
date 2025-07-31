// components/pickup-request-list.tsx
import { Job } from '@/types/index';

interface PickupRequestListProps {
  requests: Job[];
  currentLocation: { lat: number; lng: number } | null;
  onAcceptRequest: (requestId: number) => void;
}

export function PickupRequestList({ requests, currentLocation, onAcceptRequest }: PickupRequestListProps) {
  const calculateDistance = (jobLocation: { lat: number; lng: number }) => {
    if (!currentLocation) return '--';
    const latDiff = Math.abs(jobLocation.lat - currentLocation.lat);
    const lngDiff = Math.abs(jobLocation.lng - currentLocation.lng);
    return `${(latDiff + lngDiff) * 100} km`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">New Pickup Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No new pickup requests</p>
      ) : (
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{request.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(request.scheduledTime).toLocaleTimeString()} - {request.wasteType}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm">Distance: {calculateDistance(request.location)}</p>
                </div>
              </div>
              <div className="mt-3 flex justify-end space-x-2">
                <button 
                  className="px-3 py-1 border rounded text-sm"
                  onClick={() => {/* Implement reject logic */}}
                >
                  Reject
                </button>
                <button 
                  className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  onClick={() => onAcceptRequest(request.id)}
                >
                  Accept
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}