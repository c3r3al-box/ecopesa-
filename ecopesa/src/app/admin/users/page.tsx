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

export default function AdminUsersPage() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast, ToastComponent } = useToast();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, email, role');

      if (error) {
        console.error('Error fetching users:', error.message);
        showToast('Failed to load users', 'error');
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, []);

  const assignRole = async (userId: string, role: string) => {
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId, role }),
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to assign role: ${result.error}`, 'error');
    } else {
      showToast('Role updated successfully', 'success');
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, role } : user
        )
      );
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">User Roles</h1>
      <p className="text-gray-700 mb-6">Search users and assign roles to manage EcoPesa access.</p>

      <div className="mb-6 max-w-md">
        <Label htmlFor="search">Search by name or email</Label>
        <Input
          id="search"
          type="text"
          placeholder="e.g. jane@ecopesa.org"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mt-1"
        />
      </div>

      {loading ? (
        <p className="text-gray-600">Loading users...</p>
      ) : (
        <div className="space-y-4">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded shadow flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-semibold text-emerald-700">{user.full_name || 'Unnamed User'}</p>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <div className="mt-2 md:mt-0 flex items-center gap-2">
                <select
                  value={user.role}
                  onChange={(e) => assignRole(user.id, e.target.value)}
                  className="border rounded px-3 py-1 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="user">User</option>
                  <option value="recycler">Recycler</option>
                  <option value="collector">Collector</option>
                  <option value="admin">Admin</option>
                </select>
                <span className="text-xs text-gray-500">Current: {user.role}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <ToastComponent />
    </div>
  );
}
