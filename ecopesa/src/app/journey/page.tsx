'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';

export default function JourneyPage() {
  const user = useUser();
  interface Center {
    id: string;
    name: string;
  }
  const [centers, setCenters] = useState<Center[]>([]);
  const [selectedCenter, setSelectedCenter] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [recycledWeight, setRecycledWeight] = useState('');
  const [materialType, setMaterialType] = useState('');

  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase.from('collection_centres').select('id, name');
      if (error) console.error('Error fetching centers:', error.message);
      else setCenters(data);
    };
    fetchCenters();
  }, []);

  const handleSubmit = async () => {
    if (!user?.id || !selectedCenter || !staffPin || !recycledWeight || !materialType) {
      setStatus({ type: 'error', message: 'Please fill in all fields.' });
      return;
    }

    const { error } = await supabase.from('recycling_logs').insert({
      user_id: user.id,
      center_id: selectedCenter,
      staff_pin: staffPin,
      recycled_weight: recycledWeight,
      material_type: materialType,
      verified: false,
    });

    if (error) {
      console.error(error.message);
      setStatus({ type: 'error', message: 'Something went wrong. Try again.' });
    } else {
      setStatus({ type: 'success', message: 'Journey logged successfully! Awaiting verification.' });
      setSelectedCenter('');
      setStaffPin('');
      setRecycledWeight('');
      setMaterialType('');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-6 flex items-center">
        <button
          title="Back"
          aria-label="Back"
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-emerald-700 transition mr-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        Log Your Recycling Journey
      </h1>

      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto space-y-4">
        {/* Centre Selector */}
        <div>
          <label htmlFor="center" className="block mb-2 font-semibold text-gray-700">Select Collection Center</label>
          <select
            id="center"
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">-- Choose a center --</option>
            {centers.map((center) => (
              <option key={center.id} value={center.id}>
                {center.name}
              </option>
            ))}
          </select>
        </div>

        {/* Weight */}
        <div>
          <label htmlFor="weight" className="block mb-2 font-semibold text-gray-700">Recycled Weight (kg)</label>
          <input
            id="weight"
            type="number"
            value={recycledWeight}
            onChange={(e) => setRecycledWeight(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 3.5"
          />
        </div>

        {/* Material Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Material Type</label>
          <div className="flex gap-2">
            {['plastic', 'glass', 'paper', 'metal'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setMaterialType(type)}
                className={`flex-1 px-3 py-2 rounded border ${
                  materialType === type ? 'bg-emerald-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Staff PIN */}
        <div>
          <label htmlFor="pin" className="block mb-2 font-semibold text-gray-700">Enter Staff PIN</label>
          <input
            id="pin"
            type="text"
            value={staffPin}
            onChange={(e) => setStaffPin(e.target.value)}
            className="w-full border p-2 rounded"
            placeholder="e.g. 1234"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={!selectedCenter || !staffPin || !recycledWeight || !materialType}
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          Log Journey
        </button>

        {/* Status */}
        {status && (
          <p
            className={`mt-4 text-center font-medium rounded p-2 ${
              status.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
            }`}
            aria-live="polite"
          >
            {status.message}
          </p>
        )}
      </div>
    </div>
  );
}
