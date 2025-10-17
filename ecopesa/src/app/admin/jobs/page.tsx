'use client';

import { useEffect, useState } from 'react';

type Job = {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
  assigned_to: {
    id: string;
    full_name: string;
    role: string;
  } | null;
};

export default function AdminJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await fetch('/api/admin/jobs');
      const result = await res.json();
      if (res.ok) setJobs(result.jobs);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Job Assignments</h1>
      <p className="text-gray-700 mb-6">Track operational roles and task distribution.</p>

      {loading ? (
        <p className="text-gray-600">Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-600">No jobs found.</p>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-bold text-emerald-700">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                Assigned to:{' '}
                {job.assigned_to
                  ? `${job.assigned_to.full_name} (${job.assigned_to.role})`
                  : 'Unassigned'}
              </p>
              <p className="text-sm text-gray-500">Status: {job.status}</p>
              <p className="text-xs text-gray-400">Created: {new Date(job.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
