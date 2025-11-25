'use client';

import { useState } from 'react';

export default function ProfileSettingsPage() {
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('USER');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    // ✅ Client-side validation
    if (password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    try {
      const res = await fetch('/api/profile/update_password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          role,
          password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(`Error: ${data.error}`);
      } else {
        setMessage('Profile updated successfully!');
        setPassword('');
        setConfirmPassword('');
      }
    } catch (err: any) {
      setMessage(`Unexpected error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50 px-4 py-8">
      <h1 className="text-2xl font-bold text-emerald-800 mb-4">Profile Settings</h1>
      <form
        onSubmit={handleUpdateProfile}
        className="bg-white p-6 rounded-lg shadow max-w-md space-y-4"
      >
        {/* Full Name */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter your name"
          />
        </div>

        
        

        {/* New Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">New Password</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Enter new password"
          />
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block mb-2 font-semibold text-gray-700">Confirm New Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Re-enter new password"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-emerald-600 text-white px-4 py-2 rounded font-bold hover:bg-emerald-700 transition"
        >
          Save Changes
        </button>
      </form>

      {message && <p className="mt-4 text-emerald-700 font-semibold">{message}</p>}
    </div>
  );
}
