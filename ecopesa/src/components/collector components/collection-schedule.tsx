// components/collection-schedule.tsx
import { Job } from '@/types/index';

interface CollectionScheduleProps {
  jobs: Job[];
  currentLocation: { lat: number; lng: number } | null;
}

function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): string {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *  
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c;
  return distance < 1 
    ? `${Math.round(distance * 1000)} m` 
    : `${distance.toFixed(1)} km`;
} 

export function CollectionSchedule({ jobs, currentLocation }: CollectionScheduleProps) {
  const getDistance = (jobLocation: { lat: number; lng: number }) => {
    if (!currentLocation) return '--';
    return calculateDistance(
      currentLocation.lat,
      currentLocation.lng,
      jobLocation.lat,
      jobLocation.lng
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Collection Schedule</h2>
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-gray-500">No jobs scheduled for today</p>
        ) : (
          jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4 hover:bg-gray-50">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{job.address}</h3>
                  <p className="text-sm text-gray-600">
                    {new Date(job.scheduledTime).toLocaleTimeString()} - {job.wasteType}
                  </p>
                </div>
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    job.status === 'completed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {job.status}
                  </span>
                  <p className="text-sm mt-1">Distance: {calculateDistance(job.location.lat,job.location.lng,currentLocation.lat,currentLocation?.lng)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}