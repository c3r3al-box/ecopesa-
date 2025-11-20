'use client';

import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

type Reward = {
  id: string;
  title: string;
  description: string;
  cost: number;
};

type Claim = {
  id: string;
  user_id: string;
  reward_id: string;
  status: 'pending' | 'approved' | 'rejected';
};

export default function AdminRewardsPage() {
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [cost, setCost] = useState('');
  const { showToast, ToastComponent } = useToast();

  const fetchRewards = async () => {
    const res = await fetch('/api/rewards');
    const result = await res.json();
    if (res.ok) setRewards(result.rewards || []);
  };

  const fetchClaims = async () => {
    const res = await fetch('/api/reward-claims');
    const result = await res.json();
    if (res.ok) setClaims(result.claims || []);
  };

  useEffect(() => {
    fetchRewards();
    fetchClaims();
  }, []);

  const handleAddReward = async () => {
    if (!title || !description || !cost) {
      showToast('Please fill all fields', 'error');
      return;
    }

    const res = await fetch('/api/rewards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, cost: parseFloat(cost) }),
    });

    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to add reward: ${result.error}`, 'error');
    } else {
      showToast('Reward added successfully', 'success');
      setTitle('');
      setDescription('');
      setCost('');
      fetchRewards();
    }
  };

  const handleApproveClaim = async (claimId: string) => {
    const res = await fetch(`/api/reward-claims/${claimId}/approve`, { method: 'POST' });
    const result = await res.json();
    if (!res.ok) {
      showToast(`Failed to approve claim: ${result.error}`, 'error');
    } else {
      showToast('Claim approved', 'success');
      fetchClaims();
    }
  };

  return (
    <div className="p-6 min-h-screen bg-emerald-50">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Manage Rewards</h1>
      <p className="text-gray-700 mb-6">Create rewards and approve claims.</p>

      {/*  Add Reward */}
      <div className="bg-white p-6 rounded shadow mb-8 max-w-md">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">Add New Reward</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="cost">Cost (EcoPesa Points)</Label>
            <Input
              id="cost"
              type="number"
              value={cost}
              onChange={(e) => setCost(e.target.value)}
            />
          </div>
          <Button onClick={handleAddReward} className="w-full bg-emerald-600 hover:bg-emerald-700">
            Add Reward
          </Button>
        </div>
      </div>

      {/*  List Rewards */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">Available Rewards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rewards.map(r => (
            <div key={r.id} className="bg-white p-4 rounded shadow">
              <h3 className="text-lg font-bold text-emerald-700">{r.title}</h3>
              <p className="text-sm text-gray-600">{r.description}</p>
              <p className="text-sm text-gray-600">Cost: {r.cost} points</p>
            </div>
          ))}
        </div>
      </div>

      {/* Approve Claims */}
      <div>
        <h2 className="text-lg font-semibold text-emerald-700 mb-4">Pending Claims</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {claims.filter(c => c.status === 'pending').map(c => (
            <div key={c.id} className="bg-white p-4 rounded shadow">
              <p className="text-sm text-gray-600">User: {c.user_id}</p>
              <p className="text-sm text-gray-600">Reward ID: {c.reward_id}</p>
              <Button
                onClick={() => handleApproveClaim(c.id)}
                className="mt-2 bg-emerald-600 hover:bg-emerald-700"
              >
                Approve
              </Button>
            </div>
          ))}
        </div>
      </div>

      <ToastComponent />
    </div>
  );
}
