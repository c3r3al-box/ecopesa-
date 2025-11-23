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
    <div className="min-h-screen bg-emerald-50 px-4 py-8">
      {/* Seamless welcome */}
      <h1 className="text-2xl font-bold text-emerald-800 mb-2">
        Welcome back, {user.user_metadata?.full_name || user.email}
      </h1>
      <p className="text-gray-600 mb-8">Here’s a snapshot of your EcoPesa journey.</p>

      {/* 📊 Stats */}
      <section className="mb-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {[
            { label: 'Total Pickups', value: stats.totalPickups, icon: '🚚' },
            { label: 'Recycled Weight', value: `${stats.totalWeight} kg`, icon: '♻️' },
            { label: 'EcoPesa Points', value: stats.ecoPoints, icon: '🌱' },
            { label: 'Centers Visited', value: stats.centersVisited, icon: '📍' },
          ].map((item, idx) => (
            <div key={idx} className="bg-white p-4 rounded-lg shadow text-center">
              <div className="text-2xl mb-2">{item.icon}</div>
              <h3 className="text-xl font-bold text-emerald-700">{item.value}</h3>
              <p className="text-sm text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 🎁 Rewards */}
      <section className="mb-10">
        <h2 className="text-xl font-bold text-emerald-800 mb-4">Your Rewards</h2>
        {rewards.length === 0 ? (
          <p className="text-gray-600">No rewards yet. Keep recycling to earn points!</p>
        ) : (
          <ul className="space-y-4">
            {rewards.map(r => (
              <li key={r.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                <div>
                  <p className="font-bold text-emerald-700">{r.reward?.title}</p>
                  <p className="text-sm text-gray-600">Cost: {r.reward?.cost} points</p>
                  <span
                    className={`inline-block mt-1 px-2 py-1 rounded text-xs font-semibold ${
                      r.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-700'
                        : r.status === 'verified'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {r.status}
                  </span>
                </div>
                {r.status === 'verified' && (
                  <Link
                    href={`/rewards/redeem/${r.id}`}
                    className="bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition"
                  >
                    Redeem
                  </Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ⚙️ Actions */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/rewards" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-bold text-emerald-700">Explore Rewards</h3>
          <p className="text-sm text-gray-600">See available rewards to redeem with your EcoPesa points.</p>
        </Link>

        <Link href="/journey" className="bg-white p-6 rounded-lg shadow hover:shadow-md transition">
          <h3 className="font-bold text-emerald-700">Log Your Journey</h3>
          <p className="text-sm text-gray-600">Record your recycling activity and earn EcoPesa points.</p>
        </Link>

        <div className="bg-white p-6 rounded-lg shadow flex flex-col justify-between">
         
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.href = '/';
            }}
            className="mt-4 w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition"
          >
            Sign Out
          </button>
        </div>
      </section>
    </div>
  );
}
