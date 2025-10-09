'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import Link from 'next/dist/client/link';

export default function ProfilePage() {
  const user = useUser();
  const [stats, setStats] = useState({
    totalPickups: 0,
    totalWeight: 0,
    ecoPoints: 0,
    centersVisited: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.id) return;

      const { data, error } = await supabase
        .from('recycling_stats')
        .select('total_pickups, total_weight, eco_points, centers_visited')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching stats:', error.message);
      } else if (data) {
        setStats({
          totalPickups: data.total_pickups,
          totalWeight: data.total_weight,
          ecoPoints: data.eco_points,
          centersVisited: data.centers_visited,
        });
      }
    };

    fetchStats();
  }, [user]);

  if (!user) return <p className="p-6">Loading profile...</p>;

  return (
    <div>
      <div className="p-4"></div>
      <div className="min-h-screen bg-emerald-50">
        <header className="bg-emerald-800 text-white p-6 rounded xl shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <button title="Back" aria-label="Back" onClick={() => window.history.back()} className='p-2 rounded-full hover:bg-emerald-700 transition'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <h1 className="text-xl font-bold">Welcome Cheki your stats, {user.user_metadata?.full_name || user.email}</h1>
            </div>
          </div>
        </header>

        {/* 📊 Stats */}
        <main className="container mx-auto px-4 py-6">
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

          {/* 🎁 Rewards */}
          <div className="mt-8 bg-emerald-100 p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-bold text-emerald-800 mb-2">Redeem Your Points</h3>
            <p className="text-gray-700 mb-4">
              You have <span className="font-bold">{stats.ecoPoints}</span> EcoPesa points available.
            </p>
           <Link
              href="/rewards"
             
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-md hover:bg-emerald-700 transition inline-block sentencecase tracking-wide"
            >
              View Rewards
            </Link>
          </div>
        </main>
      </div>
    </div>
  );
}
