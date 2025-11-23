'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase/client';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type Profile = {
  id: string;
  full_name: string;
  email: string;
  role: string;
};

type Centre = {
  id: string;
  name: string;
  location: {
    type: string;
    coordinates: [number, number];
    crs?: any;
  };
  readableLocation?: string;
};

type RecyclerLog = {
  id: string;
  user_id: string | null;
  email: string | null;
  staff_pin: string | null;
  assigned_centre_name?: string | null;
  assigned_centre_id: string | null;
 
  
};

export default function AdminRecyclersPage() {
  const [unassigned, setUnassigned] = useState<Profile[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [logs, setLogs] = useState<RecyclerLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState<Record<string, { centreId: string; pin: string }>>({});
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchUnassigned = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'RECYCLER');

      if (error) {
        showToast('Failed to load unassigned recyclers', 'error');
      } else {
        setUnassigned(data || []);
      }
    };

    const fetchCentres = async () => {
      const { data, error } = await supabase
        .from('collection_centres')
        .select('id, name, location');

      if (error) {
        showToast('Failed to load centres', 'error');
        return;
      }

      const enriched = (data || []).map((c) => {
        const [lng, lat] = c.location.coordinates;
        return { ...c, readableLocation: `${lat}, ${lng}` };
      });

      setCentres(enriched);
    };

    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/admin/recyclers'); // ✅ call GET route
        if (!res.ok) {
          showToast('Failed to load recycler logs', 'error');
          return;
        }
        const data: RecyclerLog[] = await res.json();
        setLogs(data || []);
      } catch {
        showToast('Failed to load recycler logs', 'error');
      }
    };

    fetchUnassigned();
    fetchCentres();
    fetchLogs();
  }, []);

  const assignRecycler = async (userId: string, centreId: string, pin: string) => {
    const res = await fetch('/api/admin/recyclers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        assignedCentreId: centreId,
        staffPin: pin,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to assign recycler: ${result.error}`, 'error');
    } else {
      showToast('Recycler assigned successfully', 'success');
      setUnassigned(prev => prev.filter(u => u.id !== userId));
      setAssignments(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
      // refresh logs via GET route
      const refreshed = await fetch('/api/admin/recyclers');
      const data: RecyclerLog[] = await refreshed.json();
      setLogs(data || []);
    }
  };

  const filteredUnassigned = unassigned.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Assign Recyclers</h1>
      <p className="text-gray-700 mb-6">Link recyclers to collection centres and generate staff PINs.</p>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search Unassigned Recyclers</Label>
        <Input
          id="search"
          type="text"
          placeholder="e.g. jane@ecopesa.org"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      {/* Assignment Section */}
      <div className="space-y-4">
        {filteredUnassigned.map(user => {
          const assignment = assignments[user.id] || { centreId: '', pin: '' };
          return (
            <div key={user.id} className="bg-white p-4 rounded shadow">
              <p className="font-semibold text-emerald-700">{user.full_name || 'Unnamed User'}</p>
              <p className="text-sm text-gray-600 mb-2">{user.email}</p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                <select
                  value={assignment.centreId}
                  onChange={(e) =>
                    setAssignments(prev => ({
                      ...prev,
                      [user.id]: {
                        ...prev[user.id],
                        centreId: e.target.value,
                        pin: prev[user.id]?.pin || ''
                      }
                    }))
                  }
                  className="border rounded px-3 py-2 text-sm bg-white shadow-sm"
                >
                  <option value="">Select Centre</option>
                  {centres.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name} – {c.readableLocation}
                    </option>
                  ))}
                </select>

                <Input
                  type="text"
                  placeholder="Staff PIN"
                  value={assignment.pin}
                  onChange={(e) =>
                    setAssignments(prev => ({
                      ...prev,
                      [user.id]: {
                        ...prev[user.id],
                        pin: e.target.value,
                        centreId: prev[user.id]?.centreId || ''
                      }
                    }))
                  }
                />

                <Button
                  onClick={() => {
                    if (!assignment.centreId || !assignment.pin) {
                      showToast('Please fill all fields', 'error');
                      return;
                    }
                    assignRecycler(user.id, assignment.centreId, assignment.pin);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700"
                >
                  Assign
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recycler Log Section */}
      <div className="mt-10">
        <h2 className="text-xl font-bold text-emerald-800 mb-4">Recycler Log</h2>
        <div className="bg-white rounded shadow p-4">
          {logs.length === 0 ? (
            <p className="text-gray-600">No recyclers found.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="border-b">
                  <th className="py-2 px-3">Email</th>
                  <th className="py-2 px-3">Assigned Centre</th>
                  <th className="py-2 px-3">Centre ID</th>
                  <th className="py-2 px-3">Staff PIN</th>
                  
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.id} className="border-b">
                    <td className="py-2 px-3">{log.email || 'No email'}</td>
                    <td className="py-2 px-3">{log.assigned_centre_name || 'Not assigned'}</td>
                    <td className="py-2 px-3">{log.assigned_centre_id || 'Not assigned'}</td>
                    <td className="py-2 px-3">{log.staff_pin || 'Not assigned'}</td>
                    <td className="py-2 px-3">
                      
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ToastComponent />
    </div>
  );
}
