'use client';

import { useEffect, useState } from 'react';

export default function AssignCollectorPage() {
  const [collectors, setCollectors] = useState([]);
  const [centres, setCentres] = useState([]);
  const [collectorId, setCollectorId] = useState('');
  const [centreId, setCentreId] = useState('');
  const [status, setStatus] = useState('');

  const [showCollectorSelect, setShowCollectorSelect] = useState(false);
  const [showCentreSelect, setShowCentreSelect] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const [collectorRes, centreRes] = await Promise.all([
        fetch('/api/admin/assign-collector'),
        fetch('/api/collection-centres'),
      ]);
      const collectorsData = await collectorRes.json();
      const centresData = await centreRes.json();
      setCollectors(collectorsData.collectors || []);
      setCentres(centresData.centres || []);
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

      <div className="space-y-8">
  {/* Collector Selection */}
  <div>
    <h2 className="text-lg font-semibold text-emerald-700 mb-2">Step 1: Choose a Collector</h2>
    {!showCollectorSelect ? (
      <button
        onClick={() => setShowCollectorSelect(true)}
        className="bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded shadow-sm transition"
      >
        Select Collector
      </button>
    ) : (
      <select
        value={collectorId}
        onChange={(e) => setCollectorId(e.target.value)}
        className="block w-full p-2 border border-emerald-300 rounded"
      >
        <option value="">Choose a collector</option>
        {collectors.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.full_name}
          </option>
        ))}
      </select>
    )}
  </div>

  {/* Centre Selection */}
  <div>
    <h2 className="text-lg font-semibold text-emerald-700 mb-2">Step 2: Choose a Collection Centre</h2>
    {!showCentreSelect ? (
      <button
        onClick={() => setShowCentreSelect(true)}
        className="bg-white border border-emerald-500 text-emerald-700 hover:bg-emerald-50 px-4 py-2 rounded shadow-sm transition"
      >
        Select Centre
      </button>
    ) : (
      <select
        value={centreId}
        onChange={(e) => setCentreId(e.target.value)}
        className="block w-full p-2 border border-emerald-300 rounded"
      >
        <option value="">Choose a centre</option>
        {centres.map((c: any) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>
    )}
  </div>

  {/* Assign Button */}
  <button
    onClick={handleAssign}
    className="bg-emerald-600 text-white block w-full px-4 py-2 rounded hover:bg-emerald-700 transition"
  >
    Assign Collector
  </button>

  {status && <p className="text-sm text-gray-700 mt-2">{status}</p>}
</div>

    </div>
  );
}
