'use client';

import { useEffect, useState } from 'react';

type Log = {
  id: string;
  recycled_weight: number;
  points_earned: number;
  material: string;
  created_at: string;
  verified_by: { id: string; full_name: string } | null;
  user_id: { id: string; full_name: string; role: string };
};

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/admin/logs');
      const result = await res.json();
      if (res.ok) setLogs(result.logs);
      setLoading(false);
    };

    fetchLogs();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Recycling Logs</h1>
      <p className="text-gray-700 mb-6">Track verified submissions and material breakdowns.</p>

      {loading ? (
        <p className="text-gray-600">Loading logs...</p>
      ) : logs.length === 0 ? (
        <p className="text-gray-600">No logs found.</p>
      ) : (
        <div className="space-y-4">
          {logs.map((log) => (
            <div key={log.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">
                <strong>User:</strong> {log.user_id.full_name} ({log.user_id.role})
              </p>
              <p className="text-sm text-gray-700">
                <strong>Material:</strong> {log.material}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Weight:</strong> {log.recycled_weight} kg
              </p>
              <p className="text-sm text-gray-700">
                <strong>Points:</strong> {log.points_earned}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Verified by:</strong>{' '}
                {log.verified_by ? log.verified_by.full_name : 'Pending'}
              </p>
              <p className="text-xs text-gray-500">
                Submitted: {new Date(log.created_at).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
