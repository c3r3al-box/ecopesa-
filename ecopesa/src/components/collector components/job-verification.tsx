// components/job-verification.tsx
import { Job } from '@/types/index';
import React, { useState } from 'react';
interface JobVerificationProps {
  jobs: Job[];
  onVerify: (jobId: number, verificationData: any) => void;
}

export function JobVerification({ jobs, onVerify }: JobVerificationProps) {
  const [verificationData, setVerificationData] = useState<Record<number, { weight: string; photo: string | null }>>({});

  const handleVerificationChange = (jobId: number, field: string, value: string) => {
    setVerificationData(prev => ({
      ...prev,
      [jobId]: {
        ...prev[jobId],
        [field]: value,
      },
    }));
  };

  const handleTakePhoto = async (jobId: number) => {
    try {
      // This would use the device camera in a real app
      // For demo purposes, we'll just use a placeholder
      const mockPhoto = 'data:image/png;base64,...';
      handleVerificationChange(jobId, 'photo', mockPhoto);
    } catch (error) {
      console.error('Error taking photo:', error);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 mt-6">
      <h2 className="text-xl font-semibold mb-4">Job Verification</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs requiring verification</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="border rounded-lg p-4">
              <h3 className="font-medium">{job.address}</h3>
              <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Waste Weight (kg)
                  </label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded"
                    value={verificationData[job.id]?.weight || ''}
                    onChange={(e) => handleVerificationChange(job.id, 'weight', e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Collection Proof
                  </label>
                  {verificationData[job.id]?.photo ? (
                    <div className="relative">
                      <img 
                        src={verificationData[job.id].photo!} 
                        alt="Collection proof" 
                        className="h-20 w-20 object-cover rounded border"
                      />
                    </div>
                  ) : (
                    <button
                      onClick={() => handleTakePhoto(job.id)}
                      className="px-3 py-2 bg-gray-100 rounded text-sm"
                    >
                      Take Photo
                    </button>
                  )}
                </div>
              </div>
              <button
                onClick={() => onVerify(job.id, verificationData[job.id] || {})}
                disabled={!verificationData[job.id]?.weight || !verificationData[job.id]?.photo}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-300"
              >
                Verify Completion
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}