'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

type RedeemModalProps = {
  userId: string;
  ecoPoints: number;
  onClose: () => void;
};

export default function RedeemModal({ userId, ecoPoints, onClose }: RedeemModalProps) {
  const [mpesaNumber, setMpesaNumber] = useState<string>('');
  const [redeemedPoints, setRedeemedPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  const conversionRate = 1;
  const cashValue = redeemedPoints * conversionRate;

  const handleRedeem = async () => {
    setLoading(true);
    const res = await fetch('/api/redeem', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId,
        mpesaNumber,
        redeemedPoints,
      }),
    });

    const result = await res.json();
    if (res.ok) {
      toast.success(`Redeemed ${redeemedPoints} points for KES ${cashValue}! 🎉`);
      onClose(); // close modal after success
    } else {
      toast.error(`Redemption failed: ${result.error}`);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-emerald-700 mb-4">Redeem Points</h2>

        <label className="block mb-2 text-sm text-gray-700">M-Pesa Number</label>
        <input
          type="text"
          value={mpesaNumber}
          onChange={(e) => setMpesaNumber(e.target.value)}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Enter your M-Pesa number"
        />

        <label className="block mb-2 text-sm text-gray-700">Points to Redeem</label>
        <input
          type="number"
          value={redeemedPoints}
          onChange={(e) => setRedeemedPoints(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder={`Max: ${ecoPoints}`}
          max={ecoPoints}
        />

        <p className="text-gray-700 mb-4">
          Expected Cash Value: <strong>KES {cashValue}</strong>
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleRedeem}
            disabled={loading || !mpesaNumber || redeemedPoints <= 0}
            className="px-4 py-2 bg-emerald-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Redeem'}
          </button>
        </div>
      </div>
    </div>
  );
}
