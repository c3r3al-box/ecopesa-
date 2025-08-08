import { JobVerification } from '@/components/collector components/job-verification';

import type { Job } from '@/types'; // Adjust the import path if needed

type Location = {
  lat: number;
  lng: number;
};

type CollectionScheduleProps = {
  jobs: Job[];
  currentLocation: Location;
};

export function CollectionSchedule({ jobs, currentLocation }: CollectionScheduleProps) {
  const assignedJobs = jobs.filter((job) => job.status === 'assigned');

  function calculateDistance(arg0: number, arg1: number, lat: number, lng: number): import("react").ReactNode {
    throw new Error('Function not implemented.');
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Today's Collection Schedule</h2>
      <div className="space-y-4">
        {assignedJobs.length === 0 ? (
          <p className="text-gray-500">No jobs scheduled for today</p>
        ) : (
          assignedJobs.map((job) => (
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
                  <p className="text-sm mt-1">Distance: {calculateDistance(
                    currentLocation?.lat ?? 0,
                    currentLocation?.lng ?? 0,
                    job.location.lat,
                    job.location.lng
                  )}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Verification Section */}
      <JobVerification
        jobs={assignedJobs}
        currentLocation={currentLocation}
        onVerify={(jobId: string) => {
          console.log(`Job ${jobId} verified`);
          // Optionally refresh jobs or show toast
        }}
      />
    </div>
  );
}
