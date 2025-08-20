'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase-browser';

interface RecyclerJob {
  id: string;
  material_type: string;
  disposal_guidance: string;
  image_url?: string;
  status: 'pending' | 'completed' | 'verified';
  assigned_to: string;
}

;

export default function RecyclerDashboard() {
  const [jobs, setJobs] = useState<RecyclerJob[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      const { data, error } = await supabase
        .from('recycler_jobs')
        .select('*')
        .eq('assigned_to', user?.id) 
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching jobs:', error.message);
       } else setJobs(data as RecyclerJob[]);
      setLoading(false);
    };

    fetchJobs();
  }, []);

  const markComplete = async (jobId: string) => {
    const { error } = await supabase
      .from('recycler_jobs')
      .update({ status: 'completed' })
      .eq('id', jobId);

    if (!error) setJobs(jobs.map(job =>
      job.id === jobId ? { ...job, status: 'completed' } : job
    ));
  };

  return (
    <div className="p-6 bg-white shadow rounded">
      <h2 className="text-2xl font-bold mb-4">Recycler Dashboard</h2>
      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length === 0 ? (
        <p>No assigned jobs for you right now.</p>
      ) : (
        <ul className="space-y-4">
          {jobs.map(job => (
            <li key={job.id} className="border p-4 rounded">
              <p><strong>Material:</strong> {job.material_type}</p>
              <p><strong>Guidance:</strong> {job.disposal_guidance}</p>
              {job.image_url && (
                <img src={job.image_url} alt="Trash item" className="w-20 h-20 object-cover mt-2 rounded" />
              )}
              <button
                onClick={() => markComplete(job.id)}
                disabled={job.status === 'completed'}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded disabled:bg-gray-400"
              >
                {job.status === 'completed' ? 'Completed' : 'Mark as Complete'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
