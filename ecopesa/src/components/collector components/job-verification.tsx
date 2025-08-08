'use client';

import React, { useState } from 'react';
import { Job } from '@/types';

interface JobVerificationProps {
  jobs: Job[];
  currentLocation: { lat: number; lng: number } | null;
  onVerify: (jobId: string) => void;
}

export function JobVerification({ jobs, currentLocation, onVerify }: JobVerificationProps) {
  const [weightByJobId, setWeightByJobId] = useState<Record<string, string>>({});
  const [verifyingJobId, setVerifyingJobId] = useState<string | null>(null);
  const [errorByJobId, setErrorByJobId] = useState<Record<string, string>>({});

  const handleVerify = async (jobId: string) => {
    const weight = weightByJobId[jobId];
    if (!weight) {
      setErrorByJobId((prev) => ({ ...prev, [jobId]: 'Weight is required' }));
      return;
    }

    if (!currentLocation) {
      setErrorByJobId((prev) => ({ ...prev, [jobId]: 'Location not available' }));
      return;
    }

    setVerifyingJobId(jobId);
    setErrorByJobId((prev) => ({ ...prev, [jobId]: '' }));

    try {
      const res = await fetch('/api/jobs/verify-completion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobId,
          weight,
          location: currentLocation
        })
      });

      const result = await res.json();
      if (!res.ok) {
        setErrorByJobId((prev) => ({ ...prev, [jobId]: result.error || 'Verification failed' }));
      } else {
        setWeightByJobId((prev) => ({ ...prev, [jobId]: '' }));
        if (onVerify) onVerify(jobId);
      }
    } catch (err) {
      setErrorByJobId((prev) => ({ ...prev, [jobId]: 'Network error' }));
    } finally {
      setVerifyingJobId(null);
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
              <p className="text-sm text-gray-600 mb-2">
                Scheduled: {new Date(job.scheduledTime).toLocaleTimeString()} — {job.wasteType}
              </p>

              <label className="block text-sm font-medium text-gray-700 mb-1">Waste Weight (kg)</label>
              <input
                type="number"
                className="w-full p-2 border rounded"
                value={weightByJobId[job.id] || ''}
                onChange={(e) =>
                  setWeightByJobId((prev) => ({
                    ...prev,
                    [job.id]: e.target.value
                  }))
                }
              />

              {errorByJobId[job.id] && (
                <p className="text-red-600 text-sm mt-1">{errorByJobId[job.id]}</p>
              )}

              <button
                onClick={() => handleVerify(job.id)}
                disabled={verifyingJobId === job.id || !weightByJobId[job.id]}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
              >
                {verifyingJobId === job.id ? 'Verifying...' : 'Verify Completion'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
