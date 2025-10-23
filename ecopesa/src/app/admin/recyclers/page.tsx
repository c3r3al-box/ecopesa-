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

export default function AdminRecyclersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [assignments, setAssignments] = useState<Record<string, { centreId: string; pin: string }>>({});
  const { showToast, ToastComponent } = useToast();

  const getReadableLocation = async (lat: number, lng: number): Promise<string> => {
    const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
    if (!apiKey) return 'Unknown location';
    try {
      const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat},${lng}&key=${apiKey}`);
      const data = await res.json();
      return data.results?.[0]?.formatted || 'Unknown location';
    } catch {
      return 'Unknown location';
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .in('role', ['user', 'recycler', 'RECYCLER']);

      if (error) {
        showToast('Failed to load users', 'error');
      } else {
        setUsers(data || []);
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

      const enriched = await Promise.all(
        (data || []).map(async (c) => {
          const [lng, lat] = c.location.coordinates;
          const readable = await getReadableLocation(lat, lng);
          return { ...c, readableLocation: readable };
        })
      );

      setCentres(enriched);
    };

    fetchUsers();
    fetchCentres();
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
      setUsers(prev => prev.filter(u => u.id !== userId));
      setAssignments(prev => {
        const copy = { ...prev };
        delete copy[userId];
        return copy;
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Assign Recyclers</h1>
      <p className="text-gray-700 mb-6">Link users to collection centres and generate staff PINs.</p>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search Users</Label>
        <Input
          id="search"
          type="text"
          placeholder="e.g. jane@ecopesa.org"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      <div className="space-y-4">
        {filteredUsers.map(user => {
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

      <ToastComponent />
    </div>
  );
}
