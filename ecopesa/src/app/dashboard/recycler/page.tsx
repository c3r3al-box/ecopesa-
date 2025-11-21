'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import { CollectionCentre, Recycler, RecyclingLog } from '@/types/supabase';
import toast from 'react-hot-toast';

export default function RecyclerDashboard() {
  const user = useUser();
  const [recycler, setRecycler] = useState<Recycler | null>(null);
  const [center, setCenter] = useState<CollectionCentre | null>(null);
  const [logs, setLogs] = useState<RecyclingLog[]>([]);
  const [loadUpdate, setLoadUpdate] = useState<number | ''>('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchRecyclerData = async () => {
      if (!user?.id) return;

      // 1. Get recycler record
      const { data: recyclerData, error: recyclerError } = await supabase
        .from('recyclers')
        .select('staff_pin, assigned_centre_id')
        .eq('user_id', user.id)
        .maybeSingle();

      if (recyclerError) {
        console.error('Error fetching recycler:', recyclerError.message);
        return;
      }
      if (!recyclerData) return;

      setRecycler(recyclerData);

      // 2. Get assigned centre
      const { data: centerData, error: centerError } = await supabase
        .from('collection_centres')
        .select('*')
        .eq('id', recyclerData.assigned_centre_id)
        .maybeSingle();

      if (centerError) {
        console.error('Error fetching centre:', centerError.message);
      } else {
        setCenter(centerData);
      }

      // 3. Fetch pending logs via API
      try {
        const res = await fetch(`/api/rewards/verify-logs?staffPin=${recyclerData.staff_pin}`);
        const result = await res.json();

        if (Array.isArray(result)) {
          setLogs(result);
        } else if (result.logs) {
          setLogs(result.logs);
        } else {
          setLogs([]);
        }
      } catch (err) {
        console.error('Error fetching logs:', err);
      }
    };

    fetchRecyclerData();
  }, [user]);

  // Toast if centre is already full
  useEffect(() => {
    if (center && center.current_load >= center.capacity) {
      toast.error(`Centre "${center.name}" is at full capacity (${center.capacity}kg).`);
    }
  }, [center]);

  const handleVerifyLog = async (logId: string) => {
    const res = await fetch('/api/rewards/verify-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        logId,
        recyclerId: user?.id,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(`Verification failed: ${result.error}`);
      setStatus(`Verification failed: ${result.error}`);
      return;
    }

    setLogs(prev => prev.filter(log => log.id !== logId));
    setCenter(prev =>
      prev ? { ...prev, current_load: result.newLoad } : null
    );
    toast.success('Log verified successfully ✅');
    setStatus(`Log verified successfully. User now has ${result.newPoints} EcoPesa points.`);
  };

  const handleUpdateLoad = async () => {
    if (!center?.id || !loadUpdate) return;

    const projectedLoad = center.current_load + Number(loadUpdate);
    if (projectedLoad > center.capacity) {
      toast.error(`Cannot update: adding ${loadUpdate}kg would exceed capacity (${center.capacity}kg).`);
      setStatus(`Cannot update: adding ${loadUpdate}kg would exceed capacity (${center.capacity}kg).`);
      return;
    }

    const res = await fetch('/api/recycler/update-load', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        centreId: center.id,
        loadDelta: loadUpdate,
      }),
    });

    const result = await res.json();

    if (!res.ok) {
      toast.error(`Failed to update load: ${result.error}`);
      setStatus(`Failed to update load: ${result.error}`);
    } else {
      toast.success('Load updated successfully ✅');
      setStatus('Load updated successfully');
      setCenter(prev =>
        prev ? { ...prev, current_load: result.newLoad } : null
      );
      setLoadUpdate('');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Recycler Dashboard</h1>

      {recycler && center && (
        <>
          {/* Centre Info */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2">Assigned Centre</h2>
            <p><strong>Name:</strong> {center.name}</p>
            <p><strong>Current Load:</strong> {center.current_load} kg</p>
            <p><strong>Capacity:</strong> {center.capacity} kg</p>
            <p><strong>Staff PIN:</strong> <span className="font-mono text-lg">{recycler.staff_pin}</span></p>

            {/* Capacity Progress Bar */}
            <div className="mt-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Capacity Usage</span>
                <span>{Math.min(center.current_load, center.capacity)} / {center.capacity} kg</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className={`h-3 rounded-full ${
                    center.current_load >= center.capacity ? 'bg-red-500' : 'bg-emerald-600'
                  }`}
                  style={{
                    width: `${Math.min((center.current_load / center.capacity) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          </div>

          {/* Manual Load Update */}
          <div className="bg-white p-4 rounded shadow mb-6">
            <h2 className="text-lg font-semibold text-emerald-700 mb-2">Update Centre Load</h2>
            <input
              type="number"
              value={loadUpdate}
              onChange={(e) => {
                const value = e.target.value;
                setLoadUpdate(value === '' ? '' : parseFloat(value));
              }}
              className="border p-2 rounded w-full mb-2"
              placeholder="Enter weight received (kg)"
            />
            <button
              onClick={handleUpdateLoad}
              disabled={
                !loadUpdate ||
                center.current_load >= center.capacity ||
                center.current_load + Number(loadUpdate) > center.capacity
              }
              className={`px-4 py-2 rounded font-bold transition ${
                center.current_load >= center.capacity
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              Update Load
            </button>
            {status && <p className="mt-2 text-emerald-700">{status}</p>}
          </div>

          {/* Pending Logs */}
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-semibold text-emerald-700 mb-4">Pending Logs to Verify</h2>
            {logs.length === 0 ? (
              <p className="text-gray-600">No pending logs at this time.</p>
            ) : (
              <ul className="space-y-4">
                {logs.map(log => (
                  <li key={log.id} className="border p-3 rounded flex justify-between items-center">
                    <div>
                      <p><strong>User:</strong> {log.user_id}</p>
                      <p><strong>Weight:</strong> {log.recycled_weight} kg</p>
                      <p><strong>Material:</strong> {log.material_type}</p>
                      <p><strong>Date:</strong> {new Date(log.created_at).toLocaleString()}</p>
                    </div>
                    <button
                      onClick={() => handleVerifyLog(log.id)}
                      className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
                    >
                      Verify
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}
