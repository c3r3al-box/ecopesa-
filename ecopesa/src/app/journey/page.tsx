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
  const [status, setStatus] = useState('');
  const [recycledWeight, setRecycledWeight] = useState('');
  useEffect(() => {
    const fetchCenters = async () => {
      const { data, error } = await supabase.from('collection_centres').select('id, name');
      if (error) console.error('Error fetching centers:', error.message);
      else setCenters(data);
    };
    fetchCenters();
  }, []);

  const handleSubmit = async () => {
    if (!user?.id || !selectedCenter || !staffPin) {
      setStatus('Please fill in all fields.');
      return;
    }

    const { error } = await supabase.from('recycling_logs').insert({
      user_id: user.id,
      center_id: selectedCenter,
      staff_pin: staffPin,
      recycled_weight: recycledWeight,
      verified: false,
    });

    if (error) {
      console.error(error.message);
      setStatus('Something went wrong. Try again.');
    } else {
      setStatus('Journey logged successfully! Awaiting verification.');
      setSelectedCenter('');
      setStaffPin('');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
        
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">
        <button title="Back" aria-label="Back" onClick={() => window.history.back()} className='p-2 rounded-full hover:bg-emerald-700 transition'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>Log Your Recycling Journey</h1>
      

      <div className="bg-white p-6 rounded-lg shadow max-w-md mx-auto">
        <label className="block mb-2 font-semibold text-gray-700">Select Collection Center</label>
        <select
          value={selectedCenter}
          onChange={(e) => setSelectedCenter(e.target.value)}
          className="w-full border p-2 rounded mb-4"
        >
          <option value="">-- Choose a center --</option>
          {centers.map((center) => (
            <option key={center.id} value={center.id}>
              {center.name}
            </option>
          ))}
        </select>
        <label className="block mb-2 font-semibold text-gray-700">Recycled Weight (kg)</label>
<input
  type="number"
  value={recycledWeight}
  onChange={(e) => setRecycledWeight(e.target.value)}
  className="w-full border p-2 rounded mb-4"
  placeholder="e.g. 3.5"
/>


        <label className="block mb-2 font-semibold text-gray-700">Enter Staff PIN</label>
        <input
          type="text"
          value={staffPin}
          onChange={(e) => setStaffPin(e.target.value)}
          className="w-full border p-2 rounded mb-4"
          placeholder="e.g. 1234"
        />

        <button
          onClick={handleSubmit}
          className="btn-primary w-full"
        >
          Log Journey
        </button>

        {status && <p className="mt-4 text-center text-emerald-700 font-medium">{status}</p>}
      </div>
    </div>
  );
}
