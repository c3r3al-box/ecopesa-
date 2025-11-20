'use client';

import { useEffect, useState } from 'react';

type Claim = {
  id: string;
  mpesa_number: string;
  redeemed_points: number;
  cash_value: number;
  status: string;
  created_at: string;
  verified_at?: string | null;
};

export default function MyRedemptions({ userId }: { userId: string }) {
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClaims = async () => {
      const res = await fetch(`/api/redeem?userId=${userId}`);
      const result = await res.json();
      if (res.ok) setClaims(result.claims);
      setLoading(false);
    };

    fetchClaims();
  }, [userId]);

  return (
    <div className="bg-emerald-50 p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold text-emerald-700 mb-4">My Redemptions</h2>

      {loading ? (
        <p className="text-gray-600">Loading redemptions...</p>
      ) : claims.length === 0 ? (
        <p className="text-gray-600">No redemption requests yet.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => (
            <div key={claim.id} className="bg-white p-4 rounded-lg shadow">
              <p className="text-sm text-gray-700">
                <strong>M-Pesa:</strong> {claim.mpesa_number}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Points Redeemed:</strong> {claim.redeemed_points}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Cash Value:</strong> KES {claim.cash_value}
              </p>
              <p className="text-sm text-gray-700">
                <strong>Status:</strong>{' '}
                {claim.status === 'pending' && (
                  <span className="text-yellow-600">Awaiting Approval</span>
                )}
                {claim.status === 'verified' && (
                  <span className="text-emerald-600">Approved</span>
                )}
                {claim.status === 'rejected' && (
                  <span className="text-red-600">Rejected</span>
                )}
              </p>
              <p className="text-xs text-gray-500">
                Requested: {new Date(claim.created_at).toLocaleString()}
              </p>
              {claim.verified_at && (
                <p className="text-xs text-gray-500">
                  Verified: {new Date(claim.verified_at).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
