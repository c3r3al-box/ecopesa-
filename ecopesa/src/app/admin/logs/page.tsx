'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@supabase/auth-helpers-react';

type UserRef = {
  id: string;
  full_name: string;
  role: string;
};

type Log = {
  id: string;
  recycled_weight: number;
  points_earned: number;
  material_type: string;
  created_at: string;
  verified_by: { id: string; full_name: string } | null;
  user_id: UserRef; // always an object
};

type Claim = {
  id: string;
  user_id: UserRef; // always an object
  mpesa_number: string;
  redeemed_points: number;
  cash_value: number;
  status: string;
  created_at: string;
  verified_by?: { id: string; full_name: string } | null;
  verified_at?: string | null;
};

export default function AdminAuditPage() {
  const [activeTab, setActiveTab] = useState<'logs' | 'claims'>('logs');
  const [logs, setLogs] = useState<Log[]>([]);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(true);
  const [loadingClaims, setLoadingClaims] = useState(true);
  const user = useUser();

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await fetch('/api/admin/logs');
      const result = await res.json();
      if (res.ok) setLogs(result.logs);
      setLoadingLogs(false);
    };

    const fetchClaims = async () => {
      const res = await fetch('/api/redeem?status=pending');
      const result = await res.json();
      if (res.ok) setClaims(result.claims);
      setLoadingClaims(false);
    };

    fetchLogs();
    fetchClaims();
  }, []);

  return (
    <div className="min-h-screen bg-emerald-50 p-6">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Audit Dashboard</h1>
      <p className="text-gray-700 mb-6">Monitor recycling submissions and reward redemptions.</p>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'logs' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border'
          }`}
          onClick={() => setActiveTab('logs')}
        >
          Recycling Logs
        </button>
        <button
          className={`px-4 py-2 rounded ${
            activeTab === 'claims' ? 'bg-emerald-600 text-white' : 'bg-white text-emerald-600 border'
          }`}
          onClick={() => setActiveTab('claims')}
        >
          Reward Claims
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'logs' && (
        <div>
          {loadingLogs ? (
            <p className="text-gray-600">Loading logs...</p>
          ) : logs.length === 0 ? (
            <p className="text-gray-600">No logs found.</p>
          ) : (
            <div className="space-y-4">
              {logs.map((log) => (
                <div key={log.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-700">
                    <strong>User:</strong> {log.user_id.full_name} ({log.user_id.role})
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Material:</strong> {log.material_type}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Weight:</strong> {log.recycled_weight} kg
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Points:</strong> {log.points_earned}
                  </p>
                  <p className="text-sm text-gray-700">
                    <strong>Verified by:</strong>{' '}
                    {log.verified_by ? log.verified_by.full_name : 'Pending'}
                  </p>
                  <p className="text-xs text-gray-500">
                    Submitted: {new Date(log.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'claims' && (
        <div>
          {loadingClaims ? (
            <p className="text-gray-600">Loading claims...</p>
          ) : claims.length === 0 ? (
            <p className="text-gray-600">No claims found.</p>
          ) : (
            <div className="space-y-4">
              {claims.map((claim) => (
                <div key={claim.id} className="bg-white p-4 rounded-lg shadow">
                  <p className="text-sm text-gray-700">
                    <strong>User:</strong> {claim.user_id.full_name} ({claim.user_id.role})
                  </p>
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
                    <strong>Status:</strong> {claim.status}
                  </p>
                  {claim.verified_by && (
                    <p className="text-sm text-gray-700">
                      <strong>Verified by:</strong> {claim.verified_by.full_name}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Requested: {new Date(claim.created_at).toLocaleString()}
                  </p>
                  {claim.status === 'pending' && (
                    <div className="mt-2 flex gap-2">
                      <button
                        className="px-3 py-1 bg-emerald-600 text-white rounded"
                        onClick={async () => {
                          const res = await fetch(`/api/redeem/${claim.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ status: 'verified', adminId: user?.id }),
                          });

                          if (!res.ok) {
                            const err = await res.json();
                            alert(`Error approving claim: ${err.error}`);
                            return;
                          }

                          const data = await res.json();
                          alert(data.message || 'Claim approved successfully!');

                          const refreshed = await fetch('/api/redeem?status=pending');
                          const result = await refreshed.json();
                          setClaims(result.claims);
                        }}
                      >
                        Approve
                      </button>

                      <button
                        className="px-3 py-1 bg-red-600 text-white rounded"
                        onClick={async () => {
                          const reason = prompt('Enter rejection reason:');
                          if (!reason) return;
                          const res = await fetch(`/api/redeem/${claim.id}`, {
                            method: 'PATCH',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                              status: 'rejected',
                              adminId: user?.id,
                              reason,
                            }),
                          });
                          if (!res.ok) {
                            const err = await res.json();
                            alert(`Error rejecting claim: ${err.error}`);
                            return;
                          }
                          const refreshed = await fetch('/api/redeem?status=pending');
                          const result = await refreshed.json();
                          setClaims(result.claims);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
