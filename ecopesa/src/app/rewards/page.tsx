'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';
import { supabase } from '@/utils/supabase/client';
import RedeemModal from '@/components/redeem/redeem-modal';
import MyRedemptions from '@/components/redeem/my-redemptions';

export default function ViewRewardsPage() {
  const user = useUser();
  const [ecoPoints, setEcoPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchPoints = async () => {
      if (!user?.id) return;

      const { data: stats } = await supabase
        .from('recycling_stats')
        .select('eco_points')
        .eq('user_id', user.id)
        .maybeSingle();

      setEcoPoints(stats?.eco_points || 0);
      setLoading(false);
    };

    fetchPoints();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-emerald-700 font-medium">Loading your rewards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
            EcoPesa Rewards
          </h1>

          {/* Points Card */}
          <div className="mt-6 inline-block bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-emerald-100 px-8 py-6 transform hover:scale-105 transition-transform duration-200">
            <p className="text-gray-600 text-sm font-medium uppercase tracking-wider mb-2">
              Available Balance
            </p>
            <div className="flex items-baseline justify-center gap-2">
              <span className="text-5xl font-extrabold text-emerald-700 animate-pulse">
                {ecoPoints}
              </span>
              <span className="text-emerald-600 font-semibold">points</span>
            </div>
            <p className="mt-2 text-xs text-gray-500 italic">
              Keep recycling to grow your rewards 🌱
            </p>
            <div className="mt-3 w-16 h-1 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full mx-auto"></div>
          </div>
        </header>

        {/* Redeem Action Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-8 mb-8 text-center">
          <h2 className="text-2xl font-bold text-emerald-800 mb-3">Redeem Your Points</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Convert your eco-points to cash rewards and enjoy the fruits of your recycling efforts.
          </p>

          <button
            disabled={ecoPoints <= 0}
            onClick={() => setShowModal(true)}
            className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 flex items-center justify-center gap-3 ${
              ecoPoints > 0
                ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:scale-105 hover:shadow-xl'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            <span className="text-xl">💰</span>
            {ecoPoints > 0 ? 'Redeem to Cash' : 'Insufficient Points'}
          </button>

          {ecoPoints <= 0 && (
            <p className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>🔄</span>
              Recycle more items to earn points
            </p>
          )}
        </section>

        {/* Redemption History */}
        {user?.id && (
          <section className="bg-white rounded-2xl shadow-sm border border-emerald-50 p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                <span className="text-emerald-600">📋</span>
              </div>
              <h2 className="text-2xl font-bold text-emerald-800">Redemption History</h2>
            </div>
            <MyRedemptions userId={user.id} />
          </section>
        )}
      </div>

      {/* Redeem Modal */}
      {showModal && (
        <RedeemModal
          userId={user!.id}
          ecoPoints={ecoPoints}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
