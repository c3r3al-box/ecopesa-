'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/link';

export default function ProfilePage() {
  const user = useUser();
  const [stats, setStats] = useState({
    totalPickups: 0,
    totalWeight: 0,
    ecoPoints: 0,
    centersVisited: 0,
  });
  const [rewards, setRewards] = useState<any[]>([]);

  useEffect(() => {
    const fetchStatsAndRewards = async () => {
      if (!user?.id) return;

      // Fetch stats
      const { data: statsData } = await supabase
        .from('recycling_stats')
        .select('total_pickups, total_weight, eco_points, centers_visited')
        .eq('user_id', user.id)
        .maybeSingle();

      if (statsData) {
        setStats({
          totalPickups: statsData.total_pickups,
          totalWeight: statsData.total_weight,
          ecoPoints: statsData.eco_points,
          centersVisited: statsData.centers_visited,
        });
      }

      // Fetch rewards
      const { data: rewardData } = await supabase
        .from('reward_claims')
        .select(`
          id,
          status,
          created_at,
          reward:admin_rewards (title, cost)
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setRewards(rewardData || []);
    };

    fetchStatsAndRewards();
  }, [user]);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div className="min-h-screen bg-emerald-50">
      <header className="bg-emerald-800 text-white p-2 rounded-xs shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <button
              title="Back"
              aria-label="Back"
              onClick={() => window.history.back()}
              className="p-2 rounded-full hover:bg-emerald-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold">
              Welcome Cheki your stats, {user.user_metadata?.full_name || user.email}
            </h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* 📊 Stats */}
        <h2 className="text-xl font-bold text-emerald-800 mb-4">Your Eco Journey</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-emerald-700">{stats.totalPickups}</h3>
            <p className="text-sm text-gray-600">Total Pickups</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-emerald-700">{stats.totalWeight} kg</h3>
            <p className="text-sm text-gray-600">Recycled Weight</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-emerald-700">{stats.ecoPoints}</h3>
            <p className="text-sm text-gray-600">EcoPesa Points</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-bold text-emerald-700">{stats.centersVisited}</h3>
            <p className="text-sm text-gray-600">Centers Visited</p>
          </div>
        </div>

        {/* 🎁 Rewards Section */}
        <div className="mt-8">
          <h2 className="text-xl font-bold text-emerald-800 mb-4">Your Rewards</h2>
          {rewards.length === 0 ? (
            <p className="text-gray-600">No rewards yet. Keep recycling to earn points!</p>
          ) : (
            <ul className="space-y-4">
              {rewards.map(r => (
                <li key={r.id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                  <div>
                    <p className="font-bold text-emerald-700">{r.reward?.title}</p>
                    <p className="text-sm text-gray-600">Cost: {r.reward?.cost} points</p>
                    <p className="text-sm text-gray-600">
                      Status:{' '}
                      <span className={
                        r.status === 'pending' ? 'text-yellow-600' :
                        r.status === 'verified' ? 'text-green-600' :
                        'text-gray-600'
                      }>
                        {r.status}
                      </span>
                    </p>
                  </div>
                  {r.status === 'verified' && (
                    <Link
                      href={`/rewards/redeem/${r.id}`}
                      className="bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700"
                    >
                      Redeem
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/rewards" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="font-bold text-emerald-700">Explore Rewards</h3>
            <p className="text-sm text-gray-600">See available rewards to redeem with your EcoPesa points.</p>
          </Link>

          {/* New Log Journey Card */}
          <Link href="/journey" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
            <h3 className="font-bold text-emerald-700">Log Your Journey</h3>
            <p className="text-sm text-gray-600">Record your recycling activity and earn EcoPesa points.</p>
          </Link>

          <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-emerald-700">Profile Settings</h3>
              <p className="text-sm text-gray-600">Update your details and preferences.</p>
            </div>
            <div className="mt-4">
              <button
                onClick={async () => {
                  await supabase.auth.signOut();
                  window.location.href = '/';
                }}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
