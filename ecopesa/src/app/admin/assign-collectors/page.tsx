'use client';

import { useEffect, useState } from 'react';

export default function AssignCollectorPage() {
  const [collectors, setCollectors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [collectorId, setCollectorId] = useState('');
  const [centreId, setCentreId] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const [collectorRes, centreRes] = await Promise.all([
        fetch('/api/admin/collectors'),
        fetch('/api/admin/centres'),
      ]);
      const collectorsData = await collectorRes.json();
      const centresData = await centreRes.json();
      setCollectors(collectorsData.collectors);
      setCentres(centresData.centres);
    };
    fetchData();
  }, []);

  const handleAssign = async () => {
    const res = await fetch('/api/admin/assign-collector', {
      method: 'POST',
      body: JSON.stringify({ collector_id: collectorId, centre_id: centreId }),
    });
    const result = await res.json();
    setStatus(res.ok ? 'Assignment successful' : `Error: ${result.error}`);
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Assign Collector</h1>
      <p className="text-gray-700 mb-6">Link collectors to collection centres for routing and visibility.</p>

      <div className="space-y-6">
        <select value={collectorId} onChange={(e) => setCollectorId(e.target.value)} className="block w-full p-2 border rounded mb-4">
          <option value="">Select Collector</option>
          {collectors.map((c: any) => (
            <option key={c.id} value={c.id}>{c.full_name}</option>
          ))}
        </select>

        <select value={centreId} onChange={(e) => setCentreId(e.target.value)} className="block w-full p-2 border rounded mb-4">
          <option value="">Select Centre</option>
          {centres.map((c: any) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button onClick={handleAssign} className="bg-emerald-600 text-white block w-full px-4 py-2 rounded">
          Assign Collector
        </button>

        {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
      </div>
    </div>
  );
}
