'use client';

import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type Centre = {
  id: string;
  name: string;
  location: string;
  capacity: number;
  current_load: number;
};

export default function AdminCentresPage() {
  const [name, setName] = useState('');
  const [LocationText, setLocationText] = useState('');
  const [capacity, setCapacity] = useState('');
  const [centres, setCentres] = useState<Centre[]>([]);
  const { showToast, ToastComponent } = useToast();

  const fetchCentres = async () => {
    const res = await fetch('/api/collection-centres', { method: 'GET' });
    const result = await res.json();
    if (res.ok) setCentres(result.data || []);
  };

  useEffect(() => {
    fetchCentres();
  }, []);

  const handleSubmit = async () => {
    if (!name || !location || !capacity) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const res = await fetch('/api/collection-centres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        LocationText,
        capacity: parseFloat(capacity),
        current_load: 0,
      }),
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to add centre: ${result.error}`, 'error');
    } else {
      showToast('Centre added successfully', 'success');
      setName('');
      setLocationText('');
      setCapacity('');
      fetchCentres();
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Manage Collection Centres</h1>
      <p className="text-gray-700 mb-6">Add new centres and view existing ones.</p>

      <div className="bg-white p-6 rounded shadow mb-8 max-w-md">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">Add New Centre</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Centre Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="LocationText">Location</Label>
            <Input id="LocationText" value={LocationText} onChange={(e) => setLocationText(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="capacity">Capacity (kg)</Label>
            <Input
              id="capacity"
              type="number"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
            />
          </div>
          <Button onClick={handleSubmit} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Add Centre
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {centres.map(c => (
          <div key={c.id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold text-emerald-700">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.location}</p>
            <p className="text-sm text-gray-600">Capacity: {c.capacity} kg</p>
            <p className="text-sm text-gray-600">Current Load: {c.current_load} kg</p>
          </div>
        ))}
      </div>

      <ToastComponent />
    </div>
  );
}
