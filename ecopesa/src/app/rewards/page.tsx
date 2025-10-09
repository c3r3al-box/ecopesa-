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
    </div>
  );
}
