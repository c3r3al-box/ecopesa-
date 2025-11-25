'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';

function normalizePin(input: string): string {
  return input
    .trim()                // remove leading/trailing spaces/newlines
    .replace(/\s+/g, '')   // remove any internal whitespace
    .replace(/[^\x00-\x7F]/g, ''); // strip non‑ASCII characters
}

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
  const [loading, setLoading] = useState(false);

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

    setLoading(true);

    // 🔑 Normalize staff PIN
    const normalizedPin = normalizePin(staffPin);
    console.log('Raw staffPin:', JSON.stringify(staffPin), 'Normalized:', normalizedPin);

    // Validate staff PIN against recyclers table
    const { data: staff, error: staffError } = await supabase
      .from('recyclers')
      .select('id')
      .eq('staff_pin', normalizedPin)
      .maybeSingle();

    if (staffError || !staff) {
      setStatus({ type: 'error', message: 'Invalid staff PIN. Please try again.' });
      setLoading(false);
      return;
    }

    // ✅ Insert recycling log only if staff PIN is valid
    const { error } = await supabase.from('recycling_logs').insert({
      user_id: user.id,
      center_id: selectedCenter,
      staff_pin: normalizedPin, // store normalized pin
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

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <h1 className="text-3xl font-bold text-emerald-800 mb-8 flex items-center">
        <button
          title="Back"
          aria-label="Back"
          onClick={() => window.history.back()}
          className="p-2 rounded-full hover:bg-emerald-100 transition mr-3"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-700" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        Log Your Recycling Journey
      </h1>

      <div className="bg-white p-6 rounded-xl shadow-lg max-w-md mx-auto space-y-6">
        {/* Centre Selector */}
        <div>
          <label htmlFor="center" className="block mb-2 font-semibold text-gray-700">Collection Center</label>
          <select
            id="center"
            value={selectedCenter}
            onChange={(e) => setSelectedCenter(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500"
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
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. 3.5"
          />
        </div>

        {/* Material Type */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Material Type</label>
          <div className="grid grid-cols-2 gap-3">
            {['plastic', 'glass', 'paper', 'metal'].map(type => (
              <button
                key={type}
                type="button"
                onClick={() => setMaterialType(type)}
                className={`px-3 py-2 rounded border transition ${
                  materialType === type
                    ? 'bg-emerald-600 text-white shadow'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Staff PIN */}
        <div>
          <label htmlFor="pin" className="block mb-2 font-semibold text-gray-700">Staff PIN</label>
          <input
            id="pin"
            type="password"
            value={staffPin}
            onChange={(e) => setStaffPin(e.target.value)}
            className="w-full border p-2 rounded focus:ring-2 focus:ring-emerald-500"
            placeholder="e.g. 1234"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading || !selectedCenter || !staffPin || !recycledWeight || !materialType}
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
        >
          {loading ? 'Logging...' : 'Log Journey'}
        </button>

        {/* Status */}
        {status && (
          <div
            className={`mt-4 text-center font-medium rounded p-3 ${
              status.type === 'success'
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-red-100 text-red-700'
            }`}
            role="alert"
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}
