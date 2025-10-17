'use client';

import { useEffect, useState } from 'react';

type Analytics = {
  totalWeight: number;
  totalUsers: number;
  totalRecyclers: number;
  totalCollectors: number;
  totalCentres: number;
  totalPoints: number;
  verifiedLogs: number;
};

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      const res = await fetch('/api/admin/analytics');
      const result = await res.json();
      if (res.ok) setData(result);
      setLoading(false);
    };

    fetchAnalytics();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">EcoPesa Analytics</h1>
      <p className="text-gray-700 mb-6">Track platform-wide impact and performance.</p>

      {loading ? (
        <p className="text-gray-600">Loading analytics...</p>
      ) : data ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
          <StatCard label="Total Recycled" value={`${data.totalWeight} kg`} />
          <StatCard label="EcoPesa Points" value={data.totalPoints} />
          <StatCard label="Users" value={data.totalUsers} />
          <StatCard label="Recyclers" value={data.totalRecyclers} />
          <StatCard label="Collectors" value={data.totalCollectors} />
          <StatCard label="Centres" value={data.totalCentres} />
          <StatCard label="Verified Logs" value={data.verifiedLogs} />
        </div>
      ) : (
        <p className="text-red-600">Failed to load analytics.</p>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold text-emerald-700">{value}</h3>
      <p className="text-sm text-gray-600">{label}</p>
    </div>
  );
}
