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
  location: string;
};

export default function AdminRecyclersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [centres, setCentres] = useState<Centre[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedCentreId, setSelectedCentreId] = useState('');
  const [staffPin, setStaffPin] = useState('');
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role')
        .eq('role', 'user'); // Only show unassigned users

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
      } else {
        setCentres(data || []);
      }
    };

    fetchUsers();
    fetchCentres();
  }, []);

  const assignRecycler = async () => {
    if (!selectedUserId || !selectedCentreId || !staffPin) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const res = await fetch('/api/admin/recyclers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUserId,
        assignedCentreId: selectedCentreId,
        staffPin,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to assign recycler: ${result.error}`, 'error');
    } else {
      showToast('Recycler assigned successfully', 'success');
      setUsers(prev => prev.filter(u => u.id !== selectedUserId));
      setSelectedUserId('');
      setSelectedCentreId('');
      setStaffPin('');
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
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white p-4 rounded shadow">
            <p className="font-semibold text-emerald-700">{user.full_name || 'Unnamed User'}</p>
            <p className="text-sm text-gray-600 mb-2">{user.email}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <select
                value={selectedCentreId}
                onChange={(e) => setSelectedCentreId(e.target.value)}
                className="border rounded px-3 py-2 text-sm bg-white shadow-sm"
              >
                <option value="">Select Centre</option>
                {centres.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.name} – {c.location}
                  </option>
                ))}
              </select>

              <Input
                type="text"
                placeholder="Staff PIN"
                value={staffPin}
                onChange={(e) => setStaffPin(e.target.value)}
              />

              <Button
                onClick={() => {
                  setSelectedUserId(user.id);
                  assignRecycler();
                }}
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                Assign
              </Button>
            </div>
          </div>
        ))}
      </div>

      <ToastComponent />
    </div>
  );
}
