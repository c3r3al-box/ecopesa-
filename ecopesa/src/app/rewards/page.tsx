'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';

type Reward = {
  id: string;
  name: string;
  description: string;
  points_required: number;
};

export default function ViewRewardsPage() {
  const user = useUser();
  const [ecoPoints, setEcoPoints] = useState(0);
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchRewards = async () => {
      if (!user?.id) return;

      const { data: stats } = await supabase
        .from('recycling_stats')
        .select('eco_points')
        .eq('user_id', user.id)
        .maybeSingle();

      const { data: rewardsList } = await supabase
        .from('rewards')
        .select('*')
        .order('points_required', { ascending: true });

      setEcoPoints(stats?.eco_points || 0);
      setRewards(rewardsList || []);
      setLoading(false);
    };

    fetchRewards();
  }, [user]);

  const handleRedeemClick = (reward: Reward) => {
    setSelectedReward(reward);
    setShowModal(true);
    setPhoneNumber('');
    setStatus('');
  };

  const handleConfirmRedeem = async () => {
    if (!user?.id || !selectedReward || !phoneNumber) return;

    const res = await fetch('/api/rewards/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        rewardId: selectedReward.id,
        amount: selectedReward.points_required,
        phone: phoneNumber,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      setEcoPoints(prev => prev - selectedReward.points_required);
      setStatus(`Redeemed ${selectedReward.name} to ${phoneNumber}`);
      setSelectedReward(null);
    } else {
      setStatus(`Redemption failed: ${result.error}`);
    }
  };

  if (loading) {
    return <div className="p-6 text-center">Loading rewards...</div>;
  }

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <header className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-emerald-800">Your EcoPesa Rewards</h1>
        <p className="text-gray-700 mt-2">You have <span className="font-bold">{ecoPoints}</span> points available</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {rewards.map(reward => (
          <div key={reward.id} className="bg-white rounded-lg shadow p-4 text-center">
            <h2 className="text-lg font-bold text-emerald-700">{reward.name}</h2>
            <p className="text-sm text-gray-600 mb-2">{reward.description}</p>
            <p className="text-sm text-gray-800 mb-4">Requires: <span className="font-semibold">{reward.points_required}</span> points</p>
            <button
              disabled={ecoPoints < reward.points_required}
              onClick={() => handleRedeemClick(reward)}
              className={`px-4 py-2 rounded-full font-semibold transition ${
                ecoPoints >= reward.points_required
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {ecoPoints >= reward.points_required ? 'Redeem' : 'Not Enough Points'}
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedReward && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-2xl w-11/12 max-w-sm text-center">
            <h2 className="text-xl font-bold mb-4 text-emerald-800">Redeem {selectedReward.name}</h2>
            <p className="mb-4 text-gray-600">Enter your M-Pesa phone number to receive this reward.</p>
            <input
              type="tel"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0712345678"
              className="border p-2 rounded w-full mb-4"
            />
            <button
              onClick={handleConfirmRedeem}
              className="bg-emerald-600 text-white px-4 py-2 rounded-full font-bold hover:bg-emerald-700 w-full"
            >
              Confirm Redemption
            </button>
            {status && <p className="mt-3 text-sm text-emerald-700">{status}</p>}
            <button
              onClick={() => setShowModal(false)}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
